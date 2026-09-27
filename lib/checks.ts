import { REASONS } from "@/data/reasons";
import { APPROACH_MIN, MISSING_TRUTH, hasBecause } from "@/data/approaches";
import { DELIGHT, NETSOL } from "@/data/delight";
import { OBSERVATIONS, OBS_BY_ID, OBS_IDS, RESPONSE_TRUTH, SIGNAL_IDS, TEAM_ACCEPT, WEAK_BY_ID } from "@/data/signals";
import type { SignalType, WeakId } from "@/data/signals";
import { MEASURE_BY_ID, sustainBucket } from "@/data/measures";
import type { MeasureId } from "@/data/measures";
import type { Factor } from "@/data/approaches";
import {
  ACTIVITY_IDS,
  ARCH_BY_ID,
  ARCH_IDS,
  BASELINE_ITEM,
  CRIT_IDS,
  KPI_BY_ID,
  LEVER_CHOOSE,
  PRINCIPLE_MUST,
  R2_BUDGET,
  RACI_ACCEPT,
  ROLE_IDS,
  TIME_ACCEPT,
  isSystemic,
  maxRating,
} from "@/data/route2";
import type { ArchId, LeverId } from "@/data/route2";
import { extractAmounts, parseAmount } from "@/lib/parseAmount";
import type { L1State, R2State, SortMap, TagMap } from "@/store/useStore";

/* ------------------------------------------------------------------ Block 1.1 */

export function sortHolds(sort: SortMap): { holds: number; placed: number } {
  let holds = 0;
  let placed = 0;
  for (const r of REASONS) {
    const t = sort[r.id];
    if (!t) continue;
    placed++;
    if (t === r.truth) holds++;
  }
  return { holds, placed };
}

/* ------------------------------------------------------------------ Block 1.2 */

export const DELIGHT_DERIVED = [DELIGHT.f1, DELIGHT.f2, DELIGHT.f3, DELIGHT.f1 - DELIGHT.f2];
export function citesDelightFigure(text: string): boolean {
  return extractAmounts(text).some((n) => DELIGHT_DERIVED.some((d) => Math.abs(n - d) < 0.5));
}
export function figMatches(entered: string, answer: number): boolean {
  const v = parseAmount(entered);
  return v !== null && Math.abs(v - answer) < 0.5;
}
export { NETSOL };

/* ------------------------------------------------------------------ Block 1.3 */

export const missingHolds = (l1: L1State) => l1.missing === MISSING_TRUTH;
/** Approaches that do not meet the floor: a factor, a distinct factor, enough words, and a reason. */
export function approachFlags(l1: L1State): number[] {
  return l1.approaches
    .map((a, i) => ({ a, i }))
    .filter(({ a, i }) => !a.factor || l1.approaches.findIndex((b) => b.factor === a.factor) !== i || a.text.trim().length < APPROACH_MIN || !hasBecause(a.text))
    .map(({ i }) => i);
}

/* ------------------------------------------------------------------ Block 2.1 / 2.2 */

export function tagHolds(tags: TagMap): { holds: number; placed: number } {
  let holds = 0;
  let placed = 0;
  for (const id of OBS_IDS) {
    const t = tags[id];
    if (!t) continue;
    placed++;
    if (t === OBS_BY_ID[id].truth) holds++;
  }
  return { holds, placed };
}
export type Tally = { count: Record<SignalType, number>; stalled: Record<SignalType, number>; tagged: number };
export function tallyOf(tags: TagMap): Tally {
  const count = { interest: 0, comparison: 0, proximity: 0, uncertainty: 0 } as Record<SignalType, number>;
  const stalled = { ...count };
  let tagged = 0;
  for (const o of OBSERVATIONS) {
    const s = tags[o.id];
    if (!s) continue;
    tagged++;
    count[s]++;
    if (o.outcome === "stalled") stalled[s]++;
  }
  return { count, stalled, tagged };
}
export const allTagged = (tags: TagMap) => OBS_IDS.every((id) => !!tags[id]);
export const weakHolds = (weak: WeakId[]) => ({ holds: weak.filter((w) => WEAK_BY_ID[w].real).length, chosen: weak.length });
/** How many of the eight picks of the simple system hold (a response and an owner team for each signal type). */
export function systemHolds(l1: L1State): { holds: number; total: number; rows: Record<SignalType, { response: boolean; team: boolean }> } {
  let holds = 0;
  const rows = {} as Record<SignalType, { response: boolean; team: boolean }>;
  for (const s of SIGNAL_IDS) {
    const r = l1.system[s];
    const response = r.response === RESPONSE_TRUTH[s];
    const team = !!r.team && TEAM_ACCEPT[s].includes(r.team);
    rows[s] = { response, team };
    holds += Number(response) + Number(team);
  }
  return { holds, total: SIGNAL_IDS.length * 2, rows };
}

/* ------------------------------------------------------------------ Block 2.3 */

export function aimsHold(id: MeasureId, aims: Factor[]): boolean {
  const truth = MEASURE_BY_ID[id].targets;
  if (truth.length === 0) return aims.length === 0;
  return aims.length > 0 && aims.every((a) => truth.includes(a));
}
export const susHolds = (id: MeasureId, v: number) => v === sustainBucket(MEASURE_BY_ID[id].runsOn);
export const measureScore = (l1: L1State, id: MeasureId) => (l1.eff[id] || 0) * (l1.sus[id] || 0) * (l1.fea[id] || 0);
export const measureScored = (l1: L1State, id: MeasureId) => !!l1.eff[id] && !!l1.sus[id] && !!l1.fea[id];
export const totalCost = (ids: MeasureId[]) => ids.reduce((s, id) => s + MEASURE_BY_ID[id].cost, 0);
export function coverage(l1: L1State): { factor: Factor; covered: boolean }[] {
  return (["trust", "appreciation", "relevance"] as Factor[]).map((f) => ({ factor: f, covered: l1.chosen.some((id) => MEASURE_BY_ID[id].targets.includes(f)) }));
}
export function orderInversions(l1: L1State): { high: MeasureId; low: MeasureId }[] {
  const out: { high: MeasureId; low: MeasureId }[] = [];
  const ord = l1.order.filter((id) => l1.chosen.includes(id));
  for (let i = 0; i < ord.length; i++)
    for (let j = i + 1; j < ord.length; j++) if (measureScored(l1, ord[i]) && measureScored(l1, ord[j]) && measureScore(l1, ord[i]) < measureScore(l1, ord[j])) out.push({ high: ord[j], low: ord[i] });
  return out;
}

/* ------------------------------------------------------------------ Route 2 */

export const hasNumber = (t: string) => /\d/.test(t);
export const principlesHold = (r2: R2State) => ({ view: r2.principles.includes(PRINCIPLE_MUST[0]), signals: r2.principles.includes(PRINCIPLE_MUST[1]) });

export function processHolds(r2: R2State): { holds: number; total: number } {
  let holds = 0;
  for (const s of SIGNAL_IDS) {
    const r = r2.process[s];
    if (r.team && TEAM_ACCEPT[s].includes(r.team)) holds++;
    if (r.time && TIME_ACCEPT[s].includes(r.time)) holds++;
    if (r.action === RESPONSE_TRUTH[s]) holds++;
  }
  return { holds, total: SIGNAL_IDS.length * 3 };
}

export function ratingFlags(r2: R2State): string[] {
  const out: string[] = [];
  for (const l of r2.levers) for (const c of CRIT_IDS) if ((r2.rate[`${l}.${c}`] || 0) > maxRating(l, c)) out.push(`${l}.${c}`);
  return out;
}
export const leverTotal = (r2: R2State, id: LeverId) => CRIT_IDS.reduce((s, c) => s + (r2.rate[`${id}.${c}`] || 0), 0);
export const systemicCount = (levers: LeverId[]) => levers.filter(isSystemic).length;
export { LEVER_CHOOSE };

/** RACI: how many cells hold (against the accepted letters), and the rows that break the structure rule (exactly one A). */
export function raciHolds(r2: R2State): { holds: number; total: number } {
  let holds = 0;
  for (const a of ACTIVITY_IDS) for (const r of ROLE_IDS) if (r2.raci[`${a}.${r}`] && RACI_ACCEPT[a][r].includes(r2.raci[`${a}.${r}`])) holds++;
  return { holds, total: ACTIVITY_IDS.length * ROLE_IDS.length };
}
export function raciRowFlags(r2: R2State): string[] {
  return ACTIVITY_IDS.filter((a) => {
    const letters = ROLE_IDS.map((r) => r2.raci[`${a}.${r}`]).filter(Boolean);
    if (letters.length < ROLE_IDS.length) return false;
    const aCount = letters.filter((l) => l === "A").length;
    const doers = letters.filter((l) => l === "R" || l === "A").length;
    return aCount !== 1 || doers === 0;
  });
}

export const funded = (r2: R2State): ArchId[] => ARCH_IDS.filter((id) => r2.alloc[id]);
export const archCost = (r2: R2State) => funded(r2).reduce((s, id) => s + ARCH_BY_ID[id].cost, 0);
export const archOver = (r2: R2State) => Math.max(0, archCost(r2) - R2_BUDGET);
export const archLeft = (r2: R2State) => R2_BUDGET - archCost(r2);
export const onePersonFunded = (r2: R2State): ArchId[] => funded(r2).filter((id) => ARCH_BY_ID[id].onePerson);
/** Three rules of Materi B5: the shared view starts no later than the first other item; the budget holds; nothing rests on one person. */
export function seqRules(r2: R2State): { baseline: boolean; budget: boolean; system: boolean; hasBaseline: boolean } {
  const f = funded(r2);
  const hasBaseline = f.includes(BASELINE_ITEM);
  const others = f.filter((id) => id !== BASELINE_ITEM);
  const base = r2.start[BASELINE_ITEM];
  const first = Math.min(...others.map((id) => r2.start[id] ?? 99));
  const baseline = hasBaseline && base != null && (others.length === 0 || base <= first);
  return { baseline, budget: archOver(r2) === 0 && f.length > 0, system: onePersonFunded(r2).length === 0, hasBaseline };
}

export function tripFlagsOf(r2: R2State): string[] {
  const out: string[] = [];
  if (r2.tripKpi && !KPI_BY_ID[r2.tripKpi].behaviour) out.push("kpi");
  if (r2.tripKpi && r2.tripThreshold.trim()) {
    const v = parseAmount(r2.tripThreshold);
    const k = KPI_BY_ID[r2.tripKpi];
    if (v !== null && (k.better === "up" ? v <= k.baseline : v >= k.baseline)) out.push("threshold");
  }
  return out;
}
