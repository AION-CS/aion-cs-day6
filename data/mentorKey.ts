import { REASONS } from "@/data/reasons";
import type { AreaTag, ReasonId } from "@/data/reasons";
import { MISSING_TRUTH } from "@/data/approaches";
import type { Factor } from "@/data/approaches";
import { OBSERVATIONS, RESPONSE_TRUTH, SIGNAL_IDS, TEAM_ACCEPT } from "@/data/signals";
import type { ObsId, SignalType, WeakId } from "@/data/signals";
import { DELIGHT } from "@/data/delight";
import { MEASURE_BY_ID, MODEL_MEASURES, sustainBucket } from "@/data/measures";
import type { MeasureId } from "@/data/measures";
import { ACTIVITY_IDS, ARCH_BY_ID, CHALLENGE_LOST, DELIGHTED_WRONG_AT, GP_PER_CUSTOMER, LEVER_BY_ID, MODEL_ARCH, MODEL_LEVERS, MODEL_PICKUP, MODEL_START, MODEL_TRIGGER, MODEL_TRIPWIRE, OWNER_ACCEPT, R2_BUDGET, R2_FIG, R2_MONTHS, RACI_ACCEPT, ROLE_IDS, TIME_ACCEPT, modelTriggerMonth, triggerNumber } from "@/data/route2";
import type { Criterion, OwnerId, ProcessRow, RaciLetter } from "@/data/route2";
import { euro, tt } from "@/lib/lang";
import type { L1State, R2State, Score } from "@/store/useStore";

/**
 * Every model answer of the day, in one file. "Fill all model answers" in the mentor bar enters these, so that after one fill every
 * route's missing list is empty and every export downloads at once. Free text follows the site's language. A convenience for
 * facilitators, not security.
 */
export const MENTOR_PASSCODE = "muchson123";
export const MODEL_ORDER: MeasureId[] = ["playbook", "handover", "reviews"];
const FUNDED = MODEL_ARCH.reduce((a, id) => a + ARCH_BY_ID[id].cost, 0);

export function KEY_L1(): Partial<L1State> {
  return {
    sort: Object.fromEntries(REASONS.map((r) => [r.id, r.truth])) as Record<ReasonId, AreaTag>,
    extraReason: tt(
      "Relationship: “When our contact at NetSolutions changed, nobody introduced the new one to us.” The tie to a person broke without anyone noticing.",
      "Beziehung: „Als unser Ansprechpartner bei NetSolutions wechselte, hat uns niemand den neuen vorgestellt.“ Die Bindung an eine Person brach, ohne dass es jemand bemerkte.",
    ),
    fig: { F1: String(DELIGHT.f1), F2: String(DELIGHT.f2), F3: String(DELIGHT.f3) },
    worth: tt(
      `Satisfied customers cost NetSolutions ${euro(DELIGHT.f1)} of gross profit a year when they leave, delighted ones only ${euro(DELIGHT.f2)}. Turning 30 satisfied customers into delighted ones would keep ${euro(DELIGHT.f3)} a year. Satisfaction keeps the service running; delight keeps the customer.`,
      `Zufriedene Kunden kosten NetSolutions ${euro(DELIGHT.f1)} Rohertrag pro Jahr, wenn sie gehen, begeisterte nur ${euro(DELIGHT.f2)}. 30 zufriedene Kunden zu begeisterten zu machen, würde ${euro(DELIGHT.f3)} pro Jahr halten. Zufriedenheit hält den Service am Laufen; Begeisterung hält den Kunden.`,
    ),
    missing: MISSING_TRUTH,
    approaches: [
      { factor: "trust" as Factor, text: tt("A joint go-live meeting of the salesperson and a named service lead for every new customer, so that customers know who looks after them, because trust needs a person they can rely on.", "Ein gemeinsamer Go-live-Termin von Verkäufer und benannter Service-Leitung für jeden Neukunden, damit Kunden wissen, wer sich um sie kümmert, weil Vertrauen eine Person braucht, auf die man sich verlassen kann.") },
      { factor: "appreciation" as Factor, text: tt("A personal first-year review with the managing director for every customer, so that they feel their business matters, because appreciation is shown by time given, not by a gift.", "Ein persönlicher Rückblick nach dem ersten Jahr mit der Geschäftsführung für jeden Kunden, damit sie spüren, dass ihr Geschäft zählt, weil Wertschätzung sich in geschenkter Zeit zeigt, nicht in einem Geschenk.") },
      { factor: "relevance" as Factor, text: tt("A twice-yearly success review with benchmarks from similar companies, so that customers get advice for their own work, because relevance means what we offer fits their situation.", "Ein halbjährliches Success-Review mit Benchmarks ähnlicher Firmen, damit Kunden Rat für ihre eigene Arbeit bekommen, weil Relevanz heißt, dass unser Angebot zu ihrer Lage passt.") },
    ],
    reflect: {
      satisfaction: tt("I thought a 4 out of 5 meant the customer was safe. The figures show satisfied customers leave four times as often as delighted ones: satisfaction only removes a reason to leave, it does not create a reason to stay.", "Ich dachte, eine 4 von 5 heißt, der Kunde ist sicher. Die Zahlen zeigen: Zufriedene Kunden gehen viermal so oft wie begeisterte. Zufriedenheit nimmt nur einen Grund zu gehen, sie schafft keinen Grund zu bleiben."),
      signal: tt("Signals are overlooked when a hesitation sounds like a detail question, like “what happens to our data if it fails?”. NetSolutions reacts too late because nobody owns the answer.", "Signale werden übersehen, wenn ein Zögern wie eine Detailfrage klingt, etwa „was passiert mit unseren Daten, wenn es scheitert?“. NetSolutions reagiert zu spät, weil niemand die Antwort verantwortet."),
      manager: tt("An experienced sales manager would ask after every call which kind of signal the buyer gave, answer uncertainty the same day with something that reduces the risk, and make sure the next step has a name and a date.", "Eine erfahrene Vertriebsleiterin würde nach jedem Gespräch fragen, welche Art Signal der Käufer gab, Unsicherheit am selben Tag mit etwas beantworten, das das Risiko verkleinert, und dafür sorgen, dass der nächste Schritt einen Namen und ein Datum hat."),
    },
    tags: Object.fromEntries(OBSERVATIONS.map((o) => [o.id, o.truth])) as Record<ObsId, SignalType>,
    weak: ["owner", "hesitation", "handover"] as WeakId[],
    system: Object.fromEntries(SIGNAL_IDS.map((s) => [s, { response: RESPONSE_TRUTH[s], team: TEAM_ACCEPT[s][0] }])) as L1State["system"],
    misread: tt(
      "If we read “what happens to our data if it fails?” as interest and send a demo, the buyer feels unheard and stalls; we would see it when a deal goes quiet right after a detailed question.",
      "Wenn wir „was passiert mit unseren Daten, wenn es scheitert?“ als Interesse lesen und eine Demo schicken, fühlt sich der Käufer überhört und stockt; wir würden es sehen, wenn ein Deal direkt nach einer Detailfrage verstummt.",
    ),
    chosen: [...MODEL_MEASURES],
    aims: Object.fromEntries(MODEL_MEASURES.map((id) => [id, [...MEASURE_BY_ID[id].targets]])) as Record<string, Factor[]>,
    eff: Object.fromEntries(MODEL_MEASURES.map((id) => [id, MEASURE_BY_ID[id].model.effect])) as Record<string, Score>,
    sus: Object.fromEntries(MODEL_MEASURES.map((id) => [id, sustainBucket(MEASURE_BY_ID[id].runsOn)])) as Record<string, Score>,
    fea: Object.fromEntries(MODEL_MEASURES.map((id) => [id, MEASURE_BY_ID[id].model.feasibility])) as Record<string, Score>,
    order: [...MODEL_ORDER],
    why: tt(
      "The signal playbook goes first: every uncertainty signal stalled because nobody owned the answer, and it turns reacting into managing for every customer. The joint handover is second, because it answers “a number, never a name” from the first day and links sales and service. The success reviews come third, because they need eight weeks to set up. All three score 18 and cost €95,000 of the €140,000. The relationship owner model (12) would take the total to €143,000; it is left for later.",
      "Das Signal-Playbook kommt zuerst: Jedes Unsicherheitssignal stockte, weil niemand die Antwort verantwortete, und es macht aus Reagieren Steuern, für jeden Kunden. Die gemeinsame Übergabe ist Zweiter, weil sie „eine Nummer, nie ein Name“ vom ersten Tag an beantwortet und Vertrieb und Service verbindet. Die Success-Reviews kommen als Drittes, weil sie acht Wochen Vorlauf brauchen. Alle drei erzielen 18 und kosten 95.000 € von 140.000 €. Das Beziehungs-Owner-Modell (12) brächte die Summe auf 143.000 €; es bleibt für später.",
    ),
  };
}

export function KEY_R2(): Partial<R2State> {
  const rate: Record<string, Score> = {};
  for (const id of MODEL_LEVERS) for (const c of ["reach", "depth", "durability", "scale"] as Criterion[]) rate[`${id}.${c}`] = LEVER_BY_ID[id].model[c];
  const raci: Record<string, RaciLetter> = {};
  for (const a of ACTIVITY_IDS) for (const r of ROLE_IDS) raci[`${a}.${r}`] = RACI_ACCEPT[a][r][0];
  const note = {
    interest: tt("Offer a trial with their own data within two days.", "Innerhalb von zwei Tagen einen Test mit eigenen Daten anbieten."),
    comparison: tt("Send a fair comparison and a peer reference before their matrix closes.", "Einen fairen Vergleich und eine Referenz schicken, bevor ihre Matrix geschlossen ist."),
    proximity: tt("Send a one-page decision plan with dates and signatories the same day.", "Am selben Tag einen einseitigen Entscheidungsplan mit Terminen und Unterzeichnenden schicken."),
    uncertainty: tt("Call the same day, name the concern, offer a pilot or exit terms.", "Am selben Tag anrufen, die Sorge ansprechen, einen Pilot oder Ausstiegsklauseln anbieten."),
  };
  return {
    principles: ["view", "signals", "moments"],
    principleText: {
      view: tt("Everyone who talks to a customer sees its history and its open signals, so no customer has to explain itself twice.", "Jeder, der mit einem Kunden spricht, sieht seine Historie und offenen Signale, damit kein Kunde sich zweimal erklären muss."),
      signals: tt("Every buying or hesitation signal has a named owner and a response time, so no doubt waits until it becomes a stall.", "Jedes Kauf- oder Zögersignal hat einen benannten Owner und eine Reaktionszeit, damit kein Zweifel wartet, bis ein Stillstand daraus wird."),
      moments: tt("Go-live, the first year and renewal are designed moments for every customer, so attachment does not depend on who happens to be there.", "Go-live, erstes Jahr und Verlängerung sind gestaltete Momente für jeden Kunden, damit Bindung nicht davon abhängt, wer gerade da ist."),
    },
    process: Object.fromEntries(SIGNAL_IDS.map((s) => [s, { team: TEAM_ACCEPT[s][0], time: TIME_ACCEPT[s][0], action: RESPONSE_TRUTH[s], note: note[s] } as ProcessRow])) as R2State["process"],
    levers: [...MODEL_LEVERS],
    rate,
    greatest: "playbook",
    greatestWhy: tt(
      "The signal playbook acts on the weakness the evidence shows most clearly: every uncertainty signal stalled because nobody owned the answer. As a process it works for every customer, whoever is on duty, and its cost is a one-off.",
      "Das Signal-Playbook wirkt auf die Schwäche, die die Evidenz am deutlichsten zeigt: Jedes Unsicherheitssignal stockte, weil niemand die Antwort verantwortete. Als Prozess wirkt es für jeden Kunden, egal wer Dienst hat, und seine Kosten fallen einmal an.",
    ),
    raci,
    alloc: Object.fromEntries(MODEL_ARCH.map((id) => [id, true])),
    start: { ...MODEL_START } as Record<string, number>,
    owner: Object.fromEntries(MODEL_ARCH.map((id) => [id, OWNER_ACCEPT[id][0]])) as Record<string, OwnerId>,
    trigger: Object.fromEntries(MODEL_ARCH.map((id) => [id, MODEL_TRIGGER[id as keyof typeof MODEL_TRIGGER]])) as Record<string, string>,
    postponed: tt(
      `The relationship owner model (${euro(ARCH_BY_ID.owners.cost)}) is left out. The five funded items cost ${euro(FUNDED)} of the ${euro(R2_BUDGET)}; adding it would take the plan to ${euro(FUNDED + ARCH_BY_ID.owners.cost)}, and it rests on people staying, so it lasts less than the process items.`,
      `Das Beziehungs-Owner-Modell (${euro(ARCH_BY_ID.owners.cost)}) bleibt draußen. Die fünf finanzierten Punkte kosten ${euro(FUNDED)} von ${euro(R2_BUDGET)}; mit ihm käme der Plan auf ${euro(FUNDED + ARCH_BY_ID.owners.cost)}, und es hängt davon ab, dass Menschen bleiben, also hält es weniger lange als die Prozesspunkte.`,
    ),
    pickup: tt(
      `If ${MODEL_PICKUP.count} or more satisfied customers give notice by month ${MODEL_PICKUP.month} because they miss a personal contact, we fund the owner model from the next budget round: by then waiting has cost as much as the model.`,
      `Kündigen bis Monat ${MODEL_PICKUP.month} ${MODEL_PICKUP.count} oder mehr zufriedene Kunden, weil ihnen ein persönlicher Kontakt fehlt, finanzieren wir das Owner-Modell aus der nächsten Budgetrunde: Dann hat das Warten so viel gekostet wie das Modell.`,
    ),
    decision: "stage",
    assumptions: [
      tt(
        `I assume the ${R2_FIG.satisfied} satisfied customers move to 5 of 5 when we spend ${euro(ARCH_BY_ID.reviews.cost + ARCH_BY_ID.moments.cost)} on reviews and designed moments; the data is only medium sure, because 28 of them never answered the survey. I am wrong if fewer than ${MODEL_TRIPWIRE.threshold} customers rate us 5 of 5 by month ${MODEL_TRIPWIRE.month} (today ${R2_FIG.delighted}).`,
        `Ich nehme an, dass die ${R2_FIG.satisfied} zufriedenen Kunden auf 5 von 5 steigen, wenn wir ${euro(ARCH_BY_ID.reviews.cost + ARCH_BY_ID.moments.cost)} für Reviews und gestaltete Momente ausgeben; die Daten sind nur mittel sicher, weil 28 von ihnen die Befragung nie beantwortet haben. Ich liege falsch, wenn uns bis Monat ${MODEL_TRIPWIRE.month} weniger als ${MODEL_TRIPWIRE.threshold} Kunden mit 5 von 5 bewerten (heute ${R2_FIG.delighted}).`,
      ),
      tt(
        `I assume the ${R2_FIG.openDeals} customers with an open deal or a renewal move forward when every signal gets an owner fast; we spend ${euro(ARCH_BY_ID.playbook.cost + ARCH_BY_ID.handover.cost)} on the playbook and the joint handover. The data is weak, because only logged signals are counted. I am wrong if fewer than ${triggerNumber("playbook")} stalled deals have moved forward by month ${modelTriggerMonth("playbook")} (${R2_FIG.stalled} stalled in the last six months).`,
        `Ich nehme an, dass die ${R2_FIG.openDeals} Kunden mit offenem Deal oder Verlängerung weiterkommen, wenn jedes Signal schnell einen Owner hat; wir geben ${euro(ARCH_BY_ID.playbook.cost + ARCH_BY_ID.handover.cost)} für Playbook und gemeinsame Übergabe aus. Die Daten sind schwach, weil nur erfasste Signale gezählt werden. Ich liege falsch, wenn bis Monat ${modelTriggerMonth("playbook")} weniger als ${triggerNumber("playbook")} stockende Deals weitergekommen sind (${R2_FIG.stalled} stockten in den letzten sechs Monaten).`,
      ),
      tt(
        `I assume the ${R2_FIG.delighted} delighted customers stay without extra money; none of the budget goes to them. The data is weak: “a personal contact” was ticked by salespeople, and 5% rests on 2 customers a year. I am wrong if ${DELIGHTED_WRONG_AT} or more delighted customers give notice by month ${R2_MONTHS} (expected: ${DELIGHTED_WRONG_AT - 1}).`,
        `Ich nehme an, dass die ${R2_FIG.delighted} begeisterten Kunden ohne zusätzliches Geld bleiben; nichts vom Budget geht an sie. Die Daten sind schwach: „Persönlicher Kontakt“ wurde von Verkäufern angekreuzt, und 5 % beruhen auf 2 Kunden pro Jahr. Ich liege falsch, wenn bis Monat ${R2_MONTHS} ${DELIGHTED_WRONG_AT} oder mehr begeisterte Kunden kündigen (erwartet: ${DELIGHTED_WRONG_AT - 1}).`,
      ),
    ],
    tripKpi: MODEL_TRIPWIRE.kpi,
    tripThreshold: String(MODEL_TRIPWIRE.threshold),
    tripMonth: MODEL_TRIPWIRE.month,
    tripAction: "adjust",
    challenge: tt(
      `I keep the reviews. The two losses cost ${CHALLENGE_LOST} × ${euro(GP_PER_CUSTOMER)} = ${euro(CHALLENGE_LOST * GP_PER_CUSTOMER)} of gross profit a year, less than the ${euro(ARCH_BY_ID.stars.cost)} the top seller's visits would cost, and the visits would tie the key customers to one person again. I would call both customers now to learn what the competitor's team offered, give our largest customers a named service lead from the existing review budget, and check the tripwire as agreed: ${MODEL_TRIPWIRE.threshold} customers rating us 5 of 5 by month ${MODEL_TRIPWIRE.month}.`,
      `Ich behalte die Reviews. Die zwei Verluste kosten ${CHALLENGE_LOST} × ${euro(GP_PER_CUSTOMER)} = ${euro(CHALLENGE_LOST * GP_PER_CUSTOMER)} Rohertrag pro Jahr, weniger als die ${euro(ARCH_BY_ID.stars.cost)}, die die Besuche des besten Verkäufers kosten würden, und die Besuche würden die Schlüsselkunden wieder an eine Person binden. Ich würde beide Kunden jetzt anrufen, um zu erfahren, was das Team des Wettbewerbers bot, unseren größten Kunden aus dem bestehenden Review-Budget eine benannte Service-Leitung geben und den Tripwire wie vereinbart prüfen: ${MODEL_TRIPWIRE.threshold} Kunden mit 5 von 5 bis Monat ${MODEL_TRIPWIRE.month}.`,
    ),
  };
}
