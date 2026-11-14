# مسار · الصف الحادي عشر

Daily interactive lessons for one grade-11 student: physics, chemistry, biology, math, geology.
Served by GitHub Pages at https://insightosis.github.io/masar/

**This repository is public.** Never commit the textbook, the student's name, or results.

## Layout

| Path | What it is |
|---|---|
| `index.html` | Tracking dashboard (today's lesson, stats, subjects, link map, exams, all lessons) |
| `review.html` | All terminology and golden points, filterable by subject |
| `plan.html` | Day-by-day plan up to the exams, phases, syllabus coverage |
| `latest.html` | Plain page read by the notification task. Must change with every lesson |
| `lessons/<id>.html` | One self-contained lesson per file, id from the plan (e.g. `phy-u1-1-3`) |
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

## Study plan

- `tools/build_plan.py` holds the term-1 syllabus (tables of contents of the five student books) and builds
  `plan.json` + `assets/plan.js`: every lesson placed on a day from 2026-11-15 to 2026-12-10, then a week of
  consolidation, two mock-exam days, and the exam window (20 to 31 Dec 2026).
- Lesson ids follow the book: `<subject>-u<unit>-<code>`, e.g. `phy-u1-1-3` is physics unit 1, lesson 1-3.
  A published lesson uses the same id in `assets/data.js` and `lessons/<id>.html`.
- The daily task builds the lessons listed for that day in `plan.json` (all `type: "new"` items, as one or
  more lesson pages) and starts each page with retrieval questions on the previous day's lessons.
- When the official per-subject timetable is published, fill `exams` in `tools/build_plan.py`
  (`{"subject":..., "date":...}`) and rebuild; the evening before each exam becomes that subject's review.
