import {
  ARCH_BY_ID,
  CHALLENGE_LOST,
  FIG_ROW_ID,
  GP_PER_CUSTOMER,
  KEPT_PER_MOVE,
  R2_FIG,
  R2_MONTHS,
  customerItems,
  groupRowId,
  setupMonths,
} from "@/data/route2";
import type { ArchId } from "@/data/route2";
import type { CalcBuilder } from "@/lib/calcBuilder";
import { euro, num, tt } from "@/lib/lang";
import type { R2State } from "@/store/useStore";

/**
 * The automatic calculators of Route 2 (CLAUDE.md #43): every number a decision, trigger, pickup point, assumption or the board's
 * challenge needs is built here from printed rows, by the method taught in Materi B6. A calculator checks the arithmetic of the
 * learner's own inputs, never the model's choice (#38): where a part depends on the learner's own plan (their start month, the item
 * they left out, the items they funded) its expected value is read from their state. A wrong part names the row to read, never the value.
 */
const up = (x: number) => Math.ceil(x - 1e-9);
const row = (label: string) => tt(`“NetSolutions today”: the row “${label}”.`, `„NetSolutions heute“: die Zeile „${label}“.`);

/** Where each printed Route 2 figure lives, for the clue kits (#42): label, printed value, and the row id to flash. */
export function figRef(k: "customers" | "delighted" | "satisfied" | "churnSat" | "churnDel" | "contract" | "margin" | "gpCust" | "kept" | "years" | "openDeals" | "stalled" | "dealGP") {
  const v: Record<typeof k, [string, string]> = {
    customers: [tt("Customers", "Kunden"), String(R2_FIG.customers)],
    delighted: [tt("Delighted customers today (5 of 5)", "Begeisterte Kunden heute (5 von 5)"), String(R2_FIG.delighted)],
    satisfied: [tt("Satisfied customers (4 of 5)", "Zufriedene Kunden (4 von 5)"), String(R2_FIG.satisfied)],
    churnSat: [tt("Yearly churn, satisfied", "Jährlicher Churn, zufrieden"), `${R2_FIG.churnSat}%`],
    churnDel: [tt("Yearly churn, delighted", "Jährlicher Churn, begeistert"), `${R2_FIG.churnDel}%`],
    contract: [tt("Average yearly contract", "Durchschnittlicher Jahresvertrag"), euro(R2_FIG.contract)],
    margin: [tt("Gross margin", "Bruttomarge"), `${R2_FIG.margin}%`],
    gpCust: [tt("Gross profit a year per customer", "Rohertrag pro Kunde und Jahr"), euro(GP_PER_CUSTOMER)],
    kept: [tt("Gross profit kept a year per customer moved to 5 of 5", "Gehaltener Rohertrag pro Jahr je Kunde, der auf 5 von 5 steigt"), euro(KEPT_PER_MOVE)],
    years: [tt("Contract term", "Vertragslaufzeit"), tt(`${R2_FIG.years} years`, `${R2_FIG.years} Jahre`)],
    openDeals: [tt("Customers with an open deal or a renewal in the next six months", "Kunden mit offenem Deal oder Verlängerung in den nächsten sechs Monaten"), String(R2_FIG.openDeals)],
    stalled: [tt("Deals that stalled in the last six months", "Deals, die in den letzten sechs Monaten stockten"), String(R2_FIG.stalled)],
    dealGP: [tt("Gross profit of an average expansion deal", "Rohertrag eines durchschnittlichen Erweiterungsdeals"), euro(R2_FIG.dealGP)],
  };
  const [label, value] = v[k];
  return { label, value, target: FIG_ROW_ID(k) };
}

/** The number a funded item's trigger uses. Its parts follow the item's method (coverage, deals, customers). */
export function triggerBuilder(id: ArchId): CalcBuilder {
  const a = ARCH_BY_ID[id];
  if (a.result === "coverage")
    return {
      get parts() {
        return [
          { id: "needed", label: tt("Customers the next step needs", "Kunden, die der nächste Schritt braucht"), expected: R2_FIG.openDeals, clue: tt(`${row(figRef("openDeals").label)} The playbook works on the customers with an open deal or a renewal, not on every customer.`, `${row(figRef("openDeals").label)} Das Playbook arbeitet mit den Kunden mit offenem Deal oder Verlängerung, nicht mit allen Kunden.`) },
          { id: "all", label: tt("All customers", "Alle Kunden"), expected: R2_FIG.customers, clue: row(figRef("customers").label) },
        ];
      },
      compute: (v) => up((v.needed / v.all) * 100),
      show: (v) => `${v.needed} ÷ ${v.all} × 100 ${tt("rounded up", "aufgerundet")}`,
    };
  if (a.result === "deal")
    return {
      get parts() {
        return [
          { id: "cost", label: tt("Cost of the item (€)", "Kosten des Punkts (€)"), expected: a.cost, clue: tt(`The item card in Block 3.5: the cost printed after “${ARCH_BY_ID[id].name}”.`, `Die Karte des Punkts in Block 3.5: die Kosten hinter „${ARCH_BY_ID[id].name}“.`) },
          { id: "per", label: tt("Gross profit of one deal (€)", "Rohertrag eines Deals (€)"), expected: R2_FIG.dealGP, clue: tt(`${row(figRef("dealGP").label)} A deal that moves forward earns this, not a whole yearly contract.`, `${row(figRef("dealGP").label)} Ein Deal, der weiterkommt, bringt das, nicht einen ganzen Jahresvertrag.`) },
        ];
      },
      compute: (v) => up(v.cost / v.per),
      show: (v) => `${v.cost} ÷ ${v.per} ${tt("rounded up", "aufgerundet")}`,
    };
  return {
    get parts() {
      return [
        { id: "cost", label: tt("Cost of the item (€)", "Kosten des Punkts (€)"), expected: a.cost, clue: tt(`The item card in Block 3.5: the cost printed after “${ARCH_BY_ID[id].name}”.`, `Die Karte des Punkts in Block 3.5: die Kosten hinter „${ARCH_BY_ID[id].name}“.`) },
        { id: "kept", label: tt("Gross profit kept a year per customer moved (€)", "Gehaltener Rohertrag pro Jahr je Kunde (€)"), expected: KEPT_PER_MOVE, clue: tt(`${row(figRef("kept").label)} It is the churn gap times contract times margin, not the whole gross profit of a customer.`, `${row(figRef("kept").label)} Es ist die Churn-Lücke mal Vertrag mal Marge, nicht der ganze Rohertrag eines Kunden.`) },
        { id: "years", label: tt("Contract term (years)", "Vertragslaufzeit (Jahre)"), expected: R2_FIG.years, clue: tt(`${row(figRef("years").label)} A customer moved to 5 of 5 keeps paying back for the whole term.`, `${row(figRef("years").label)} Ein Kunde auf 5 von 5 zahlt über die ganze Laufzeit zurück.`) },
      ];
    },
    compute: (v) => up(v.cost / (v.kept * v.years)),
    show: (v) => `${v.cost} ÷ (${v.kept} × ${v.years}) ${tt("rounded up", "aufgerundet")}`,
  };
}

/** The month of a funded item's trigger: the learner's own start month + months of set-up + months until the response shows. */
export function monthBuilder(id: ArchId, r2: R2State): CalcBuilder {
  const a = ARCH_BY_ID[id];
  const start = r2.start[id] ?? 0;
  return {
    get parts() {
      return [
        { id: "start", label: tt("Your start month", "Ihr Startmonat"), expected: start, clue: tt("Your own choice under “Starts in month” on this item's card.", "Ihre eigene Wahl unter „Startet in Monat“ auf der Karte dieses Punkts.") },
        { id: "setup", label: tt("Months of set-up (weeks ÷ 4, rounded up)", "Monate Einrichtung (Wochen ÷ 4, aufgerundet)"), expected: setupMonths(a.weeks), clue: tt(`The item card: “${a.weeks} weeks to be in use”. Divide by 4 and round up.`, `Die Karte des Punkts: „${a.weeks} Wochen bis zum Einsatz“. Durch 4 teilen und aufrunden.`) },
        { id: "respond", label: tt("Months until the response shows", "Monate, bis die Reaktion sichtbar ist"), expected: a.respond, clue: tt("The item card: “response shows after … months”.", "Die Karte des Punkts: „Reaktion sichtbar nach … Monaten“.") },
      ];
    },
    compute: (v) => v.start + v.setup + v.respond,
    show: (v) => `${v.start} + ${v.setup} + ${v.respond}`,
  };
}

/** Pickup point (cost of waiting): the cost of the item left out ÷ the gross profit lost when one customer leaves. */
export function pickupBuilder(item: ArchId | null): CalcBuilder {
  const cost = item ? ARCH_BY_ID[item].cost : 0;
  return {
    get parts() {
      return [
        { id: "cost", label: tt("Cost of the item you leave out (€)", "Kosten des weggelassenen Punkts (€)"), expected: cost, clue: tt("The card of the item you chose above as left out: its printed cost.", "Die Karte des Punkts, den Sie oben als weggelassen gewählt haben: seine gedruckten Kosten.") },
        { id: "per", label: tt("Gross profit lost when one customer leaves (€)", "Verlorener Rohertrag, wenn ein Kunde geht (€)"), expected: GP_PER_CUSTOMER, clue: tt(`${row(figRef("gpCust").label)} A customer who leaves takes the whole gross profit of the contract, not only the churn gap.`, `${row(figRef("gpCust").label)} Ein Kunde, der geht, nimmt den ganzen Rohertrag des Vertrags mit, nicht nur die Churn-Lücke.`) },
      ];
    },
    compute: (v) => up(v.cost / v.per),
    show: (v) => `${v.cost} ÷ ${v.per} ${tt("rounded up", "aufgerundet")}`,
  };
}

/** Tripwire (baseline plus step): today's delighted customers + your funded customer items' cost ÷ (kept per customer × years). */
export function tripBuilder(r2: R2State): CalcBuilder {
  const funded = (Object.keys(r2.alloc) as ArchId[]).filter((id) => r2.alloc[id] && ARCH_BY_ID[id]);
  const cost = customerItems(funded).reduce((s, id) => s + ARCH_BY_ID[id].cost, 0);
  return {
    get parts() {
      return [
        { id: "base", label: tt("Delighted customers today", "Begeisterte Kunden heute"), expected: R2_FIG.delighted, clue: row(figRef("delighted").label) },
        { id: "cost", label: tt("Cost of your funded items that move customers (€)", "Kosten Ihrer finanzierten Punkte, die Kunden bewegen (€)"), expected: cost, clue: tt("Your own plan in Block 3.5: add the costs of the funded items whose card says “counts customers moved to 5 of 5”.", "Ihr eigener Plan in Block 3.5: Addieren Sie die Kosten der finanzierten Punkte, deren Karte „zählt Kunden, die auf 5 von 5 steigen“ sagt.") },
        { id: "kept", label: tt("Gross profit kept a year per customer moved (€)", "Gehaltener Rohertrag pro Jahr je Kunde (€)"), expected: KEPT_PER_MOVE, clue: row(figRef("kept").label) },
        { id: "years", label: tt("Contract term (years)", "Vertragslaufzeit (Jahre)"), expected: R2_FIG.years, clue: row(figRef("years").label) },
      ];
    },
    compute: (v) => v.base + up(v.cost / (v.kept * v.years)),
    show: (v) => `${v.base} + ${v.cost} ÷ (${v.kept} × ${v.years}) ${tt("rounded up", "aufgerundet")}`,
  };
}

/** The sign for a group left on the standard offer: expected leavers in the plan = customers × churn × months ÷ 12; wrong at one more. */
export const stayBuilder: CalcBuilder = {
  get parts() {
    return [
      { id: "customers", label: tt("Customers in the group", "Kunden in der Gruppe"), expected: R2_FIG.delighted, clue: tt("The group table in Block 3.6: the row of the group left on the standard offer.", "Die Gruppentabelle in Block 3.6: die Zeile der Gruppe, die beim Standardangebot bleibt.") },
      { id: "churn", label: tt("Its yearly churn (%)", "Ihr jährlicher Churn (%)"), expected: R2_FIG.churnDel, clue: row(figRef("churnDel").label) },
      { id: "months", label: tt("Months of the plan", "Monate des Plans"), expected: R2_MONTHS, clue: tt("“The limits” in the case brief: the time.", "„Die Grenzen“ im Fall: die Zeit.") },
    ];
  },
  compute: (v) => Math.floor((v.customers * (v.churn / 100) * v.months) / 12 + 1e-9) + 1,
  show: (v) => `${v.customers} × ${v.churn}% × ${v.months} ÷ 12 ${tt("→ expected, then + 1", "→ erwartet, dann + 1")}`,
};

/** The board's challenge: what the two losses cost a year = customers lost × gross profit per customer. */
export const lossBuilder: CalcBuilder = {
  get parts() {
    return [
      { id: "lost", label: tt("Customers lost", "Verlorene Kunden"), expected: CHALLENGE_LOST, clue: tt("The board's challenge: how many large satisfied customers announce they will leave.", "Die Frage des Vorstands: wie viele große zufriedene Kunden ankündigen zu gehen.") },
      { id: "per", label: tt("Gross profit a year per customer (€)", "Rohertrag pro Kunde und Jahr (€)"), expected: GP_PER_CUSTOMER, clue: row(figRef("gpCust").label) },
    ];
  },
  compute: (v) => v.lost * v.per,
  show: (v) => `${v.lost} × ${v.per}`,
};

/** Adds to each part of a builder the element that holds its printed figure, so the panel can link to it. */
const withTargets = (b: CalcBuilder, t: Record<string, string>): CalcBuilder => ({
  ...b,
  get parts() {
    return b.parts.map((p) => ({ ...p, target: t[p.id] }));
  },
});
const archCard = (id: string) => `arch-${id}`;

/**
 * Every number of Route 2 by its key, built from the learner's own state where a part depends on it. Since 2026-09-30 the learner does
 * not calculate them: the "numbers you can use" panel (components/ui/NumbersHelp.tsx) shows each result, why it is that number and
 * where every input is printed. The task keeps the learner on composing the trigger, the assumption, the tripwire and the answer.
 */
export function r2Builders(r2: R2State): Record<string, CalcBuilder> {
  const out: Record<string, CalcBuilder> = {};
  for (const id of Object.keys(ARCH_BY_ID) as ArchId[]) {
    const a = ARCH_BY_ID[id];
    out[`trig-${id}`] = withTargets(
      triggerBuilder(id),
      a.result === "coverage"
        ? { needed: FIG_ROW_ID("openDeals"), all: FIG_ROW_ID("customers") }
        : a.result === "deal"
          ? { cost: archCard(id), per: FIG_ROW_ID("dealGP") }
          : { cost: archCard(id), kept: FIG_ROW_ID("kept"), years: FIG_ROW_ID("years") },
    );
    out[`month-${id}`] = withTargets(monthBuilder(id, r2), { start: `start-${id}`, setup: archCard(id), respond: archCard(id) });
    out[`pickup-${id}`] = withTargets(pickupBuilder(id), { cost: archCard(id), per: FIG_ROW_ID("gpCust") });
  }
  out.trip = withTargets(tripBuilder(r2), { base: FIG_ROW_ID("delighted"), cost: "arch-total", kept: FIG_ROW_ID("kept"), years: FIG_ROW_ID("years") });
  out.stay = withTargets(stayBuilder, { customers: groupRowId("delighted"), churn: FIG_ROW_ID("churnDel"), months: "task-2" });
  out.loss = withTargets(lossBuilder, { lost: "board-challenge", per: FIG_ROW_ID("gpCust") });
  return out;
}

/** Why a number is what it is, in one or two everyday sentences, and whether it can be shown yet (it may need the learner's own choice). */
export function numberInfo(key: string, r2: R2State): { why: string; ready: string | null } {
  if (key.startsWith("trig-")) {
    const a = ARCH_BY_ID[key.slice(5) as ArchId];
    if (a.result === "coverage")
      return {
        ready: null,
        why: tt(
          "The next step, the signal rules, only works for the customers with an open deal or a renewal. So the shared record has to cover that share of all customers, not all of them.",
          "Der nächste Schritt, die Signalregeln, wirkt nur bei den Kunden mit offenem Deal oder Verlängerung. Die gemeinsame Sicht muss also diesen Anteil aller Kunden abdecken, nicht alle.",
        ),
      };
    if (a.result === "deal")
      return {
        ready: null,
        why: tt(
          "The item has paid for itself when the deals it moves earn its cost back. One deal earns the printed gross profit, so this many moved deals is the least that counts as paid back; fewer means it has not.",
          "Der Punkt hat sich bezahlt gemacht, wenn die Deals, die er bewegt, seine Kosten zurückverdienen. Ein Deal bringt den gedruckten Rohertrag, so viele bewegte Deals sind also das Minimum für „bezahlt“; weniger heißt, es hat sich nicht gerechnet.",
        ),
      };
    return {
      ready: null,
      why: tt(
        "The item has paid for itself when the customers it moves to 5 of 5 keep as much gross profit over the contract as the item cost. One customer keeps the printed amount a year for the whole term.",
        "Der Punkt hat sich bezahlt gemacht, wenn die Kunden, die er auf 5 von 5 bringt, über die Laufzeit so viel Rohertrag halten, wie er kostete. Ein Kunde hält den gedruckten Betrag pro Jahr, über die ganze Laufzeit.",
      ),
    };
  }
  if (key.startsWith("month-"))
    return {
      ready: r2.start[key.slice(6)] == null ? tt("Choose the month this item starts (above) and its month appears here.", "Wählen Sie oben den Startmonat dieses Punkts, dann erscheint hier sein Monat.") : null,
      why: tt(
        "A trigger can only be read once the item is in use and customers or deals have had time to respond: your start month, plus the months of set-up, plus the months until the response shows. Any earlier month says nothing.",
        "Ein Trigger lässt sich erst lesen, wenn der Punkt im Einsatz ist und Kunden oder Deals Zeit zum Reagieren hatten: Ihr Startmonat, plus Monate Einrichtung, plus Monate bis die Reaktion sichtbar ist. Jeder frühere Monat sagt nichts.",
      ),
    };
  if (key.startsWith("pickup-"))
    return {
      ready: null,
      why: tt(
        "When this many customers have left for the reason the item would fix, waiting has cost as much as the item. That is the moment to look at it again.",
        "Wenn so viele Kunden aus dem Grund gegangen sind, den der Punkt beheben würde, hat das Warten so viel gekostet wie der Punkt. Das ist der Moment, ihn wieder anzusehen.",
      ),
    };
  if (key === "trip") {
    const funded = (Object.keys(r2.alloc) as ArchId[]).filter((id) => r2.alloc[id] && ARCH_BY_ID[id]);
    return {
      ready: customerItems(funded).length === 0 ? tt("Fund at least one item that moves customers in Block 3.5 and the number appears here.", "Finanzieren Sie in Block 3.5 mindestens einen Punkt, der Kunden bewegt, dann erscheint hier die Zahl.") : null,
      why: tt(
        "A tripwire has to beat today's figure by the step your funded customer items need to pay back. Today's figure plus that step, not a round number, is what shows the money was worth it.",
        "Ein Tripwire muss den heutigen Wert um den Schritt übertreffen, den Ihre finanzierten Kundenpunkte zum Bezahltmachen brauchen. Heutiger Wert plus dieser Schritt, keine runde Zahl, zeigt, dass sich das Geld gelohnt hat.",
      ),
    };
  }
  if (key === "stay")
    return {
      ready: null,
      why: tt(
        "A group that should simply stay still loses a few customers in any six months. You are wrong only when the loss goes above what is expected, at the first whole customer above it.",
        "Eine Gruppe, die einfach bleiben soll, verliert in jedem halben Jahr ein paar Kunden. Sie liegen erst falsch, wenn der Verlust über dem Erwarteten liegt, beim ersten ganzen Kunden darüber.",
      ),
    };
  return {
    ready: null,
    why: tt(
      "What the two losses cost in a year: customers lost times the gross profit a customer brings in a year. This is the figure to set against what the proposal would cost.",
      "Was die zwei Verluste in einem Jahr kosten: verlorene Kunden mal Rohertrag, den ein Kunde pro Jahr bringt. Diese Zahl setzen Sie den Kosten des Vorschlags gegenüber.",
    ),
  };
}

/** A part's label without its unit hint, and its printed value in the unit the label names. */
const partLabel = (label: string) => label.replace(/\s*\((€|%)\)\s*$/, "");
const partValue = (label: string, v: number) => (/\(€\)\s*$/.test(label) ? euro(v) : /\(%\)\s*$/.test(label) ? `${num(v)}%` : num(v));

/**
 * One number as the learner sees it: the result, how it comes out, why, whether it can be shown yet, and every printed input with its
 * value and the element to flash. Read by "Show the numbers you can use" and by the sentence kits (CLAUDE.md #44).
 */
export function numberView(key: string, r2: R2State) {
  const b = r2Builders(r2)[key];
  const info = numberInfo(key, r2);
  const parts = b.parts;
  const result = Math.round(b.compute(Object.fromEntries(parts.map((p) => [p.id, p.expected]))) * 1e6) / 1e6;
  return {
    result,
    show: b.show(Object.fromEntries(parts.map((p) => [p.id, String(p.expected)]))),
    why: info.why,
    ready: info.ready,
    sources: parts.map((p) => ({ label: partLabel(p.label), value: partValue(p.label, p.expected), target: p.target ?? "" })),
  };
}
