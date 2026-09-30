import type { ResponseId, SignalType, TeamId } from "@/data/signals";
import { NETSOL } from "@/data/delight";
import { bi, t } from "@/lib/lang";

/**
 * Route 2 (Level 3) data: the Transfer Project. NetSolutions' Chief Customer Officer builds a scalable customer retention system with a
 * limited budget, high time pressure and incomplete data. Every figure is a Case assumption (the plan gives the role, the situation and
 * the constraints, not numbers). Model values are used only by the checks, the answer keys and the worked answers.
 */
export const R2_BUDGET = 170000;
export const R2_MONTHS = 6;
export type Bucket = 1 | 2 | 3;

/* ------------------------------------------------------------------ 3.1 · target vision: system principles */

export type PrincipleId = "view" | "signals" | "owner" | "moments" | "discount" | "stars";
export const PRINCIPLE_IDS: PrincipleId[] = ["view", "signals", "owner", "moments", "discount", "stars"];
export const PRINCIPLES = bi({
  view: { id: "view" as PrincipleId, name: t("One shared customer view", "Eine gemeinsame Kundensicht"), means: t("Sales, service and marketing see the same record of every customer: history, contacts, open signals.", "Vertrieb, Service und Marketing sehen denselben Datensatz jedes Kunden: Historie, Kontakte, offene Signale.") },
  signals: { id: "signals" as PrincipleId, name: t("Every signal has an owner and a response time", "Jedes Signal hat einen Owner und eine Reaktionszeit"), means: t("A buying or hesitation signal is never left to whoever happens to notice it.", "Ein Kauf- oder Zögersignal wird nie dem überlassen, der es zufällig bemerkt.") },
  owner: { id: "owner" as PrincipleId, name: t("Every customer has a named relationship owner", "Jeder Kunde hat einen benannten Beziehungs-Owner"), means: t("One person the customer knows, who stays for years.", "Eine Person, die der Kunde kennt und die über Jahre bleibt.") },
  moments: { id: "moments" as PrincipleId, name: t("Delight moments are planned in the journey", "Begeisterungsmomente sind in der Journey geplant"), means: t("Go-live, first year, renewal: the moments that create attachment are designed, not improvised.", "Go-live, erstes Jahr, Verlängerung: Die Momente, die Bindung schaffen, sind gestaltet, nicht improvisiert.") },
  discount: { id: "discount" as PrincipleId, name: t("Loyalty is rewarded with discounts at renewal", "Treue wird mit Rabatten bei Verlängerung belohnt"), means: t("Customers who stay pay less.", "Kunden, die bleiben, zahlen weniger.") },
  stars: { id: "stars" as PrincipleId, name: t("The best salespeople look after the key customers personally", "Die besten Verkäufer betreuen die Schlüsselkunden persönlich"), means: t("The most important accounts are held by the most talented people.", "Die wichtigsten Accounts werden von den talentiertesten Menschen gehalten.") },
});
/** A system needs both: a shared view (so anyone can act) and signal ownership (so someone must). */
export const PRINCIPLE_MUST: PrincipleId[] = ["view", "signals"];
export const PRINCIPLE_TRAP: PrincipleId[] = ["discount", "stars"];

/* ------------------------------------------------------------------ 3.2 · the central process: handling signals */

export type TimeId = "same" | "two" | "week" | "next";
export const TIMES = bi([
  { id: "same" as TimeId, label: t("The same working day", "Am selben Arbeitstag") },
  { id: "two" as TimeId, label: t("Within two working days", "Innerhalb von zwei Arbeitstagen") },
  { id: "week" as TimeId, label: t("Within a week", "Innerhalb einer Woche") },
  { id: "next" as TimeId, label: t("At the next scheduled contact", "Beim nächsten geplanten Kontakt") },
]);
export const TIME_ACCEPT: Record<SignalType, TimeId[]> = { interest: ["two", "same"], comparison: ["two", "same"], proximity: ["same", "two"], uncertainty: ["same"] };
export const PROCESS_WHY = bi({
  interest: t("Interest cools if nobody follows up; two days keeps the buyer's picture of using it alive.", "Interesse kühlt ab, wenn niemand nachfasst; zwei Tage halten das Bild der Nutzung beim Käufer lebendig."),
  comparison: t("The buyer is filling in a comparison now; an answer after the matrix is closed does not count.", "Der Käufer füllt jetzt einen Vergleich aus; eine Antwort nach Abschluss der Matrix zählt nicht."),
  proximity: t("The buyer is close; a decision plan the same day or the next keeps the momentum.", "Der Käufer ist nah dran; ein Entscheidungsplan am selben oder nächsten Tag hält den Schwung."),
  uncertainty: t("Every uncertainty signal at NetSolutions stalled. Hesitation grows while it waits, so it is answered the same day, by someone who can reduce the risk.", "Jedes Unsicherheitssignal bei NetSolutions stockte. Zögern wächst, während es wartet, also wird es am selben Tag beantwortet, von jemandem, der das Risiko verkleinern kann."),
});
export type ProcessRow = { team: TeamId | null; time: TimeId | null; action: ResponseId | null; note: string };

/* ------------------------------------------------------------------ 3.3 · strategic levers for emotional retention */

export type LeverId = "view" | "playbook" | "owners" | "reviews" | "moments" | "stars" | "discount" | "newsletter";
export const LEVER_IDS: LeverId[] = ["view", "playbook", "owners", "reviews", "moments", "stars", "discount", "newsletter"];
export type Depends = "people" | "process" | "rule";
export type CostShape = "one-off" | "per customer" | "per deal";
export type Criterion = "reach" | "depth" | "durability" | "scale";
export const CRIT_IDS: Criterion[] = ["reach", "depth", "durability", "scale"];
export const CRITERIA = bi([
  { id: "reach" as Criterion, name: t("Reach", "Reichweite"), test: t("How many customers does it touch?", "Wie viele Kunden erreicht er?"), low: t("Some customers only.", "Nur einige Kunden."), high: t("Every customer.", "Jeden Kunden.") },
  { id: "depth" as Criterion, name: t("Depth", "Tiefe"), test: t("How strongly does it build attachment in one customer?", "Wie stark baut er Bindung bei einem Kunden auf?"), low: t("A small nudge.", "Ein kleiner Anstoß."), high: t("It removes a reason the customer feels no tie.", "Er beseitigt einen Grund, warum der Kunde keine Bindung spürt.") },
  { id: "durability" as Criterion, name: t("Durability", "Dauerhaftigkeit"), test: t("Does it still work when the person changes or the campaign ends?", "Wirkt er noch, wenn die Person wechselt oder die Kampagne endet?"), low: t("It depends on individual people.", "Er hängt an einzelnen Menschen.") , high: t("It is built into a process or a rule.", "Er ist in einen Prozess oder eine Regel eingebaut.") },
  { id: "scale" as Criterion, name: t("Scale", "Skalierung"), test: t("Does the cost per additional customer fall as the base grows?", "Sinken die Kosten pro zusätzlichem Kunden, wenn die Basis wächst?"), low: t("The cost repeats with every deal.", "Die Kosten wiederholen sich mit jedem Deal."), high: t("A one-off cost that serves every customer.", "Einmalige Kosten, die jedem Kunden dienen.") },
]);

export type Lever = { id: LeverId; name: string; what: string; level: "argument" | "interaction" | "process" | "structure"; depends: Depends; costShape: CostShape; reachAll: boolean; acts: string; model: Record<Criterion, Bucket>; note: string };
export const LEVERS: Lever[] = bi([
  { id: "view" as LeverId, name: t("One shared customer view in the CRM", "Eine gemeinsame Kundensicht im CRM"), what: t("One record per customer for sales, service and marketing: history, contacts, open signals, next step.", "Ein Datensatz pro Kunde für Vertrieb, Service und Marketing: Historie, Kontakte, offene Signale, nächster Schritt."), level: "structure" as const, depends: "process" as Depends, costShape: "one-off" as CostShape, reachAll: true, acts: t("Whether anyone who talks to the customer knows its story.", "Ob jeder, der mit dem Kunden spricht, seine Geschichte kennt."), model: { reach: 3, depth: 2, durability: 3, scale: 3 }, note: t("It does not create attachment by itself, but every other lever depends on it. One-off cost, every customer.", "Er schafft selbst keine Bindung, aber jeder andere Hebel hängt von ihm ab. Einmalige Kosten, jeder Kunde.") },
  { id: "playbook" as LeverId, name: t("Signal response playbook", "Signal-Playbook"), what: t("Every signal gets an owner, a response time and a first action, automatically.", "Jedes Signal bekommt automatisch einen Owner, eine Reaktionszeit und eine erste Aktion."), level: "process" as const, depends: "process" as Depends, costShape: "one-off" as CostShape, reachAll: true, acts: t("Whether a customer's doubt is answered before it becomes a stall.", "Ob der Zweifel eines Kunden beantwortet wird, bevor daraus ein Stillstand wird."), model: { reach: 3, depth: 3, durability: 3, scale: 3 }, note: t("It turns reacting into managing for every customer, whoever is on duty.", "Es macht aus Reagieren Steuern, für jeden Kunden, egal wer Dienst hat.") },
  { id: "owners" as LeverId, name: t("Relationship owner for every customer", "Beziehungs-Owner für jeden Kunden"), what: t("One named account manager per customer, quarterly calls, a yearly visit.", "Ein fester Account Manager pro Kunde, Anrufe pro Quartal, ein Besuch pro Jahr."), level: "interaction" as const, depends: "people" as Depends, costShape: "per customer" as CostShape, reachAll: true, acts: t("Whether the customer has one person it knows and trusts.", "Ob der Kunde eine Person hat, die er kennt und der er vertraut."), model: { reach: 3, depth: 3, durability: 1, scale: 2 }, note: t("Deep where it works, but the tie leaves with the person, and every new customer needs more of a person's time.", "Tief, wo es wirkt, aber die Bindung geht mit der Person, und jeder neue Kunde braucht mehr Personenzeit.") },
  { id: "reviews" as LeverId, name: t("Success review programme", "Success-Review-Programm"), what: t("Twice-yearly reviews with benchmarks and three recommendations per customer.", "Halbjährliche Reviews mit Benchmarks und drei Empfehlungen pro Kunde."), level: "process" as const, depends: "process" as Depends, costShape: "per customer" as CostShape, reachAll: true, acts: t("Whether the customer gains something beyond the contract.", "Ob der Kunde etwas über den Vertrag hinaus gewinnt."), model: { reach: 3, depth: 2, durability: 3, scale: 2 }, note: t("A process, so it lasts; but each review takes service time, so the cost repeats per customer.", "Ein Prozess, also dauerhaft; aber jedes Review braucht Servicezeit, daher wiederholen sich die Kosten pro Kunde.") },
  { id: "moments" as LeverId, name: t("Designed delight moments", "Gestaltete Begeisterungsmomente"), what: t("Go-live meeting, first-year review and renewal thank-you, planned in the journey for every customer.", "Go-live-Termin, Rückblick nach dem ersten Jahr und Dank zur Verlängerung, in der Journey für jeden Kunden geplant."), level: "process" as const, depends: "process" as Depends, costShape: "one-off" as CostShape, reachAll: true, acts: t("Whether customers feel noticed at the moments that matter.", "Ob Kunden sich in den Momenten bemerkt fühlen, die zählen."), model: { reach: 3, depth: 2, durability: 3, scale: 3 }, note: t("Designed once, then part of the journey for every customer.", "Einmal gestaltet, dann Teil der Journey für jeden Kunden.") },
  { id: "stars" as LeverId, name: t("Top-seller visits to key customers", "Besuche des besten Verkäufers bei Schlüsselkunden"), what: t("The best salesperson personally visits the 20 largest customers.", "Der beste Verkäufer besucht persönlich die 20 größten Kunden."), level: "interaction" as const, depends: "people" as Depends, costShape: "per customer" as CostShape, reachAll: false, acts: t("A personal tie for a few large customers.", "Eine persönliche Bindung für wenige große Kunden."), model: { reach: 2, depth: 3, durability: 1, scale: 1 }, note: t("Deep for twenty customers, gone when the person moves on.", "Tief für zwanzig Kunden, weg, wenn die Person weiterzieht.") },
  { id: "discount" as LeverId, name: t("Loyalty discount at renewal", "Treuerabatt bei Verlängerung"), what: t("8% off for every renewal.", "8 % Rabatt bei jeder Verlängerung."), level: "argument" as const, depends: "rule" as Depends, costShape: "per deal" as CostShape, reachAll: true, acts: t("The price. It leaves trust, appreciation and relevance where they were.", "Den Preis. Vertrauen, Wertschätzung und Relevanz bleiben, wo sie waren."), model: { reach: 3, depth: 1, durability: 2, scale: 1 }, note: t("Paid on every renewal, including those that would have happened anyway.", "Bei jeder Verlängerung bezahlt, auch bei denen, die ohnehin passiert wären.") },
  { id: "newsletter" as LeverId, name: t("Monthly product newsletter", "Monatlicher Produkt-Newsletter"), what: t("The same product news to every contact each month.", "Jeden Monat dieselben Produktneuigkeiten an jeden Kontakt."), level: "argument" as const, depends: "process" as Depends, costShape: "one-off" as CostShape, reachAll: true, acts: t("How much customers hear from NetSolutions, not what they hear.", "Wie viel Kunden von NetSolutions hören, nicht was sie hören."), model: { reach: 3, depth: 1, durability: 2, scale: 3 }, note: t("Cheap and wide, and it adds to the communication customers already ignore.", "Günstig und breit, und es vergrößert die Kommunikation, die Kunden schon ignorieren.") },
]);
export const LEVER_BY_ID = Object.fromEntries(LEVERS.map((l) => [l.id, l])) as Record<LeverId, Lever>;
export const LEVER_CHOOSE = 3;
export const isSystemic = (id: LeverId) => LEVER_BY_ID[id].level === "process" || LEVER_BY_ID[id].level === "structure";
export const LEVEL_LABEL = bi({ argument: t("Argument", "Argument"), interaction: t("Interaction", "Interaktion"), process: t("Process", "Prozess"), structure: t("Structure", "Struktur") });
export const DEPENDS_LABEL = bi({ people: t("Individual people", "Einzelne Menschen"), process: t("The process", "Der Prozess"), rule: t("A rule", "Eine Regel") });
export const COST_SHAPE_LABEL = bi({ "one-off": t("one-off", "einmalig"), "per customer": t("per customer", "pro Kunde"), "per deal": t("per deal", "pro Deal") });
export const MODEL_LEVERS: LeverId[] = ["playbook", "view", "moments"];
/** The limit a rating must not exceed, from the printed facts of the lever (Materi B3). */
export function maxRating(id: LeverId, c: Criterion): Bucket {
  const l = LEVER_BY_ID[id];
  if (c === "reach") return l.reachAll ? 3 : 2;
  if (c === "durability") return l.depends === "people" ? 1 : 3;
  if (c === "scale") return l.costShape === "per deal" ? 1 : l.costShape === "per customer" ? 2 : 3;
  return 3;
}

/* ------------------------------------------------------------------ 3.4 · integrating sales, service and marketing (RACI) */

export type RoleId = "sales" | "service" | "marketing" | "cco";
export const ROLE_IDS: RoleId[] = ["sales", "service", "marketing", "cco"];
export const RACI_ROLES = bi({
  sales: { name: t("Sales", "Vertrieb"), profile: t("Owns open deals, renewals and expansions; talks to buyers; can change offers within its authority.", "Verantwortet offene Deals, Verlängerungen und Erweiterungen; spricht mit Käufern; kann Angebote im Rahmen seiner Befugnis ändern.") },
  service: { name: t("Service", "Service"), profile: t("Runs the platform for the customer day to day, knows its usage and its problems, holds the service relationship.", "Betreibt die Plattform täglich für den Kunden, kennt Nutzung und Probleme, hält die Servicebeziehung.") },
  marketing: { name: t("Marketing", "Marketing"), profile: t("Owns the customer journey design, the content and the campaigns. Rarely talks to a single customer.", "Verantwortet die Gestaltung der Customer Journey, die Inhalte und die Kampagnen. Spricht selten mit einzelnen Kunden.") },
  cco: { name: t("Chief Customer Officer (you)", "Chief Customer Officer (Sie)"), profile: t("Answers for retention as a whole and decides across the three teams. Should hold few items, or decisions queue at one desk.", "Verantwortet die Kundenbindung als Ganzes und entscheidet über die drei Teams hinweg. Sollte wenige Punkte halten, sonst stauen sich Entscheidungen an einem Schreibtisch.") },
});
export type RaciLetter = "R" | "A" | "C" | "I" | "-";
export const RACI_LETTERS: RaciLetter[] = ["R", "A", "C", "I", "-"];
export type ActivityId = "respond" | "review" | "moments" | "save";
export const ACTIVITY_IDS: ActivityId[] = ["respond", "review", "moments", "save"];
export const ACTIVITIES = bi({
  respond: { name: t("Respond to a buying or hesitation signal in an open deal", "Auf ein Kauf- oder Zögersignal in einem offenen Deal reagieren") },
  review: { name: t("Run the twice-yearly success review", "Das halbjährliche Success-Review durchführen") },
  moments: { name: t("Design the delight moments in the customer journey", "Die Begeisterungsmomente in der Customer Journey gestalten") },
  save: { name: t("Decide on a save plan for a customer at risk of leaving", "Über einen Rettungsplan für einen abwanderungsgefährdeten Kunden entscheiden") },
});
/** The letters that defend in each cell (reference answer). A cell accepts more than one where both defend. */
export const RACI_ACCEPT: Record<ActivityId, Record<RoleId, RaciLetter[]>> = {
  respond: { sales: ["A"], service: ["C"], marketing: ["I", "-"], cco: ["I", "-"] },
  review: { sales: ["C"], service: ["A"], marketing: ["I", "-"], cco: ["I", "-"] },
  moments: { sales: ["C"], service: ["C"], marketing: ["R"], cco: ["A"] },
  save: { sales: ["R", "C"], service: ["R"], marketing: ["-", "I"], cco: ["A"] },
};
export const RACI_WHY = bi({
  respond: t("Sales holds the open deal and can change the offer, so it answers for the response (A, doing the work too). Service knows the customer's usage and is asked (C).", "Der Vertrieb hält den offenen Deal und kann das Angebot ändern, also verantwortet er die Reaktion (A, macht die Arbeit auch). Der Service kennt die Nutzung des Kunden und wird gefragt (C)."),
  review: t("Service runs the platform and knows the usage, so it owns the review (A). Sales is asked what matters for the renewal (C).", "Der Service betreibt die Plattform und kennt die Nutzung, also verantwortet er das Review (A). Der Vertrieb wird gefragt, was für die Verlängerung zählt (C)."),
  moments: t("Marketing designs the journey (R). The moments cut across all teams, so the CCO answers for them (A); sales and service know the customers and are asked (C).", "Marketing gestaltet die Journey (R). Die Momente gehen über alle Teams, also verantwortet sie der CCO (A); Vertrieb und Service kennen die Kunden und werden gefragt (C)."),
  save: t("A save plan needs service (what went wrong) and usually sales (the commercial offer) doing the work (R). Only the CCO can trade money and effort across teams, so the CCO decides (A).", "Ein Rettungsplan braucht den Service (was schiefging) und meist den Vertrieb (das kommerzielle Angebot) für die Arbeit (R). Nur der CCO kann Geld und Aufwand über Teams hinweg verschieben, also entscheidet der CCO (A)."),
});

/* ------------------------------------------------------------------ 3.5 · implementation architecture */

export type ArchId = "view" | "playbook" | "handover" | "reviews" | "moments" | "owners" | "stars" | "discount";
export const ARCH_IDS: ArchId[] = ["view", "playbook", "handover", "reviews", "moments", "owners", "stars", "discount"];
/**
 * What an item's trigger counts, which fixes the method its number comes from (Materi B6, CLAUDE.md #43):
 *   coverage · the share of customers the next step needs (customers it needs ÷ all customers)
 *   deal     · a payback count in deals (item cost ÷ gross profit of one expansion deal)
 *   customer · a payback count in customers moved to 5 of 5 (item cost ÷ (gross profit kept per customer moved × contract years))
 */
export type ArchResult = "coverage" | "deal" | "customer";
/** Which customer group the item spends on (CLAUDE.md #41): "all" is the internal baseline every group reads. */
export type GroupId = "satisfied" | "deals" | "delighted" | "dissatisfied";
export type ArchItem = { id: ArchId; name: string; what: string; cost: number; weeks: number; respond: number; result: ArchResult; group: GroupId | "all"; onePerson: boolean };
export const ARCH: ArchItem[] = bi([
  { id: "view" as ArchId, name: t("Shared customer view in the CRM", "Gemeinsame Kundensicht im CRM"), what: t("One record per customer for all three teams, with open signals.", "Ein Datensatz pro Kunde für alle drei Teams, mit offenen Signalen."), cost: 30000, weeks: 4, respond: 0, result: "coverage" as ArchResult, group: "all" as const, onePerson: false },
  { id: "playbook" as ArchId, name: t("Signal response playbook", "Signal-Playbook"), what: t("Owners, response times and first actions for the four signal types.", "Owner, Reaktionszeiten und erste Aktionen für die vier Signalarten."), cost: 35000, weeks: 4, respond: 1, result: "deal" as ArchResult, group: "deals" as GroupId, onePerson: false },
  { id: "handover" as ArchId, name: t("Joint sales and service handover", "Gemeinsame Übergabe von Vertrieb und Service"), what: t("Salesperson and service lead meet the customer together when a deal closes.", "Verkäufer und Service-Leitung treffen den Kunden gemeinsam, wenn ein Deal abgeschlossen ist."), cost: 20000, weeks: 4, respond: 2, result: "customer" as ArchResult, group: "deals" as GroupId, onePerson: false },
  { id: "reviews" as ArchId, name: t("Success review programme", "Success-Review-Programm"), what: t("Twice-yearly reviews with benchmarks for every customer.", "Halbjährliche Reviews mit Benchmarks für jeden Kunden."), cost: 40000, weeks: 8, respond: 1, result: "customer" as ArchResult, group: "satisfied" as GroupId, onePerson: false },
  { id: "moments" as ArchId, name: t("Designed delight moments", "Gestaltete Begeisterungsmomente"), what: t("Go-live meeting, first-year review, renewal thank-you in the journey.", "Go-live-Termin, Rückblick nach dem ersten Jahr, Dank zur Verlängerung in der Journey."), cost: 25000, weeks: 6, respond: 1, result: "customer" as ArchResult, group: "satisfied" as GroupId, onePerson: false },
  { id: "owners" as ArchId, name: t("Relationship owners for every customer", "Beziehungs-Owner für jeden Kunden"), what: t("Named account managers who stay two years, with a quarterly call.", "Feste Account Manager, die zwei Jahre bleiben, mit einem Anruf pro Quartal."), cost: 48000, weeks: 6, respond: 2, result: "customer" as ArchResult, group: "satisfied" as GroupId, onePerson: false },
  { id: "stars" as ArchId, name: t("Top-seller visits to key customers", "Besuche des besten Verkäufers bei Schlüsselkunden"), what: t("The best salesperson visits the 20 largest customers.", "Der beste Verkäufer besucht die 20 größten Kunden."), cost: 25000, weeks: 2, respond: 1, result: "customer" as ArchResult, group: "satisfied" as GroupId, onePerson: true },
  { id: "discount" as ArchId, name: t("Loyalty discount at renewal", "Treuerabatt bei Verlängerung"), what: t("8% off every renewal.", "8 % Rabatt bei jeder Verlängerung."), cost: 60000, weeks: 1, respond: 3, result: "customer" as ArchResult, group: "deals" as GroupId, onePerson: false },
]);
export const ARCH_BY_ID = Object.fromEntries(ARCH.map((a) => [a.id, a])) as Record<ArchId, ArchItem>;
export const BASELINE_ITEM: ArchId = "view";

/* ------------------------------------------------------------------ NetSolutions' figures for Route 2 (printed in the case brief) */

/**
 * Every number a Route 2 answer uses is printed here, once, and every model number is derived from these rows by a method taught in
 * Materi B6 (CLAUDE.md #43). Case assumptions; the survey and contract figures are the same as in Route 1.
 */
export const R2_FIG = {
  customers: NETSOL.satisfied.customers + NETSOL.delighted.customers + NETSOL.dissatisfied.customers,
  delighted: NETSOL.delighted.customers,
  satisfied: NETSOL.satisfied.customers,
  dissatisfied: NETSOL.dissatisfied.customers,
  churnSat: NETSOL.satisfied.churn,
  churnDel: NETSOL.delighted.churn,
  churnDis: NETSOL.dissatisfied.churn,
  contract: NETSOL.contract,
  margin: NETSOL.margin,
  /** Contracts run three years: the term over which a customer moved to 5 of 5 keeps paying back. */
  years: 3,
  /** Customers with an open deal or a renewal in the next six months: the ones the playbook serves. */
  openDeals: 120,
  /** Deals that stalled in the last six months. */
  stalled: 14,
  /** Gross profit of an average expansion deal. */
  dealGP: 6000,
};
/** Gross profit a year of one customer = contract × margin. */
export const GP_PER_CUSTOMER = (R2_FIG.contract * R2_FIG.margin) / 100;
/** Gross profit kept a year per customer moved from satisfied to delighted = (churn satisfied − churn delighted) × contract × margin. */
export const KEPT_PER_MOVE = (((R2_FIG.churnSat - R2_FIG.churnDel) / 100) * R2_FIG.contract * R2_FIG.margin) / 100;
/** The same over the contract term. */
export const KEPT_PER_TERM = KEPT_PER_MOVE * R2_FIG.years;

export type FigKey = "customers" | "delighted" | "satisfied" | "churnSat" | "churnDel" | "contract" | "margin" | "gpCust" | "kept" | "years" | "openDeals" | "stalled" | "dealGP";
export const FIG_ROW_ID = (k: FigKey) => `r2fig-${k}`;

/* ------------------------------------------------------------------ the methods (Materi B6) */

const up = (x: number) => Math.ceil(x - 1e-9);
/** Coverage share, in whole %: customers the next step needs ÷ all customers, rounded up. */
export const coverageShare = (needed: number, all: number) => up((needed / all) * 100);
/** Payback count: item cost ÷ gross profit per result, rounded up. */
export const paybackCount = (cost: number, perResult: number) => up(cost / perResult);
/** Cost of waiting: item cost ÷ gross profit lost per customer who leaves, rounded up. */
export const waitingCount = (cost: number, perCustomer: number) => up(cost / perCustomer);
/** Months of set-up: weeks ÷ 4, rounded up. */
export const setupMonths = (weeks: number) => up(weeks / 4);
/** Timing: the trigger month = start month + months of set-up + months until customers or deals respond. */
export const triggerMonth = (start: number, id: ArchId) => start + setupMonths(ARCH_BY_ID[id].weeks) + ARCH_BY_ID[id].respond;
/** The number an item's trigger uses, by its method. */
export function triggerNumber(id: ArchId): number {
  const a = ARCH_BY_ID[id];
  if (a.result === "coverage") return coverageShare(R2_FIG.openDeals, R2_FIG.customers);
  if (a.result === "deal") return paybackCount(a.cost, R2_FIG.dealGP);
  return paybackCount(a.cost, KEPT_PER_TERM);
}
/** Expected leavers in the plan's months = customers × yearly churn × months ÷ 12 (the baseline a "they stay" assumption is compared with). */
export const expectedLeavers = (customers: number, churnPct: number, months: number) => (customers * (churnPct / 100) * months) / 12;

/* ------------------------------------------------------------------ customer groups and what the data can tell (CLAUDE.md #41) */

export const GROUP_IDS: GroupId[] = ["satisfied", "deals", "delighted", "dissatisfied"];
export const GROUPS = bi({
  satisfied: { name: t("Satisfied customers (4 of 5)", "Zufriedene Kunden (4 von 5)"), confidence: t("Medium", "Mittel"), confidenceWhy: t("62 of the 90 answered the survey; the other 28 count as satisfied only because they never complained.", "62 der 90 haben die Befragung beantwortet; die anderen 28 gelten nur als zufrieden, weil sie sich nie beschwert haben.") },
  deals: { name: t("Customers with an open deal or a renewal", "Kunden mit offenem Deal oder Verlängerung"), confidence: t("Low", "Niedrig"), confidenceWhy: t("Only signals someone logged are counted. Of those, 35% are answered in time; nobody knows how many were never logged.", "Gezählt werden nur Signale, die jemand erfasst hat. Davon werden 35 % rechtzeitig beantwortet; niemand weiß, wie viele nie erfasst wurden.") },
  delighted: { name: t("Delighted customers (5 of 5 and a personal contact)", "Begeisterte Kunden (5 von 5 und persönlicher Kontakt)"), confidence: t("Low", "Niedrig"), confidenceWhy: t("“A personal contact” was ticked by the salesperson, not asked of the customer, and the 5% churn rests on 2 customers a year.", "„Persönlicher Kontakt“ wurde vom Verkäufer angekreuzt, nicht beim Kunden erfragt, und der Churn von 5 % beruht auf 2 Kunden pro Jahr.") },
  dissatisfied: { name: t("Dissatisfied customers (1 to 3)", "Unzufriedene Kunden (1 bis 3)"), confidence: t("High", "Hoch"), confidenceWhy: t("Their complaints and tickets are all recorded. They are handled by the service quality work, outside this budget.", "Ihre Beschwerden und Tickets sind vollständig erfasst. Sie werden von der Servicequalitätsarbeit betreut, außerhalb dieses Budgets.") },
});
export const GROUP_SIZE: Record<GroupId, number> = { satisfied: NETSOL.satisfied.customers, deals: R2_FIG.openDeals, delighted: NETSOL.delighted.customers, dissatisfied: NETSOL.dissatisfied.customers };
export const GROUP_CHURN: Record<GroupId, number | null> = { satisfied: NETSOL.satisfied.churn, deals: null, delighted: NETSOL.delighted.churn, dissatisfied: NETSOL.dissatisfied.churn };
export const groupRowId = (g: GroupId) => `r2group-${g}`;

export type OwnerId = "cco" | "salesops" | "saleslead" | "service" | "marketing";
export const OWNER_IDS: OwnerId[] = ["cco", "salesops", "saleslead", "service", "marketing"];
export const OWNERS = bi({
  cco: { name: t("Chief Customer Officer (you)", "Chief Customer Officer (Sie)"), profile: t("Decides across the three teams and answers to the board. Should hold few items.", "Entscheidet über die drei Teams hinweg und berichtet an den Vorstand. Sollte wenige Punkte halten.") },
  salesops: { name: t("Head of Sales Operations", "Leitung Sales Operations"), profile: t("Owns the CRM, its fields, automations and reports.", "Verantwortet das CRM, seine Felder, Automatisierungen und Berichte.") },
  saleslead: { name: t("Head of Sales", "Vertriebsleitung"), profile: t("Leads the salespeople, assigns accounts, sets how deals are run.", "Führt die Verkäufer, verteilt Accounts, legt fest, wie Deals laufen.") },
  service: { name: t("Head of Service", "Leitung Service"), profile: t("Leads the service team, owns reviews, onboarding and the service relationship.", "Führt das Serviceteam, verantwortet Reviews, Onboarding und die Servicebeziehung.") },
  marketing: { name: t("Head of Marketing", "Marketingleitung"), profile: t("Owns the customer journey design, content and campaigns.", "Verantwortet Journey-Gestaltung, Inhalte und Kampagnen.") },
});
export const OWNER_ACCEPT: Record<ArchId, OwnerId[]> = {
  view: ["salesops"],
  playbook: ["salesops", "saleslead"],
  handover: ["service", "saleslead"],
  reviews: ["service"],
  moments: ["marketing"],
  owners: ["saleslead"],
  stars: ["saleslead", "cco"],
  discount: ["cco"],
};
export const MODEL_ARCH: ArchId[] = ["view", "playbook", "handover", "reviews", "moments"];
export const MODEL_START: Partial<Record<ArchId, number>> = { view: 1, playbook: 2, handover: 2, reviews: 3, moments: 3 };
/** Model triggers: every number comes from `triggerNumber` and every month from `triggerMonth` on the model start months (#43). */
export const modelTriggerMonth = (id: ArchId) => triggerMonth(MODEL_START[id] ?? 1, id);
const tm = modelTriggerMonth;
export const MODEL_TRIGGER = bi({
  view: t(
    `If fewer than ${triggerNumber("view")}% of customers have a complete shared record by month ${tm("view")}, the playbook waits and the records are completed first.`,
    `Haben bis Monat ${tm("view")} weniger als ${triggerNumber("view")} % der Kunden einen vollständigen gemeinsamen Datensatz, wartet das Playbook, und zuerst werden die Datensätze vervollständigt.`,
  ),
  playbook: t(
    `If fewer than ${triggerNumber("playbook")} stalled deals have moved forward by month ${tm("playbook")}, the Head of Sales reviews who owns which signal.`,
    `Sind bis Monat ${tm("playbook")} weniger als ${triggerNumber("playbook")} stockende Deals weitergekommen, prüft die Vertriebsleitung, wer welches Signal verantwortet.`,
  ),
  handover: t(
    `If fewer than ${triggerNumber("handover")} customers with a joint handover rate us 5 of 5 by month ${tm("handover")}, the handover becomes a required step in the CRM.`,
    `Bewerten uns bis Monat ${tm("handover")} weniger als ${triggerNumber("handover")} Kunden mit gemeinsamer Übergabe mit 5 von 5, wird die Übergabe ein Pflichtschritt im CRM.`,
  ),
  reviews: t(
    `If fewer than ${triggerNumber("reviews")} reviewed customers have moved from 4 to 5 of 5 by month ${tm("reviews")}, the review is shortened to one hour and a template.`,
    `Sind bis Monat ${tm("reviews")} weniger als ${triggerNumber("reviews")} Kunden mit Review von 4 auf 5 von 5 gestiegen, wird das Review auf eine Stunde und eine Vorlage gekürzt.`,
  ),
  moments: t(
    `If fewer than ${triggerNumber("moments")} customers have moved to 5 of 5 after a designed moment by month ${tm("moments")}, marketing redesigns the moments with service.`,
    `Sind bis Monat ${tm("moments")} weniger als ${triggerNumber("moments")} Kunden nach einem gestalteten Moment auf 5 von 5 gestiegen, gestaltet Marketing die Momente mit dem Service neu.`,
  ),
});

/* ------------------------------------------------------------------ 3.6 · the system decision */

export type DecisionId = "commit" | "stage" | "wait";
export const DECISIONS = bi([
  { id: "commit" as DecisionId, label: t("Build the whole system now", "Das ganze System jetzt bauen"), detail: t("Fund every item and roll the system out to all customers from month 1.", "Jeden Punkt finanzieren und das System ab Monat 1 für alle Kunden ausrollen."), why: t("Fast and complete, and it defends only if the customer data is good enough to run everything at once.", "Schnell und vollständig, und nur vertretbar, wenn die Kundendaten gut genug sind, alles auf einmal zu betreiben."), rejected: t("Most of the money is spent before the shared view shows whether signals are captured at all.", "Der Großteil des Geldes ist ausgegeben, bevor die gemeinsame Sicht zeigt, ob Signale überhaupt erfasst werden.") },
  { id: "stage" as DecisionId, label: t("Decide the system now, build it in stages, with a tripwire", "Das System jetzt entscheiden, stufenweise bauen, mit Tripwire"), detail: t("Start with the shared view and the playbook, add reviews and moments in month 3, and scale only if the tripwire is met.", "Mit gemeinsamer Sicht und Playbook starten, Reviews und Momente in Monat 3 ergänzen, und nur skalieren, wenn der Tripwire erreicht ist."), why: t("It makes the system decision the brief asks for, while the first months produce the data that is missing.", "Es trifft die Systementscheidung, die der Auftrag verlangt, während die ersten Monate die fehlenden Daten liefern."), rejected: t("", "") },
  { id: "wait" as DecisionId, label: t("Collect complete data first", "Zuerst vollständige Daten sammeln"), detail: t("Run a six-month survey and analysis before deciding on any system.", "Eine sechsmonatige Befragung und Analyse durchführen, bevor über ein System entschieden wird."), why: t("", ""), rejected: t("The brief asks for a system decision despite incomplete information. Waiting leaves every signal unanswered for six more months.", "Der Auftrag verlangt eine Systementscheidung trotz unvollständiger Information. Warten lässt jedes Signal sechs weitere Monate unbeantwortet.") },
]);
export const MODEL_DECISION: DecisionId = "stage";

export type KpiId = "delighted" | "churn" | "repeat" | "answered" | "mails";
export const KPIS = bi([
  { id: "delighted" as KpiId, label: t("Customers rating 5 of 5 (delighted)", "Kunden mit Bewertung 5 von 5 (begeistert)"), unit: t("customers", "Kunden"), baseline: NETSOL.delighted.customers, better: "up" as const, behaviour: true },
  { id: "churn" as KpiId, label: t("Satisfied customers who gave notice in the last six months", "Zufriedene Kunden, die in den letzten sechs Monaten gekündigt haben"), unit: t("customers", "Kunden"), baseline: (NETSOL.satisfied.customers * NETSOL.satisfied.churn) / 100 / 2, better: "down" as const, behaviour: true },
  { id: "repeat" as KpiId, label: t("Customers with a repeat purchase in the last 12 months", "Kunden mit Wiederkauf in den letzten 12 Monaten"), unit: t("customers", "Kunden"), baseline: 27, better: "up" as const, behaviour: true },
  { id: "answered" as KpiId, label: t("Logged signals answered within their response time", "Erfasste Signale, die in ihrer Reaktionszeit beantwortet wurden"), unit: "%", baseline: 35, better: "up" as const, behaviour: false },
  { id: "mails" as KpiId, label: t("Customer emails sent per month", "Versendete Kunden-E-Mails pro Monat"), unit: t("emails", "E-Mails"), baseline: 600, better: "up" as const, behaviour: false },
]);
export const KPI_BY_ID = Object.fromEntries(KPIS.map((k) => [k.id, k])) as Record<KpiId, (typeof KPIS)[number]>;
/** Items whose trigger counts customers moved to 5 of 5: the tripwire's step is their payback count together (Materi B6). */
export const customerItems = (ids: ArchId[]) => ids.filter((id) => ARCH_BY_ID[id].result === "customer");
/** Tripwire (baseline plus step): today's delighted customers + (cost of the funded customer items ÷ gross profit kept per customer over the term). */
export const tripwireStep = (ids: ArchId[]) => paybackCount(customerItems(ids).reduce((s, id) => s + ARCH_BY_ID[id].cost, 0), KEPT_PER_TERM);
const MODEL_CUSTOMER_ITEMS: ArchId[] = ["handover", "reviews", "moments"];
export const MODEL_TRIPWIRE = {
  kpi: "delighted" as KpiId,
  threshold: NETSOL.delighted.customers + tripwireStep(MODEL_CUSTOMER_ITEMS),
  month: Math.min(R2_MONTHS, Math.max(...MODEL_CUSTOMER_ITEMS.map(modelTriggerMonth))),
};
/** Pickup point for the owner model left out (cost of waiting): satisfied customers who leave before it would have paid. */
export const MODEL_PICKUP = { item: "owners" as ArchId, count: waitingCount(48000, GP_PER_CUSTOMER), month: R2_MONTHS };
/** The "they stay" sign for the delighted group: expected leavers in six months, and the count that proves the assumption wrong. */
export const DELIGHTED_EXPECTED = expectedLeavers(NETSOL.delighted.customers, NETSOL.delighted.churn, R2_MONTHS);
export const DELIGHTED_WRONG_AT = Math.floor(DELIGHTED_EXPECTED) + 1;
export const R2_BASELINE_NOTE = bi({ v: t("Baselines are Case assumptions from NetSolutions' last customer survey and contract data.", "Die Ausgangswerte sind Fallannahmen aus der letzten Kundenbefragung und den Vertragsdaten von NetSolutions.") });
/** The board's challenge: two large satisfied customers leave in month 3. */
export const CHALLENGE_LOST = 2;
export const BOARD_CHALLENGE = bi({
  v: t(
    "It is month 3. The shared view and the playbook are running. Then two large satisfied customers announce they will leave anyway, both citing a competitor's personal account team. The Head of Sales wants to stop the success reviews and give their budget to the top seller's personal visits. The board asks what you do.",
    "Es ist Monat 3. Gemeinsame Sicht und Playbook laufen. Dann kündigen zwei große zufriedene Kunden an, trotzdem zu gehen, beide mit Verweis auf das persönliche Account-Team eines Wettbewerbers. Die Vertriebsleitung will die Success-Reviews stoppen und ihr Budget den persönlichen Besuchen des besten Verkäufers geben. Der Vorstand fragt, was Sie tun.",
  ),
});
