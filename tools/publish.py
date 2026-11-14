#!/usr/bin/env python3
"""Publish prepared lessons for one session.

usage: python3 tools/publish.py --date 2026-11-15 --session am|pm --ready DIR id [id ...]

DIR holds <id>.html and entries.json ({id: {entry: {...}, latest: {keypoints: [3], hook: str}}}).
Copies lessons/<id>.html, adds/replaces the LAB.lessons entry in assets/data.js (with the date),
and rewrites latest.html and latest.txt for the notification tasks. Idempotent: re-running replaces, never duplicates."""
import argparse, html, json, os, re, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://insightosis.github.io/masar/"
SUBJ = {"physics": "الفيزياء", "chemistry": "الكيمياء", "biology": "الأحياء", "math": "الرياضيات", "geology": "الجيولوجيا"}
SESS = {"am": "الصباح (06:00)", "pm": "المساء (18:00)"}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--date", required=True)
    ap.add_argument("--session", required=True, choices=["am", "pm"])
    ap.add_argument("--ready", required=True)
    ap.add_argument("ids", nargs="+")
    a = ap.parse_args()
    meta = json.load(open(os.path.join(a.ready, "entries.json"), encoding="utf-8"))

    data_p = os.path.join(ROOT, "assets", "data.js")
    js = open(data_p, encoding="utf-8").read()
    for lid in a.ids:
        if lid not in meta: sys.exit(f"no entry for {lid} in entries.json")
        src = os.path.join(a.ready, lid + ".html")
        if not os.path.exists(src): sys.exit(f"missing {src}")
        shutil.copyfile(src, os.path.join(ROOT, "lessons", lid + ".html"))
        e = dict(meta[lid]["entry"]); e["date"] = a.date
        order = ["id", "date", "subject", "unit", "title", "url", "minutes", "prereq", "related", "next", "terms", "gold"]
        e = {k: e[k] for k in order if k in e}
        block = json.dumps(e, ensure_ascii=False, indent=2)
        block = "\n".join("    " + l for l in block.splitlines())
        # drop an older copy of the same lesson (a block that starts with {"id": "<lid>" or id: "<lid>")
        pat = re.compile(r'\n    \{\n      "?id"?: "' + re.escape(lid) + r'".*?\n    \},?(?=\n)', re.S)
        js = pat.sub("", js)
        i = js.index("lessons: [") + len("lessons: [")
        js = js[:i] + "\n" + block + "," + js[i:]
    js = re.sub(r",(\s*\n\s*\])", r"\1", js)  # no trailing comma before ]
    open(data_p, "w", encoding="utf-8").write(js)

    L = []
    L.append('<!DOCTYPE html>\n<html lang="ar" dir="rtl">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">')
    L.append('<title>آخر درس · مسار · الصف الحادي عشر</title>')
    L.append('<style>body{font-family:system-ui,sans-serif;max-width:640px;margin:40px auto;padding:0 18px;line-height:1.8;background:#f7f3ff;color:#3d3561}a{color:#d1557a}section{margin:18px 0;padding:10px 16px;border-radius:14px;background:#fff}</style>\n</head>\n<body>')
    L.append('<!-- Plain page on purpose: the notification tasks (06:05 and 18:05) read it. Written by tools/publish.py every session. -->')
    L.append('<h1>آخر درس</h1>')
    for lid in a.ids:
        L.append(f'<p>LESSON-ID: {lid}</p>')
    L.append(f'<p>الجلسة: {SESS[a.session]}</p>')
    L.append(f'<p>التاريخ: {a.date}</p>')
    for lid in a.ids:
        e = meta[lid]["entry"]; lt = meta[lid]["latest"]; url = BASE + e["url"]
        L.append('<section>')
        L.append(f'<p>المادة: {SUBJ[e["subject"]]}</p>')
        L.append(f'<p>العنوان: {html.escape(e["title"])}</p>')
        L.append(f'<p>المدة: {e["minutes"]} دقيقة</p>')
        L.append(f'<p>الرابط: <a href="{url}">{url}</a></p>')
        for k in lt["keypoints"]:
            L.append(f'<p>KEY-POINT: {html.escape(k)}</p>')
        L.append('</section>')
    L.append(f'<p>HOOK-SEED: {html.escape(meta[a.ids[0]]["latest"]["hook"])}</p>')
    L.append(f'<p><a href="{BASE}">لوحة التتبع</a></p>\n</body>\n</html>\n')
    open(os.path.join(ROOT, "latest.html"), "w", encoding="utf-8").write("\n".join(L))
    # same content as plain text (some fetch tools read text/plain more reliably than HTML)
    T = [f"LESSON-ID: {lid}" for lid in a.ids] + [f"الجلسة: {SESS[a.session]}", f"التاريخ: {a.date}"]
    for lid in a.ids:
        e = meta[lid]["entry"]; lt = meta[lid]["latest"]
        T += ["", f"المادة: {SUBJ[e['subject']]}", f"العنوان: {e['title']}", f"المدة: {e['minutes']} دقيقة", f"الرابط: {BASE}{e['url']}"]
        T += [f"KEY-POINT: {k}" for k in lt["keypoints"]]
    T += ["", f"HOOK-SEED: {meta[a.ids[0]]['latest']['hook']}", ""]
    open(os.path.join(ROOT, "latest.txt"), "w", encoding="utf-8").write("\n".join(T))
    print("published", ", ".join(a.ids), "for", a.date, a.session)

if __name__ == "__main__":
    main()
