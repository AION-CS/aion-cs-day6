import type { Factor } from "@/data/approaches";
import { bi, t } from "@/lib/lang";

/**
 * Task 1 · Block 2.3. Nine measures for emotional retention NetSolutions could fund inside €140,000 and six months. Costs and weeks are
 * Case assumptions. What each measure changes is written as a mechanism, never with the factor's name, so the learner has to match them
 * (Materi A7). The score is the plan's own evaluation: Effect × Sustainability × Feasibility. Sustainability follows from the printed
 * "runs on" (a process or system, a named role, or one person / a one-off campaign), so it is checkable; effect and feasibility are the
 * learner's judgement.
 */
export type MeasureId = "owner" | "playbook" | "reviews" | "moments" | "healthcheck" | "discount" | "newsletter" | "starvisits" | "handover";
export const BUDGET = 140000;
export const MONTHS = 6;
export type Bucket = 1 | 2 | 3;
export type RunsOn = "process" | "role" | "person";
export const RUNS_ON_LABEL = bi({
  process: t("a process or system", "einen Prozess oder ein System"),
  role: t("a named role in every account", "eine benannte Rolle in jedem Account"),
  person: t("one person, or a one-off campaign", "eine Person, oder eine einmalige Kampagne"),
});
export const sustainBucket = (r: RunsOn): Bucket => (r === "process" ? 3 : r === "role" ? 2 : 1);
export const SUSTAIN_RULE = bi({
  v: t(
    "Sustainability follows from what a measure runs on: a process or system scores 3, a named role in every account scores 2, one person or a one-off campaign scores 1.",
    "Nachhaltigkeit folgt daraus, worauf eine Maßnahme läuft: ein Prozess oder System ergibt 3, eine benannte Rolle in jedem Account ergibt 2, eine Person oder eine einmalige Kampagne ergibt 1.",
  ),
});

/**
 * The category printed after the weeks (CLAUDE.md #45): which of the areas taught in Materi A3 a measure acts on. Customers named
 * three areas in Block 1.1 (relationship, communication, added value); a price cut is a fourth kind that no statement names. The label
 * is a fact about the measure taken from A3's own tests, never the factor (that stays the learner's job) and never a score.
 */
export type MeasureArea = "rel" | "comm" | "value" | "price";
export const MEASURE_AREA_LABEL = bi({
  rel: t("Relationship", "Beziehung"),
  comm: t("Communication", "Kommunikation"),
  value: t("Added value", "Mehrwert"),
  price: t("Price", "Preis"),
});

export type Measure = {
  id: MeasureId;
  name: string;
  what: string;
  mechanism: string;
  runsOn: RunsOn;
  cost: number;
  weeks: number;
  area: MeasureArea;
  targets: Factor[];
  model: { effect: Bucket; feasibility: Bucket; note: string };
  verdict: string;
};

export const MEASURES: Measure[] = bi([
  {
    id: "owner" as MeasureId,
    name: t("A named relationship owner for every customer", "Ein benannter Beziehungs-Owner für jeden Kunden"),
    what: t("Each customer gets one named account manager who stays for at least two years, with a quarterly call and a yearly visit.", "Jeder Kunde bekommt einen festen Account Manager, der mindestens zwei Jahre bleibt, mit einem Anruf pro Quartal und einem Besuch pro Jahr."),
    mechanism: t("Gives the customer one person who knows its history and whom it can rely on.", "Gibt dem Kunden eine Person, die seine Geschichte kennt und auf die er sich verlassen kann."),
    runsOn: "role" as RunsOn,
    cost: 48000,
    weeks: 6,
    area: "rel" as MeasureArea,
    targets: ["trust", "appreciation"] as Factor[],
    model: { effect: 3, feasibility: 2, note: t("Strong effect on the reason customers name most, but it needs sales capacity and a rule that managers stay.", "Starke Wirkung auf den Grund, den Kunden am häufigsten nennen, braucht aber Vertriebskapazität und eine Regel, dass Manager bleiben.") },
    verdict: t("A good measure that just misses: 12 points, and with the three model measures the total would be €143,000, over budget.", "Eine gute Maßnahme, die knapp verfehlt: 12 Punkte, und mit den drei Modellmaßnahmen läge die Summe bei 143.000 €, über dem Budget."),
  },
  {
    id: "playbook" as MeasureId,
    name: t("Signal response playbook in the CRM", "Signal-Playbook im CRM"),
    what: t("Every buying or hesitation signal is logged in the CRM; an owner and a response are assigned automatically, with an answer within two days.", "Jedes Kauf- oder Zögersignal wird im CRM erfasst; ein Owner und eine Antwort werden automatisch zugewiesen, mit Reaktion innerhalb von zwei Tagen."),
    mechanism: t("Makes sure the customer's questions and doubts are answered, by the right person, before they turn into a stall.", "Sorgt dafür, dass Fragen und Zweifel des Kunden beantwortet werden, von der richtigen Person, bevor ein Stillstand daraus wird."),
    runsOn: "process" as RunsOn,
    cost: 35000,
    weeks: 6,
    area: "comm" as MeasureArea,
    targets: ["trust"] as Factor[],
    model: { effect: 3, feasibility: 2, note: t("Acts on the weakness that stalled every uncertainty signal; needs a CRM set-up, so feasibility 2.", "Wirkt auf die Schwäche, die jedes Unsicherheitssignal stocken ließ; braucht eine CRM-Einrichtung, daher Machbarkeit 2.") },
    verdict: t("A model measure: it turns reacting into managing, and it keeps working whoever sells.", "Eine Modellmaßnahme: Sie macht aus Reagieren Steuern, und sie wirkt, egal wer verkauft."),
  },
  {
    id: "reviews" as MeasureId,
    name: t("Twice-yearly success reviews with benchmarks", "Halbjährliche Success-Reviews mit Benchmarks"),
    what: t("Twice a year each customer gets a review: how it uses the platform, what similar companies do, three concrete recommendations.", "Zweimal im Jahr bekommt jeder Kunde ein Review: wie er die Plattform nutzt, was ähnliche Firmen tun, drei konkrete Empfehlungen."),
    mechanism: t("Gives the customer advice that makes it better at its own work, beyond the contract.", "Gibt dem Kunden Rat, der ihn in seiner eigenen Arbeit besser macht, über den Vertrag hinaus."),
    runsOn: "process" as RunsOn,
    cost: 40000,
    weeks: 8,
    area: "value" as MeasureArea,
    targets: ["relevance", "appreciation"] as Factor[],
    model: { effect: 3, feasibility: 2, note: t("Answers “nobody ever told us how to use it better”; needs a template and service time, so feasibility 2.", "Beantwortet „nie hat uns jemand gezeigt, wie wir es besser nutzen“; braucht eine Vorlage und Servicezeit, daher Machbarkeit 2.") },
    verdict: t("A model measure: added value, built into the service calendar rather than left to goodwill.", "Eine Modellmaßnahme: Mehrwert, eingebaut in den Servicekalender statt dem guten Willen überlassen."),
  },
  {
    id: "moments" as MeasureId,
    name: t("Thank-you campaign in the fourth quarter", "Dankeschön-Kampagne im vierten Quartal"),
    what: t("A one-off campaign: a personal letter from the managing director and a small gift to every customer in December.", "Eine einmalige Kampagne: ein persönlicher Brief der Geschäftsführung und ein kleines Geschenk an jeden Kunden im Dezember."),
    mechanism: t("Makes customers feel valued once a year.", "Lässt Kunden sich einmal im Jahr geschätzt fühlen."),
    runsOn: "person" as RunsOn,
    cost: 12000,
    weeks: 4,
    area: "rel" as MeasureArea,
    targets: ["appreciation"] as Factor[],
    model: { effect: 2, feasibility: 3, note: t("A pleasant gesture, but once a year and from no one the customer works with.", "Eine nette Geste, aber einmal im Jahr und von niemandem, mit dem der Kunde arbeitet.") },
    verdict: t("Not in the model three: 6 points. Appreciation works best when it is built into the relationship, not sent once.", "Nicht unter den drei Modellmaßnahmen: 6 Punkte. Wertschätzung wirkt am besten eingebaut in die Beziehung, nicht einmal verschickt."),
  },
  {
    id: "healthcheck" as MeasureId,
    name: t("Free security review for the 30 largest customers", "Kostenloser Sicherheits-Check für die 30 größten Kunden"),
    what: t("A one-off review of each large customer's network, delivered by a senior engineer.", "Ein einmaliger Check des Netzes jedes großen Kunden, durchgeführt von einem Senior Engineer."),
    mechanism: t("Gives something useful first, as the competitor did.", "Gibt zuerst etwas Nützliches, wie es der Wettbewerber tat."),
    runsOn: "person" as RunsOn,
    cost: 30000,
    weeks: 10,
    area: "value" as MeasureArea,
    targets: ["relevance"] as Factor[],
    model: { effect: 2, feasibility: 2, note: t("Answers the competitor's move, but as a one-off it builds nothing lasting, and it ties up a senior engineer.", "Beantwortet den Zug des Wettbewerbers, baut aber als Einmalaktion nichts Dauerhaftes auf und bindet einen Senior Engineer.") },
    verdict: t("Rejected for now: 4 points. Useful once, not a retention system.", "Vorerst verworfen: 4 Punkte. Einmal nützlich, kein Bindungssystem."),
  },
  {
    id: "discount" as MeasureId,
    name: t("8% loyalty discount at renewal", "8 % Treuerabatt bei Verlängerung"),
    what: t("Every customer who renews gets 8% off the next year.", "Jeder Kunde, der verlängert, bekommt 8 % Rabatt auf das nächste Jahr."),
    mechanism: t("Lowers the price at the moment of renewal; changes nothing in how the customer feels about NetSolutions.", "Senkt den Preis im Moment der Verlängerung; ändert nichts daran, wie der Kunde über NetSolutions denkt."),
    runsOn: "process" as RunsOn,
    cost: 60000,
    weeks: 1,
    area: "price" as MeasureArea,
    targets: [] as Factor[],
    model: { effect: 1, feasibility: 3, note: t("Price is named in none of the reasons; customers leave while satisfied, not because it is dear.", "Der Preis wird in keinem Grund genannt; Kunden gehen zufrieden, nicht weil es teuer ist.") },
    verdict: t("Rejected: it scores well on sustainability and feasibility and still acts on no emotional factor. It buys renewals, not attachment.", "Verworfen: Es punktet bei Nachhaltigkeit und Machbarkeit und wirkt trotzdem auf keinen emotionalen Faktor. Es kauft Verlängerungen, keine Bindung."),
  },
  {
    id: "newsletter" as MeasureId,
    name: t("Monthly product newsletter", "Monatlicher Produkt-Newsletter"),
    what: t("A monthly email with product news and release notes to every customer contact.", "Eine monatliche E-Mail mit Produktneuigkeiten und Release Notes an jeden Kundenkontakt."),
    mechanism: t("Sends more messages; the same ones to everyone.", "Verschickt mehr Nachrichten; an alle dieselben."),
    runsOn: "process" as RunsOn,
    cost: 10000,
    weeks: 3,
    area: "comm" as MeasureArea,
    targets: [] as Factor[],
    model: { effect: 1, feasibility: 3, note: t("More of the communication customers already ignore (“twenty pages nobody reads”).", "Mehr von der Kommunikation, die Kunden schon ignorieren („zwanzig Seiten, die niemand liest“).") },
    verdict: t("Rejected: cheap and lasting, but it answers no reason customers gave.", "Verworfen: günstig und dauerhaft, beantwortet aber keinen Grund, den Kunden nannten."),
  },
  {
    id: "starvisits" as MeasureId,
    name: t("Personal visits by the top salesperson", "Persönliche Besuche des besten Verkäufers"),
    what: t("NetSolutions' best salesperson personally visits the 20 largest customers twice this year.", "Der beste Verkäufer von NetSolutions besucht die 20 größten Kunden dieses Jahr zweimal persönlich."),
    mechanism: t("Gives the largest customers a personal tie to one respected person.", "Gibt den größten Kunden eine persönliche Bindung an eine angesehene Person."),
    runsOn: "person" as RunsOn,
    cost: 25000,
    weeks: 2,
    area: "rel" as MeasureArea,
    targets: ["trust", "appreciation"] as Factor[],
    model: { effect: 3, feasibility: 2, note: t("Strong where it happens, but the tie belongs to one person and leaves with them.", "Stark, wo es passiert, aber die Bindung gehört einer Person und geht mit ihr.") },
    verdict: t("Not chosen: 6 points. Effective and fragile: the same problem as four account managers in two years, in reverse.", "Nicht gewählt: 6 Punkte. Wirksam und zerbrechlich: dasselbe Problem wie vier Account Manager in zwei Jahren, nur umgekehrt."),
  },
  {
    id: "handover" as MeasureId,
    name: t("Joint sales and service handover at go-live", "Gemeinsame Übergabe von Vertrieb und Service beim Go-live"),
    what: t("At go-live, the salesperson and the named service lead meet the customer together and hand over the history.", "Beim Go-live treffen Verkäufer und die benannte Service-Leitung den Kunden gemeinsam und übergeben die Historie."),
    mechanism: t("Lets the customer meet the people who will look after it, and know that they know its story.", "Lässt den Kunden die Menschen treffen, die sich um ihn kümmern, und wissen, dass sie seine Geschichte kennen."),
    runsOn: "process" as RunsOn,
    cost: 20000,
    weeks: 4,
    area: "rel" as MeasureArea,
    targets: ["trust"] as Factor[],
    model: { effect: 2, feasibility: 3, note: t("Answers “a number, never a name” at the moment it starts; a step of the process, cheap to run.", "Beantwortet „eine Nummer, nie ein Name“ in dem Moment, in dem es beginnt; ein Prozessschritt, günstig im Betrieb.") },
    verdict: t("A model measure: 18 points, and it links sales and service, as the plan's model solution asks.", "Eine Modellmaßnahme: 18 Punkte, und sie verbindet Vertrieb und Service, wie es die Musterlösung des Plans verlangt."),
  },
]);

export const MEASURE_BY_ID = Object.fromEntries(MEASURES.map((m) => [m.id, m])) as Record<MeasureId, Measure>;
export const MEASURE_IDS = MEASURES.map((m) => m.id);
export const CHOOSE = 3;
export const modelScore = (id: MeasureId) => {
  const m = MEASURE_BY_ID[id];
  return m.model.effect * sustainBucket(m.runsOn) * m.model.feasibility;
};
export const MODEL_MEASURES: MeasureId[] = ["playbook", "reviews", "handover"];
export const MODEL_COST = MODEL_MEASURES.reduce((s, id) => s + MEASURE_BY_ID[id].cost, 0);
