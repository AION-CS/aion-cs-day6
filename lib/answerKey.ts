import { MISSING_QUESTION, MISSING_TRUTH } from "@/data/approaches";
import { BUDGET, MEASURES, MODEL_COST, MODEL_MEASURES, RUNS_ON_LABEL, modelScore, sustainBucket } from "@/data/measures";
import { AREA_LABEL, REASONS } from "@/data/reasons";
import { OBSERVATIONS, RESPONSES, RESPONSE_TRUTH, SIGNALS, SIGNAL_IDS, TEAMS, TEAM_ACCEPT, TRUTH_COUNTS, WEAKNESSES } from "@/data/signals";
import {
  ACTIVITIES,
  ACTIVITY_IDS,
  ARCH_BY_ID,
  CRIT_IDS,
  DECISIONS,
  KPIS,
  LEVERS,
  LEVER_BY_ID,
  MODEL_ARCH,
  MODEL_DECISION,
  MODEL_LEVERS,
  MODEL_TRIPWIRE,
  OWNERS,
  OWNER_ACCEPT,
  PRINCIPLES,
  PRINCIPLE_IDS,
  PRINCIPLE_MUST,
  PROCESS_WHY,
  RACI_ACCEPT,
  RACI_ROLES,
  RACI_WHY,
  ROLE_IDS,
  TIMES,
  TIME_ACCEPT,
  maxRating,
} from "@/data/route2";
import type { ArchId } from "@/data/route2";
import { MODEL_ORDER } from "@/data/mentorKey";
import { FACTOR_LABEL } from "@/data/approaches";
import { euro } from "@/lib/lang";

/**
 * Mentor-only answer keys for the exercises where the learner picks from fixed options. Each key gives the expected answer and a
 * reason per option, including why each rejected option is rejected, plus a teaching note wherever more than one answer defends.
 * Never exported and never shown to a learner. Mentor tools stay in English (CLAUDE.md #32); the option labels they quote follow the
 * site's language.
 */
export type AnswerKeyOption = { label: string; expected: boolean; why: string };
export type AnswerKeyBlock = { title: string; expected: string; options: AnswerKeyOption[]; teachingNote?: string };

const B = ["—", "Low", "Mid", "High"];

/* ------------------------------------------------------------------ Route 1 */

export function sortKey(): AnswerKeyBlock {
  return {
    title: "Block 1.1 · Relationship, communication or added value",
    expected: REASONS.map((r, i) => `${i + 1} → ${AREA_LABEL[r.truth]}`).join(" · "),
    options: REASONS.flatMap((r, i) => [
      { label: `Statement ${i + 1} → ${AREA_LABEL[r.truth]}`, expected: true, why: r.why },
      ...(Object.entries(r.rejected) as [keyof typeof AREA_LABEL, string][]).map(([tag, why]) => ({ label: `Statement ${i + 1} → ${AREA_LABEL[tag]}`, expected: false, why })),
    ]),
    teachingNote:
      "Three of each. The pair learners swap is relationship and communication: “a ticket number, never a name” is about who (relationship), “twenty pages nobody reads” is about what reaches them (communication). Ask: is the complaint about a person being missing, or about a message? The competitor's free review is added value: something useful beyond the contract.",
  };
}

export function missingKey(): AnswerKeyBlock {
  return {
    title: "Block 1.3a · What is missing from the customer's perspective",
    expected: MISSING_QUESTION.options.find((o) => o.id === MISSING_TRUTH)!.label,
    options: MISSING_QUESTION.options.map((o) => ({
      label: o.label,
      expected: o.id === MISSING_TRUTH,
      why:
        o.id === MISSING_TRUTH
          ? MISSING_QUESTION.why
          : o.id === "performance"
            ? "Customers rate the service 4 of 5 and say it works. Performance is a Kano basic that is already met; more of it adds little."
            : o.id === "price"
              ? "Nobody names price. Customers leave while satisfied with what they pay for."
              : "“The service works” is the customers' own verdict. More features would not give them a person to rely on.",
    })),
  };
}

export function tagKey(): AnswerKeyBlock {
  return {
    title: "Block 2.1 · Signal type per observation",
    expected: OBSERVATIONS.map((o) => `${o.deal} → ${SIGNALS[o.truth].label}`).join(" · "),
    options: OBSERVATIONS.flatMap((o) => [
      { label: `${o.deal} → ${SIGNALS[o.truth].label}`, expected: true, why: o.why },
      ...(Object.entries(o.rejected) as [keyof typeof SIGNALS, string][]).map(([s, why]) => ({ label: `${o.deal} → ${SIGNALS[s].label}`, expected: false, why })),
    ]),
    teachingNote: `${SIGNAL_IDS.map((s) => `${TRUTH_COUNTS[s]} ${SIGNALS[s].label}`).join(", ")}. The lesson sits in the outcomes: all three uncertainty signals stalled, because sales answered hesitation as if it were interest. Stadtwerke Lahn is the trap: a detailed question, but about getting out.`,
  };
}

export function weakKey(): AnswerKeyBlock {
  return {
    title: "Block 2.2a · Weaknesses in NetSolutions' retention",
    expected: WEAKNESSES.filter((w) => w.real).map((w) => w.label).join(" · "),
    options: WEAKNESSES.map((w) => ({ label: w.label, expected: w.real, why: w.why })),
    teachingNote: "Any two of the four real weaknesses complete the block. The check counts how many chosen ones the evidence shows; uptime, price and features are what an internal team often blames, and what customers never mention.",
  };
}

export function systemKey(): AnswerKeyBlock {
  return {
    title: "Block 2.2b · Response and owner per signal type",
    expected: SIGNAL_IDS.map((s) => `${SIGNALS[s].label}: ${RESPONSES.find((r) => r.id === RESPONSE_TRUTH[s])!.label.split(" (")[0]} · ${TEAM_ACCEPT[s].map((t) => TEAMS[t]).join(" or ")}`).join(" · "),
    options: SIGNAL_IDS.flatMap((s) =>
      RESPONSES.map((r) => ({
        label: `${SIGNALS[s].label} → ${r.label.split(" (")[0]}`,
        expected: r.id === RESPONSE_TRUTH[s],
        why:
          r.id === RESPONSE_TRUTH[s]
            ? `${SIGNALS[s].response}`
            : r.id === "discount"
              ? "A discount answers no signal type: it trains buyers to hesitate and costs margin on deals that would have closed anyway."
              : `This answers a different signal. The test for ${SIGNALS[s].label.toLowerCase()}: ${SIGNALS[s].test}`,
      })),
    ),
    teachingNote: "Sales owns the response to the three buying signals, because it holds the deal and can change the offer. Uncertainty accepts Sales or Service: a peer call or a pilot is often best arranged by the people who run the service. Marketing owns none; it rarely talks to a single buyer.",
  };
}

export function measureKey(): AnswerKeyBlock {
  const rows = [...MEASURES].sort((a, b) => modelScore(b.id) - modelScore(a.id));
  return {
    title: "Block 2.3 · The three measures",
    expected: `${MODEL_MEASURES.map((id) => MEASURES.find((m) => m.id === id)!.name).join(", ")} · ${euro(MODEL_COST)} of ${euro(BUDGET)}`,
    options: rows.map((m) => ({
      label: `${m.name} · ${m.model.effect} × ${sustainBucket(m.runsOn)} × ${m.model.feasibility} = ${modelScore(m.id)} · ${euro(m.cost)} · runs on ${RUNS_ON_LABEL[m.runsOn]} · builds ${m.targets.length ? m.targets.map((t) => FACTOR_LABEL[t]).join(", ") : "none"}`,
      expected: MODEL_MEASURES.includes(m.id),
      why: `${m.verdict} ${m.model.note}`,
    })),
    teachingNote: `The checks look only at the factors named (a subset of the real ones, or “none” for discount and newsletter) and at sustainability, which follows from what the measure runs on. Effect and feasibility are judged; the model values are here. The owner model scores 12 and adding it to the model three takes the plan to ${euro(MODEL_COST + 48000)}, over budget. A learner who swaps the handover for the owner model is defending depth over scale; accept it if the plan stays in budget and the why says so.`,
  };
}

export function orderKey(): AnswerKeyBlock {
  return {
    title: "Block 2.3 · The order",
    expected: MODEL_ORDER.map((id) => MEASURES.find((m) => m.id === id)!.name).join(" → "),
    options: MODEL_ORDER.map((id, i) => ({
      label: `${i + 1}. ${MEASURES.find((m) => m.id === id)!.name} (${modelScore(id)})`,
      expected: true,
      why: i === 0 ? "Answers the weakness that stalled every uncertainty signal, for every customer." : i === 1 ? "Answers “a number, never a name” from the first day; cheap and quick (four weeks)." : "Needs eight weeks to set up, so its effect arrives last.",
    })),
    teachingNote: "All three score 18, so no order is an inversion. The order is judged on the why: the weakness it answers first, or the time it needs to set up. Any order with such a reason defends.",
  };
}

/* ------------------------------------------------------------------ Route 2 */

export function principleKey(): AnswerKeyBlock {
  return {
    title: "Block 3.1 · System principles",
    expected: `${PRINCIPLES[PRINCIPLE_MUST[0]].name} and ${PRINCIPLES[PRINCIPLE_MUST[1]].name}, plus any third that is not people-bound or price`,
    options: PRINCIPLE_IDS.map((c) => ({
      label: PRINCIPLES[c].name,
      expected: PRINCIPLE_MUST.includes(c) || c === "moments" || c === "owner",
      why:
        c === "view"
          ? "Required: without one shared record, every team acts on its own part of the story and signals are lost between them."
          : c === "signals"
            ? "Required: it is what turns reacting into managing. Every uncertainty signal stalled because nobody owned it."
            : c === "moments"
              ? "A good third: designed moments build appreciation for every customer, not only for those who happen to have an active account manager."
              : c === "owner"
                ? "A defensible third: it answers the missing personal tie. Accept it if the learner makes it a role with a rule (managers stay two years), not a person."
                : c === "discount"
                  ? "Rejected: it buys renewals with margin and acts on no emotional factor. Price is named in none of the reasons."
                  : "Rejected: it ties the key customers to individuals. When the star leaves, the tie leaves too: the opposite of a system.",
    })),
    teachingNote: "The check only asks for the shared view and signal ownership. The third is judged; designed moments and a named owner role both defend. Discounts and star sellers are the tempting ones because they work quickly for a few customers.",
  };
}

export function processKey(): AnswerKeyBlock {
  return {
    title: "Block 3.2 · Owner, time and first action per signal",
    expected: SIGNAL_IDS.map((s) => `${SIGNALS[s].label}: ${TEAM_ACCEPT[s].map((t) => TEAMS[t]).join("/")}, ${TIMES.find((t) => t.id === TIME_ACCEPT[s][0])!.label.toLowerCase()}, ${RESPONSES.find((r) => r.id === RESPONSE_TRUTH[s])!.label.split(" (")[0].toLowerCase()}`).join(" · "),
    options: SIGNAL_IDS.map((s) => ({
      label: `${SIGNALS[s].label}: time ${TIME_ACCEPT[s].map((t) => TIMES.find((x) => x.id === t)!.label.toLowerCase()).join(" or ")}`,
      expected: true,
      why: PROCESS_WHY[s],
    })),
    teachingNote: "The check counts owner, time and action for each of the four rows (12 settings) and never says which. “Within a week” and “at the next scheduled contact” never hold: the response curve in Materi B2 shows most of a signal's value is gone by then. Uncertainty accepts only the same day.",
  };
}

export function leverKey(): AnswerKeyBlock {
  return {
    title: "Block 3.3 · Levers and ratings",
    expected: `${MODEL_LEVERS.map((id) => LEVER_BY_ID[id].name).join(", ")}; greatest effect: ${LEVER_BY_ID.playbook.name}`,
    options: LEVERS.map((l) => ({
      label: `${l.name}: ${CRIT_IDS.map((c) => `${c} ${B[l.model[c]]} (max ${B[maxRating(l.id, c)]})`).join(", ")}`,
      expected: MODEL_LEVERS.includes(l.id),
      why: l.note,
    })),
    teachingNote:
      "The check flags only a rating above what the printed facts allow (reach High only for every customer; durability Low when it depends on people; scale Low when the cost repeats per deal, Mid per customer). Depth is judged. The playbook is the model's greatest lever: High on all four tests, and it removes the weakness that stalled every uncertainty signal. The owner model is the strongest people-bound choice; accept it as greatest only if the learner names how its durability is protected.",
  };
}

export function raciKey(): AnswerKeyBlock {
  return {
    title: "Block 3.4 · Who does what",
    expected: ACTIVITY_IDS.map((a) => `${ACTIVITIES[a].name}: ${ROLE_IDS.map((r) => `${RACI_ROLES[r].name.split(" (")[0]} ${RACI_ACCEPT[a][r].join("/")}`).join(", ")}`).join(" · "),
    options: ACTIVITY_IDS.map((a) => ({
      label: ACTIVITIES[a].name,
      expected: true,
      why: RACI_WHY[a],
    })),
    teachingNote: "Cells that accept two letters defend either way (Marketing I or empty on the deal rows; Sales R or C on the save plan). The check counts holding cells and outlines only rows that break the structure rule. A CCO holding A on every row is the typical mistake: decisions then queue at one desk.",
  };
}

export function ownerKey(funded: ArchId[]): AnswerKeyBlock {
  const ids = funded.length ? funded : MODEL_ARCH;
  return {
    title: "Block 3.5 · Owners, sequence and funding",
    expected: `Model: ${MODEL_ARCH.map((id) => `${ARCH_BY_ID[id].name} (${OWNERS[OWNER_ACCEPT[id][0]].name})`).join(", ")} · ${euro(MODEL_ARCH.reduce((s, id) => s + ARCH_BY_ID[id].cost, 0))}`,
    options: ids.map((id) => ({
      label: `${ARCH_BY_ID[id].name} → ${OWNER_ACCEPT[id].map((o) => OWNERS[o].name).join(" or ")}`,
      expected: true,
      why:
        id === "view"
          ? "Sales Operations owns the CRM. It starts first: every other item and every trigger reads from it."
          : id === "stars"
            ? "Rests on one person. Funding it contradicts the system; the check flags it."
            : id === "discount"
              ? "Only the CCO can trade margin across the company, but funding it spends €60,000 on no emotional factor."
              : `The owner who can change it without asking anyone: ${OWNERS[OWNER_ACCEPT[id][0]].profile}`,
    })),
    teachingNote: "The check tests three rules: the shared view starts no later than the first other item, total within €170,000, nothing funded that rests on one person. Owners are not checked by the app; use this key. Funding the owner model instead of the reviews and moments (48,000 against 65,000) defends if the learner argues the personal tie and names how the role survives staff changes.",
  };
}

export function decisionKey(): AnswerKeyBlock {
  return {
    title: "Block 3.6 · The decision",
    expected: DECISIONS.find((d) => d.id === MODEL_DECISION)!.label,
    options: DECISIONS.map((d) => ({ label: d.label, expected: d.id !== "wait", why: d.id === MODEL_DECISION ? d.why : d.id === "commit" ? `${d.why} ${d.rejected}` : d.rejected })),
    teachingNote: "“Build it all now” and “Stage it” both defend with different reasoning; the check outlines only “Wait”, because the brief asks for a system decision despite incomplete information.",
  };
}

export function tripKey(): AnswerKeyBlock {
  const k = KPIS.find((x) => x.id === MODEL_TRIPWIRE.kpi)!;
  return {
    title: "Block 3.6 · The tripwire",
    expected: `${k.label} ≥ ${MODEL_TRIPWIRE.threshold}${k.unit === "%" ? "%" : ` ${k.unit}`} by month ${MODEL_TRIPWIRE.month} (today ${k.baseline} + the payback count of the funded customer items, Materi B6), else adjust one item`,
    options: KPIS.map((x) => ({ label: `${x.label} (baseline ${x.baseline}${x.unit === "%" ? "%" : ` ${x.unit}`})`, expected: x.behaviour, why: x.behaviour ? "How customers feel or behave: the result the system is meant to move." : "Measures NetSolutions' own activity, not how customers responded." })),
    teachingNote: "Any customer metric with a threshold better than its baseline defends; its number should come from today plus a step (Materi B6), so a learner who funds other items gets another threshold. Signals answered in time is the tempting one: it measures NetSolutions' own activity, not the customers' response.",
  };
}
