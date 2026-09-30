# Retention Lab · Day 6

**Customer Retention & Buying Behaviour in B2B IT Sales · Module 3, Day 2 of 2.**
*Building emotional customer retention and implementing it systematically.*
A self-study companion: study material with twelve live instruments, two tasks and two working documents, in **English and German**
(EN | DE in the top bar, `../CLAUDE.md` #32). It carries the shared standards `../CLAUDE.md` #1 to #28, the two-route form of #30,
the German version of #32 and, since the retrofit of 2026-09-30, #33 to #43 (see notes 9 to 20 below).

The case company is **NetSolutions GmbH**, a German provider of managed IT services for the Mittelstand: *customers are satisfied
but not loyal, repeat purchases are rare, sales reacts instead of managing* (the plan's case study). Route 1 works it with €140,000
and six months; Route 2 puts the learner in the Chief Customer Officer's chair with €170,000 and six months (Case assumption).

This repo was bootstrapped from `day5` (chrome, primitives, store pattern, tokens, the language machinery) and its content was
replaced. Nothing of DataCloud Services remains in the tree.

> **Remote:** `git remote -v` points at `AION-CS/aion-cs-day6` (checked 2026-09-30). The retrofit of 2026-09-30 is not committed or
> pushed yet (`../CLAUDE.md` #17: push only when asked).

## Routes

| Route | Content | Export |
|---|---|---|
| `/route-1/` **Levels 1 + 2** | **Materi A**: seven cards, 60 min (A1 satisfaction against delight and the Kano model, A2 three emotional retention factors: trust, appreciation, relevance, A3 why attachment is missing: relationship, communication, added value, A4 what delight is worth: the churn arithmetic, A5 reading four buying signals, A6 responding to signals: a simple retention system, A7 measures: effect × sustainability × feasibility). **Task 1, Retention Analysis**: *Part 1 · Understand the missing tie:* 1.1 sort nine customer statements by area and add one of your own, 1.2 what satisfaction and delight are worth (F1–F3 and a sentence), 1.3 what is missing from the customer's perspective, three approaches on three factors, 1.4 coaching reflection. *Part 2 · Read the signals and act:* 2.1 tag twelve deal observations with a signal type, 2.2 weaknesses, a response and an owner team per signal type, the risk of misreading, 2.3 choose, score and order three measures. | `1-{name}-day6-l1l2-retention-analysis.html` |
| `/route-2/` **Level 3** | **Materi B**: six cards, 60 min (B1 from actions to a system: the target vision, B2 the central process: handling signals, B3 where the lever is: reach, depth, durability, scale, B4 integrating sales, service and marketing (RACI), B5 deciding without complete information, and the architecture, B6 numbers you can defend: thresholds, payback, the cost of waiting and the month; 10 min each). **Task 2, Retention System Memo**, with the live memo below the last question: 3.1 three system principles, 3.2 owner, response time and first action per signal type, 3.3 three strategic levers rated on four tests and the greatest one, 3.4 a RACI grid across sales, service, marketing and the CCO, 3.5 the implementation architecture, 3.6 the decision, three assumptions, the tripwire and the board's challenge. | `2-{name}-day6-l3-system-memo.html` |

Minutes: Materi A 60 + Task 1 58 (6 + 10 + 8 + 5 + 8 + 9 + 12), Materi B 60 (6 × 10) + Task 2 51 (5 + 9 + 10 + 8 + 10 + 9). All in `lib/routes.ts`
and `data/materialIndex.ts`. Core only (note 11): Materi A 52 + Task 1 36, Materi B 30 + Task 2 28.

Route 2 quotes the learner's Route 1 Core answers (the uncertainty signals tagged in 2.1, the measures chosen in 2.3) in a soft box
(`useJumpTo`, jumping to Block 2.3) and never requires them; the routes share no answer fields.

## German version (CLAUDE.md #32)

Same machinery as Day 5: `lib/lang.ts` (`tt`, `t` + `bi`, number formats), `lib/i18n.tsx` (`LangProvider`, `LangSwitch`), `ui.lang`
in the persisted store. Every page, card, diagram, task, clue, missing list, the glossary panel and both exports follow the switch.
Common terms stay English in German sentences (Churn, Owner, Playbook, Tripwire, Go-live, Success-Review, RACI, KPI…); the explanations
are German, formal "Sie". Mentor tools stay English; "Fill all model answers" enters German free text while the site is German. File
names stay English.

## Stack

Next.js 14 App Router · TypeScript strict · Tailwind (CS tokens) · Zustand + `persist` (key `cs-d6-v1`, version 2 since 2026-09-30, `skipHydration` +
`StoreHydrator`, deep `mergeDefaults`) · static export. No animation, drag-and-drop, PDF or chart library.

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm run verify:calc  # re-derives every figure and rule, and runs the mentor fill in both languages (Core-only fill, over-budget, calculators, key phrases and the v1 → v2 migration too; 268 checks)
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
  €170,000), each with weeks, months until the response shows, the method its trigger uses and the group it spends on; owners;
  **“NetSolutions today”** (`R2_FIG`: 150 customers, 40 delighted, 90 satisfied, churn 20% / 5%, €24,000, 40%, 3-year term, 120 open
  deals or renewals, 14 stalled deals, €6,000 per expansion deal); the **methods** of Materi B6 (`coverageShare`, `paybackCount`,
  `waitingCount`, `triggerMonth`, `expectedLeavers`); the four customer groups with data confidence; three decisions, the KPIs with
  baselines and the board's challenge. Every Route 2 model number is computed from these, never typed (see note 16).
- `lib/calcR2.ts`: the Route 2 calculators (one per trigger number and month, the pickup point, the tripwire, the “they stay” sign and
  the cost of the two losses), with per-part clues that name the row to read.

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

9. **Core / Optional on both routes (CLAUDE.md #35, #40, retrofit 2026-09-30).** Nothing was removed; the shortest thread to each route's
   objective stays open and the rest is folded to one line. Route 1 objective: *from satisfied to attached: why the tie is missing, what
   delight is worth, read the signals, choose measures*. **Core 1.1, 1.2, 2.1, 2.3**; **Optional 1.3, 1.4, 2.2**. Cards **A1 to A5 and A7**
   stay Core (1.2 now cites A1 for satisfied against delighted; 2.3 cites A2 for the factors); **A6** is Optional. Route 2 objective:
   *decide a scalable retention system despite incomplete information*. **Core 3.2, 3.5, 3.6**; **Optional 3.1, 3.3, 3.4**. Cards **B2,
   B5, B6** Core; **B1, B3, B4** Optional. The ring, the page map's done/total and both missing lists count Core only
   (`OPTIONAL_BLOCKS`, `optional` on the material registry, one filter in `lib/missing.ts`). The tag shows beside every page-map pill and on
   every card and block (`CorePill`). A jump to a collapsed item opens it first (`lib/flash.ts`, `store/useOptionalOpen.ts`).
10. **Two always-live rust notices (CLAUDE.md #34):** under every answer block (`BlockMissing`) and above Export, with no click first.
11. **Minutes of the Core thread:** Materi A 52 (A6 is 8), Task 1 36 (6 + 10 + 8 + 12); Materi B 30 (B2, B5, B6), Task 2 28 (9 + 10 + 9).
12. **“Show clue and example answer” on every free-text field (CLAUDE.md #23 update).** Open fields show the mentor's model text; fields
    whose model text is a calculated result or a graded pick (1.2 sentence, 2.3 first priority, 3.2 process notes, 3.3 greatest lever,
    3.5 triggers, what is left out and the pickup point, 3.6 assumptions and the board's challenge) show a separate `example` in
    `lib/mentorGuide.ts`: the same method on Elbe or “Company A” with other numbers. `verify:calc` proves each example differs from its answer.
13. **“Highlight the key words” on both boards (1.1 and 2.1):** `REASON_KEY`, `OBS_KEY`; `verify:calc` proves every phrase is an exact
    substring of its text in both languages.
14. **Guided stories and “The point” (CLAUDE.md #36).** All thirteen interactive diagrams (A1 curve, A2 pillars, A3 worked sort, A4 delight
    value, A5 worked tagging, A6 read and respond, A7 scoring, B1 loop, B2 decay, B3 lever profile, B4 RACI example, B5 architecture, B6
    number methods) open with “The point” and carry a three-step “Walk me through it” (the case that works, the case that does not, the
    point) that drives the real controls and moves an amber spotlight; every number is computed from the diagram's own constants; a manual
    button leaves the story. Every “What this shows” now starts “In plain words:”. **No video was embedded (#33):** none was searched and
    verified in this pass; a card without a video is not a defect.
15. **Less text by default (CLAUDE.md #37).** Research paragraphs, the Kano table and caution (A1), the worked calculation (A4), side
    callouts (A6, B3), notes (A7, B5) and Elbe's worked tables (B5, B6) sit behind “＋ Show …”; the decision rules and “why it matters /
    how to read the picture” too. Task chips open the rules, the worked calculation and tables first. One button per Materi block shows all.
16. **Every number in Route 2 has a method, a calculator and a check (CLAUDE.md #41, #42, #43).** The model triggers used 80%, 70%, 90%, 60%
    and “3 points”, and the tripwire 33%, none of which could be derived from the screen. They are replaced by numbers worked out from
    “NetSolutions today” with the methods of the new card **B6**: shared view 80% by month 2 (coverage 120 ÷ 150), playbook 6 stalled deals
    by month 4 (€35,000 ÷ €6,000), handover 5 customers by month 5, reviews 10 by month 6, moments 6 by month 6 (cost ÷ (€1,440 × 3
    years)); tripwire **60 delighted customers by month 6** (40 + ⌈€85,000 ÷ €4,320⌉); pickup point **5 satisfied customers by month 6**
    (€48,000 ÷ €9,600); the delighted group's sign **2 leavers by month 6** (40 × 5% × 6 ÷ 12 = 1, then one more). The month is start +
    ⌈weeks ÷ 4⌉ + months until the response shows (printed on each item; view and playbook now need 4 weeks). Every such field has
    “Show what to look at” (every input with its value, each a button to its row) and “Show the method” (formula in words + calculator
    with per-part clues + “Use this result”); the calculator checks the learner's arithmetic on their own inputs, never their choice. The
    assumptions follow the two-sentence recipe of B5 (#41) against a printed group table with data confidence and the learner's own spend
    per group. The tripwire KPI counts customers now, so the persisted `version` is 2 (`migrate` clears an old % threshold).
17. **Decisions are free (CLAUDE.md #38).** Going over the Route 2 budget is no longer a missing item and no longer blocks Block 3.5; it is
    a hint, and the memo prints the amount over as a fact. Route 1's over-budget line is worded as a hint too.
18. **Live memo at the bottom (CLAUDE.md #39):** full width below Block 3.6 and above Export, with “Hide the memo”; no side column, no phone strip.
19. **Clue kits on every field (CLAUDE.md #42):** `WritingHelp` became “Show what to look at”: every number, rule and earlier answer the
    model answer uses, with its value, each a button that flashes its source; then the steps.
20. **Elbe's worked triggers in B5 were aligned with B6** (75% / 5 deals / 8 customers instead of 80% / 70% / 85%, which matched the
    task's own model answers too closely).
21. **Follow-up check (2026-09-30, second session).** Core never names an Optional concept: Block 3.6's "adjust one lever" became
    "adjust one item" (levers are taught only in the Optional B3), in the task, export, answer key, worked answer and glossary. The
    Route 2 blurb says the memo assembles below the last question (#39). The home page's RACI pay-off says it is taught in the optional
    part of Route 2 (#27). The Route 1 Word documents (last built 2026-09-26) were rebuilt with Core/Optional marks, "The point" per card
    and Block 2.3's new wording; "The point" was added to B1–B5 in the Route 2 Materi document too. All four pass `validate.py`.
    **Kept by the user's decision (2026-09-30):** Materi B2's table "A signal process for a managed IT provider" prints the same owner,
    time and first action per signal type that Block 3.2 asks for. #25 would move it to another case; the user chose to keep it, because
    what matters in the task is that learners can see where every number and clue comes from.
22. **“Acts on” label in Block 2.3 (2026-09-30, user feedback; CLAUDE.md #45).** Every measure now carries, after its weeks, the area of
    Materi A3 it acts on (Relationship, Communication, Added value, or Price for the discount) as a small teal pill and in the chosen card's
    header. It is a fact taken from A3's own tests, never the factor and never a score. A line above the list says customers named three
    areas in Block 1.1 and that none of the nine statements mentions price (`verify:calc` checks that in both languages). A3 and A7 carry the
    rule in their decision rules, and the “Show the test questions” help repeats it. The model three act on one area each. The label does
    not rank by itself: owner, playbook, reviews and handover all defend, and durability and feasibility still decide. The Route 1 Word
    task lists the label in a new “Acts on” column.
23. **“Left out” in Block 2.3 made explicit (2026-09-30, user feedback).** The reason field now says that “left out” means one of the six
    measures the learner did not choose, not the second or third priority, asks to name the one that tempted them most and to say why it
    stays out (its score, its area, what it runs on, or the budget). The “What to look at” list shows every not-chosen measure with its cost,
    area and what it runs on, live from the learner's picks. The mentor's `lookFor` and the Word task say the same.

## Dependency checklist (CLAUDE.md #40)

✓ = reads only Core blocks, Core cards and the case brief. Optional items may read Core; nothing reads them back.

| Item | Status | Reads from | Core-safe |
|---|---|---|---|
| **Route 1** | | | |
| 1.1 Sort the statements | Core | printed statements, A3 | ✓ |
| 1.2 F1–F3 and the sentence | Core | printed tables, A4, A1 | ✓ |
| 1.3 What is missing, approaches | Optional | review summary, own sort 1.1 (Core), A1, A2 | self-contained |
| 1.4 Coaching reflection | Optional | own answers 1.1–1.3, A1, A6 | self-contained |
| 2.1 Tag the observations | Core | printed observations, A5 | ✓ |
| 2.2 Weaknesses and system | Optional | own tags 2.1 (Core), statements 1.1, A3, A6 | self-contained |
| 2.3 Measures, scores, order | Core | printed measures, A2, A7, own 1.1 and 2.1 | ✓ **fixed**: its “why” help asked for “the weakness” (chosen only in Optional 2.2); it now names the reasons of 1.1 and the stalled signals of 2.1 |
| **Route 2** | | | |
| Case brief · “Where Route 1 left off” | — | Route 1 Core 2.1 and 2.3 | ✓ **fixed**: it quoted the weaknesses of Optional 2.2 and jumped there; it now quotes 2.1 and 2.3 and jumps to 2.3 (the memo too) |
| 3.1 Principles | Optional | B1 | self-contained (its help no longer points at Route 1's weaknesses) |
| 3.2 Signal process | Core | printed signals, B2, A5 | ✓ |
| 3.3 Levers | Optional | printed levers, B3 | self-contained |
| 3.4 RACI | Optional | B4 | self-contained |
| 3.5 Architecture | Core | printed items, “NetSolutions today”, B5, B6 | ✓ |
| 3.6 Decision | Core | own 3.2 and 3.5, group table, baselines, B5, B6 | ✓ **fixed**: its FIND IT line named “Blocks 3.1 to 3.5”; it now names 3.2 and 3.5 |
| **Cards** | | | |
| A1–A5, A7 · B2, B5, B6 | Core | each other and the case | ✓ (B5 carries the assumption recipe, B6 the number methods) |
| A6 · B1, B3, B4 | Optional | — | no Core block needs them |

## Coverage: where each task block is taught

| Block | Taught in | Help while answering |
|---|---|---|
| 1.1 Sort the statements · **Core** | A3 (three areas, test questions, worked sort on Kontor) | Show the test questions · Check (how many hold) + clue · reasoning after two checks · undo/redo |
| 1.2 What delight is worth · **Core** | A4 (the churn arithmetic on Kontor, every step) | Show where the numbers are · Show the formula + calculator · per-part clues |
| 1.3 What is missing, three approaches · Optional | A1 (Kano), A2 (three factors) | Check (the choice, distinct factors, a reason) + clue |
| 1.4 Coaching reflection · Optional | A1–A5 | Worked answers for the mentor |
| 2.1 Tag the observations · **Core** | A5 (four types, pair tests, worked example) | Show the test questions · Check + clue · reasoning after two checks · undo/redo |
| 2.2 Weaknesses and a simple system · Optional | A3, A6 (response per type, owner teams) | Your tally · Check my choices · Check my system + clue per row |
| 2.3 Measures, scores, order · **Core** | A2, A7 (factor matching, sustainability rule, budget) | Show the test questions · budget bar · factor coverage · Check (factors, sustainability) · order check |
| 3.1 Principles · Optional | B1 (system tests: works when people change) | Check (shared view and signal ownership) + clue |
| 3.2 Signal process · **Core** | A5, B2 (response curve, owner, time, action) | Show the test questions · Check (how many of twelve) + clue |
| 3.3 Levers · Optional | B3 (four tests, limits from the printed facts) | Show the test questions · Check (ratings above the limits, systemic count) |
| 3.4 RACI · Optional | B4 (letter tests, role profiles, worked grid on Elbe) | Show the test questions · Check (cells + structure rule) + clue |
| 3.5 Architecture · **Core** | B5 (baseline first, owner and trigger tests), B6 (the number methods) | Owner test · budget bar · plan reading · per trigger: what to look at, the method + two calculators (number, month) · pickup point: cost-of-waiting calculator · Check (three rules, hints only) |
| 3.6 Decision · **Core** | B5 (decision rules, assumption recipe), B6 (today plus a step, expected leavers) | Group table with data confidence and own spend · per assumption: how to build it (+ calculator for the group left standard) · tripwire: what to look at + calculator · challenge: cost-of-losses calculator · Check (wait, activity metric, threshold) |
