#!/usr/bin/env python3
"""Génère les pages du site (index.html, chalets.html, …) à partir de src/.

  src/layout.html        squelette commun d'une page
  src/partials/*.html    en-tête, pied de page, chatbot, bandeau « Réserver »
  src/pages/*.html       contenu de chaque page (la 1re ligne donne la clé, le titre et la description)

Usage :  python3 scripts/build.py
Il faut le relancer après avoir modifié un fichier de src/ (le menu, par exemple).
Les textes du français sont aussi écrits dans le HTML (utile pour Google et sans JavaScript) ;
les autres langues sont appliquées par assets/js/i18n.js.
"""
import html, json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "src")
SITE = "Gîtes BEL'M"


def read(*p):
    return open(os.path.join(SRC, *p), encoding="utf-8").read()


def french():
    js = "global.window={};require(process.argv[1]);process.stdout.write(JSON.stringify(window.I18N.fr))"
    out = subprocess.check_output(["node", "-e", js, os.path.join(ROOT, "assets", "js", "i18n.js")])
    return json.loads(out)


FR = french()
TXT = re.compile(r'(<(?P<tag>[a-zA-Z0-9]+)\b[^>]*?\sdata-i18n="(?P<key>[^"]+)"[^>]*>)(?P<inner>[^<]*)(</(?P=tag)>)')
ATTR_TAG = re.compile(r'<[^>]*\sdata-i18n-attr="[^"]+"[^>]*>')


def prerender(s):
    def fill(m):
        k = m.group("key")
        return m.group(1) + html.escape(FR[k], quote=False) + m.group(5) if k in FR else m.group(0)
    s = TXT.sub(fill, s)

    def attrs(m):
        tag = m.group(0)
        spec = re.search(r'data-i18n-attr="([^"]+)"', tag).group(1)
        for pair in spec.split(";"):
            a, _, k = pair.partition(":")
            a, k = a.strip(), k.strip()
            if k not in FR:
                continue
            val = html.escape(FR[k], quote=True)
            if re.search(r'\s%s="[^"]*"' % re.escape(a), tag):
                tag = re.sub(r'(\s%s=")[^"]*(")' % re.escape(a), lambda x: x.group(1) + val + x.group(2), tag, count=1)
            else:
                tag = tag[:-1].rstrip("/ ") + f' {a}="{val}">'
        return tag
    return ATTR_TAG.sub(attrs, s)


def main():
    layout = read("layout.html")
    parts = {n: read("partials", n + ".html") for n in ("header", "footer", "chat", "cta")}
    built = []
    for fn in sorted(os.listdir(os.path.join(SRC, "pages"))):
        if not fn.endswith(".html"):
            continue
        raw = read("pages", fn)
        m = re.match(r"<!--page\s+key=(\S+)\s+title=(\S+)\s+desc=(\S+?)\s*-->\n", raw)
        if not m:
            sys.exit(f"{fn}: première ligne <!--page key=… title=… desc=…--> manquante")
        key, tkey, dkey = m.groups()
        content = raw[m.end():].replace("{{CTA}}", parts["cta"])
        title = FR[tkey] if tkey == "meta.title" else f"{FR[tkey]} — {SITE}"
        header = parts["header"]
        header = re.sub(r'(<a href="%s\.html" data-nav="%s")' % (key, key), r'\1 aria-current="page"', header)
        page = (layout.replace("{{TITLE_KEY}}", tkey).replace("{{DESC_KEY}}", dkey).replace("{{KEY}}", key)
                .replace("{{TITLE}}", html.escape(title, quote=True))
                .replace("{{HEADER}}", header).replace("{{FOOTER}}", parts["footer"]).replace("{{CHAT}}", parts["chat"])
                .replace("{{CONTENT}}", content))
        out = "index.html" if key == "home" else key + ".html"
        with open(os.path.join(ROOT, out), "w", encoding="utf-8") as f:
            f.write(prerender(page))
        built.append(out)
    print("Pages générées :", ", ".join(built))


if __name__ == "__main__":
    main()
