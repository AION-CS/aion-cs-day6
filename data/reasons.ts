import { bi, t } from "@/lib/lang";

/**
 * Task 1 · Block 1.1. Nine reasons NetSolutions' customers gave, in account reviews and exit calls, for why they feel little attachment
 * although the service works. The learner sorts them into the three areas the plan names: relationship, communication, added value
 * (Materi A3). `truth` is never shown to the learner outside the mentor answer key.
 */
export type AreaTag = "rel" | "comm" | "value";
export const AREA_TAGS = bi([
  { id: "rel" as AreaTag, label: t("Relationship", "Beziehung"), hint: t("About the people: who the customer knows, and who knows the customer.", "Über die Menschen: wen der Kunde kennt, und wer den Kunden kennt.") },
  { id: "comm" as AreaTag, label: t("Communication", "Kommunikation"), hint: t("About what NetSolutions tells the customer, when and how.", "Darüber, was NetSolutions dem Kunden sagt, wann und wie.") },
  { id: "value" as AreaTag, label: t("Added value", "Mehrwert"), hint: t("About what the customer gains beyond the contracted service.", "Darüber, was der Kunde über die vertragliche Leistung hinaus gewinnt.") },
]);
export const AREA_LABEL = bi({ rel: t("Relationship", "Beziehung"), comm: t("Communication", "Kommunikation"), value: t("Added value", "Mehrwert") });

export type ReasonId = "r1" | "r2" | "r3" | "r4" | "r5" | "r6" | "r7" | "r8" | "r9";
export type Reason = { id: ReasonId; quote: string; truth: AreaTag; clue: string; why: string; rejected: Partial<Record<AreaTag, string>> };

export const REASONS: Reason[] = bi([
  {
    id: "r1" as ReasonId,
    quote: t("“We have had four different account managers in two years. Nobody at NetSolutions knows our history.”", "„Wir hatten in zwei Jahren vier verschiedene Account Manager. Niemand bei NetSolutions kennt unsere Geschichte.“"),
    truth: "rel" as AreaTag,
    clue: t("Is the complaint about a person the customer knows, or about a message it receives?", "Geht es um eine Person, die der Kunde kennt, oder um eine Nachricht, die er bekommt?"),
    why: t("Four contacts in two years means no one the customer knows and who knows the customer. That is the relationship.", "Vier Ansprechpartner in zwei Jahren heißt: niemand, den der Kunde kennt und der den Kunden kennt. Das ist die Beziehung."),
    rejected: { comm: t("No message is missing; the person is.", "Es fehlt keine Nachricht, es fehlt die Person.") },
  },
  {
    id: "r2" as ReasonId,
    quote: t("“Nobody from NetSolutions has visited us since the contract was signed.”", "„Seit der Vertragsunterzeichnung hat uns niemand von NetSolutions besucht.“"),
    truth: "rel" as AreaTag,
    clue: t("Would a better email fix this, or does it need a person?", "Würde eine bessere E-Mail das lösen, oder braucht es eine Person?"),
    why: t("The customer misses personal contact after the signature. It is about being known, not about information.", "Der Kunde vermisst den persönlichen Kontakt nach der Unterschrift. Es geht ums Gekanntwerden, nicht um Information."),
    rejected: { value: t("The customer does not ask for more service, only for someone to show up.", "Der Kunde verlangt keine zusätzliche Leistung, nur dass jemand vorbeikommt.") },
  },
  {
    id: "r3" as ReasonId,
    quote: t("“When we had a problem, we opened a ticket and got a ticket number. Never a name.”", "„Als wir ein Problem hatten, haben wir ein Ticket eröffnet und eine Ticketnummer bekommen. Nie einen Namen.“"),
    truth: "rel" as AreaTag,
    clue: t("What is missing in the answer: information, or a person?", "Was fehlt in der Antwort: Information oder eine Person?"),
    why: t("“A number, never a name” is about the missing person behind the service, the core of a relationship.", "„Eine Nummer, nie ein Name“ handelt von der fehlenden Person hinter dem Service, dem Kern einer Beziehung."),
    rejected: { comm: t("The ticket system did communicate; what hurt was that no person did.", "Das Ticketsystem hat kommuniziert; was wehtat, war, dass keine Person es tat.") },
  },
  {
    id: "r4" as ReasonId,
    quote: t("“We only hear from NetSolutions when an invoice or a renewal is due.”", "„Wir hören von NetSolutions nur, wenn eine Rechnung oder eine Verlängerung ansteht.“"),
    truth: "comm" as AreaTag,
    clue: t("Is this about who the customer knows, or about when and why it is contacted?", "Geht es darum, wen der Kunde kennt, oder darum, wann und warum er kontaktiert wird?"),
    why: t("Contact only when money is due: the timing and the reason of the communication tell the customer it matters only as a payer.", "Kontakt nur, wenn Geld fällig ist: Zeitpunkt und Anlass der Kommunikation sagen dem Kunden, dass er nur als Zahler zählt."),
    rejected: { rel: t("There may be a contact person; the problem is what they get in touch about.", "Es mag einen Ansprechpartner geben; das Problem ist, worüber er sich meldet.") },
  },
  {
    id: "r5" as ReasonId,
    quote: t("“The monthly report is twenty pages of numbers. Nobody here reads it.”", "„Der Monatsbericht sind zwanzig Seiten Zahlen. Niemand hier liest ihn.“"),
    truth: "comm" as AreaTag,
    clue: t("Is something missing, or is it told in a way nobody uses?", "Fehlt etwas, oder wird es so erzählt, dass niemand es nutzt?"),
    why: t("The information exists but is told in a form nobody reads. That is how NetSolutions communicates.", "Die Information existiert, wird aber in einer Form erzählt, die niemand liest. So kommuniziert NetSolutions."),
    rejected: { value: t("The report could be valuable; the problem is how it is presented.", "Der Bericht könnte wertvoll sein; das Problem ist, wie er aufbereitet ist.") },
  },
  {
    id: "r6" as ReasonId,
    quote: t("“We learned about the planned maintenance from our own users, not from NetSolutions.”", "„Von der geplanten Wartung haben wir von unseren eigenen Nutzern erfahren, nicht von NetSolutions.“"),
    truth: "comm" as AreaTag,
    clue: t("Did the customer lack a person, a benefit, or being told in time?", "Fehlte dem Kunden eine Person, ein Nutzen, oder rechtzeitige Information?"),
    why: t("The customer was not told in time. That is a failure of communication.", "Der Kunde wurde nicht rechtzeitig informiert. Das ist ein Versagen der Kommunikation."),
    rejected: { rel: t("A relationship would help, but what is named here is a message that never came.", "Eine Beziehung würde helfen, aber genannt wird eine Nachricht, die nie kam.") },
  },
  {
    id: "r7" as ReasonId,
    quote: t("“The service works, but we could get the same from anyone.”", "„Der Service funktioniert, aber das bekämen wir überall.“"),
    truth: "value" as AreaTag,
    clue: t("Is the customer missing a person, a message, or something that makes NetSolutions different?", "Fehlt dem Kunden eine Person, eine Nachricht, oder etwas, das NetSolutions unterscheidet?"),
    why: t("Nothing sets NetSolutions apart from a replacement: no added value beyond the contract.", "Nichts hebt NetSolutions von einem Ersatz ab: kein Mehrwert über den Vertrag hinaus."),
    rejected: { comm: t("Better messages would not change that the offer is interchangeable.", "Bessere Nachrichten würden nicht ändern, dass das Angebot austauschbar ist.") },
  },
  {
    id: "r8" as ReasonId,
    quote: t("“Nobody ever told us how to use the platform better, or what similar companies do with it.”", "„Nie hat uns jemand gezeigt, wie wir die Plattform besser nutzen oder was ähnliche Firmen damit machen.“"),
    truth: "value" as AreaTag,
    clue: t("Is the missing thing a message about the service, or advice that would make the customer better off?", "Fehlt eine Nachricht über den Service, oder ein Rat, der den Kunden besser stellen würde?"),
    why: t("The customer wants advice that makes it better at its own work, beyond the contracted service. That is added value.", "Der Kunde will Rat, der ihn in seiner eigenen Arbeit besser macht, über die vertragliche Leistung hinaus. Das ist Mehrwert."),
    rejected: { comm: t("It is not about how NetSolutions talks but about what it could give.", "Es geht nicht darum, wie NetSolutions redet, sondern darum, was es geben könnte.") },
  },
  {
    id: "r9" as ReasonId,
    quote: t("“The competitor offered a free security review of our network. NetSolutions never suggested anything.”", "„Der Wettbewerber hat einen kostenlosen Sicherheits-Check unseres Netzes angeboten. NetSolutions hat nie etwas vorgeschlagen.“"),
    truth: "value" as AreaTag,
    clue: t("What did the competitor give that NetSolutions did not: a person, a message, or something useful?", "Was hat der Wettbewerber gegeben, das NetSolutions nicht gab: eine Person, eine Nachricht oder etwas Nützliches?"),
    why: t("The competitor offered something useful beyond the contract. The missing piece is added value.", "Der Wettbewerber bot etwas Nützliches über den Vertrag hinaus. Das fehlende Stück ist Mehrwert."),
    rejected: { rel: t("The competitor won attention with a useful offer, not with a personal tie.", "Der Wettbewerber gewann Aufmerksamkeit mit einem nützlichen Angebot, nicht mit einer persönlichen Bindung.") },
  },
]);
export const REASON_IDS: ReasonId[] = ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9"];

/** The tests taught in Materi A3 for each area, and the pair tests. */
export const AREA_TESTS = bi([
  { name: t("Relationship", "Beziehung"), test: t("Is it about the people: who the customer knows, trusts, and is known by?", "Geht es um die Menschen: wen der Kunde kennt, wem er vertraut, und wer ihn kennt?") },
  { name: t("Communication", "Kommunikation"), test: t("Is it about what NetSolutions tells the customer, when, and in what form?", "Geht es darum, was NetSolutions dem Kunden sagt, wann, und in welcher Form?") },
  { name: t("Added value", "Mehrwert"), test: t("Is it about what the customer gains beyond the contracted service?", "Geht es darum, was der Kunde über die vertragliche Leistung hinaus gewinnt?") },
  { name: t("Relationship or communication?", "Beziehung oder Kommunikation?"), test: t("Would a better message fix it? Then it is communication. Does it need a person the customer knows? Then it is the relationship.", "Würde eine bessere Nachricht es lösen? Dann ist es Kommunikation. Braucht es eine Person, die der Kunde kennt? Dann ist es die Beziehung.") },
  { name: t("Communication or added value?", "Kommunikation oder Mehrwert?"), test: t("Is the problem how something is told, or that nothing useful is given? The way you tell is communication; what you give is added value.", "Ist das Problem, wie etwas erzählt wird, oder dass nichts Nützliches gegeben wird? Wie man erzählt, ist Kommunikation; was man gibt, ist Mehrwert.") },
]);
