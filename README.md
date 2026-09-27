# Retention Lab · Day 6

**Customer Retention & Buying Behaviour in B2B IT Sales · Module 3, Day 2 of 2.**
*Building emotional customer retention and implementing it systematically.*
A self-study companion: study material with twelve live instruments, two tasks and two working documents, in **English and German**
(EN | DE in the top bar, `../CLAUDE.md` #32). It carries the shared standards `../CLAUDE.md` #1 to #28, the two-route form of #30
and the German version of #32.

The case company is **NetSolutions GmbH**, a German provider of managed IT services for the Mittelstand: *customers are satisfied
but not loyal, repeat purchases are rare, sales reacts instead of managing* (the plan's case study). Route 1 works it with €140,000
and six months; Route 2 puts the learner in the Chief Customer Officer's chair with €170,000 and six months (Case assumption).

This repo was bootstrapped from `day5` (chrome, primitives, store pattern, tokens, the language machinery) and its content was
replaced. Nothing of DataCloud Services remains in the tree.

> **Before you push:** `git remote -v` still points at `aion-cs-day2`, because the folder was copied from an earlier day. Create or
> select the `aion-cs-day6` repository and set the remote first (`../CLAUDE.md` #17). Nothing was committed or pushed.

## Routes

| Route | Content | Export |
|---|---|---|
| `/route-1/` **Levels 1 + 2** | **Materi A**: seven cards, 60 min (A1 satisfaction against delight and the Kano model, A2 three emotional retention factors: trust, appreciation, relevance, A3 why attachment is missing: relationship, communication, added value, A4 what delight is worth: the churn arithmetic, A5 reading four buying signals, A6 responding to signals: a simple retention system, A7 measures: effect × sustainability × feasibility). **Task 1, Retention Analysis**: *Part 1 · Understand the missing tie:* 1.1 sort nine customer statements by area and add one of your own, 1.2 what satisfaction and delight are worth (F1–F3 and a sentence), 1.3 what is missing from the customer's perspective, three approaches on three factors, 1.4 coaching reflection. *Part 2 · Read the signals and act:* 2.1 tag twelve deal observations with a signal type, 2.2 weaknesses, a response and an owner team per signal type, the risk of misreading, 2.3 choose, score and order three measures. | `1-{name}-day6-l1l2-retention-analysis.html` |
| `/route-2/` **Level 3** | **Materi B**: five cards, 60 min (B1 from actions to a system: the target vision, B2 the central process: handling signals, B3 where the lever is: reach, depth, durability, scale, B4 integrating sales, service and marketing (RACI), B5 deciding without complete information, and the architecture). **Task 2, Retention System Memo**, assembling beside the questions: 3.1 three system principles, 3.2 owner, response time and first action per signal type, 3.3 three strategic levers rated on four tests and the greatest one, 3.4 a RACI grid across sales, service, marketing and the CCO, 3.5 the implementation architecture, 3.6 the decision, three assumptions, the tripwire and the board's challenge. | `2-{name}-day6-l3-system-memo.html` |

Minutes: Materi A 60 + Task 1 58 (6 + 10 + 8 + 5 + 8 + 9 + 12), Materi B 60 + Task 2 51 (5 + 9 + 10 + 8 + 10 + 9). All in `lib/routes.ts`.

Route 2 quotes the learner's Route 1 weaknesses and measures in a soft box (`useJumpTo`) and never requires them; the routes share no
answer fields.

## German version (CLAUDE.md #32)

Same machinery as Day 5: `lib/lang.ts` (`tt`, `t` + `bi`, number formats), `lib/i18n.tsx` (`LangProvider`, `LangSwitch`), `ui.lang`
in the persisted store. Every page, card, diagram, task, clue, missing list, the glossary panel and both exports follow the switch.
Common terms stay English in German sentences (Churn, Owner, Playbook, Tripwire, Go-live, Success-Review, RACI, KPI…); the explanations
are German, formal "Sie". Mentor tools stay English; "Fill all model answers" enters German free text while the site is German. File
names stay English.

## Stack

Next.js 14 App Router · TypeScript strict · Tailwind (CS tokens) · Zustand + `persist` (key `cs-d6-v1`, version 1, `skipHydration` +
`StoreHydrator`, deep `mergeDefaults`) · static export. No animation, drag-and-drop, PDF or chart library.

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm run verify:calc  # re-derives every figure and rule, and runs the mentor fill in both languages (123 checks)
npm run build        # writes the static site to out/  (stop `npm run dev` first)
```

## What is in the data

- `reasons.ts`: nine things customers said (3 relationship, 3 communication, 3 added value) with the test questions, clue, reason and
  why each rejected area is rejected.
- `delight.ts`: NetSolutions' survey and contract data. Gross profit lost = customers × churn × average contract × margin. Satisfied
  90 × 20% × €24,000 × 40% = **F1 €172,800**; delighted 40 × 5% × €24,000 × 40% = **F2 €19,200**; moving 30 satisfied customers to
  delighted keeps 30 × (20% − 5%) × €24,000 × 40% = **F3 €43,200**. The worked example of A4 (Kontor Systems) uses other numbers:
  €94,500 / €12,600 / €10,710.
- `approaches.ts`: the three factors, the forced choice of 1.3 (what is missing: a personal tie) and the frame of an approach.
- `signals.ts`: the four signal types with test questions and pair tests; twelve observations (3 per type; every uncertainty signal
  stalled); five responses; three teams; seven weaknesses (four real).
- `measures.ts`: nine measures with cost, weeks, what they run on and reference scores. Sustainability follows from what a measure runs
  on (process 3, role 2, one person or one-off 1). Playbook, reviews and handover score 18 and cost €95,000; the owner model scores 12 and
  would take the plan to €143,000.
- `route2.ts`: six principles, the signal process (times, why), eight levers with printed facts and model ratings, the RACI roles,
  activities and accepted letters, eight architecture items (model: shared view, playbook, handover, reviews, moments = €150,000 of
  €170,000), owners, triggers, three decisions, the KPIs with baselines and the board's challenge.

## Mentor bar

The first element on every page. Enter `muchson123` once and every model answer of Routes 1 and 2 fills in (plus a participant name if
empty and every calculator part), so each export downloads straight away. The same unlock shows the answer keys (1.1, 1.3a, 2.1, 2.2a,
2.2b, 2.3 measures and order, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6 decision and tripwire) and a worked answer for every other question (F1–F3 as
step tables with pitfalls, every free text with what to look for). Client-side convenience gate, not security; a reload locks it.

## Notes on deviations from the brief and the shared rules

1. **Two routes (CLAUDE.md #30).** The plan's Level 1 Task 1 (satisfied but not loyal: reasons, delight approaches, what is missing),
   Level 1 Task 2 (buying signals: types, response, risk of misreading) and the Level 2 case study (NetSolutions: weaknesses, a simple
   retention system, measures for emotional retention) run on one company. Every numbered item is answered: reasons for the missing tie
   (1.1), what is missing from the customer's view (1.3a), three approaches to delight (1.3b), signal types (2.1), responses (2.2b),
   risk of misreading (2.2), weaknesses (2.2a), the simple system (2.2b), prioritised measures (2.3). The coaching focus is Block 1.4.
   The Level 3 transfer project's items are 3.1 (target vision), 3.2 (central processes for handling signals), 3.3 (strategic levers),
   3.4 (integrating sales, service and marketing), 3.5 (implementation architecture); the additional requirement (a system decision
   despite incomplete information) is 3.6.
2. **The evaluation "Effect × Sustainability × Feasibility"** from the plan is the score of Block 2.3. Sustainability is derived from
   what a measure runs on, so it can be checked; effect and feasibility are judged.
3. **Every figure beyond the brief is a Case assumption**: the statements, the survey and contract figures, the deal observations, the
   costs and weeks, the Route 2 budget (€170,000), the KPI baselines and the board's challenge. The brief gives €140,000 and six months.
4. **German by the user's standing request (#32)**, which changes CURRICULUM-GUIDE §1 ("English only"); English stays the default.
5. **Not a Friday capstone.** #29 says Friday days are named in each prompt; this request did not name one, so Days 5–7 follow #30.
6. **Observations are checked as a count; the tally and the system follow the learner's own tags.** Block 2.2's tally is built from the
   learner's tags in 2.1; the system rows are checked per pick with a clue, never naming the right response.
7. **RACI cells accept two letters where both defend** (Marketing I or empty on deal rows; Sales R or C on the save plan). The check
   reports how many cells hold and outlines only rows that break the structure rule (exactly one A, someone doing the work).
8. **Sources to re-check before teaching:** citations are given by their usual details (author, year, title). Page ranges and editions
   differ between printings; the churn and delight figures in the case are illustrations, not research findings.

## Coverage: where each task block is taught

| Block | Taught in | Help while answering |
|---|---|---|
| 1.1 Sort the statements | A3 (three areas, test questions, worked sort on Kontor) | Show the test questions · Check (how many hold) + clue · reasoning after two checks · undo/redo |
| 1.2 What delight is worth | A4 (the churn arithmetic on Kontor, every step) | Show where the numbers are · Show the formula + calculator · per-part clues |
| 1.3 What is missing, three approaches | A1 (Kano), A2 (three factors) | Check (the choice, distinct factors, a reason) + clue |
| 1.4 Coaching reflection | A1–A5 | Worked answers for the mentor |
| 2.1 Tag the observations | A5 (four types, pair tests, worked example) | Show the test questions · Check + clue · reasoning after two checks · undo/redo |
| 2.2 Weaknesses and a simple system | A3, A6 (response per type, owner teams) | Your tally · Check my choices · Check my system + clue per row |
| 2.3 Measures, scores, order | A2, A7 (factor matching, sustainability rule, budget) | Show the test questions · budget bar · factor coverage · Check (factors, sustainability) · order check |
| 3.1 Principles | B1 (system tests: works when people change) | Check (shared view and signal ownership) + clue |
| 3.2 Signal process | A5, B2 (response curve, owner, time, action) | Show the test questions · Check (how many of twelve) + clue |
| 3.3 Levers | B3 (four tests, limits from the printed facts) | Show the test questions · Check (ratings above the limits, systemic count) |
| 3.4 RACI | B4 (letter tests, role profiles, worked grid on Elbe) | Show the test questions · Check (cells + structure rule) + clue |
| 3.5 Architecture | B5 (baseline first, budget, nothing on one person; owner and trigger tests) | Show the owner test · budget bar · plan sentences · Check (three rules) |
| 3.6 Decision | B5 (decision rules, tripwire, premortem) | Baselines printed · Check (wait, activity metric, threshold) |
