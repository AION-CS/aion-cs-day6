import { bi, t } from "@/lib/lang";

/**
 * Task 1 · Blocks 2.1 and 2.2. Four kinds of buying signal (Materi A5) and twelve observations from NetSolutions' current expansion and
 * renewal deals. Every name and figure is a Case assumption. `truth` is never printed outside the mentor answer key. Counts are 3/3/3/3;
 * the outcomes carry the lesson: every uncertainty signal stalled, because sales answered hesitation as if it were interest.
 */
export type SignalType = "interest" | "comparison" | "proximity" | "uncertainty";
export const SIGNAL_IDS: SignalType[] = ["interest", "comparison", "proximity", "uncertainty"];

export const SIGNALS = bi({
  interest: {
    id: "interest" as SignalType,
    label: t("Interest", "Interesse"),
    means: t("The buyer imagines using it: detail questions about how it would work for them.", "Der Käufer stellt sich die Nutzung vor: Detailfragen dazu, wie es für ihn funktionieren würde."),
    sounds: t("“How would the rollout to our second site work?”, “Who could get admin rights?”", "„Wie würde der Rollout an unserem zweiten Standort laufen?“, „Wer bekäme Admin-Rechte?“"),
    test: t("Does the question move the buyer towards using it?", "Bringt die Frage den Käufer näher an die Nutzung?"),
    response: t("Answer in depth and offer the next concrete step: a tailored demo or a trial with their own data.", "Ausführlich antworten und den nächsten konkreten Schritt anbieten: eine zugeschnittene Demo oder einen Test mit eigenen Daten."),
  },
  comparison: {
    id: "comparison" as SignalType,
    label: t("Comparison", "Vergleich"),
    means: t("The buyer weighs options against each other: feature lists, prices, evaluation matrices.", "Der Käufer wägt Optionen gegeneinander ab: Funktionslisten, Preise, Bewertungsmatrizen."),
    sounds: t("“Where do you differ from provider X?”, “Please fill in our evaluation matrix.”", "„Wo unterscheiden Sie sich von Anbieter X?“, „Bitte füllen Sie unsere Bewertungsmatrix aus.“"),
    test: t("Is the buyer putting you side by side with another option?", "Stellt der Käufer Sie neben eine andere Option?"),
    response: t("Give a fair side-by-side comparison and a reference from a comparable customer.", "Einen fairen Vergleich nebeneinander liefern und eine Referenz eines vergleichbaren Kunden."),
  },
  proximity: {
    id: "proximity" as SignalType,
    label: t("Decision proximity", "Entscheidungsnähe"),
    means: t("The buyer talks about when, who and how much: budget, timing, signatures, a start date.", "Der Käufer spricht über wann, wer und wie viel: Budget, Zeitplan, Unterschriften, ein Startdatum."),
    sounds: t("“Does the price hold until our budget is released?”, “Who signs on your side?”", "„Gilt der Preis, bis unser Budget freigegeben ist?“, „Wer unterschreibt bei Ihnen?“"),
    test: t("Is the buyer asking about the decision itself: budget, timing, who signs?", "Fragt der Käufer nach der Entscheidung selbst: Budget, Zeitplan, wer unterschreibt?"),
    response: t("Propose a decision plan: the timeline, the signatories, and what happens in week one.", "Einen Entscheidungsplan vorschlagen: den Zeitplan, die Unterzeichnenden, und was in Woche eins passiert."),
  },
  uncertainty: {
    id: "uncertainty" as SignalType,
    label: t("Uncertainty", "Unsicherheit"),
    means: t("The buyer hesitates: postpones without a reason, asks how to get out, repeats “we need to check”. It looks like interest and is the opposite.", "Der Käufer zögert: verschiebt ohne Grund, fragt, wie man wieder herauskommt, wiederholt „wir müssen prüfen“. Es sieht aus wie Interesse und ist das Gegenteil."),
    sounds: t("“What happens to our data if it fails?”, “We need to check internally once more.”", "„Was passiert mit unseren Daten, wenn es scheitert?“, „Wir müssen intern noch einmal prüfen.“"),
    test: t("Is the buyer protecting itself against the decision, rather than moving towards it?", "Schützt sich der Käufer gegen die Entscheidung, statt auf sie zuzugehen?"),
    response: t("Name the concern and make the risk smaller: a pilot, exit terms, or a call with a customer who had the same doubt.", "Die Sorge ansprechen und das Risiko verkleinern: ein Pilot, Ausstiegsklauseln oder ein Gespräch mit einem Kunden, der dieselben Zweifel hatte."),
  },
});

export const SIGNAL_PAIR_TESTS = bi([
  { pair: t("Interest or uncertainty?", "Interesse oder Unsicherheit?"), test: t("Both come as detailed questions. Ask where the question leads: towards using it (“how would it work for us?”) is interest; towards protecting oneself (“what if it fails, how do we get out?”) is uncertainty.", "Beides kommt als Detailfrage. Fragen Sie, wohin die Frage führt: zur Nutzung („wie würde es bei uns laufen?“) ist Interesse; zum Selbstschutz („was, wenn es scheitert, wie kommen wir raus?“) ist Unsicherheit.") },
  { pair: t("Comparison or uncertainty?", "Vergleich oder Unsicherheit?"), test: t("Comparing weighs you against a named alternative. Uncertainty hesitates about deciding at all, with no alternative in view.", "Vergleichen wägt Sie gegen eine benannte Alternative ab. Unsicherheit zögert, überhaupt zu entscheiden, ohne Alternative im Blick.") },
  { pair: t("Decision proximity or interest?", "Entscheidungsnähe oder Interesse?"), test: t("How it works is interest. When, who and how much is decision proximity.", "Wie es funktioniert, ist Interesse. Wann, wer und wie viel ist Entscheidungsnähe.") },
]);

export type ObsId = "o01" | "o02" | "o03" | "o04" | "o05" | "o06" | "o07" | "o08" | "o09" | "o10" | "o11" | "o12";
export type Observation = { id: ObsId; deal: string; kind: string; outcome: "won" | "stalled"; text: string; truth: SignalType; clue: string; why: string; rejected: Partial<Record<SignalType, string>> };
export const OUTCOME_LABEL = bi({ won: t("Won", "Gewonnen"), stalled: t("Stalled", "Stockt") });

export const OBSERVATIONS: Observation[] = bi([
  { id: "o01" as ObsId, deal: "Hafenlog GmbH", kind: t("Expansion", "Erweiterung"), outcome: "won" as const, text: t("After the demo, asked how the rollout to their second site would work in the first week.", "Fragte nach der Demo, wie der Rollout am zweiten Standort in der ersten Woche laufen würde."), truth: "interest" as SignalType, clue: t("Does the question picture using the service, or protecting against it?", "Stellt sich die Frage die Nutzung vor, oder den Schutz davor?"), why: t("Picturing the first week at the second site is imagining use: interest.", "Sich die erste Woche am zweiten Standort vorzustellen, ist Nutzung ausmalen: Interesse."), rejected: { proximity: t("It is about how, not about when or who signs.", "Es geht um das Wie, nicht um Wann oder Wer unterschreibt.") } },
  { id: "o02" as ObsId, deal: "Brandt Medizintechnik", kind: t("Renewal", "Verlängerung"), outcome: "won" as const, text: t("Asked three follow-up questions about the backup restore time after the review.", "Stellte nach dem Review drei Nachfragen zur Wiederherstellungszeit der Backups."), truth: "interest" as SignalType, clue: t("Follow-up questions about how it works: towards use, or away from the decision?", "Nachfragen dazu, wie es funktioniert: hin zur Nutzung, oder weg von der Entscheidung?"), why: t("Detailed follow-up questions about how the service performs for them: interest.", "Detaillierte Nachfragen dazu, wie der Service für sie arbeitet: Interesse."), rejected: { uncertainty: t("It asks how it works, not what happens if it fails or how to leave.", "Es fragt, wie es funktioniert, nicht was passiert, wenn es scheitert, oder wie man aussteigt.") } },
  { id: "o03" as ObsId, deal: "Keller Bau AG", kind: t("Expansion", "Erweiterung"), outcome: "stalled" as const, text: t("Wanted to know which of their users could get admin rights in the new module.", "Wollte wissen, welche ihrer Nutzer im neuen Modul Admin-Rechte bekommen könnten."), truth: "interest" as SignalType, clue: t("Who would use it, and how: is that about deciding, or about using?", "Wer würde es nutzen, und wie: Geht es ums Entscheiden oder ums Nutzen?"), why: t("Planning who uses the module is imagining use: interest. It stalled because nobody offered a next step.", "Zu planen, wer das Modul nutzt, ist Nutzung ausmalen: Interesse. Es stockte, weil niemand einen nächsten Schritt anbot."), rejected: { proximity: t("“Who” here means users, not signatories.", "„Wer“ meint hier Nutzer, nicht Unterzeichnende.") } },
  { id: "o04" as ObsId, deal: "Lindner Logistik", kind: t("Renewal", "Verlängerung"), outcome: "stalled" as const, text: t("Sent us the feature list of a competitor and asked where exactly we differ.", "Schickte uns die Funktionsliste eines Wettbewerbers und fragte, wo genau wir uns unterscheiden."), truth: "comparison" as SignalType, clue: t("Is a named alternative on the table?", "Liegt eine benannte Alternative auf dem Tisch?"), why: t("A competitor's list side by side with ours: comparison.", "Die Liste eines Wettbewerbers neben unserer: Vergleich."), rejected: { uncertainty: t("The buyer is weighing a named alternative, not hesitating about deciding at all.", "Der Käufer wägt eine benannte Alternative ab, statt überhaupt zu zögern.") } },
  { id: "o05" as ObsId, deal: "Sommer Versand", kind: t("Renewal", "Verlängerung"), outcome: "won" as const, text: t("Asked for our price per user next to the offer from their current provider.", "Bat um unseren Preis pro Nutzer neben dem Angebot ihres aktuellen Anbieters."), truth: "comparison" as SignalType, clue: t("Is the price question about budget timing, or about putting two offers side by side?", "Geht es bei der Preisfrage um Budget und Zeitpunkt, oder darum, zwei Angebote nebeneinanderzulegen?"), why: t("Two prices side by side: comparison.", "Zwei Preise nebeneinander: Vergleich."), rejected: { proximity: t("It asks how the prices compare, not when the budget is free.", "Es fragt, wie die Preise sich vergleichen, nicht wann das Budget frei ist.") } },
  { id: "o06" as ObsId, deal: "Westfalen Textil", kind: t("Expansion", "Erweiterung"), outcome: "stalled" as const, text: t("Asked us to fill in their evaluation matrix together with three other providers.", "Bat uns, ihre Bewertungsmatrix zusammen mit drei anderen Anbietern auszufüllen."), truth: "comparison" as SignalType, clue: t("What is the matrix for?", "Wozu dient die Matrix?"), why: t("An evaluation matrix with four providers is a structured comparison.", "Eine Bewertungsmatrix mit vier Anbietern ist ein strukturierter Vergleich."), rejected: { interest: t("It does not picture using our service; it ranks it against others.", "Es malt nicht die Nutzung unseres Services aus; es ordnet ihn gegen andere ein.") } },
  { id: "o07" as ObsId, deal: "Nordwerk Energie", kind: t("Renewal", "Verlängerung"), outcome: "won" as const, text: t("Asked whether the price holds if they sign before the end of the quarter, when their budget is released.", "Fragte, ob der Preis gilt, wenn sie vor Quartalsende unterschreiben, wenn ihr Budget freigegeben wird."), truth: "proximity" as SignalType, clue: t("Is it about how it works, or about when and with what money?", "Geht es darum, wie es funktioniert, oder darum, wann und mit welchem Geld?"), why: t("Budget release and a signing date: the buyer is close to deciding.", "Budgetfreigabe und ein Unterschriftstermin: Der Käufer ist nah an der Entscheidung."), rejected: { comparison: t("No alternative is named; the question is about their own budget and timing.", "Keine Alternative wird genannt; die Frage betrifft das eigene Budget und den Zeitpunkt.") } },
  { id: "o08" as ObsId, deal: "Rhein Ärztenetz", kind: t("Expansion", "Erweiterung"), outcome: "won" as const, text: t("Asked who on our side signs the contract and when their legal team could review it.", "Fragte, wer bei uns den Vertrag unterschreibt und wann ihre Rechtsabteilung ihn prüfen könnte."), truth: "proximity" as SignalType, clue: t("Signatures and a legal review: is that interest in the product, or the decision under way?", "Unterschriften und eine Rechtsprüfung: Ist das Interesse am Produkt, oder die laufende Entscheidung?"), why: t("Who signs and when legal reviews: the decision is under way.", "Wer unterschreibt und wann die Rechtsabteilung prüft: Die Entscheidung läuft."), rejected: { uncertainty: t("A legal review is a normal step towards signing, not a hesitation.", "Eine Rechtsprüfung ist ein normaler Schritt zur Unterschrift, kein Zögern.") } },
  { id: "o09" as ObsId, deal: "Alpha Druck", kind: t("Renewal", "Verlängerung"), outcome: "stalled" as const, text: t("Asked for a start date so the migration fits before their holiday freeze in December.", "Bat um ein Startdatum, damit die Migration vor ihren Weihnachts-Freeze im Dezember passt."), truth: "proximity" as SignalType, clue: t("A start date is about timing: how close is this buyer?", "Ein Startdatum betrifft den Zeitplan: Wie nah ist dieser Käufer?"), why: t("Planning a start date around a freeze: the buyer is close. It stalled because no decision plan followed.", "Ein Startdatum um einen Freeze herum planen: Der Käufer ist nah dran. Es stockte, weil kein Entscheidungsplan folgte."), rejected: { interest: t("It is about when, not about how it works.", "Es geht um das Wann, nicht um das Wie.") } },
  { id: "o10" as ObsId, deal: "Hofmann Pharma", kind: t("Renewal", "Verlängerung"), outcome: "stalled" as const, text: t("Said “we are happy in general” but postponed the decision meeting twice without giving a reason.", "Sagte „wir sind im Großen und Ganzen zufrieden“, verschob aber das Entscheidungsmeeting zweimal ohne Grund."), truth: "uncertainty" as SignalType, clue: t("Friendly words, and a meeting moved twice: towards the decision, or away from it?", "Freundliche Worte, und ein zweimal verschobenes Meeting: hin zur Entscheidung oder weg davon?"), why: t("Postponing twice without a reason, despite friendly words, is hesitation: uncertainty.", "Zweimal ohne Grund zu verschieben, trotz freundlicher Worte, ist Zögern: Unsicherheit."), rejected: { proximity: t("A decision meeting exists, but it is moving away, not closer.", "Ein Entscheidungsmeeting existiert, aber es rückt weg, nicht näher.") } },
  { id: "o11" as ObsId, deal: "Stadtwerke Lahn", kind: t("Expansion", "Erweiterung"), outcome: "stalled" as const, text: t("Asked what happens to their data if the project fails, and whether they could leave after six months.", "Fragte, was mit ihren Daten passiert, wenn das Projekt scheitert, und ob sie nach sechs Monaten aussteigen könnten."), truth: "uncertainty" as SignalType, clue: t("A detailed question: does it lead towards using it, or towards getting out?", "Eine Detailfrage: Führt sie zur Nutzung, oder zum Ausstieg?"), why: t("What if it fails, how do we leave: the buyer is protecting itself. Uncertainty, dressed as a detail question.", "Was, wenn es scheitert, wie kommen wir raus: Der Käufer schützt sich. Unsicherheit, verkleidet als Detailfrage."), rejected: { interest: t("It is a detail question, but about the exit, not about using it.", "Es ist eine Detailfrage, aber über den Ausstieg, nicht über die Nutzung.") } },
  { id: "o12" as ObsId, deal: "Vogt Maschinen", kind: t("Renewal", "Verlängerung"), outcome: "stalled" as const, text: t("After every call the contact said she needs to “check internally once more”, with no new questions.", "Nach jedem Gespräch sagte die Ansprechpartnerin, sie müsse „intern noch einmal prüfen“, ohne neue Fragen."), truth: "uncertainty" as SignalType, clue: t("Checking again with no new questions: what does that show?", "Erneut prüfen, ohne neue Fragen: Was zeigt das?"), why: t("Repeated checking with no new questions is a buyer not ready to stand behind the decision: uncertainty.", "Wiederholtes Prüfen ohne neue Fragen ist eine Käuferin, die noch nicht hinter der Entscheidung stehen kann: Unsicherheit."), rejected: { comparison: t("No alternative is mentioned; the hesitation is about deciding at all.", "Keine Alternative wird genannt; das Zögern betrifft das Entscheiden an sich.") } },
]);
export const OBS_BY_ID = Object.fromEntries(OBSERVATIONS.map((o) => [o.id, o])) as Record<ObsId, Observation>;
export const OBS_IDS: ObsId[] = ["o01", "o02", "o03", "o04", "o05", "o06", "o07", "o08", "o09", "o10", "o11", "o12"];

const zero = () => ({ interest: 0, comparison: 0, proximity: 0, uncertainty: 0 }) as Record<SignalType, number>;
export const TRUTH_COUNTS: Record<SignalType, number> = OBSERVATIONS.reduce((o, x) => ({ ...o, [x.truth]: o[x.truth] + 1 }), zero());
export const TRUTH_STALLED: Record<SignalType, number> = OBSERVATIONS.reduce((o, x) => ({ ...o, [x.truth]: o[x.truth] + (x.outcome === "stalled" ? 1 : 0) }), zero());

/* ------------------------------------------------------------------ Block 2.2 · a simple retention system */

export type ResponseId = "next" | "compare" | "plan" | "reduce" | "discount";
export const RESPONSES = bi([
  { id: "next" as ResponseId, label: t("Answer in depth and offer the next concrete step (a tailored demo, a trial with their data)", "Ausführlich antworten und den nächsten konkreten Schritt anbieten (zugeschnittene Demo, Test mit eigenen Daten)") },
  { id: "compare" as ResponseId, label: t("Give a fair side-by-side comparison and a reference from a comparable customer", "Einen fairen Vergleich und eine Referenz eines vergleichbaren Kunden liefern") },
  { id: "plan" as ResponseId, label: t("Propose a decision plan: timeline, signatories, week one", "Einen Entscheidungsplan vorschlagen: Zeitplan, Unterzeichnende, Woche eins") },
  { id: "reduce" as ResponseId, label: t("Name the concern and make the risk smaller (a pilot, exit terms, a peer call)", "Die Sorge ansprechen und das Risiko verkleinern (Pilot, Ausstiegsklauseln, Gespräch mit einem Kunden)") },
  { id: "discount" as ResponseId, label: t("Offer a discount to speed up the decision", "Einen Rabatt anbieten, um die Entscheidung zu beschleunigen") },
]);
export const RESPONSE_TRUTH: Record<SignalType, ResponseId> = { interest: "next", comparison: "compare", proximity: "plan", uncertainty: "reduce" };

export type TeamId = "sales" | "service" | "marketing";
export const TEAMS = bi({ sales: t("Sales", "Vertrieb"), service: t("Service", "Service"), marketing: t("Marketing", "Marketing") });
export const TEAM_IDS: TeamId[] = ["sales", "service", "marketing"];
/** The teams that defend as owner of the response to each signal type (reference answer). */
export const TEAM_ACCEPT: Record<SignalType, TeamId[]> = { interest: ["sales"], comparison: ["sales"], proximity: ["sales"], uncertainty: ["sales", "service"] };

export type WeakId = "owner" | "invoice" | "hesitation" | "handover" | "uptime" | "price" | "features";
export const WEAKNESSES = bi([
  { id: "owner" as WeakId, label: t("No named person owns the relationship after the contract is signed", "Nach der Unterschrift ist keine Person für die Beziehung zuständig"), real: true, why: t("Four account managers in two years, no visits: nobody owns the tie. It is the root of the missing attachment.", "Vier Account Manager in zwei Jahren, keine Besuche: Niemand hält die Bindung. Das ist die Wurzel der fehlenden Bindung.") },
  { id: "invoice" as WeakId, label: t("Contact only at invoices and renewals", "Kontakt nur bei Rechnungen und Verlängerungen"), real: true, why: t("Customers hear from NetSolutions only when money is due, so the relationship feels transactional.", "Kunden hören nur von NetSolutions, wenn Geld fällig ist, also fühlt sich die Beziehung transaktional an.") },
  { id: "hesitation" as WeakId, label: t("Hesitation signals get no response", "Signale der Unsicherheit bekommen keine Antwort"), real: true, why: t("All three uncertainty signals stalled: sales treated them like interest and waited. That is reacting instead of managing.", "Alle drei Unsicherheitssignale stockten: Der Vertrieb behandelte sie wie Interesse und wartete. Das ist Reagieren statt Steuern.") },
  { id: "handover" as WeakId, label: t("Sales and service do not hand the customer over to each other", "Vertrieb und Service übergeben den Kunden nicht aneinander"), real: true, why: t("The ticket number without a name and the maintenance nobody announced show two teams that do not share the customer.", "Die Ticketnummer ohne Namen und die Wartung, die niemand ankündigte, zeigen zwei Teams, die den Kunden nicht teilen.") },
  { id: "uptime" as WeakId, label: t("The platform's uptime is too low", "Die Verfügbarkeit der Plattform ist zu niedrig"), real: false, why: t("Customers rate the service 4 of 5 and nobody complains about uptime. Performance is not the weakness.", "Kunden bewerten den Service mit 4 von 5, und niemand beklagt die Verfügbarkeit. Die Leistung ist nicht die Schwäche.") },
  { id: "price" as WeakId, label: t("Prices are above the market", "Die Preise liegen über dem Markt"), real: false, why: t("Price is named in none of the reasons; customers leave while satisfied with the service, not because it is dear.", "Der Preis wird in keinem Grund genannt; Kunden gehen, obwohl sie mit dem Service zufrieden sind, nicht weil er teuer ist.") },
  { id: "features" as WeakId, label: t("The product has too few features", "Das Produkt hat zu wenige Funktionen"), real: false, why: t("“The service works” is the customers' own verdict. More features would not create attachment.", "„Der Service funktioniert“ ist das eigene Urteil der Kunden. Mehr Funktionen würden keine Bindung schaffen.") },
]);
export const WEAK_BY_ID = Object.fromEntries(WEAKNESSES.map((w) => [w.id, w])) as Record<WeakId, (typeof WEAKNESSES)[number]>;

/** The decisive phrase inside each observation's own text, for "Highlight the key words" (never which signal type, CLAUDE.md #4). */
export const OBS_KEY: Record<ObsId, string> = bi({
  o01: t("how the rollout to their second site would work", "wie der Rollout am zweiten Standort in der ersten Woche laufen würde"),
  o02: t("follow-up questions about the backup restore time", "Nachfragen zur Wiederherstellungszeit der Backups"),
  o03: t("which of their users could get admin rights", "welche ihrer Nutzer im neuen Modul Admin-Rechte bekommen könnten"),
  o04: t("the feature list of a competitor", "die Funktionsliste eines Wettbewerbers"),
  o05: t("next to the offer from their current provider", "neben dem Angebot ihres aktuellen Anbieters"),
  o06: t("together with three other providers", "zusammen mit drei anderen Anbietern"),
  o07: t("if they sign before the end of the quarter", "wenn sie vor Quartalsende unterschreiben"),
  o08: t("who on our side signs the contract", "wer bei uns den Vertrag unterschreibt"),
  o09: t("Asked for a start date", "Bat um ein Startdatum"),
  o10: t("postponed the decision meeting twice without giving a reason", "verschob aber das Entscheidungsmeeting zweimal ohne Grund"),
  o11: t("if the project fails, and whether they could leave", "wenn das Projekt scheitert, und ob sie nach sechs Monaten aussteigen könnten"),
  o12: t("with no new questions", "ohne neue Fragen"),
});
