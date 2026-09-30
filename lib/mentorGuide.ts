import { DELIGHT, NETSOL } from "@/data/delight";
import type { FigureId } from "@/data/delight";
import { BUDGET, MEASURE_BY_ID, MODEL_COST, MODEL_MEASURES, RUNS_ON_LABEL, modelScore, sustainBucket } from "@/data/measures";
import type { MeasureId } from "@/data/measures";
import { FACTOR_LABEL } from "@/data/approaches";
import { SIGNALS } from "@/data/signals";
import type { SignalType } from "@/data/signals";
import { KEY_L1, KEY_R2 } from "@/data/mentorKey";
import { ARCH_BY_ID, CHALLENGE_LOST, DELIGHTED_EXPECTED, DELIGHTED_WRONG_AT, GP_PER_CUSTOMER, GROUPS, KEPT_PER_MOVE, KEPT_PER_TERM, LEVER_BY_ID, MODEL_ARCH, MODEL_PICKUP, MODEL_START, MODEL_TRIGGER, MODEL_TRIPWIRE, OWNERS, OWNER_ACCEPT, PRINCIPLES, R2_BUDGET, R2_FIG, R2_MONTHS, customerItems, setupMonths, triggerMonth, triggerNumber } from "@/data/route2";
import type { ArchId, PrincipleId } from "@/data/route2";
import { euro, tt } from "@/lib/lang";

/**
 * Mentor-only worked answers for every task question the answer keys (lib/answerKey.ts) do not already cover: the numeric fields,
 * with every step of the calculation written out with its numbers, and the free-text answers, with the model text and what a good
 * answer must contain. Shown only after the mentor bar is unlocked, never exported. Numbers are computed from the same constants as
 * the tables, the calculators and the answer checks, so they cannot drift from the model answers. Mentor tools stay English
 * (CLAUDE.md #32); the model answers quoted follow the site's language, because the fill enters them in that language.
 */
export type WorkedStep = { label: string; calc: string; result: string };
export type MentorGuide = { title: string; answer: string; example?: string; steps?: WorkedStep[]; why?: string; lookFor?: string[]; pitfalls?: string[] };

const n = (v: number) => (Math.round(v * 100) / 100).toLocaleString("en-US");
const L1 = () => KEY_L1();
const R2 = () => KEY_R2();

/* ------------------------------------------------------------------ Route 1 */

export function extraReasonGuide(): MentorGuide {
  return {
    title: "1.1 · A reason of your own",
    answer: L1().extraReason ?? "",
    why: "Any plausible reason a satisfied managed-services customer feels no tie is fine; the area must be named and must fit by the tests of A3.",
    lookFor: ["A reason that is not one of the nine statements.", "Its area named: relationship, communication or added value.", "The area fits by the test questions (who / what reaches them / what they gain beyond the contract)."],
    pitfalls: ["A performance complaint (“the servers were down”): that is dissatisfaction, not a missing tie. Ask whether a satisfied customer could say it.", "A price reason: none of the evidence points there."],
  };
}

export function figureGuide(id: FigureId): MentorGuide {
  const c = NETSOL.contract;
  const mg = NETSOL.margin;
  if (id !== "F3") {
    const g = id === "F1" ? NETSOL.satisfied : NETSOL.delighted;
    const name = id === "F1" ? "satisfied" : "delighted";
    const leave = g.customers * (g.churn / 100);
    const rev = leave * c;
    const gp = rev * (mg / 100);
    return {
      title: `1.2 · ${id} Gross profit lost per year, ${name} customers`,
      answer: n(id === "F1" ? DELIGHT.f1 : DELIGHT.f2),
      steps: [
        { label: `Customers who leave per year (${name} row)`, calc: `${g.customers} × ${g.churn}% = ${g.customers} × ${g.churn / 100}`, result: n(leave) },
        { label: "Contract revenue lost", calc: `${n(leave)} × ${n(c)}`, result: euro(rev) },
        { label: "Gross profit lost = revenue × margin", calc: `${n(rev)} × ${mg}%`, result: euro(gp) },
      ],
      why:
        id === "F1"
          ? "Satisfied customers are the largest group and leave at 20%: 18 customers a year walk out although they rate the service well."
          : "Delighted customers leave at 5%: only 2 a year. The gap between F1 and F2 is what delight is worth.",
      pitfalls: [
        `Churn not divided by 100: ${n(g.customers * g.churn * c * (mg / 100))}.`,
        `Margin left out (revenue instead of gross profit): ${n(rev)}.`,
        id === "F1" ? `Wrong row (delighted instead of satisfied): ${n(DELIGHT.f2)}.` : `Wrong row (satisfied instead of delighted): ${n(DELIGHT.f1)}.`,
      ],
    };
  }
  const diff = NETSOL.satisfied.churn - NETSOL.delighted.churn;
  const kept = NETSOL.moved * (diff / 100);
  const rev = kept * c;
  return {
    title: "1.2 · F3 Gross profit kept by moving 30 customers",
    answer: n(DELIGHT.f3),
    steps: [
      { label: "Churn gap, in points", calc: `${NETSOL.satisfied.churn}% − ${NETSOL.delighted.churn}%`, result: `${diff} points` },
      { label: "Customers kept per year", calc: `${NETSOL.moved} × ${diff / 100}`, result: n(kept) },
      { label: "Contract revenue kept", calc: `${n(kept)} × ${n(c)}`, result: euro(rev) },
      { label: "Gross profit kept = revenue × margin", calc: `${n(rev)} × ${mg}%`, result: euro(DELIGHT.f3) },
    ],
    why: "Moving a customer from satisfied to delighted cuts its chance of leaving from 20% to 5%; across 30 customers that keeps 4.5 customers a year.",
    pitfalls: [`Only the satisfied churn used (30 × 20%): ${n(NETSOL.moved * 0.2 * c * (mg / 100))}.`, `Margin left out: ${n(rev)}.`, `F1 − F2 instead of the moved customers: ${n(DELIGHT.f1 - DELIGHT.f2)}.`],
  };
}

export function worthGuide(): MentorGuide {
  return {
    title: "1.2 · What delight is worth, in one sentence",
    answer: L1().worth ?? "",
    example: tt(
      "Company A's 50 satisfied customers cost it €60,000 of gross profit a year when they leave; its 25 delighted ones cost only €7,500. Moving 15 satisfied customers to delighted would keep €13,500 a year. Run the same comparison on your own F1, F2 and F3.",
      "Die 50 zufriedenen Kunden von Firma A kosten sie 60.000 € Rohertrag pro Jahr, wenn sie gehen; ihre 25 begeisterten nur 7.500 €. 15 zufriedene Kunden zu begeisterten zu machen, würde 13.500 € pro Jahr halten. Machen Sie denselben Vergleich mit Ihrem eigenen F1, F2 und F3.",
    ),
    lookFor: ["At least one of the learner's own figures (F1, F2, F3, or F1 − F2).", "The comparison: satisfied customers cost far more than delighted ones.", "What it means: satisfaction is not enough to keep a customer."],
    pitfalls: ["A sentence with no figure: the app asks for one.", "“Delight costs money”: the sentence should be about what it keeps, not what it costs."],
  };
}

export function approachGuide(i: number): MentorGuide {
  const a = (L1().approaches ?? [])[i];
  return {
    title: `1.3 · Approach ${i + 1}`,
    answer: a ? `${a.factor ? FACTOR_LABEL[a.factor] : ""} · ${a.text}` : "",
    why: "Three approaches on three different factors, so they can be tried and judged apart. The app checks only that each has a factor, is long enough and gives a reason.",
    lookFor: ["What NetSolutions does and for which customers.", "What the customer feels or does as a result.", "A reason that names the factor it builds (trust, appreciation, relevance), and the action really builds that factor."],
    pitfalls: ["A discount or a newsletter labelled as appreciation: neither builds a factor (A2).", "A one-off gesture from nobody the customer works with: weak appreciation."],
  };
}

export function reflectGuide(k: "satisfaction" | "signal" | "manager"): MentorGuide {
  const r = L1().reflect;
  return {
    title: k === "satisfaction" ? "1.4 · Why satisfaction is not enough" : k === "signal" ? "1.4 · Where signals are overlooked" : "1.4 · How an experienced sales manager acts",
    answer: r ? r[k] : "",
    lookFor:
      k === "satisfaction"
        ? ["Something the learner found in 1.1–1.3 (a statement, a figure).", "The idea that satisfaction removes a reason to leave but gives none to stay."]
        : k === "signal"
          ? ["A concrete moment where a question can be read two ways.", "What happens when nobody owns the answer."]
          : ["What the manager asks first.", "A change in how the team works, not a single heroic act."],
  };
}

export function misreadGuide(): MentorGuide {
  return {
    title: "2.2 · The risk of misreading a signal",
    answer: L1().misread ?? "",
    lookFor: ["One signal type named and the one it could be mistaken for.", "What would go wrong (a stall, a lost deal, a discount given away).", "A sign in the deal that would show it: silence, a moved meeting, a repeated “we need to check”."],
    pitfalls: ["A general statement (“we might misunderstand customers”): ask for one signal and one sign."],
  };
}

export function scoreGuide(id: MeasureId): MentorGuide {
  const m = MEASURE_BY_ID[id];
  const s = sustainBucket(m.runsOn);
  return {
    title: `2.3 · ${m.name}`,
    answer: `${m.model.effect} × ${s} × ${m.model.feasibility} = ${modelScore(id)}`,
    steps: [
      { label: "Sustainability from what it runs on (A7)", calc: `runs on ${RUNS_ON_LABEL[m.runsOn]} → process 3 · role 2 · person or one-off 1`, result: String(s) },
      { label: "Score", calc: `${m.model.effect} × ${s} × ${m.model.feasibility}`, result: String(modelScore(id)) },
    ],
    why: `${m.model.note} Factors it builds: ${m.targets.length ? m.targets.map((t) => FACTOR_LABEL[t]).join(", ") : "none"}.`,
    pitfalls:
      id === "starvisits"
        ? ["Sustainability 3 “because it is very effective”: effect and sustainability are different tests; it runs on one person, so 1."]
        : id === "discount"
          ? ["Naming trust or appreciation as its factor: a lower price builds none of the three."]
          : id === "owner"
            ? ["Sustainability 3: it is a role, which survives one person leaving, but not a process; 2."]
            : undefined,
  };
}

export function whyGuide(): MentorGuide {
  return {
    title: "2.3 · Why the first priority goes first",
    answer: L1().why ?? "",
    example: tt(
      "Company A put its outage messages first: they answer the reason its customers gave most often and score 18. Its named service lead is second (12), the founder's calls are left out (9, one person). The two cost €40,000 of its €50,000. Use your own three scores, costs and the reasons from Blocks 1.1 and 2.1.",
      "Firma A setzte ihre Störungsmeldungen an die erste Stelle: Sie beantworten den Grund, den ihre Kunden am häufigsten nannten, und erzielen 18. Die benannte Service-Leitung ist Zweite (12), die Anrufe des Gründers bleiben draußen (9, eine Person). Die zwei kosten 40.000 € von 50.000 €. Nutzen Sie Ihre eigenen drei Werte, Kosten und die Gründe aus den Blöcken 1.1 und 2.1.",
    ),
    steps: [
      { label: "Model plan cost", calc: MODEL_MEASURES.map((id) => n(MEASURE_BY_ID[id].cost)).join(" + "), result: euro(MODEL_COST) },
      { label: "Left of the budget", calc: `${n(BUDGET)} − ${n(MODEL_COST)}`, result: euro(BUDGET - MODEL_COST) },
      { label: "With the owner model added", calc: `${n(MODEL_COST)} + ${n(MEASURE_BY_ID.owner.cost)}`, result: euro(MODEL_COST + MEASURE_BY_ID.owner.cost) },
    ],
    lookFor: ["The order and what decides it (score, the reason customers gave in 1.1, the stalled signals in 2.1, or set-up time).", "The cost against €140,000.", "One of the six measures NOT chosen (not the 2nd or 3rd priority), named, with why it stays out: its score, its area, what it runs on, or the budget."],
  };
}

/* ------------------------------------------------------------------ Route 2 */

export function principleTextGuide(c: PrincipleId): MentorGuide {
  return {
    title: `3.1 · ${PRINCIPLES[c].name}`,
    answer: (R2().principleText ?? {})[c] ?? PRINCIPLES[c].means,
    lookFor: ["What changes for NetSolutions' customers or teams.", "Which weakness it answers (no owner, contact only at invoices, unanswered hesitation, no handover)."],
    pitfalls: c === "discount" || c === "stars" ? ["This principle is one the key rejects; if the learner kept it, ask what happens when the discount ends or the star leaves."] : undefined,
  };
}

export function processNoteGuide(s: SignalType): MentorGuide {
  const row = R2().process?.[s];
  return {
    title: `3.2 · ${SIGNALS[s].label}`,
    answer: row?.note ?? "",
    example: tt(
      "At Elbe, a question about a price increase is logged in the shared record under the customer, the account manager is told at once, and the customer gets a written answer with the new terms within the promised time. Write your own line for this signal type, with your own owner, time and first action.",
      "Bei Elbe wird eine Frage zu einer Preiserhöhung im gemeinsamen Datensatz beim Kunden erfasst, der Account Manager wird sofort informiert, und der Kunde bekommt in der zugesagten Zeit eine schriftliche Antwort mit den neuen Konditionen. Schreiben Sie Ihre eigene Zeile für diese Signalart, mit Ihrem eigenen Owner, Ihrer Zeit und Ihrer ersten Aktion.",
    ),
    lookFor: ["Where the signal is logged (the shared customer view).", "Who is told.", "What the customer receives, and when."],
  };
}

export function greatestGuide(): MentorGuide {
  return {
    title: "3.3 · The lever with the greatest effect",
    answer: `${LEVER_BY_ID.playbook.name} · ${R2().greatestWhy ?? ""}`,
    example: tt(
      "At Company A the shared record was the greatest lever: it touches every customer, lasts when people change, costs once, and removes the reason customers gave most often, “we have to explain ourselves every time”. Use your own three levers, their ratings and the weakness your evidence shows.",
      "Bei Firma A war der gemeinsame Datensatz der größte Hebel: Er erreicht jeden Kunden, bleibt, wenn Menschen wechseln, kostet einmal und beseitigt den häufigsten Grund der Kunden, „wir müssen uns jedes Mal neu erklären“. Nutzen Sie Ihre eigenen drei Hebel, ihre Bewertungen und die Schwäche, die Ihre Evidenz zeigt.",
    ),
    lookFor: ["One of the learner's three levers.", "The test that decides it (usually durability or reach).", "The weakness from Route 1 it removes."],
    pitfalls: ["The owner model as greatest “because customers want a person”: defensible on depth, but ask how it survives four managers in two years."],
  };
}

const methodSteps = (id: ArchId): WorkedStep[] => {
  const a = ARCH_BY_ID[id];
  const start = MODEL_START[id] ?? 1;
  const setup = setupMonths(a.weeks);
  const number: WorkedStep[] =
    a.result === "coverage"
      ? [{ label: "Coverage share (NetSolutions today: open-deal customers ÷ all customers)", calc: `${R2_FIG.openDeals} ÷ ${R2_FIG.customers} × 100 = ${n((R2_FIG.openDeals / R2_FIG.customers) * 100)} → round up`, result: `${triggerNumber(id)}%` }]
      : a.result === "deal"
        ? [{ label: "Payback in deals (item cost ÷ gross profit of one expansion deal)", calc: `${n(a.cost)} ÷ ${n(R2_FIG.dealGP)} = ${n(a.cost / R2_FIG.dealGP)} → round up`, result: `${triggerNumber(id)} deals` }]
        : [
            { label: "Kept per customer moved, over the term", calc: `${euro(KEPT_PER_MOVE)} × ${R2_FIG.years} years`, result: euro(KEPT_PER_TERM) },
            { label: "Payback in customers (item cost ÷ kept over the term)", calc: `${n(a.cost)} ÷ ${n(KEPT_PER_TERM)} = ${n(a.cost / KEPT_PER_TERM)} → round up`, result: `${triggerNumber(id)} customers` },
          ];
  return [
    ...number,
    { label: `Month (model start month ${start} + set-up ${a.weeks} weeks ÷ 4 → ${setup} + response ${a.respond})`, calc: `${start} + ${setup} + ${a.respond}`, result: `month ${triggerMonth(start, id)}` },
  ];
};

export function triggerGuide(id: ArchId): MentorGuide {
  const model = MODEL_TRIGGER[id as keyof typeof MODEL_TRIGGER];
  const a = ARCH_BY_ID[id];
  return {
    title: `3.5 · ${a.name}`,
    answer: model ?? tt(`If fewer than ${triggerNumber(id)} … by month …, then … (the method of Materi B6 on this item).`, `Wenn bis Monat … weniger als ${triggerNumber(id)} …, dann … (die Methode aus Materi B6 für diesen Punkt).`),
    example: tt(
      "At Elbe: “If fewer than 8 new customers rate the onboarding 5 of 5 by month 5, it is shortened.” The 8 is €18,000 ÷ €2,520 kept per customer over the term, rounded up; month 5 is start 3 + 1 month of set-up + 1 month until customers respond. Work out your own item's number and month with “Show the method”.",
      "Bei Elbe: „Bewerten bis Monat 5 weniger als 8 Neukunden das Onboarding mit 5 von 5, wird es gekürzt.“ Die 8 sind 18.000 € ÷ 2.520 € gehalten je Kunde über die Laufzeit, aufgerundet; Monat 5 ist Start 3 + 1 Monat Einrichtung + 1 Monat, bis Kunden reagieren. Berechnen Sie Zahl und Monat Ihres eigenen Punkts mit „Methode zeigen“.",
    ),
    steps: methodSteps(id),
    why: `The number is the item's own method (${a.result === "coverage" ? "coverage: what the next step needs" : a.result === "deal" ? "payback in deals" : "payback in customers moved to 5 of 5"}), the month the first month it can have worked. Owner that defends: ${OWNER_ACCEPT[id].map((o) => OWNERS[o].name).join(" or ")}. A learner with another start month gets another month: check it with the calculator, not against the model.`,
    lookFor: ["A metric about the item's effect.", "A number from the item's method and a month from the start month.", "An action the owner can take alone."],
    pitfalls: [
      a.result === "customer" ? `Kept per year not times the ${R2_FIG.years}-year term: ${n(Math.ceil(a.cost / KEPT_PER_MOVE - 1e-9))}.` : a.result === "deal" ? `A whole contract's gross profit used instead of a deal's: ${n(Math.ceil(a.cost / GP_PER_CUSTOMER - 1e-9))}.` : "100% “because every customer matters”: the playbook only needs the open-deal customers.",
      "A round number with no method (“80%”, “20 customers”): ask which printed rows it comes from.",
      "A month before the item can have worked (the start month itself).",
    ],
  };
}

export function postponedGuide(): MentorGuide {
  const cost = MODEL_ARCH.reduce((s, id) => s + ARCH_BY_ID[id].cost, 0);
  return {
    title: "3.5 · What is left out",
    answer: R2().postponed ?? "",
    example: tt(
      "Company A leaves out its star account manager (€36,000): its five funded items cost €140,000 of the €150,000, adding it would take the plan to €176,000, and it rests on one person. Name your own item, its cost and your own totals from the budget bar.",
      "Firma A lässt ihren Star-Account-Manager weg (36.000 €): Ihre fünf finanzierten Punkte kosten 140.000 € von 150.000 €, mit ihm käme der Plan auf 176.000 €, und er hängt an einer Person. Nennen Sie Ihren eigenen Punkt, seine Kosten und Ihre eigenen Summen aus dem Budgetbalken.",
    ),
    steps: [
      { label: "Model funded items", calc: MODEL_ARCH.map((id) => n(ARCH_BY_ID[id].cost)).join(" + "), result: euro(cost) },
      { label: "Left", calc: `${n(R2_BUDGET)} − ${n(cost)}`, result: euro(R2_BUDGET - cost) },
      { label: "With the owner model added", calc: `${n(cost)} + ${n(ARCH_BY_ID.owners.cost)}`, result: euro(cost + ARCH_BY_ID.owners.cost) },
    ],
    lookFor: ["The item named, with its cost.", "Why this one (budget, depends on people, acts on no factor)."],
  };
}

export function pickupGuide(): MentorGuide {
  const a = ARCH_BY_ID[MODEL_PICKUP.item];
  return {
    title: "3.5 · The pickup point",
    answer: R2().pickup ?? "",
    example: tt(
      "At Elbe: “If 4 or more customers leave by month 6 because they had no personal contact, we fund the star account manager.” €36,000 ÷ €10,500 of gross profit per customer = 3.4, rounded up to 4: after four such losses, waiting has cost more than the item. Run the method on the item you left out.",
      "Bei Elbe: „Gehen bis Monat 6 4 oder mehr Kunden, weil sie keinen persönlichen Kontakt hatten, finanzieren wir den Star-Account-Manager.“ 36.000 € ÷ 10.500 € Rohertrag je Kunde = 3,4, aufgerundet 4: Nach vier solchen Verlusten hat das Warten mehr gekostet als der Punkt. Wenden Sie die Methode auf den Punkt an, den Sie weggelassen haben.",
    ),
    steps: [
      { label: "Gross profit lost per customer who leaves (contract × margin)", calc: `${n(R2_FIG.contract)} × ${R2_FIG.margin}%`, result: euro(GP_PER_CUSTOMER) },
      { label: `Cost of waiting (${a.name} ÷ that)`, calc: `${n(a.cost)} ÷ ${n(GP_PER_CUSTOMER)} = ${n(a.cost / GP_PER_CUSTOMER)} → round up`, result: `${MODEL_PICKUP.count} customers` },
      { label: "Month", calc: "the plan's last month", result: `month ${MODEL_PICKUP.month}` },
    ],
    why: "The pickup point is the count of losses at which not having the item has cost as much as the item. It counts only customers who leave for the reason the item would fix (no personal contact).",
    lookFor: ["A number from the cost of waiting.", "Which leavers count.", "A month no later than 6."],
    pitfalls: [`Kept per customer (${euro(KEPT_PER_MOVE)}) used instead of the whole gross profit a leaving customer takes: ${Math.ceil(a.cost / KEPT_PER_MOVE - 1e-9)}.`, "Any churn counted, not only the leavers the item would have kept."],
  };
}

export function assumptionGuide(i: number): MentorGuide {
  const answer = (R2().assumptions ?? [])[i] ?? "";
  const g = (["satisfied", "deals", "delighted"] as const)[i];
  const doubt = g ? `${GROUPS[g].confidence}: ${GROUPS[g].confidenceWhy}` : "";
  const examples = [
    tt(
      "At Elbe: “I assume satisfied customers move to 5 of 5 when we spend €45,000 on them; a third never answered the survey. I am wrong if fewer than 73 customers rate us 5 of 5 by month 6 (today 55).” Use your own group, your plan's spend there and your own tripwire number.",
      "Bei Elbe: „Ich nehme an, dass zufriedene Kunden auf 5 von 5 steigen, wenn wir 45.000 € für sie ausgeben; ein Drittel hat die Befragung nie beantwortet. Ich liege falsch, wenn uns bis Monat 6 weniger als 73 Kunden mit 5 von 5 bewerten (heute 55).“ Nutzen Sie Ihre eigene Gruppe, die Ausgaben Ihres Plans dort und Ihre eigene Tripwire-Zahl.",
    ),
    tt(
      "At Elbe: “I assume the 150 customers with an open deal move forward when every signal has an owner; only logged signals are counted. I am wrong if fewer than 5 stalled deals have moved forward by month 4 (9 stalled in the last half-year).” Use your own trigger number and month from Block 3.5.",
      "Bei Elbe: „Ich nehme an, dass die 150 Kunden mit offenem Deal weiterkommen, wenn jedes Signal einen Owner hat; gezählt werden nur erfasste Signale. Ich liege falsch, wenn bis Monat 4 weniger als 5 stockende Deals weitergekommen sind (9 stockten im letzten Halbjahr).“ Nutzen Sie Ihre eigene Trigger-Zahl und Ihren Monat aus Block 3.5.",
    ),
    tt(
      "At Elbe: “I assume the 55 delighted customers stay without extra money; their 6% churn rests on a handful of cases. 55 × 6% × 6 ÷ 12 = 1.65 are expected to leave, so I am wrong if 2 or more give notice by month 6.” Run the same method on your group left on the standard offer.",
      "Bei Elbe: „Ich nehme an, dass die 55 begeisterten Kunden ohne zusätzliches Geld bleiben; ihr Churn von 6 % beruht auf einer Handvoll Fällen. 55 × 6 % × 6 ÷ 12 = 1,65 Abgänge werden erwartet, also liege ich falsch, wenn bis Monat 6 2 oder mehr kündigen.“ Wenden Sie dieselbe Methode auf Ihre Gruppe beim Standardangebot an.",
    ),
  ];
  const steps: WorkedStep[][] = [
    [
      { label: "Doubt (data confidence, satisfied)", calc: doubt, result: "medium" },
      { label: "Bet: reviews + moments", calc: `${n(ARCH_BY_ID.reviews.cost)} + ${n(ARCH_BY_ID.moments.cost)}`, result: euro(ARCH_BY_ID.reviews.cost + ARCH_BY_ID.moments.cost) },
      { label: "Sign = the tripwire (same thing, same month)", calc: `${R2_FIG.delighted} + ⌈${n(customerItems(MODEL_ARCH).reduce((s2, id) => s2 + ARCH_BY_ID[id].cost, 0))} ÷ ${n(KEPT_PER_TERM)}⌉`, result: `${MODEL_TRIPWIRE.threshold} by month ${MODEL_TRIPWIRE.month}` },
    ],
    [
      { label: "Doubt (data confidence, open deals)", calc: doubt, result: "low" },
      { label: "Bet: playbook + handover", calc: `${n(ARCH_BY_ID.playbook.cost)} + ${n(ARCH_BY_ID.handover.cost)}`, result: euro(ARCH_BY_ID.playbook.cost + ARCH_BY_ID.handover.cost) },
      { label: "Sign = the playbook trigger (same thing, same month)", calc: `⌈${n(ARCH_BY_ID.playbook.cost)} ÷ ${n(R2_FIG.dealGP)}⌉; month ${MODEL_START.playbook} + ${setupMonths(ARCH_BY_ID.playbook.weeks)} + ${ARCH_BY_ID.playbook.respond}`, result: `${triggerNumber("playbook")} by month ${triggerMonth(MODEL_START.playbook!, "playbook")}` },
    ],
    [
      { label: "Doubt (data confidence, delighted)", calc: doubt, result: "low" },
      { label: "Expected leavers in six months", calc: `${R2_FIG.delighted} × ${R2_FIG.churnDel}% × ${R2_MONTHS} ÷ 12`, result: n(DELIGHTED_EXPECTED) },
      { label: "Wrong at the first whole customer above", calc: `${n(DELIGHTED_EXPECTED)} → next whole number`, result: `${DELIGHTED_WRONG_AT} by month ${R2_MONTHS}` },
    ],
  ];
  return {
    title: `3.6 · Assumption ${i + 1}`,
    answer,
    example: examples[i] ?? examples[0],
    steps: steps[i],
    why: "One assumption per group the plan serves: the two funded groups (satisfied, open deals) and the group left on the standard offer (delighted). The dissatisfied group is outside this budget, so nothing rides on it here. Each sign is a count the learner can read in the CRM, compared with today's figure, and uses the same number as the trigger or tripwire that measures the same thing.",
    lookFor: ["A named group and what the plan bets there (or that it gets nothing extra).", "The doubt from that group's data-confidence note.", "A number worked out by a method, today's figure and a month."],
    pitfalls: ["A market-growth figure as the sign: it does not move within the plan.", "An assumption about the team's effort (“service has time”) with no customer group: fine as a risk, but it is not what the block asks.", "A sign with a different threshold from the tripwire for the same group."],
  };
}

export function tripGuide(): MentorGuide {
  const items = customerItems(MODEL_ARCH);
  const cost = items.reduce((s2, id) => s2 + ARCH_BY_ID[id].cost, 0);
  return {
    title: "3.6 · The tripwire",
    answer: tt(`Customers rating 5 of 5: ${MODEL_TRIPWIRE.threshold} by month ${MODEL_TRIPWIRE.month}; if missed, adjust one item.`, `Kunden mit 5 von 5: ${MODEL_TRIPWIRE.threshold} bis Monat ${MODEL_TRIPWIRE.month}; bei Verfehlen einen Punkt anpassen.`),
    steps: [
      { label: "Funded items that move customers", calc: items.map((id) => `${ARCH_BY_ID[id].name} ${n(ARCH_BY_ID[id].cost)}`).join(" + "), result: euro(cost) },
      { label: "Kept per customer over the term", calc: `${euro(KEPT_PER_MOVE)} × ${R2_FIG.years}`, result: euro(KEPT_PER_TERM) },
      { label: "Step (payback count)", calc: `${n(cost)} ÷ ${n(KEPT_PER_TERM)} = ${n(cost / KEPT_PER_TERM)} → round up`, result: String(MODEL_TRIPWIRE.threshold - R2_FIG.delighted) },
      { label: "Threshold = today + step", calc: `${R2_FIG.delighted} + ${MODEL_TRIPWIRE.threshold - R2_FIG.delighted}`, result: String(MODEL_TRIPWIRE.threshold) },
      { label: "Month = latest month the customer items can be read", calc: items.map((id) => `${ARCH_BY_ID[id].name} ${triggerMonth(MODEL_START[id]!, id)}`).join(", "), result: `month ${MODEL_TRIPWIRE.month}` },
    ],
    why: "The tripwire must beat today by the step the spending needs, and be read when the last customer item can have worked. A learner who funds other items gets another step: check their arithmetic with the calculator, not against 60.",
    pitfalls: ["An activity metric (signals answered, emails sent): it measures NetSolutions, not the customers.", `Kept per year not times the term: ${R2_FIG.delighted + Math.ceil(cost / KEPT_PER_MOVE - 1e-9)}.`, "A threshold at or below today's 40."],
  };
}

export function challengeGuide(): MentorGuide {
  return {
    title: "3.6 · The board's challenge",
    answer: R2().challenge ?? "",
    example: tt(
      "Company A lost 3 customers in month 2: 3 × €10,500 = €31,500 of gross profit a year, less than the €36,000 a star manager would cost. It kept its plan, called the three customers, gave its largest accounts a named service lead from an existing budget, and kept its tripwire date. Use the board's numbers and your own tripwire.",
      "Firma A verlor in Monat 2 3 Kunden: 3 × 10.500 € = 31.500 € Rohertrag pro Jahr, weniger als die 36.000 €, die ein Star-Manager kosten würde. Sie behielt ihren Plan, rief die drei Kunden an, gab ihren größten Accounts aus einem bestehenden Budget eine benannte Service-Leitung und behielt ihr Tripwire-Datum. Nutzen Sie die Zahlen des Vorstands und Ihren eigenen Tripwire.",
    ),
    steps: [
      { label: "What the two losses cost a year", calc: `${CHALLENGE_LOST} × ${euro(GP_PER_CUSTOMER)}`, result: euro(CHALLENGE_LOST * GP_PER_CUSTOMER) },
      { label: "Against the proposal (top-seller visits)", calc: `${euro(CHALLENGE_LOST * GP_PER_CUSTOMER)} vs ${euro(ARCH_BY_ID.stars.cost)}`, result: "the losses cost less" },
      { label: "Where the decision is tested", calc: "the tripwire, as agreed", result: `${MODEL_TRIPWIRE.threshold} by month ${MODEL_TRIPWIRE.month}` },
    ],
    why: "Two losses in month 3 are two cases, before the system has had time to act; the tripwire is where the decision is tested. Moving the review budget to one seller's visits repeats the weakness the case started with: the tie belongs to one person.",
    lookFor: ["What is checked first (the two cases: were their signals logged and answered?).", "The cost of the losses in numbers, compared with the proposal.", "What is kept (the system, the tripwire date).", "One change, not a new plan."],
    pitfalls: ["Accepting the Head of Sales' proposal: it trades a process for a person.", "Dismissing the two losses without looking at them.", `Only the churn gap counted (${CHALLENGE_LOST} × ${euro(KEPT_PER_MOVE)}): a leaving customer takes the whole gross profit.`],
  };
}
