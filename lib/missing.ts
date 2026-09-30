import { REASONS } from "@/data/reasons";
import { APPROACH_MIN, hasBecause } from "@/data/approaches";
import { OBSERVATIONS, SIGNALS, SIGNAL_IDS } from "@/data/signals";
import { CHOOSE, MEASURE_BY_ID } from "@/data/measures";
import { ACTIVITIES, ACTIVITY_IDS, ARCH_BY_ID, ARCH_IDS, CRIT_IDS, LEVER_BY_ID, LEVER_CHOOSE, PRINCIPLES, R2_BUDGET, ROLE_IDS } from "@/data/route2";
import { archOver, citesDelightFigure, funded, hasNumber } from "@/lib/checks";
import { MIN_LINE, MIN_SENTENCE, OPTIONAL_BLOCKS } from "@/lib/progress";
import { parseAmount } from "@/lib/parseAmount";
import { euro, tt } from "@/lib/lang";
import type { Persisted } from "@/store/useStore";

/** DOM ids the missing list points at. One place, so the list and the UI cannot drift. */
export const IDS = {
  participant: "participant-strip",
  reason: (id: string) => `reason-${id}`,
  figure: (id: string) => `fig-${id}`,
  extraReason: "extra-reason",
  worth: "worth-field",
  missing: "missing-field",
  approach: (i: number) => `approach-${i}`,
  reflect: (k: string) => `reflect-${k}`,
  obs: (id: string) => `obs-${id}`,
  weak: "weak-field",
  system: (s: string) => `system-${s}`,
  misread: "misread-field",
  measurePick: "measure-pick",
  measure: (id: string) => `measure-${id}`,
  order: "order-field",
  why: "why-field",
  principlePick: "principle-pick",
  principle: (id: string) => `principle-${id}`,
  process: (s: string) => `process-${s}`,
  leverPick: "lever-pick",
  lever: (id: string) => `lever-${id}`,
  greatest: "greatest-field",
  greatestWhy: "greatest-why",
  raci: "raci-field",
  raciRow: (a: string) => `raci-${a}`,
  arch: (id: string) => `arch-${id}`,
  archTotal: "arch-total",
  postponed: "postponed-field",
  pickup: "pickup-field",
  decision: "decision-field",
  assumption: (i: number) => `assumption-${i}`,
  trip: "trip-field",
  challenge: "challenge-field",
} as const;

export type MissingEntry = { id: string; label: string };

/**
 * Optional blocks (CLAUDE.md #35) are never required: their entries are dropped here, in one place, so the Export notice, the
 * per-block notice (#34) and the dossier ring agree. Every label starts "Block X.Y:", in both languages.
 */
const OPTIONAL_PREFIXES = OPTIONAL_BLOCKS.map((b) => `Block ${b[1]}.${b[2]}:`);
const coreOnly = (list: MissingEntry[]) => list.filter((m) => !OPTIONAL_PREFIXES.some((p) => m.label.startsWith(p)));
const short = (s: string, n = 44) => (s.length > n ? `${s.slice(0, n)}…` : s);

export function participantMissing(p: Persisted): MissingEntry[] {
  return p.participant.name.trim() ? [] : [{ id: IDS.participant, label: tt("Your full name is needed for the file name.", "Ihr vollständiger Name wird für den Dateinamen gebraucht.") }];
}

export function l1Missing(p: Persisted): MissingEntry[] {
  const out = participantMissing(p);
  const { l1 } = p;
  const e = (id: string, label: string) => out.push({ id, label });
  for (const r of REASONS) if (l1.sort[r.id] === null) e(IDS.reason(r.id), tt(`Block 1.1: ${short(r.quote)} is not sorted as Relationship, Communication or Added value.`, `Block 1.1: ${short(r.quote)} ist nicht als Beziehung, Kommunikation oder Mehrwert einsortiert.`));
  if (l1.extraReason.trim().length < MIN_LINE) e(IDS.extraReason, tt(`Block 1.1: add one reason of your own and its area (at least ${MIN_LINE} characters).`, `Block 1.1: Ergänzen Sie einen eigenen Grund und seinen Bereich (mindestens ${MIN_LINE} Zeichen).`));
  for (const f of ["F1", "F2", "F3"] as const) if (parseAmount(l1.fig[f]) === null) e(IDS.figure(f), tt(`Block 1.2: ${f} has no figure.`, `Block 1.2: ${f} hat keinen Wert.`));
  const w = l1.worth.trim();
  if (!w) e(IDS.worth, tt("Block 1.2: the sentence on what delight is worth is empty.", "Block 1.2: Der Satz dazu, was Begeisterung wert ist, ist leer."));
  else if (w.length < MIN_SENTENCE) e(IDS.worth, tt(`Block 1.2: the sentence needs at least ${MIN_SENTENCE} characters.`, `Block 1.2: Der Satz braucht mindestens ${MIN_SENTENCE} Zeichen.`));
  else if (!citesDelightFigure(w)) e(IDS.worth, tt("Block 1.2: the sentence states no figure from your calculation.", "Block 1.2: Der Satz nennt keine Zahl aus Ihrer Rechnung."));
  if (!l1.missing) e(IDS.missing, tt("Block 1.3: say what is missing from the customer's perspective.", "Block 1.3: Sagen Sie, was aus Sicht des Kunden fehlt."));
  l1.approaches.forEach((a, i) => {
    const n = i + 1;
    if (!a.factor) e(IDS.approach(i), tt(`Block 1.3: approach ${n} has no factor chosen.`, `Block 1.3: Ansatz ${n} hat keinen Faktor gewählt.`));
    else if (l1.approaches.findIndex((b) => b.factor === a.factor) !== i) e(IDS.approach(i), tt(`Block 1.3: approach ${n} repeats a factor. Use a different one for each.`, `Block 1.3: Ansatz ${n} wiederholt einen Faktor. Nutzen Sie für jeden einen anderen.`));
    const t = a.text.trim();
    if (!t) e(IDS.approach(i), tt(`Block 1.3: approach ${n} is empty.`, `Block 1.3: Ansatz ${n} ist leer.`));
    else if (t.length < APPROACH_MIN) e(IDS.approach(i), tt(`Block 1.3: approach ${n} needs at least ${APPROACH_MIN} characters.`, `Block 1.3: Ansatz ${n} braucht mindestens ${APPROACH_MIN} Zeichen.`));
    else if (!hasBecause(t)) e(IDS.approach(i), tt(`Block 1.3: approach ${n} gives no reason. Add “because …”.`, `Block 1.3: Ansatz ${n} nennt keinen Grund. Ergänzen Sie „weil …“.`));
  });
  const rf: [keyof typeof l1.reflect, string, string][] = [
    ["satisfaction", "why satisfaction is not enough here", "warum Zufriedenheit hier nicht reicht"],
    ["signal", "where signals are overlooked or answered too late", "wo Signale übersehen oder zu spät beantwortet werden"],
    ["manager", "how an experienced sales manager would act", "wie eine erfahrene Vertriebsleitung handeln würde"],
  ];
  for (const [k, en, de] of rf) if (l1.reflect[k].trim().length < MIN_LINE) e(IDS.reflect(k), tt(`Block 1.4: say ${en} (at least ${MIN_LINE} characters).`, `Block 1.4: Sagen Sie, ${de} (mindestens ${MIN_LINE} Zeichen).`));
  for (const o of OBSERVATIONS) if (l1.tags[o.id] === null) e(IDS.obs(o.id), tt(`Block 2.1: ${o.deal} has no signal type.`, `Block 2.1: ${o.deal} hat keine Signalart.`));
  if (l1.weak.length < 2) e(IDS.weak, tt("Block 2.2: choose at least two weaknesses in NetSolutions' retention.", "Block 2.2: Wählen Sie mindestens zwei Schwächen in der Kundenbindung von NetSolutions."));
  for (const s of SIGNAL_IDS) {
    const r = l1.system[s];
    if (!r.response) e(IDS.system(s), tt(`Block 2.2: choose the response to ${SIGNALS[s].label}.`, `Block 2.2: Wählen Sie die Antwort auf ${SIGNALS[s].label}.`));
    if (!r.team) e(IDS.system(s), tt(`Block 2.2: choose the team that owns the response to ${SIGNALS[s].label}.`, `Block 2.2: Wählen Sie das Team, das die Antwort auf ${SIGNALS[s].label} verantwortet.`));
  }
  if (l1.misread.trim().length < MIN_LINE) e(IDS.misread, tt(`Block 2.2: name the risk of misreading a signal (at least ${MIN_LINE} characters).`, `Block 2.2: Nennen Sie das Risiko, ein Signal falsch zu lesen (mindestens ${MIN_LINE} Zeichen).`));
  if (l1.chosen.length !== CHOOSE) e(IDS.measurePick, tt(`Block 2.3: choose exactly ${CHOOSE} measures (you have ${l1.chosen.length}).`, `Block 2.3: Wählen Sie genau ${CHOOSE} Maßnahmen (Sie haben ${l1.chosen.length}).`));
  for (const id of l1.chosen) {
    const name = MEASURE_BY_ID[id].name;
    if (l1.aims[id] === undefined) e(IDS.measure(id), tt(`Block 2.3: “${name}” has no factor it builds (or “none”).`, `Block 2.3: „${name}“ hat keinen Faktor, den es aufbaut (oder „keinen“).`));
    if (!l1.eff[id] || !l1.sus[id] || !l1.fea[id]) e(IDS.measure(id), tt(`Block 2.3: “${name}” is not fully scored (effect, sustainability, feasibility).`, `Block 2.3: „${name}“ ist nicht vollständig bewertet (Wirkung, Nachhaltigkeit, Machbarkeit).`));
  }
  if (l1.chosen.length === CHOOSE) {
    if (l1.order.length !== CHOOSE || !l1.chosen.every((id) => l1.order.includes(id))) e(IDS.order, tt("Block 2.3: put your three measures in a priority order.", "Block 2.3: Bringen Sie Ihre drei Maßnahmen in eine Reihenfolge."));
    if (l1.why.trim().length < 60) e(IDS.why, tt("Block 2.3: say why your first priority goes first (at least 60 characters).", "Block 2.3: Begründen Sie, warum Ihre erste Priorität zuerst kommt (mindestens 60 Zeichen)."));
  }
  return coreOnly(out);
}

export function r2Missing(p: Persisted): MissingEntry[] {
  const out = participantMissing(p);
  const { r2 } = p;
  const e = (id: string, label: string) => out.push({ id, label });
  if (r2.principles.length !== 3) e(IDS.principlePick, tt(`Block 3.1: choose exactly 3 system principles (you have ${r2.principles.length}).`, `Block 3.1: Wählen Sie genau 3 Systemprinzipien (Sie haben ${r2.principles.length}).`));
  for (const c of r2.principles) if ((r2.principleText[c] ?? "").trim().length < MIN_LINE) e(IDS.principle(c), tt(`Block 3.1: say what “${PRINCIPLES[c].name}” means for NetSolutions (at least ${MIN_LINE} characters).`, `Block 3.1: Sagen Sie, was „${PRINCIPLES[c].name}“ für NetSolutions bedeutet (mindestens ${MIN_LINE} Zeichen).`));
  for (const s of SIGNAL_IDS) {
    const r = r2.process[s];
    const n = SIGNALS[s].label;
    if (!r.team) e(IDS.process(s), tt(`Block 3.2: ${n} has no owner team.`, `Block 3.2: ${n} hat kein zuständiges Team.`));
    if (!r.time) e(IDS.process(s), tt(`Block 3.2: ${n} has no response time.`, `Block 3.2: ${n} hat keine Reaktionszeit.`));
    if (!r.action) e(IDS.process(s), tt(`Block 3.2: ${n} has no first action.`, `Block 3.2: ${n} hat keine erste Aktion.`));
    if (r.note.trim().length < 20) e(IDS.process(s), tt(`Block 3.2: describe what happens for ${n} (at least 20 characters).`, `Block 3.2: Beschreiben Sie, was bei ${n} passiert (mindestens 20 Zeichen).`));
  }
  if (r2.levers.length !== LEVER_CHOOSE) e(IDS.leverPick, tt(`Block 3.3: choose exactly ${LEVER_CHOOSE} levers (you have ${r2.levers.length}).`, `Block 3.3: Wählen Sie genau ${LEVER_CHOOSE} Hebel (Sie haben ${r2.levers.length}).`));
  for (const id of r2.levers) if (!CRIT_IDS.every((c) => !!r2.rate[`${id}.${c}`])) e(IDS.lever(id), tt(`Block 3.3: “${LEVER_BY_ID[id].name}” is not rated on all four tests.`, `Block 3.3: „${LEVER_BY_ID[id].name}“ ist nicht nach allen vier Tests bewertet.`));
  if (!r2.greatest) e(IDS.greatest, tt("Block 3.3: name the lever with the greatest effect on loyalty.", "Block 3.3: Nennen Sie den Hebel mit der größten Wirkung auf die Loyalität."));
  if (r2.greatestWhy.trim().length < 40) e(IDS.greatestWhy, tt("Block 3.3: say why it is the greatest lever (at least 40 characters).", "Block 3.3: Begründen Sie, warum es der größte Hebel ist (mindestens 40 Zeichen)."));
  for (const a of ACTIVITY_IDS) {
    const unset = ROLE_IDS.filter((r) => !r2.raci[`${a}.${r}`]);
    if (unset.length) e(IDS.raciRow(a), tt(`Block 3.4: “${short(ACTIVITIES[a].name, 40)}” has ${unset.length} empty cell(s).`, `Block 3.4: „${short(ACTIVITIES[a].name, 40)}“ hat ${unset.length} leere Zelle(n).`));
  }
  const f = funded(r2);
  if (f.length === 0) e(IDS.archTotal, tt("Block 3.5: fund at least one item.", "Block 3.5: Finanzieren Sie mindestens einen Punkt."));
  for (const id of f) {
    const name = ARCH_BY_ID[id].name;
    if (r2.start[id] == null) e(IDS.arch(id), tt(`Block 3.5: “${name}” has no start month.`, `Block 3.5: „${name}“ hat keinen Startmonat.`));
    if (!r2.owner[id]) e(IDS.arch(id), tt(`Block 3.5: “${name}” has no owner.`, `Block 3.5: „${name}“ hat keinen Owner.`));
    const t = (r2.trigger[id] ?? "").trim();
    if (t.length < 20) e(IDS.arch(id), tt(`Block 3.5: “${name}” needs a trigger (at least 20 characters).`, `Block 3.5: „${name}“ braucht einen Trigger (mindestens 20 Zeichen).`));
    else if (!hasNumber(t)) e(IDS.arch(id), tt(`Block 3.5: the trigger of “${name}” names no number.`, `Block 3.5: Der Trigger von „${name}“ nennt keine Zahl.`));
  }
  if (!ARCH_IDS.every((id) => r2.alloc[id])) {
    if (r2.postponed.trim().length < MIN_LINE) e(IDS.postponed, tt("Block 3.5: say what you leave out and why.", "Block 3.5: Sagen Sie, was Sie weglassen und warum."));
    if (r2.pickup.trim().length < 15 || !hasNumber(r2.pickup)) e(IDS.pickup, tt("Block 3.5: give the pickup point: the number and the date at which you look at it again.", "Block 3.5: Nennen Sie den Pickup Point: die Zahl und den Zeitpunkt, zu dem Sie es wieder prüfen."));
  }
  if (!r2.decision) e(IDS.decision, tt("Block 3.6: choose your decision.", "Block 3.6: Wählen Sie Ihre Entscheidung."));
  r2.assumptions.forEach((a, i) => {
    if (a.trim().length < MIN_LINE) e(IDS.assumption(i), tt(`Block 3.6: assumption ${i + 1} is missing (at least ${MIN_LINE} characters).`, `Block 3.6: Annahme ${i + 1} fehlt (mindestens ${MIN_LINE} Zeichen).`));
  });
  if (!r2.tripKpi) e(IDS.trip, tt("Block 3.6: choose the metric of your tripwire.", "Block 3.6: Wählen Sie die Kennzahl Ihres Tripwires."));
  if (parseAmount(r2.tripThreshold) === null) e(IDS.trip, tt("Block 3.6: give the tripwire a threshold.", "Block 3.6: Geben Sie dem Tripwire einen Schwellenwert."));
  if (!r2.tripMonth) e(IDS.trip, tt("Block 3.6: give the tripwire a month.", "Block 3.6: Geben Sie dem Tripwire einen Monat."));
  if (!r2.tripAction) e(IDS.trip, tt("Block 3.6: say what you do if the tripwire is missed.", "Block 3.6: Sagen Sie, was Sie tun, wenn der Tripwire verfehlt wird."));
  if (r2.challenge.trim().length < 60) e(IDS.challenge, tt("Block 3.6: answer the board's challenge (at least 60 characters).", "Block 3.6: Beantworten Sie die Frage des Vorstands (mindestens 60 Zeichen)."));
  return coreOnly(out);
}
