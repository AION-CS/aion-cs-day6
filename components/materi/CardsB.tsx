"use client";

import { Bul, Diagram } from "@/components/materi/kit";
import { ArchExample, LeverProfile, RaciExample, ResponseDecay, SystemLoop } from "@/components/materi/diagramsB";
import { Callout, DataTable, MaterialCard } from "@/components/ui/MaterialCard";
import { RACI_ROLES, ROLE_IDS } from "@/data/route2";
import { tt } from "@/lib/lang";

/** Materi B: the five cards of Route 2 (Level 3). 60 minutes in all. */
const p = "text-body text-ink";

export function CardB1() {
  return (
    <MaterialCard
      id="B1"
      scan={tt("A retention system is not a list of good actions. It is a loop that captures what customers signal, gives each signal an owner and a rule, keeps one record and reviews what worked, so it works whoever is on duty.", "Ein Bindungssystem ist keine Liste guter Aktionen. Es ist eine Schleife, die erfasst, was Kunden signalisieren, jedem Signal einen Owner und eine Regel gibt, einen Datensatz führt und prüft, was wirkte, damit es funktioniert, egal wer Dienst hat.")}
      reasoning={[
        tt("A target vision names principles, not actions. A principle is true of every customer and every day (“every signal has an owner”); an action happens once (“call the key customers in May”).", "Ein Zielbild nennt Prinzipien, keine Aktionen. Ein Prinzip gilt für jeden Kunden und jeden Tag („jedes Signal hat einen Owner“); eine Aktion passiert einmal („die Schlüsselkunden im Mai anrufen“)."),
        tt("Two principles every retention system needs: one shared customer view (so anyone can act) and ownership of every signal (so someone must).", "Zwei Prinzipien braucht jedes Bindungssystem: eine gemeinsame Kundensicht (damit jeder handeln kann) und Verantwortung für jedes Signal (damit jemand muss)."),
        tt("A principle that depends on individuals (the best people look after the best customers) or on price (discounts at renewal) is not systemic: it leaves with the person, or it buys renewals instead of attachment.", "Ein Prinzip, das an Einzelnen hängt (die Besten betreuen die besten Kunden) oder am Preis (Rabatte bei Verlängerung), ist nicht systemisch: Es geht mit der Person, oder es kauft Verlängerungen statt Bindung."),
        tt("What is systemic and what is only operational? Systemic: it changes how every case is handled. Operational: it handles one case well.", "Was ist systemisch und was nur operativ? Systemisch: Es ändert, wie jeder Fall behandelt wird. Operativ: Es behandelt einen Fall gut."),
      ]}
      sources={["meadows1999", "heskett1994", "deming1986"]}
    >
      <p className={p}>
        {tt(
          "Meadows (1999) showed that systems move most when you change their rules and structure, least when you push on single parameters. Heskett and colleagues (1994) described the service-profit chain: loyalty follows from the value customers experience, which follows from how the service is organised. For a CCO this means: design the conditions in which every employee answers every customer well, rather than relying on a few who do it by instinct.",
          "Meadows (1999) zeigte, dass sich Systeme am stärksten bewegen, wenn man ihre Regeln und Strukturen ändert, am wenigsten, wenn man an einzelnen Parametern drückt. Heskett und Kollegen (1994) beschrieben die Service-Profit-Chain: Loyalität folgt aus dem Wert, den Kunden erleben, und der folgt daraus, wie der Service organisiert ist. Für einen CCO heißt das: die Bedingungen gestalten, unter denen jeder Mitarbeitende jeden Kunden gut bedient, statt sich auf wenige zu verlassen, die es aus dem Bauch heraus tun.",
        )}
      </p>
      <Diagram label={tt("The retention loop · a worked example on Elbe Managed Services", "Die Bindungsschleife · ein Beispiel mit Elbe Managed Services")} caption={tt("Switch the five parts on and off and read what breaks when one is missing.", "Schalten Sie die fünf Teile ein und aus und lesen Sie, was bricht, wenn eines fehlt.")}>
        <SystemLoop />
      </Diagram>
    </MaterialCard>
  );
}

export function CardB2() {
  return (
    <MaterialCard
      id="B2"
      scan={tt("The central process of a retention system is how signals are handled: for each kind of signal, which team owns it, how fast it answers, and what the first action is.", "Der zentrale Prozess eines Bindungssystems ist der Umgang mit Signalen: für jede Signalart, welches Team es verantwortet, wie schnell es antwortet und was die erste Aktion ist.")}
      reasoning={[
        tt("Owner: the team that can give the response. Open deals belong to sales; a doubt about delivery or data brings in service.", "Owner: das Team, das die Antwort geben kann. Offene Deals gehören dem Vertrieb; ein Zweifel an Lieferung oder Daten holt den Service dazu."),
        tt("Response time follows how fast the signal decays. Uncertainty decays fastest and is answered the same day; interest and comparison within two working days; decision proximity the same day or the next.", "Die Reaktionszeit folgt daraus, wie schnell das Signal zerfällt. Unsicherheit zerfällt am schnellsten und wird am selben Tag beantwortet; Interesse und Vergleich innerhalb von zwei Arbeitstagen; Entscheidungsnähe am selben oder nächsten Tag."),
        tt("“At the next scheduled contact” is never a response time for a signal: it is the reactive habit the system replaces.", "„Beim nächsten geplanten Kontakt“ ist nie eine Reaktionszeit für ein Signal: Es ist die reaktive Gewohnheit, die das System ersetzt."),
        tt("First action: the response that fits the signal (a next step for interest, a fair comparison for comparison, a decision plan for proximity, a smaller risk for uncertainty). A discount fits none.", "Erste Aktion: die Antwort, die zum Signal passt (ein nächster Schritt bei Interesse, ein fairer Vergleich bei Vergleich, ein Entscheidungsplan bei Nähe, ein kleineres Risiko bei Unsicherheit). Ein Rabatt passt zu keinem."),
      ]}
      sources={["rackham1988", "adamson2012"]}
    >
      <Diagram label={tt("How fast a signal cools · a worked example on Elbe Managed Services", "Wie schnell ein Signal abkühlt · ein Beispiel mit Elbe Managed Services")} caption={tt("Choose a signal type and compare how many deals are still open for each response time.", "Wählen Sie eine Signalart und vergleichen Sie, wie viele Deals je Reaktionszeit noch offen sind.")}>
        <ResponseDecay />
      </Diagram>
      <DataTable
        head={[tt("Signal", "Signal"), tt("Owner", "Owner"), tt("Response time", "Reaktionszeit"), tt("First action", "Erste Aktion")]}
        rows={[
          [tt("Interest", "Interesse"), tt("Sales", "Vertrieb"), tt("Within two working days", "Innerhalb von zwei Arbeitstagen"), tt("The next concrete step", "Der nächste konkrete Schritt")],
          [tt("Comparison", "Vergleich"), tt("Sales", "Vertrieb"), tt("Within two working days", "Innerhalb von zwei Arbeitstagen"), tt("Fair comparison and a reference", "Fairer Vergleich und eine Referenz")],
          [tt("Decision proximity", "Entscheidungsnähe"), tt("Sales", "Vertrieb"), tt("Same day or next", "Am selben oder nächsten Tag"), tt("A decision plan", "Ein Entscheidungsplan")],
          [tt("Uncertainty", "Unsicherheit"), tt("Sales with service", "Vertrieb mit Service"), tt("The same day", "Am selben Tag"), tt("Name the concern, reduce the risk", "Die Sorge ansprechen, das Risiko verkleinern")],
        ]}
        caption={tt("A signal process for a managed IT provider (practitioner rule of thumb)", "Ein Signalprozess für einen Managed-IT-Anbieter (Faustregel aus der Praxis)")}
      />
    </MaterialCard>
  );
}

export function CardB3() {
  return (
    <MaterialCard
      id="B3"
      scan={tt("To find the greatest lever for loyalty, rate each on four tests: how many customers it reaches, how deeply it builds attachment, whether it lasts when people change, and whether its cost falls as the customer base grows.", "Um den größten Hebel für Loyalität zu finden, bewerten Sie jeden nach vier Tests: wie viele Kunden er erreicht, wie tief er Bindung aufbaut, ob er bleibt, wenn Menschen wechseln, und ob seine Kosten sinken, wenn die Kundenbasis wächst.")}
      reasoning={[
        tt("Reach: 3 if it touches every customer; at most 2 if only some.", "Reichweite: 3, wenn er jeden Kunden erreicht; höchstens 2, wenn nur manche."),
        tt("Depth: 3 if it removes a reason customers feel no tie; 1 for a small nudge.", "Tiefe: 3, wenn er einen Grund beseitigt, warum Kunden keine Bindung spüren; 1 für einen kleinen Anstoß."),
        tt("Durability: at most 1 if it depends on individual people; up to 3 if it is built into a process or a rule.", "Dauerhaftigkeit: höchstens 1, wenn er an einzelnen Menschen hängt; bis 3, wenn er in einen Prozess oder eine Regel eingebaut ist."),
        tt("Scale: at most 1 if its cost repeats with every deal; at most 2 if it repeats per customer; up to 3 if it is a one-off that serves everyone.", "Skalierung: höchstens 1, wenn sich die Kosten mit jedem Deal wiederholen; höchstens 2, wenn pro Kunde; bis 3, wenn es einmalige Kosten sind, die allen dienen."),
        tt("Choose at least two levers built into a process or a structure. A system that rests on people leaves with them.", "Wählen Sie mindestens zwei Hebel, die in einen Prozess oder eine Struktur eingebaut sind. Ein System, das auf Menschen ruht, geht mit ihnen."),
        tt("The greatest lever acts on the weakness the evidence shows most clearly and holds for every customer.", "Der größte Hebel wirkt auf die Schwäche, die die Evidenz am deutlichsten zeigt, und gilt für jeden Kunden."),
      ]}
      sources={["meadows1999", "palmatier2006"]}
    >
      <Diagram label={tt("Four levers, four tests · a worked example on Elbe Managed Services", "Vier Hebel, vier Tests · ein Beispiel mit Elbe Managed Services")} caption={tt("Click any rating to read the reason for it.", "Klicken Sie eine Bewertung an, um ihre Begründung zu lesen.")}>
        <LeverProfile />
      </Diagram>
      <Callout label={tt("The paradox of the star", "Das Paradox des Stars")} tone="amber">
        <p>{tt("Palmatier and colleagues (2006) found that relationships with a person are stronger than with a firm. That is why a star account manager works, and why losing one hurts so much. A system does not replace people; it makes sure a customer's tie survives when the person changes.", "Palmatier und Kollegen (2006) fanden, dass Beziehungen zu einer Person stärker sind als zu einer Firma. Deshalb wirkt ein Star-Account-Manager, und deshalb schmerzt sein Verlust so sehr. Ein System ersetzt keine Menschen; es sorgt dafür, dass die Bindung eines Kunden überlebt, wenn die Person wechselt.")}</p>
      </Callout>
    </MaterialCard>
  );
}

export function CardB4() {
  return (
    <MaterialCard
      id="B4"
      scan={tt("Sales, service and marketing each touch the customer, and each assumes another will act. A RACI grid ends that: for every activity, who does it, who answers for it, who is asked and who is told.", "Vertrieb, Service und Marketing berühren den Kunden, und jeder nimmt an, ein anderer handelt. Ein RACI-Raster beendet das: für jede Tätigkeit, wer sie macht, wer dafür einsteht, wer gefragt und wer informiert wird.")}
      reasoning={[
        tt("R · Responsible: who does the work? At least one per row.", "R · Responsible: Wer macht die Arbeit? Mindestens einer pro Zeile."),
        tt("A · Accountable: who answers for the result and has the authority to decide? Exactly one per row. A team that answers for the work and does it holds the A; no separate R is needed.", "A · Accountable: Wer steht für das Ergebnis ein und hat die Befugnis zu entscheiden? Genau einer pro Zeile. Ein Team, das die Arbeit verantwortet und macht, hält das A; ein eigenes R ist nicht nötig."),
        tt("C · Consulted: whose knowledge is needed before acting? The conversation goes both ways.", "C · Consulted: Wessen Wissen wird vor dem Handeln gebraucht? Das Gespräch geht in beide Richtungen."),
        tt("I · Informed: who must know afterwards? One way only. – : no role, because involving them would slow things down.", "I · Informed: Wer muss es danach wissen? Nur in eine Richtung. – : keine Rolle, weil ihre Einbindung bremsen würde."),
        tt("A or R? Ask who has the authority to decide. The team that only does the work is R. C or I? Ask whether their input changes what is done (C) or whether they only need to know (I).", "A oder R? Fragen Sie, wer die Befugnis zu entscheiden hat. Das Team, das nur die Arbeit macht, ist R. C oder I? Fragen Sie, ob ihr Beitrag ändert, was getan wird (C), oder ob sie es nur wissen müssen (I)."),
        tt("Put the A at the level with the authority. The CCO takes the A where money or effort is traded across teams (a save plan, the journey design), and stays out of routine work.", "Setzen Sie das A auf die Ebene mit der Befugnis. Der CCO nimmt das A, wo Geld oder Aufwand über Teams verschoben werden (ein Rettungsplan, die Journey-Gestaltung), und bleibt aus der Routine heraus."),
      ]}
      sources={["pmi2021", "heskett1994"]}
    >
      <p className={p}>
        {tt(
          "The responsibility assignment matrix (RACI) is described in the PMBOK Guide (PMI 2021) and used far beyond projects. Its value for retention is that it makes the gaps visible: an activity with no A is one everyone assumes someone else owns, and a row with three As is one where every decision becomes a meeting.",
          "Die Verantwortungsmatrix (RACI) ist im PMBOK Guide (PMI 2021) beschrieben und wird weit über Projekte hinaus genutzt. Ihr Wert für die Kundenbindung ist, dass sie Lücken sichtbar macht: Eine Tätigkeit ohne A ist eine, von der jeder annimmt, ein anderer sei zuständig, und eine Zeile mit drei As ist eine, in der jede Entscheidung zu einem Meeting wird.",
        )}
      </p>
      <DataTable
        head={[tt("Role", "Rolle"), tt("What it typically decides, does and knows", "Was sie typischerweise entscheidet, tut und weiß")]}
        rows={ROLE_IDS.map((r) => [RACI_ROLES[r].name, RACI_ROLES[r].profile])}
        caption={tt("The four roles in the grid (practitioner profiles)", "Die vier Rollen im Raster (Profile aus der Praxis)")}
      />
      <Diagram label={tt("A RACI grid explained cell by cell · a worked example on Elbe Managed Services", "Ein RACI-Raster, Zelle für Zelle erklärt · ein Beispiel mit Elbe Managed Services")} caption={tt("Click any cell to read why it holds that letter and which test decides it. Elbe's activities differ from NetSolutions', so the task is not answered here.", "Klicken Sie eine Zelle an, um zu lesen, warum sie diesen Buchstaben trägt und welcher Test ihn entscheidet. Die Tätigkeiten von Elbe unterscheiden sich von denen von NetSolutions, die Aufgabe wird hier also nicht gelöst.")}>
        <RaciExample />
      </Diagram>
    </MaterialCard>
  );
}

export function CardB5() {
  return (
    <MaterialCard
      id="B5"
      scan={tt("You will not have complete information before you build the system. Decide the system now, build it in stages, and agree on the result that makes you change course. Then give every item a start, one owner and a trigger.", "Sie werden keine vollständige Information haben, bevor Sie das System bauen. Entscheiden Sie das System jetzt, bauen Sie es in Stufen, und vereinbaren Sie das Ergebnis, bei dem Sie den Kurs ändern. Geben Sie dann jedem Punkt einen Start, einen Owner und einen Trigger.")}
      reasoning={[
        tt("Waiting for complete data is also a decision: it leaves every signal unanswered while you wait. The brief asks for a decision despite incomplete information.", "Auf vollständige Daten zu warten, ist auch eine Entscheidung: Es lässt jedes Signal unbeantwortet, solange Sie warten. Der Auftrag verlangt eine Entscheidung trotz unvollständiger Information."),
        tt("Building everything at once is fast, but most of the money is spent before the shared view shows whether signals are captured at all. Staging decides the system now and spends in the order the evidence arrives.", "Alles auf einmal zu bauen ist schnell, aber der Großteil des Geldes ist ausgegeben, bevor die gemeinsame Sicht zeigt, ob Signale überhaupt erfasst werden. Stufenweise entscheidet das System jetzt und gibt in der Reihenfolge aus, in der die Evidenz kommt."),
        tt("Baseline first: the shared customer view starts no later than the first other item, because every trigger reads it.", "Baseline zuerst: Die gemeinsame Kundensicht startet nicht später als der erste andere Punkt, weil jeder Trigger sie liest."),
        tt("Fund inside the budget, and fund nothing that rests on one person: it contradicts the system you are building.", "Finanzieren Sie innerhalb des Budgets, und nichts, das auf einer Person ruht: Es widerspricht dem System, das Sie bauen."),
        tt("Owner test: who can change the item without asking anyone else? Trigger test: a metric, a number, a date and an action.", "Owner-Test: Wer kann den Punkt ändern, ohne jemanden zu fragen? Trigger-Test: eine Kennzahl, eine Zahl, ein Datum und eine Aktion."),
        tt("A tripwire measures the customers' response (delighted share, churn, repeat purchases), not your own activity (signals answered, emails sent), and its threshold is better than today.", "Ein Tripwire misst die Reaktion der Kunden (Anteil Begeisterter, Churn, Wiederkäufe), nicht Ihre eigene Aktivität (beantwortete Signale, versendete E-Mails), und sein Schwellenwert ist besser als heute."),
        tt("When early results disappoint, check the tripwire and the evidence before you change the system; change one item, not all of them.", "Wenn frühe Ergebnisse enttäuschen, prüfen Sie Tripwire und Evidenz, bevor Sie das System ändern; ändern Sie einen Punkt, nicht alle."),
      ]}
      sources={["courtney1997", "klein2007", "doran1981", "deming1986"]}
    >
      <Diagram label={tt("Three funded items over six months · a worked example on Elbe Managed Services", "Drei finanzierte Punkte über sechs Monate · ein Beispiel mit Elbe Managed Services")} caption={tt("Click a row to read its owner, its trigger and why it starts when it does.", "Klicken Sie eine Zeile an, um Owner, Trigger und den Grund für den Start zu lesen.")}>
        <ArchExample />
      </Diagram>
      <Bul
        items={[
          tt("Stage it: the no-regret items (shared view, signal rules) first, the rest when the first results are in.", "Stufenweise: die No-regret-Punkte (gemeinsame Sicht, Signalregeln) zuerst, der Rest, wenn die ersten Ergebnisse da sind."),
          tt("Premortem: imagine the system failed after a year, and write down why. Those reasons are your assumptions to watch.", "Premortem: Stellen Sie sich vor, das System sei nach einem Jahr gescheitert, und schreiben Sie auf, warum. Diese Gründe sind die Annahmen, die Sie beobachten."),
          tt("What does not fit gets a pickup point: the number and the date at which you look at it again.", "Was nicht passt, bekommt einen Pickup Point: die Zahl und das Datum, zu dem Sie es wieder ansehen."),
        ]}
      />
    </MaterialCard>
  );
}

export const CARDS_B = [CardB1, CardB2, CardB3, CardB4, CardB5];
