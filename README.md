# مسار · الصف الحادي عشر

Daily interactive lessons for one grade-11 student: physics, chemistry, biology, math, geology.
Served by GitHub Pages at https://insightosis.github.io/masar/

**This repository is public.** Never commit the textbook, the student's name, or results.

## Layout

| Path | What it is |
|---|---|
| `index.html` | Tracking dashboard (today's lesson, stats, subjects, link map, exams, all lessons) |
| `review.html` | All terminology and golden points, filterable by subject |
| `latest.html` | Plain page read by the notification task. Must change with every lesson |
| `lessons/<id>.html` | One self-contained lesson per file (`phy-001`, `chem-001`, `bio-001`, `math-001`, `geo-001`) |
| `assets/data.js` | Single source of truth: subjects, exams, concepts, lesson index (terms, gold, links) |
| `assets/lab.js` | Shared helpers: progress in localStorage, subject icons, link resolution |
| `assets/site.css`, `assets/fonts.css`, `fonts/` | Hub styles and self-hosted fonts |

## Rules for every lesson

- Loads nothing from other domains (no Google Fonts, no CDNs): the student's browser only allows this site.
  Fonts come from `../assets/fonts.css`. External links are fine but may be blocked on the device.
- Sections, in order: lab/hook, **مصطلحات الدرس** (Arabic, English, symbol, one-line definition),
  core ideas with Claude-drawn visuals, laws, worked example, **النقاط الذهبية** (labels: سؤال مكرر / قاعدة سريعة / فخ),
  daily life, 3 quiz questions, summary, links, finish button.
- Subject colour from `LAB.subjects`; each subject keeps its own visual identity.
- Include `../assets/data.js` and `../assets/lab.js`, set `LESSON_ID`, keep the quiz and finish wiring.

## Publishing a lesson

1. Write `lessons/<id>.html`.
2. Append the lesson to `LAB.lessons` in `assets/data.js` (with `terms`, `gold`, `prereq`, `related`, `next`).
   Add any new concepts it links to; when a concept gets its own lesson, set `concept.lesson`.
3. Rewrite every field of `latest.html`.
4. Commit and push to `main`.
