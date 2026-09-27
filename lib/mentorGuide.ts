import { DELIGHT, NETSOL } from "@/data/delight";
import type { FigureId } from "@/data/delight";
import { BUDGET, MEASURE_BY_ID, MODEL_COST, MODEL_MEASURES, RUNS_ON_LABEL, modelScore, sustainBucket } from "@/data/measures";
import type { MeasureId } from "@/data/measures";
import { FACTOR_LABEL } from "@/data/approaches";
import { SIGNALS } from "@/data/signals";
import type { SignalType } from "@/data/signals";
import { KEY_L1, KEY_R2 } from "@/data/mentorKey";
import { ARCH_BY_ID, LEVER_BY_ID, MODEL_ARCH, MODEL_TRIGGER, OWNERS, OWNER_ACCEPT, PRINCIPLES, R2_BUDGET } from "@/data/route2";
import type { ArchId, PrincipleId } from "@/data/route2";
import { euro } from "@/lib/lang";

/**
 * Mentor-only worked answers for every task question the answer keys (lib/answerKey.ts) do not already cover: the numeric fields,
 * with every step of the calculation written out with its numbers, and the free-text answers, with the model text and what a good
 * answer must contain. Shown only after the mentor bar is unlocked, never exported. Numbers are computed from the same constants as
 * the tables, the calculators and the answer checks, so they cannot drift from the model answers. Mentor tools stay English
 * (CLAUDE.md #32); the model answers quoted follow the site's language, because the fill enters them in that language.
 */
export type WorkedStep = { label: string; calc: string; result: string };
export type MentorGuide = { title: string; answer: string; steps?: WorkedStep[]; why?: string; lookFor?: string[]; pitfalls?: string[] };

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
    steps: [
      { label: "Model plan cost", calc: MODEL_MEASURES.map((id) => n(MEASURE_BY_ID[id].cost)).join(" + "), result: euro(MODEL_COST) },
      { label: "Left of the budget", calc: `${n(BUDGET)} − ${n(MODEL_COST)}`, result: euro(BUDGET - MODEL_COST) },
      { label: "With the owner model added", calc: `${n(MODEL_COST)} + ${n(MEASURE_BY_ID.owner.cost)}`, result: euro(MODEL_COST + MEASURE_BY_ID.owner.cost) },
    ],
    lookFor: ["The order and what decides it (score, the weakness answered, or set-up time).", "The cost against €140,000.", "What was left out, said as a decision."],
  };
}

/* ------------------------------------------------------------------ Route 2 */

export function principleTextGuide(c: PrincipleId): MentorGuide {
  return {
    title: `3.1 · ${PRINCIPLES[c].name}`,
    answer: (R2().principleText ?? {})[c] ?? PRINCIPLES[c].means,
    lookFor: ["What changes for NetSolutions' customers or teams.", "Which weakness from Route 1 it answers (no owner, contact only at invoices, unanswered hesitation, no handover)."],
    pitfalls: c === "discount" || c === "stars" ? ["This principle is one the key rejects; if the learner kept it, ask what happens when the discount ends or the star leaves."] : undefined,
  };
}

export function processNoteGuide(s: SignalType): MentorGuide {
  const row = R2().process?.[s];
  return {
    title: `3.2 · ${SIGNALS[s].label}`,
    answer: row?.note ?? "",
    lookFor: ["Where the signal is logged (the shared customer view).", "Who is told.", "What the customer receives, and when."],
  };
}

export function greatestGuide(): MentorGuide {
  return {
    title: "3.3 · The lever with the greatest effect",
    answer: `${LEVER_BY_ID.playbook.name} · ${R2().greatestWhy ?? ""}`,
    lookFor: ["One of the learner's three levers.", "The test that decides it (usually durability or reach).", "The weakness from Route 1 it removes."],
    pitfalls: ["The owner model as greatest “because customers want a person”: defensible on depth, but ask how it survives four managers in two years."],
  };
}

export function triggerGuide(id: ArchId): MentorGuide {
  const model = MODEL_TRIGGER[id as keyof typeof MODEL_TRIGGER];
  return {
    title: `3.5 · ${ARCH_BY_ID[id].name}`,
    answer: model ?? "A metric, a number, a date and an action for this item.",
    why: `Owner that defends: ${OWNER_ACCEPT[id].map((o) => OWNERS[o].name).join(" or ")}.`,
    lookFor: ["A metric about the item's effect.", "A number and a month.", "An action the owner can take alone."],
  };
}

export function postponedGuide(): MentorGuide {
  const cost = MODEL_ARCH.reduce((s, id) => s + ARCH_BY_ID[id].cost, 0);
  return {
    title: "3.5 · What is left out, and the pickup point",
    answer: `${R2().postponed} · ${R2().pickup}`,
    steps: [
      { label: "Model funded items", calc: MODEL_ARCH.map((id) => n(ARCH_BY_ID[id].cost)).join(" + "), result: euro(cost) },
      { label: "Left", calc: `${n(R2_BUDGET)} − ${n(cost)}`, result: euro(R2_BUDGET - cost) },
      { label: "With the owner model added", calc: `${n(cost)} + ${n(ARCH_BY_ID.owners.cost)}`, result: euro(cost + ARCH_BY_ID.owners.cost) },
    ],
    lookFor: ["The item named, with its cost.", "Why this one (budget, depends on people, acts on no factor).", "A pickup point with a number and a date."],
  };
}

export function assumptionGuide(i: number): MentorGuide {
  return {
    title: `3.6 · Assumption ${i + 1}`,
    answer: (R2().assumptions ?? [])[i] ?? "",
    lookFor: ["What is assumed about customers, data or teams.", "The sign that would show it is wrong, with a number or a date."],
  };
}

export function challengeGuide(): MentorGuide {
  return {
    title: "3.6 · The board's challenge",
    answer: R2().challenge ?? "",
    why: "Two losses in month 3 are two cases, before the system has had time to act; the tripwire in month 5 is where the decision is tested. Moving the review budget to one seller's visits repeats the weakness the case started with: the tie belongs to one person.",
    lookFor: ["What is checked first (the two cases: were their signals logged and answered?).", "What is kept (the system, the tripwire date).", "One change, not a new plan."],
    pitfalls: ["Accepting the Head of Sales' proposal: it trades a process for a person.", "Dismissing the two losses without looking at them."],
  };
}
