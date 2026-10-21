#!/usr/bin/env python3
"""Met à jour data/availability.json à partir d'agendas au format iCal (Google Agenda, Airbnb…).

Les adresses iCal sont lues dans des variables d'environnement (secrets GitHub) :
  ICAL_FRESSE, ICAL_BRESSE_ALL, ICAL_M1, ICAL_M2, ICAL_M3, ICAL_M4
Le mode de chaque agenda se règle dans scripts/sources.json :
  "busy" : les évènements de l'agenda sont des périodes RÉSERVÉES / indisponibles (cas Airbnb, le plus courant)
  "free" : les évènements de l'agenda sont des périodes DISPONIBLES (tout le reste est considéré comme occupé)
Une source dont la variable est vide est ignorée (la valeur actuelle du fichier est conservée).
"""
import json, os, sys, urllib.request, datetime as dt
from zoneinfo import ZoneInfo

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "data", "availability.json")
PARIS = ZoneInfo("Europe/Paris")
HORIZON_DAYS = 548  # ~18 mois, utilisé pour le mode "free"


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "belm-availability-sync/1.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")


def unfold(text):
    lines = []
    for raw in text.splitlines():
        if raw[:1] in (" ", "\t") and lines:
            lines[-1] += raw[1:]
        else:
            lines.append(raw)
    return lines


def to_date(value, params):
    """Retourne (date, est_journee_entiere)."""
    v = value.strip()
    if "VALUE=DATE" in params.upper() or (len(v) == 8 and v.isdigit()):
        return dt.date(int(v[0:4]), int(v[4:6]), int(v[6:8])), True
    d = dt.datetime(int(v[0:4]), int(v[4:6]), int(v[6:8]), int(v[9:11]), int(v[11:13]), int(v[13:15] or 0))
    if v.endswith("Z"):
        d = d.replace(tzinfo=dt.timezone.utc).astimezone(PARIS)
    return d.date(), False


def parse_ics(text):
    """Retourne une liste de périodes (arrivée, départ exclu) à partir des VEVENT."""
    events, cur = [], None
    for line in unfold(text):
        if line == "BEGIN:VEVENT":
            cur = {}
        elif line == "END:VEVENT" and cur is not None:
            events.append(cur); cur = None
        elif cur is not None and ":" in line:
            head, value = line.split(":", 1)
            name, _, params = head.partition(";")
            cur[name.upper()] = (value, params)
    ranges = []
    for e in events:
        if e.get("STATUS", ("", ""))[0].strip().upper() == "CANCELLED":
            continue
        if "DTSTART" not in e:
            continue
        start, allday = to_date(*e["DTSTART"])
        if "DTEND" in e:
            end, _ = to_date(*e["DTEND"])
        else:
            end = start + dt.timedelta(days=1)
        if end <= start:
            end = start + dt.timedelta(days=1)
        ranges.append((start, end))
        if "RRULE" in e:
            print("  ! évènement récurrent ignoré (non géré) :", e.get("SUMMARY", ("?", ""))[0])
    return ranges


def merge(ranges):
    out = []
    for a, b in sorted(ranges):
        if out and a <= out[-1][1]:
            out[-1] = (out[-1][0], max(out[-1][1], b))
        else:
            out.append((a, b))
    return out


def complement(ranges, today):
    """Mode 'free' : les périodes occupées sont tout ce qui n'est pas couvert par un évènement."""
    horizon = today + dt.timedelta(days=HORIZON_DAYS)
    busy, cursor = [], today
    for a, b in merge(ranges):
        if b <= cursor:
            continue
        if a > cursor:
            busy.append((cursor, min(a, horizon)))
        cursor = max(cursor, b)
        if cursor >= horizon:
            break
    if cursor < horizon:
        busy.append((cursor, horizon))
    return busy


def main():
    cfg = json.load(open(os.path.join(ROOT, "scripts", "sources.json"), encoding="utf-8"))
    data = json.load(open(OUT, encoding="utf-8"))
    today = dt.datetime.now(PARIS).date()
    changed = False
    for key, src in cfg.items():
        if key.startswith("_"):
            continue
        url = os.environ.get(src["env"], "").strip()
        if not url:
            print(f"- {key}: {src['env']} vide, ignoré")
            continue
        try:
            ranges = parse_ics(fetch(url))
        except Exception as ex:  # on ne casse jamais le site à cause d'un agenda injoignable
            print(f"- {key}: échec de lecture ({type(ex).__name__}), valeur conservée")
            continue
        mode = src.get("mode", "busy")
        busy = complement(ranges, today) if mode == "free" else merge(ranges)
        busy = [(a, b) for a, b in busy if b > today]  # on retire le passé
        new = [[a.isoformat(), b.isoformat()] for a, b in busy]
        print(f"- {key}: {len(new)} période(s) ({mode})")
        if data.get(key) != new:
            data[key] = new; changed = True
    if changed:
        with open(OUT, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2); f.write("\n")
        print("data/availability.json mis à jour")
    else:
        print("Aucun changement")


if __name__ == "__main__":
    sys.exit(main())
