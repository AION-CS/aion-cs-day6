import type { ArchId } from "@/data/route2";
import { bi, t } from "@/lib/lang";

/**
 * The ready-to-use parts of a trigger and of a pickup point (Block 3.5), written so the learner can put each one into the sentence and
 * learn from its reason while doing it (user decision on Day 6 Route 2, 2026-09-30; CLAUDE.md #44). The number and the month are not
 * here: they come from `numberView` (lib/calcR2.ts) so they cannot drift from the model answers. Case assumptions.
 *
 * - `metric`: what is counted, phrased so it fits "If … is below N by month M". It is about customers, not about the team's activity.
 * - `actions`: things the owner can do alone that change this one item, never the whole system (Materi B5); the first one of each of the
 *   five model items is the model trigger's own action.
 * - `reason`: why customers would leave when this item is missing, for the pickup point of an item that is left out.
 */
export type TriggerKit = {
  id: ArchId;
  metric: string;
  metricWhy: string;
  actions: { text: string; why: string }[];
  reason: string;
};

export const TRIGGER_KIT_LIST: TriggerKit[] = bi([
  {
    id: "view" as ArchId,
    metric: t("the share of customers with a complete shared record", "der Anteil der Kunden mit vollständigem gemeinsamem Datensatz"),
    metricWhy: t(
      "The shared view exists so every team can see every customer and every open signal. Its success is how many customers have a complete record, not how many meetings were held about it.",
      "Die gemeinsame Kundensicht soll jedem Team jeden Kunden und jedes offene Signal zeigen. Ihr Erfolg ist, wie viele Kunden einen vollständigen Datensatz haben, nicht wie viele Meetings darüber stattfanden.",
    ),
    actions: [
      {
        text: t("the playbook waits and the records are completed first", "wartet das Playbook, und zuerst werden die Datensätze vervollständigt"),
        why: t(
          "Every other item reads this record. Running the playbook on a record with gaps only produces unanswered signals, so the baseline is fixed before anything else moves. The Head of Sales Operations can do this alone.",
          "Jeder andere Punkt liest diesen Datensatz. Das Playbook auf Lücken laufen zu lassen, erzeugt nur unbeantwortete Signale; also wird zuerst die Baseline behoben. Die Leitung Sales Operations kann das allein tun.",
        ),
      },
      {
        text: t("the Head of Sales Operations makes the key fields required in the CRM and adds a weekly clean-up", "macht die Leitung Sales Operations die wichtigen Felder im CRM zu Pflichtfeldern und führt eine wöchentliche Bereinigung ein"),
        why: t(
          "Required fields stop new gaps, and a clean-up closes the old ones. It changes this one item and nothing else.",
          "Pflichtfelder verhindern neue Lücken, eine Bereinigung schließt die alten. Es ändert nur diesen einen Punkt.",
        ),
      },
      {
        text: t("each account manager completes the records of their open customers within two weeks", "vervollständigt jeder Account Manager innerhalb von zwei Wochen die Datensätze seiner offenen Kunden"),
        why: t(
          "The open-deal customers are the ones the playbook needs first, and the people who know them can fill the gaps fastest.",
          "Die Kunden mit offenem Deal braucht das Playbook zuerst, und die Menschen, die sie kennen, füllen die Lücken am schnellsten.",
        ),
      },
    ],
    reason: t("their records were incomplete, so nobody saw their signals", "ihre Datensätze unvollständig waren und niemand ihre Signale sah"),
  },
  {
    id: "playbook" as ArchId,
    metric: t("the number of stalled deals that have moved forward", "die Zahl der stockenden Deals, die weitergekommen sind"),
    metricWhy: t(
      "The playbook is meant to get stuck deals moving. Count the deals that moved, not the signals logged: logging is your own activity, a deal that moves is the customer's response.",
      "Das Playbook soll festgefahrene Deals in Bewegung bringen. Zählen Sie die Deals, die weitergekommen sind, nicht die erfassten Signale: Erfassen ist Ihre eigene Aktivität, ein Deal in Bewegung ist die Reaktion des Kunden.",
    ),
    actions: [
      {
        text: t("the Head of Sales reviews who owns which signal", "prüft die Vertriebsleitung, wer welches Signal verantwortet"),
        why: t(
          "Deals stall when nobody owns the answer. The Head of Sales assigns the owners, so this is something the owner can change alone.",
          "Deals stocken, wenn niemand die Antwort verantwortet. Die Vertriebsleitung legt die Owner fest, das kann der Owner also allein ändern.",
        ),
      },
      {
        text: t("the Head of Sales moves the answer to uncertainty signals to the same day", "zieht die Vertriebsleitung die Antwort auf Unsicherheitssignale auf denselben Tag vor"),
        why: t(
          "Uncertainty cools fastest of the four signal types, so the tightest rule goes there first. It changes one setting of this item.",
          "Unsicherheit kühlt von den vier Signalarten am schnellsten ab, also kommt die engste Regel zuerst dorthin. Es ändert eine Einstellung dieses Punkts.",
        ),
      },
      {
        text: t("the Head of Sales Operations checks that every logged signal is assigned an owner automatically", "prüft die Leitung Sales Operations, dass jedes erfasste Signal automatisch einen Owner bekommt"),
        why: t(
          "A signal without an owner is the exact failure the playbook exists to remove, and the CRM rule is in the owner's hands.",
          "Ein Signal ohne Owner ist genau der Fehler, den das Playbook beseitigen soll, und die CRM-Regel liegt in der Hand des Owners.",
        ),
      },
    ],
    reason: t("a signal of theirs was not answered in time", "ein Signal von ihnen nicht rechtzeitig beantwortet wurde"),
  },
  {
    id: "handover" as ArchId,
    metric: t("the number of customers with a joint handover who rate us 5 of 5", "die Zahl der Kunden mit gemeinsamer Übergabe, die uns mit 5 von 5 bewerten"),
    metricWhy: t(
      "The handover is meant to show the customer a named team that knows its story. The effect is customers who feel that, so count the ones who now rate you 5 of 5.",
      "Die Übergabe soll dem Kunden ein benanntes Team zeigen, das seine Geschichte kennt. Die Wirkung sind Kunden, die das spüren, zählen Sie also die, die Sie jetzt mit 5 von 5 bewerten.",
    ),
    actions: [
      {
        text: t("the handover becomes a required step in the CRM", "wird die Übergabe ein Pflichtschritt im CRM"),
        why: t(
          "If it only happens when someone remembers, it depends on people. A required step makes it a process, and the owner can set that alone.",
          "Wenn sie nur stattfindet, wenn jemand daran denkt, hängt sie an Menschen. Ein Pflichtschritt macht sie zum Prozess, und der Owner kann ihn allein setzen.",
        ),
      },
      {
        text: t("the Head of Service joins every handover meeting in person", "nimmt die Service-Leitung an jedem Übergabetermin persönlich teil"),
        why: t(
          "The customer should meet the person who will look after it. The Head of Service decides who attends.",
          "Der Kunde soll die Person kennenlernen, die ihn betreut. Die Service-Leitung entscheidet, wer teilnimmt.",
        ),
      },
      {
        text: t("the salesperson and the service lead send the customer a one-page summary of its history the same day", "schicken Verkäufer und Service-Leitung dem Kunden am selben Tag eine einseitige Zusammenfassung seiner Historie"),
        why: t(
          "It proves that the team knows the customer's story, which is what the handover is for.",
          "Es beweist, dass das Team die Geschichte des Kunden kennt, wofür die Übergabe da ist.",
        ),
      },
    ],
    reason: t("nobody who knew their story was there at go-live", "beim Go-live niemand da war, der ihre Geschichte kannte"),
  },
  {
    id: "reviews" as ArchId,
    metric: t("the number of reviewed customers who have moved from 4 to 5 of 5", "die Zahl der Kunden mit Review, die von 4 auf 5 von 5 gestiegen sind"),
    metricWhy: t(
      "The review is meant to give customers advice beyond the contract. If it works, satisfied customers move up to 5 of 5; the number of reviews held would only count your own effort.",
      "Das Review soll Kunden Rat über den Vertrag hinaus geben. Wenn es wirkt, steigen zufriedene Kunden auf 5 von 5; die Zahl der gehaltenen Reviews würde nur Ihren eigenen Aufwand zählen.",
    ),
    actions: [
      {
        text: t("the review is shortened to one hour and a template", "wird das Review auf eine Stunde und eine Vorlage gekürzt"),
        why: t(
          "If the review does not move customers, the cheapest change is to make it lighter, not to drop it. The Head of Service owns the reviews and can change the format alone.",
          "Wenn das Review Kunden nicht bewegt, ist die günstigste Änderung, es leichter zu machen, nicht, es zu streichen. Die Service-Leitung verantwortet die Reviews und kann das Format allein ändern.",
        ),
      },
      {
        text: t("the Head of Service replaces the benchmark section with one concrete recommendation per customer", "ersetzt die Service-Leitung den Benchmark-Teil durch eine konkrete Empfehlung pro Kunde"),
        why: t(
          "Customers value advice they can use (relevance). One concrete recommendation is easier to act on than a table.",
          "Kunden schätzen Rat, den sie nutzen können (Relevanz). Eine konkrete Empfehlung lässt sich leichter umsetzen als eine Tabelle.",
        ),
      },
      {
        text: t("the Head of Service holds the next reviews for the largest customers first", "hält die Service-Leitung die nächsten Reviews zuerst für die größten Kunden"),
        why: t(
          "It focuses a limited service team where a move to 5 of 5 keeps the most gross profit.",
          "Es konzentriert ein begrenztes Service-Team dort, wo ein Aufstieg auf 5 von 5 den meisten Rohertrag hält.",
        ),
      },
    ],
    reason: t("nobody advised them beyond the contract", "sie niemand über den Vertrag hinaus beraten hat"),
  },
  {
    id: "moments" as ArchId,
    metric: t("the number of customers who have moved to 5 of 5 after a designed moment", "die Zahl der Kunden, die nach einem gestalteten Moment auf 5 von 5 gestiegen sind"),
    metricWhy: t(
      "A designed moment (go-live, first-year review, renewal thank-you) is meant to make a customer feel valued. The proof is customers who now rate you 5 of 5, not moments delivered.",
      "Ein gestalteter Moment (Go-live, Rückblick nach einem Jahr, Dank bei Verlängerung) soll einen Kunden Wertschätzung spüren lassen. Der Beleg sind Kunden, die Sie jetzt mit 5 von 5 bewerten, nicht gelieferte Momente.",
    ),
    actions: [
      {
        text: t("marketing redesigns the moments with service", "gestaltet Marketing die Momente mit dem Service neu"),
        why: t(
          "Marketing owns the journey design, so it can change the moments alone; asking service keeps them close to what customers actually experience.",
          "Marketing verantwortet die Journey-Gestaltung und kann die Momente allein ändern; der Service hält sie nah an dem, was Kunden tatsächlich erleben.",
        ),
      },
      {
        text: t("marketing keeps only the go-live moment and drops the renewal thank-you", "behält Marketing nur den Go-live-Moment und streicht das Dankeschön bei Verlängerung"),
        why: t(
          "If the money is thin, keep the moment closest to the start, where a first impression forms. It changes one moment, not the item.",
          "Wenn das Geld knapp ist, behalten Sie den Moment nahe am Start, wo der erste Eindruck entsteht. Es ändert einen Moment, nicht den Punkt.",
        ),
      },
      {
        text: t("the Head of Service adds a personal note from the named service lead to each moment", "fügt die Service-Leitung jedem Moment eine persönliche Notiz der benannten Service-Leitung hinzu"),
        why: t(
          "A moment feels valued when it comes from someone the customer knows (trust).",
          "Ein Moment wirkt wertschätzend, wenn er von jemandem kommt, den der Kunde kennt (Vertrauen).",
        ),
      },
    ],
    reason: t("no moment made them feel valued", "kein Moment sie Wertschätzung spüren ließ"),
  },
  {
    id: "owners" as ArchId,
    metric: t("the number of customers with a named owner who rate us 5 of 5", "die Zahl der Kunden mit benanntem Owner, die uns mit 5 von 5 bewerten"),
    metricWhy: t(
      "The named owners are meant to give every customer one person who knows its history. Count the customers who now feel that, not the calls made.",
      "Die benannten Owner sollen jedem Kunden eine Person geben, die seine Geschichte kennt. Zählen Sie die Kunden, die das jetzt spüren, nicht die geführten Anrufe.",
    ),
    actions: [
      {
        text: t("the Head of Sales reassigns accounts so that no owner carries more than a set number of customers", "verteilt die Vertriebsleitung Accounts so neu, dass kein Owner mehr als eine festgelegte Zahl von Kunden betreut"),
        why: t(
          "An owner with too many customers cannot know any of them. The Head of Sales assigns accounts alone.",
          "Ein Owner mit zu vielen Kunden kann keinen davon kennen. Die Vertriebsleitung verteilt Accounts allein.",
        ),
      },
      {
        text: t("the Head of Sales makes it a rule that an owner stays at least two years", "macht die Vertriebsleitung es zur Regel, dass ein Owner mindestens zwei Jahre bleibt"),
        why: t(
          "Four account managers in two years was the problem customers named. The rule keeps the tie from breaking again.",
          "Vier Account Manager in zwei Jahren war das Problem, das Kunden nannten. Die Regel verhindert, dass die Bindung wieder reißt.",
        ),
      },
      {
        text: t("the Chief Customer Officer limits the quarterly call to the largest customers", "beschränkt die Chief Customer Officer den Anruf pro Quartal auf die größten Kunden"),
        why: t(
          "It saves time where the gross profit at stake is smallest. The CCO decides across teams.",
          "Es spart Zeit dort, wo der Rohertrag am kleinsten ist. Die CCO entscheidet über Teams hinweg.",
        ),
      },
    ],
    reason: t("they had no personal contact", "sie keinen persönlichen Kontakt hatten"),
  },
  {
    id: "stars" as ArchId,
    metric: t("the number of visited key customers who rate us 5 of 5", "die Zahl der besuchten Schlüsselkunden, die uns mit 5 von 5 bewerten"),
    metricWhy: t(
      "The visits are meant to tie the largest customers to us. The proof is that they now rate you 5 of 5, not the number of visits made.",
      "Die Besuche sollen die größten Kunden an uns binden. Der Beleg ist, dass sie Sie jetzt mit 5 von 5 bewerten, nicht die Zahl der Besuche.",
    ),
    actions: [
      {
        text: t("the Head of Sales gives each visited customer a named service lead as well", "gibt die Vertriebsleitung jedem besuchten Kunden zusätzlich eine benannte Service-Leitung"),
        why: t(
          "The visits tie customers to one person; a named service lead keeps the tie when that person moves on.",
          "Die Besuche binden Kunden an eine Person; eine benannte Service-Leitung erhält die Bindung, wenn diese Person weiterzieht.",
        ),
      },
      {
        text: t("the Chief Customer Officer stops the visits and moves their budget to the reviews", "stoppt die Chief Customer Officer die Besuche und verschiebt ihr Budget in die Reviews"),
        why: t(
          "A tie that rests on one person is fragile: it leaves when the person does. The CCO can move money across teams.",
          "Eine Bindung, die an einer Person hängt, ist zerbrechlich: Sie geht, wenn die Person geht. Die CCO kann Geld über Teams hinweg verschieben.",
        ),
      },
      {
        text: t("the Head of Sales adds a second person to every visit", "fügt die Vertriebsleitung jedem Besuch eine zweite Person hinzu"),
        why: t(
          "Two people know the customer, so the tie does not leave with one.",
          "Zwei Personen kennen den Kunden, die Bindung geht also nicht mit einer.",
        ),
      },
    ],
    reason: t("no senior person visited them", "sie kein erfahrener Mitarbeiter besucht hat"),
  },
  {
    id: "discount" as ArchId,
    metric: t("the number of renewing customers who rate us 5 of 5", "die Zahl der verlängernden Kunden, die uns mit 5 von 5 bewerten"),
    metricWhy: t(
      "A discount buys the renewal, not the feeling. The only way to see whether it built any attachment is whether those customers now rate you 5 of 5.",
      "Ein Rabatt kauft die Verlängerung, nicht das Gefühl. Ob er Bindung aufgebaut hat, sehen Sie nur daran, ob diese Kunden Sie jetzt mit 5 von 5 bewerten.",
    ),
    actions: [
      {
        text: t("the Chief Customer Officer ends the discount at the next renewal round", "beendet die Chief Customer Officer den Rabatt in der nächsten Verlängerungsrunde"),
        why: t(
          "If the discount has not moved customers to 5 of 5, it is only a cost. The CCO decides it across teams.",
          "Wenn der Rabatt Kunden nicht auf 5 von 5 gebracht hat, ist er nur ein Kostenpunkt. Die CCO entscheidet das über Teams hinweg.",
        ),
      },
      {
        text: t("the Head of Sales limits the discount to customers who rate us below 5", "begrenzt die Vertriebsleitung den Rabatt auf Kunden, die uns unter 5 bewerten"),
        why: t(
          "It is spent where attachment is weakest and a renewal is most at risk.",
          "Er wird dort eingesetzt, wo die Bindung am schwächsten und die Verlängerung am gefährdetsten ist.",
        ),
      },
      {
        text: t("the Head of Sales adds one personal touch to every discounted renewal", "fügt die Vertriebsleitung jeder rabattierten Verlängerung eine persönliche Geste hinzu"),
        why: t(
          "It gives the discount something emotional to carry, which is what retention needs.",
          "Es gibt dem Rabatt etwas Emotionales mit, was Kundenbindung braucht.",
        ),
      },
    ],
    reason: t("of the price", "des Preises"),
  },
]);

export const TRIGGER_KIT = Object.fromEntries(TRIGGER_KIT_LIST.map((k) => [k.id, k])) as Record<ArchId, TriggerKit>;
