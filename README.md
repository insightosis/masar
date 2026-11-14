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

**Look:** pastel claymorphism with a light and a dark theme (tokens in `assets/site.css`; the ☾/☀ button switches).
Never hard-code a light-only colour: use the tokens (`--card`, `--text`, `--p-peach`, `--p-sky`, `--sky`, `--ground`...).
Canvas drawings read the tokens and redraw on the `masar-theme` event.
**No decoration may sit over text**: animations and shapes go in their own row or reserved space, never `position:absolute` over copy. Puffy rounded tiles (`--clay` shadows from `assets/site.css`),
light pastel fills, the rounded display face (Baloo Bhaijaan 2) for headings, IBM Plex Sans Arabic for text.
Each subject keeps its own pastel identity (`LAB.subjects[*].color` for ink, `.soft` for fills). No dark themes.

**The book sets the scope, not the script (non-negotiable):** read the lesson's pages in the student book before
writing, then:
- **Never less than the book:** every objective on the lesson's first page, every law, definition and type of
  problem the book has is covered, with the book's notation and values (e.g. physics: g = 10 m/s², v0x, v0y, Δx, Δy,
  t′, h_max, R, the word "عجلة"), so the student recognises them in the exam.
- **Nothing extra without a reason:** no topics or laws beyond the book unless they make a book idea easier to
  understand (and then labelled as help, not exam content).
- **Free in how it teaches:** do not copy the book's wording, order, pictures or examples. Explain naturally, with
  our own analogies, everyday examples (a cannon, a kicked ball, a water hose), drawings, labs and interactive
  checks, whenever they explain better than the book does.
- Put the page range in the header and footer.

**Voice:** explain as to a student a little younger than grade 11, without talking down: short sentences, everyday
images (a ball, a lift, a car on cruise control), one idea at a time, little text, lots of visuals drawn in the page.

**Sections, in order:**
1. Hook and a hands-on lab or animation.
2. **رموز الدرس**: only the symbols and terms the lesson's equations use (e.g. v0, θ, vx, vy, g, T, H, R), each as a
   clay card: the symbol in a bubble, Arabic name, English name, what it means in one plain line, and a one-line
   memory hook (`.hook`). Not every word of the chapter.
3. Core ideas with drawn visuals, then the laws.
4. Two or three short interactive checks woven in where they fit, not stacked at the end. Pick from:
   **رتّب القانون** (tap shuffled formula pieces into order, with one decoy piece),
   **أكمل الناقص** (choose the missing piece of a formula),
   **اكتب الجواب** (type a number, tolerant check, hint button). Each gives a reason on a wrong answer.
5. Worked example (hide-solution toggle), **النقاط الذهبية** (labels: سؤال مكرر / قاعدة سريعة / فخ),
   daily life, 3 quiz questions, a 3-line summary, links, finish button.
- Every check calls `record(key, firstTryCorrect)`; the score is saved with the lesson.
- Loads nothing from other domains; fonts come from `../assets/fonts.css`.
- Include `../assets/plan.js`, `../assets/data.js` and `../assets/lab.js`, and set `LESSON_ID`.

## Saturday

No new lessons. Morning (`weekly-am`): the week's key symbols, laws and golden points as quick-fire cards.
Evening (`weekly-pm`): mixed tests across the week's lessons plus interactive applications (order / fill / type,
lab challenges), interleaving subjects. Both items list the week's lesson ids in `lessons`.

## Daily timetable

`assets/schedule.js` holds the day templates (school day, Friday, Saturday, exam day): school, homework and notebook,
school project, the 1-hour course (هندسة الأجيال), play split into two blocks, both Masar sessions, wind-down from 21:30,
sleep at 22:00. The dashboard draws today's timeline; the plan page shows every template.

## Two sessions a day

`plan.json` gives each day `sessions.am` (06:00, short, before school, starts with recall of yesterday) and
`sessions.pm` (18:00, the longer lessons). The lesson task runs before each session (about 05:30 and 17:30
Kuwait time), builds that session's lessons, and rewrites `latest.html` with that session's LESSON-ID(s).

## Publishing a lesson

1. Write `lessons/<id>.html`.
2. Append the lesson to `LAB.lessons` in `assets/data.js` (with `terms`, `gold`, `prereq`, `related`, `next`).
   Add any new concepts it links to; when a concept gets its own lesson, set `concept.lesson`.
3. Rewrite every field of `latest.html`: one `LESSON-ID:` line per lesson of the session, the session name, date,
   subject, title, minutes, link, three `KEY-POINT:` lines (from the book) and one `HOOK-SEED:` line (a curiosity
   question the lesson answers). The ChatGPT task on the student's iPad builds its message and its follow-up
   questions from these lines only.
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
