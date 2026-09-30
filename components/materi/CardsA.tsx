"use client";

import { Bul, Diagram } from "@/components/materi/kit";
import { AreaSortExample, DelightValue, ReadAndRespond, SatisfactionCurve, ScoreExample, SignalExample, ThreeFactors } from "@/components/materi/diagramsA";
import { Callout, DataTable, MaterialCard } from "@/components/ui/MaterialCard";
import { ShowMore } from "@/components/ui/ShowMore";
import { AREA_TESTS } from "@/data/reasons";
import { SIGNALS, SIGNAL_IDS, SIGNAL_PAIR_TESTS } from "@/data/signals";
import { SUSTAIN_RULE } from "@/data/measures";
import { KONTOR, KONTOR_RESULT } from "@/data/delight";
import { euro, tt } from "@/lib/lang";

/** Materi A: the seven cards of Route 1 (Levels 1 and 2 on one case). 60 minutes in all. */
const p = "text-body text-ink";

export function CardA1() {
  return (
    <MaterialCard
      id="A1"
      scan={tt("A satisfied customer has no reason to complain, which is not the same as a reason to stay. Satisfaction removes reasons to leave; delight creates reasons to stay.", "Ein zufriedener Kunde hat keinen Grund zu klagen, was nicht dasselbe ist wie ein Grund zu bleiben. Zufriedenheit nimmt Gründe zu gehen; Begeisterung schafft Gründe zu bleiben.")}
      reasoning={[
        tt("Satisfaction means the service met expectations. Delight means it exceeded them in a way the customer felt, often with a positive surprise.", "Zufriedenheit heißt: Die Leistung hat die Erwartung erfüllt. Begeisterung heißt: Sie hat sie spürbar übertroffen, oft mit einer positiven Überraschung."),
        tt("Do not read a 4 out of 5 as safe. Retention rises slowly up to “satisfied” and jumps only at “delighted”.", "Lesen Sie eine 4 von 5 nicht als sicher. Die Bindung steigt bis „zufrieden“ langsam und springt erst bei „begeistert“."),
        tt("What is missing when satisfied customers leave is rarely performance. Look for the missing tie: a person, a relevant idea, the feeling of being noticed.", "Was fehlt, wenn zufriedene Kunden gehen, ist selten Leistung. Suchen Sie die fehlende Bindung: eine Person, eine relevante Idee, das Gefühl, bemerkt zu werden."),
        tt("Delight is built on reliability, not instead of it. A surprise does not make up for a promise broken.", "Begeisterung baut auf Verlässlichkeit auf, nicht statt ihr. Eine Überraschung macht kein gebrochenes Versprechen wett."),
      ]}
      sources={["jones1995", "oliver1997", "kano1984", "dixon2010"]}
    >
      <ShowMore id="A1" part="research" label={tt("Show the research behind this card", "Die Forschung hinter dieser Karte zeigen")}>
        <p className={p}>
          {tt(
            "Jones and Sasser (1995) found that in many markets only completely satisfied customers are reliably loyal; merely satisfied ones leave almost as easily as dissatisfied ones when an alternative appears. Oliver, Rust and Varki (1997) described delight as satisfaction plus a positive surprise and joy. Kano's model (1984) explains why: basic factors only prevent complaints, performance factors satisfy in proportion, and delight factors create enthusiasm that the customer did not expect.",
            "Jones und Sasser (1995) fanden, dass in vielen Märkten nur völlig zufriedene Kunden verlässlich treu sind; bloß zufriedene gehen fast so leicht wie unzufriedene, wenn eine Alternative auftaucht. Oliver, Rust und Varki (1997) beschrieben Begeisterung als Zufriedenheit plus positive Überraschung und Freude. Das Kano-Modell (1984) erklärt, warum: Basisfaktoren verhindern nur Beschwerden, Leistungsfaktoren machen proportional zufrieden, und Begeisterungsfaktoren schaffen eine Freude, die der Kunde nicht erwartet hat.",
          )}
        </p>
      </ShowMore>
      <Diagram label={tt("Satisfaction score against retention · a worked example on Kontor Systems", "Zufriedenheit gegen Bindung · ein Beispiel mit Kontor Systems")} caption={tt("Click a point or a score and read how many customers per hundred are still there a year later.", "Klicken Sie auf einen Punkt oder Wert und lesen Sie, wie viele Kunden von hundert ein Jahr später noch da sind.")}>
        <SatisfactionCurve />
      </Diagram>
      <ShowMore id="A1" part="extra" label={tt("Show the three kinds of quality (Kano) and a caution", "Die drei Qualitätsarten (Kano) und eine Warnung zeigen")}>
        <DataTable
          head={[tt("Kano factor", "Kano-Faktor"), tt("What it does", "Was es bewirkt"), tt("In managed IT services", "In Managed IT Services")]}
          rows={[
            [tt("Basic", "Basis"), tt("Missing: anger. Present: nobody notices.", "Fehlt: Ärger. Vorhanden: Niemand bemerkt es."), tt("Uptime, security patches, invoices that are right", "Verfügbarkeit, Sicherheitsupdates, korrekte Rechnungen")],
            [tt("Performance", "Leistung"), tt("More is better, in proportion.", "Mehr ist besser, proportional."), tt("Response time, reporting, price", "Reaktionszeit, Reporting, Preis")],
            [tt("Delight", "Begeisterung"), tt("Missing: nobody complains. Present: enthusiasm.", "Fehlt: Niemand klagt. Vorhanden: Begeisterung."), tt("A named person who knows you, advice you did not ask for, a remembered milestone", "Eine benannte Person, die Sie kennt, Rat, nach dem Sie nicht fragten, ein erinnerter Meilenstein")],
          ]}
          caption={tt("Three kinds of quality", "Drei Arten von Qualität")}
        />
        <Callout label={tt("A caution from research", "Eine Warnung aus der Forschung")} tone="rust">
          <p>{tt("Dixon, Freeman and Toman (2010) found that in service, reducing the customer's effort often does more for loyalty than surprising it. Delight works on top of a reliable, easy service, never in place of one.", "Dixon, Freeman und Toman (2010) fanden, dass im Service das Senken des Kundenaufwands oft mehr für Loyalität bringt als Überraschen. Begeisterung wirkt auf einem verlässlichen, einfachen Service, nie an seiner Stelle.")}</p>
        </Callout>
      </ShowMore>
    </MaterialCard>
  );
}

export function CardA2() {
  return (
    <MaterialCard
      id="A2"
      scan={tt("Three factors turn a working service into a relationship: trust (they can rely on us and on a person), appreciation (they feel valued) and relevance (what we offer fits their situation).", "Drei Faktoren machen aus einem funktionierenden Service eine Beziehung: Vertrauen (sie können sich auf uns und eine Person verlassen), Wertschätzung (sie fühlen sich geschätzt) und Relevanz (was wir bieten, passt zu ihrer Lage).")}
      reasoning={[
        tt("Trust: the customer can rely on the provider and on a person there. It grows from promises kept and problems told early.", "Vertrauen: Der Kunde kann sich auf den Anbieter und eine Person dort verlassen. Es wächst aus gehaltenen Versprechen und früh angekündigten Problemen."),
        tt("Appreciation: the customer feels seen as a customer, not as an invoice. It is shown by time and attention given, not by gifts.", "Wertschätzung: Der Kunde fühlt sich als Kunde gesehen, nicht als Rechnung. Sie zeigt sich in geschenkter Zeit und Aufmerksamkeit, nicht in Geschenken."),
        tt("Relevance: what the provider offers fits the customer's situation and makes it better at its own work. It is advice the customer did not have to ask for.", "Relevanz: Was der Anbieter bietet, passt zur Lage des Kunden und macht ihn in seiner eigenen Arbeit besser. Es ist Rat, nach dem der Kunde nicht fragen musste."),
        tt("An approach to increase delight names what is done, for whom, what it should change, and the factor it rests on: “[what] for [whom], so that [effect], because [factor]”. Use a different factor for each approach so that they can be tried apart.", "Ein Ansatz für mehr Begeisterung nennt, was getan wird, für wen, was es ändern soll, und den Faktor, auf dem er beruht: „[was] für [wen], damit [Wirkung], weil [Faktor]“. Nutzen Sie für jeden Ansatz einen anderen Faktor, damit sie sich getrennt erproben lassen."),
        tt("People bind to people. Relationships with a named person predict loyalty more strongly than relationships with a company.", "Menschen binden sich an Menschen. Beziehungen zu einer benannten Person sagen Loyalität stärker voraus als Beziehungen zu einem Unternehmen."),
      ]}
      sources={["morgan1994", "gustafsson2005", "palmatier2006"]}
    >
      <ShowMore id="A2" part="research" label={tt("Show the research behind this card", "Die Forschung hinter dieser Karte zeigen")}>
        <p className={p}>
          {tt(
            "Morgan and Hunt (1994) put trust and commitment at the centre of lasting business relationships. Gustafsson, Johnson and Roos (2005) showed that affective commitment, staying because one wants to, keeps customers beyond what satisfaction explains. Palmatier and colleagues (2006) found in a meta-analysis that relationships with a person weigh more than relationships with a firm.",
            "Morgan und Hunt (1994) stellten Vertrauen und Commitment ins Zentrum dauerhafter Geschäftsbeziehungen. Gustafsson, Johnson und Roos (2005) zeigten, dass affektive Bindung, also bleiben, weil man will, Kunden über das hinaus hält, was Zufriedenheit erklärt. Palmatier und Kollegen (2006) fanden in einer Metaanalyse, dass Beziehungen zu einer Person mehr wiegen als Beziehungen zu einer Firma.",
          )}
        </p>
      </ShowMore>
      <Diagram label={tt("Three pillars of emotional retention · switch each one on and off", "Drei Säulen emotionaler Bindung · jede ein- und ausschalten")} caption={tt("Read the box that changes under the buttons: it says what kind of customer relationship you would have with only those factors.", "Lesen Sie das Feld unter den Schaltflächen: Es sagt, welche Art Kundenbeziehung Sie nur mit diesen Faktoren hätten.")}>
        <ThreeFactors />
      </Diagram>
    </MaterialCard>
  );
}

export function CardA3() {
  return (
    <MaterialCard
      id="A3"
      scan={tt("When customers feel no tie, the reason sits in one of three areas: the relationship (who they know), the communication (what they are told, when and how) or the added value (what they gain beyond the contract).", "Wenn Kunden keine Bindung spüren, liegt der Grund in einem von drei Bereichen: der Beziehung (wen sie kennen), der Kommunikation (was ihnen wann und wie gesagt wird) oder dem Mehrwert (was sie über den Vertrag hinaus gewinnen).")}
      reasoning={[...AREA_TESTS.map((a) => `${a.name}: ${a.test}`), tt("The same three areas describe what a measure acts on: a named person is relationship, telling or answering the customer in time is communication, advice beyond the contract is added value. A price cut acts on none of the three.", "Dieselben drei Bereiche beschreiben, worauf eine Maßnahme wirkt: eine benannte Person ist Beziehung, dem Kunden rechtzeitig etwas sagen oder antworten ist Kommunikation, Rat über den Vertrag hinaus ist Mehrwert. Eine Preissenkung wirkt auf keinen der drei."), tt("Sort by what would fix it, not by the words used. “Nobody calls us” is relationship if the customer misses a person, communication if it misses information in time.", "Sortieren Sie danach, was es beheben würde, nicht nach den verwendeten Worten. „Niemand ruft uns an“ ist Beziehung, wenn dem Kunden eine Person fehlt, Kommunikation, wenn ihm rechtzeitige Information fehlt.")]}
      sources={["palmatier2006", "heskett1994"]}
    >
      <ShowMore id="A3" part="research" label={tt("Show the research behind this card", "Die Forschung hinter dieser Karte zeigen")}>
        <p className={p}>
          {tt(
            "The three areas are practical, not theoretical: they tell you who has to act. A relationship gap needs a person; a communication gap needs a change in how and when you tell; an added-value gap needs something new to give. Mixing them up leads to the typical mistake: a newsletter sent to fix a missing person.",
            "Die drei Bereiche sind praktisch, nicht theoretisch: Sie sagen, wer handeln muss. Eine Beziehungslücke braucht eine Person; eine Kommunikationslücke braucht eine Änderung darin, wie und wann Sie informieren; eine Mehrwertlücke braucht etwas Neues zum Geben. Wer sie verwechselt, macht den typischen Fehler: einen Newsletter verschicken, um eine fehlende Person zu ersetzen.",
          )}
        </p>
      </ShowMore>
      <AreaSortExample />
      <DataTable
        head={[tt("Area", "Bereich"), tt("The test question", "Die Testfrage"), tt("What fixes it", "Was es behebt")]}
        rows={[
          [AREA_TESTS[0].name, AREA_TESTS[0].test, tt("A named person who stays", "Eine benannte Person, die bleibt")],
          [AREA_TESTS[1].name, AREA_TESTS[1].test, tt("Telling the right thing at the right time, in a form people use", "Das Richtige zur richtigen Zeit sagen, in einer Form, die genutzt wird")],
          [AREA_TESTS[2].name, AREA_TESTS[2].test, tt("Something useful beyond the contract: advice, benchmarks, a review", "Etwas Nützliches über den Vertrag hinaus: Rat, Benchmarks, ein Review")],
        ]}
        caption={tt("Three areas and their tests", "Drei Bereiche und ihre Tests")}
      />
    </MaterialCard>
  );
}

export function CardA4() {
  const d = KONTOR.satisfied.churn - KONTOR.delighted.churn;
  return (
    <MaterialCard
      id="A4"
      scan={tt("Satisfaction and delight differ in money, not only in feeling. Multiply how many customers leave each year by what each brings, and the value of delight becomes a number.", "Zufriedenheit und Begeisterung unterscheiden sich im Geld, nicht nur im Gefühl. Multiplizieren Sie, wie viele Kunden jedes Jahr gehen, mit dem, was jeder bringt, und der Wert von Begeisterung wird eine Zahl.")}
      reasoning={[
        tt("Gross profit lost per year in a group = customers in the group × yearly churn rate × average yearly contract × gross margin.", "Verlorener Rohertrag pro Jahr in einer Gruppe = Kunden in der Gruppe × jährliche Churn Rate × durchschnittlicher Jahresvertrag × Bruttomarge."),
        tt("Read every percentage as a share of one before you multiply: 20% is 0.20.", "Lesen Sie jeden Prozentwert als Anteil von eins, bevor Sie multiplizieren: 20 % sind 0,20."),
        tt("Gross profit kept by moving customers = customers moved × (churn rate of satisfied − churn rate of delighted) × contract × margin. Subtract the two churn rates first.", "Gehaltener Rohertrag durch Verschieben = verschobene Kunden × (Churn Rate zufrieden − Churn Rate begeistert) × Vertrag × Marge. Ziehen Sie zuerst die beiden Churn Rates voneinander ab."),
        tt("Compare the groups by what they cost when they leave, not by their satisfaction score. The larger group with the higher churn is where the money leaks.", "Vergleichen Sie die Gruppen danach, was sie kosten, wenn sie gehen, nicht nach ihrem Zufriedenheitswert. Die größere Gruppe mit dem höheren Churn ist dort, wo das Geld abfließt."),
      ]}
      sources={["reichheld1996", "jones1995"]}
    >
      <ShowMore id="A4" part="research" label={tt("Show the research behind this card", "Die Forschung hinter dieser Karte zeigen")}>
        <p className={p}>
          {tt(
            "Reichheld (1996) made the economics of loyalty visible: a customer who stays keeps paying, costs less to serve and recommends. The simplest version for a manager is the arithmetic of churn below. It needs only four numbers per group, all of which a CRM and a customer survey already hold.",
            "Reichheld (1996) machte die Ökonomie der Loyalität sichtbar: Ein Kunde, der bleibt, zahlt weiter, kostet weniger in der Betreuung und empfiehlt weiter. Die einfachste Version für eine Führungskraft ist die Churn-Rechnung unten. Sie braucht nur vier Zahlen pro Gruppe, die CRM und Kundenbefragung bereits enthalten.",
          )}
        </p>
      </ShowMore>
      <Diagram label={tt("What Kontor loses and keeps · a worked example", "Was Kontor verliert und hält · ein Beispiel")} caption={tt("Choose how many satisfied customers become delighted and read the gross profit kept.", "Wählen Sie, wie viele zufriedene Kunden begeistert werden, und lesen Sie den gehaltenen Rohertrag.")}>
        <DelightValue />
      </Diagram>
      <ShowMore id="A4" part="calc" label={tt("Show Kontor's calculation step by step", "Kontors Rechnung Schritt für Schritt zeigen")}>
        <DataTable
          head={[tt("Step", "Schritt"), tt("Calculation for Kontor (Case assumption)", "Rechnung für Kontor (Fallannahme)"), tt("Result", "Ergebnis")]}
          rows={[
            [tt("1 · Customers leaving per year, satisfied", "1 · Kunden, die pro Jahr gehen, zufrieden"), `${KONTOR.satisfied.customers} × ${KONTOR.satisfied.churn}%`, String((KONTOR.satisfied.customers * KONTOR.satisfied.churn) / 100)],
            [tt("2 · Gross profit per customer", "2 · Rohertrag pro Kunde"), `${euro(KONTOR.contract)} × ${KONTOR.margin}%`, euro(KONTOR.contract * (KONTOR.margin / 100))],
            [tt("3 · Gross profit lost, satisfied", "3 · Verlorener Rohertrag, zufrieden"), `${(KONTOR.satisfied.customers * KONTOR.satisfied.churn) / 100} × ${euro(KONTOR.contract * (KONTOR.margin / 100))}`, euro(KONTOR_RESULT.satisfied)],
            [tt("4 · Same for the delighted group", "4 · Dasselbe für die begeisterte Gruppe"), `${KONTOR.delighted.customers} × ${KONTOR.delighted.churn}% × ${euro(KONTOR.contract)} × ${KONTOR.margin}%`, euro(KONTOR_RESULT.delighted)],
            [tt("5 · Kept by moving 10 customers", "5 · Gehalten durch Verschieben von 10 Kunden"), `${KONTOR.moved} × (${KONTOR.satisfied.churn}% − ${KONTOR.delighted.churn}% = ${d} points) × ${euro(KONTOR.contract)} × ${KONTOR.margin}%`, euro(KONTOR_RESULT.kept)],
          ]}
          caption={tt("The same method as the task, on different numbers", "Dieselbe Methode wie in der Aufgabe, mit anderen Zahlen")}
        />
      </ShowMore>
    </MaterialCard>
  );
}

export function CardA5() {
  return (
    <MaterialCard
      id="A5"
      scan={tt("A buying signal is something a buyer says or does that shows where it stands. Four kinds matter: interest, comparison, decision proximity and uncertainty. Uncertainty often looks like interest and means the opposite.", "Ein Kaufsignal ist etwas, das ein Käufer sagt oder tut und das zeigt, wo er steht. Vier Arten zählen: Interesse, Vergleich, Entscheidungsnähe und Unsicherheit. Unsicherheit sieht oft wie Interesse aus und bedeutet das Gegenteil.")}
      reasoning={[
        ...SIGNAL_IDS.map((s) => `${SIGNALS[s].label}: ${SIGNALS[s].test}`),
        ...SIGNAL_PAIR_TESTS.map((x) => `${x.pair} ${x.test}`),
        tt("Tag by what the buyer does, not by how friendly it sounds. “We are happy in general” with a meeting moved twice is uncertainty.", "Ordnen Sie danach ein, was der Käufer tut, nicht wie freundlich es klingt. „Wir sind im Großen und Ganzen zufrieden“ mit einem zweimal verschobenen Meeting ist Unsicherheit."),
      ]}
      sources={["rackham1988", "adamson2012"]}
    >
      <ShowMore id="A5" part="research" label={tt("Show the research behind this card", "Die Forschung hinter dieser Karte zeigen")}>
        <p className={p}>
          {tt(
            "Rackham (1988) observed in thousands of large sales that a buyer's questions change as a decision nears: first about how it works, then about how it compares, then about risk and commitment. The risk questions are the dangerous ones, because sellers hear them as interest. Adamson, Dixon and Toman (2012) add that B2B buyers are far into their decision before they call; the signals you see are late, and there is little time to answer them.",
            "Rackham (1988) beobachtete in Tausenden großer Verkäufe, dass sich die Fragen eines Käufers ändern, je näher eine Entscheidung rückt: zuerst dazu, wie es funktioniert, dann wie es sich vergleicht, dann zu Risiko und Festlegung. Die Risikofragen sind die gefährlichen, weil Verkäufer sie als Interesse hören. Adamson, Dixon und Toman (2012) ergänzen, dass B2B-Käufer weit in ihrer Entscheidung sind, bevor sie anrufen; die Signale, die Sie sehen, kommen spät, und es bleibt wenig Zeit, sie zu beantworten.",
          )}
        </p>
      </ShowMore>
      <DataTable
        head={[tt("Signal", "Signal"), tt("What is going on", "Was passiert"), tt("What it sounds like", "Wie es klingt"), tt("Test question", "Testfrage")]}
        rows={SIGNAL_IDS.map((s) => [SIGNALS[s].label, SIGNALS[s].means, SIGNALS[s].sounds, SIGNALS[s].test])}
        caption={tt("Four kinds of buying signal", "Vier Arten von Kaufsignalen")}
      />
      <SignalExample />
    </MaterialCard>
  );
}

export function CardA6() {
  return (
    <MaterialCard
      id="A6"
      scan={tt("Recognising a signal is half the job; the other half is answering it the right way, by the right person, in time. A simple retention system is a rule for each kind of signal: the response and who owns it.", "Ein Signal zu erkennen ist die halbe Arbeit; die andere Hälfte ist, es richtig zu beantworten, durch die richtige Person, rechtzeitig. Ein einfaches Bindungssystem ist eine Regel für jede Signalart: die Antwort und wer sie verantwortet.")}
      reasoning={[
        ...SIGNAL_IDS.map((s) => `${SIGNALS[s].label} → ${SIGNALS[s].response}`),
        tt("A discount answers none of the four: it lowers the price and leaves the question the buyer asked open.", "Ein Rabatt beantwortet keines der vier: Er senkt den Preis und lässt die Frage des Käufers offen."),
        tt("The owner is the team that can give the response: sales for open deals, with service when the doubt is about delivery or data.", "Owner ist das Team, das die Antwort geben kann: der Vertrieb für offene Deals, mit dem Service, wenn der Zweifel Lieferung oder Daten betrifft."),
        tt("A weakness in retention is something the evidence shows (what customers said, how deals ended). Performance, price or features the customers praise or never mention are not the weakness.", "Eine Schwäche in der Kundenbindung ist etwas, das die Evidenz zeigt (was Kunden sagten, wie Deals endeten). Leistung, Preis oder Funktionen, die Kunden loben oder nie erwähnen, sind nicht die Schwäche."),
        tt("The risk of misreading is always the same shape: answering a question the buyer did not ask while the one it did ask stays open. Name the sign you would see.", "Das Risiko des Falschlesens hat immer dieselbe Form: eine Frage beantworten, die der Käufer nicht stellte, während seine eigene offen bleibt. Nennen Sie das Anzeichen, das Sie sehen würden."),
      ]}
      sources={["rackham1988", "heskett1994"]}
    >
      <Diagram label={tt("Read the signal right, or wrong · what happens next", "Das Signal richtig oder falsch lesen · was dann passiert")} caption={tt("Choose what the buyer really signals and how sales reads it. The box shows the response sent against the one needed.", "Wählen Sie, was der Käufer wirklich signalisiert und wie der Vertrieb es liest. Das Feld zeigt die gesendete gegen die nötige Antwort.")}>
        <ReadAndRespond />
      </Diagram>
      <ShowMore id="A6" part="extra" label={tt("Show: system instead of individual action", "Zeigen: System statt Einzelaktion")}>
        <Callout label={tt("System instead of individual action", "System statt Einzelaktion")} tone="amber">
          <p>{tt("A good salesperson answers signals well by instinct. A system makes sure every signal is answered well, including on the day that salesperson is ill, and including the signals nobody noticed. That is the difference between reacting and managing.", "Ein guter Verkäufer beantwortet Signale aus dem Bauch heraus gut. Ein System sorgt dafür, dass jedes Signal gut beantwortet wird, auch an dem Tag, an dem dieser Verkäufer krank ist, und auch die Signale, die niemand bemerkt hat. Das ist der Unterschied zwischen Reagieren und Steuern.")}</p>
        </Callout>
      </ShowMore>
    </MaterialCard>
  );
}

export function CardA7() {
  return (
    <MaterialCard
      id="A7"
      scan={tt("A measure for emotional retention is worth funding when it has a real effect on a factor, keeps working when people change, and can be done with what you have. Multiply the three and check the budget.", "Eine Maßnahme für emotionale Bindung lohnt sich, wenn sie echte Wirkung auf einen Faktor hat, weiterwirkt, wenn Menschen wechseln, und mit vorhandenen Mitteln umsetzbar ist. Multiplizieren Sie die drei und prüfen Sie das Budget.")}
      reasoning={[
        tt("Read the area first: each measure says which area it acts on (relationship, communication, added value: Materi A3). Customers named those three, so a measure aimed at an area they did not name, such as price, answers no reason they gave.", "Zuerst den Bereich lesen: Jede Maßnahme sagt, auf welchen Bereich sie wirkt (Beziehung, Kommunikation, Mehrwert: Materi A3). Kunden nannten diese drei, eine Maßnahme auf einen Bereich, den sie nicht nannten, etwa den Preis, beantwortet also keinen genannten Grund."),
        tt("Then match the factor a measure builds (trust, appreciation, relevance). A price cut or more of the same messages builds none.", "Dann den Faktor zuordnen, den eine Maßnahme aufbaut (Vertrauen, Wertschätzung, Relevanz). Eine Preissenkung oder mehr derselben Nachrichten bauen keinen auf."),
        tt("Effect: 3 if it removes a reason customers gave for feeling no tie; 2 if it helps a little or only some customers; 1 if it answers no reason they gave.", "Wirkung: 3, wenn sie einen Grund beseitigt, den Kunden für fehlende Bindung nannten; 2, wenn sie etwas hilft oder nur manchen Kunden; 1, wenn sie keinen genannten Grund beantwortet."),
        SUSTAIN_RULE.v,
        tt("Feasibility: 3 with what you have; 2 if it needs one set-up, an approval or scarce time; 1 if it needs something you do not control.", "Machbarkeit: 3 mit dem, was Sie haben; 2, wenn es eine Einrichtung, eine Freigabe oder knappe Zeit braucht; 1, wenn es etwas braucht, das Sie nicht steuern."),
        tt("Score = effect × sustainability × feasibility, from 1 to 27. If the measures you want cost more than the budget, leave out the lowest score.", "Wert = Wirkung × Nachhaltigkeit × Machbarkeit, von 1 bis 27. Kosten die gewünschten Maßnahmen mehr als das Budget, lassen Sie den niedrigsten Wert weg."),
        tt("A strong measure that runs on one person scores low on sustainability on purpose: the same fragility that four account managers in two years showed.", "Eine starke Maßnahme, die auf einer Person läuft, bekommt absichtlich wenig Nachhaltigkeit: dieselbe Zerbrechlichkeit, die vier Account Manager in zwei Jahren zeigten."),
      ]}
      sources={["heskett1994", "meadows1999", "cialdini2021"]}
    >
      <Diagram label={tt("Scoring three measures · a worked example on Kontor Systems", "Drei Maßnahmen bewerten · ein Beispiel mit Kontor Systems")} caption={tt(`Kontor has ${euro(50000)}. Change an effect or feasibility score, or take a measure out. Sustainability follows from what the measure runs on.`, `Kontor hat ${euro(50000)}. Ändern Sie einen Wirkungs- oder Machbarkeitswert oder nehmen Sie eine Maßnahme heraus. Die Nachhaltigkeit folgt daraus, worauf die Maßnahme läuft.`)}>
        <ScoreExample />
      </Diagram>
      <DataTable
        head={[tt("Score", "Wert"), "3", "2", "1"]}
        rows={[
          [tt("Effect", "Wirkung"), tt("Removes a reason customers gave", "Beseitigt einen genannten Grund"), tt("Helps a little, or some customers", "Hilft etwas, oder manchen"), tt("Answers no reason given", "Beantwortet keinen genannten Grund")],
          [tt("Sustainability", "Nachhaltigkeit"), tt("Runs on a process or system", "Läuft auf Prozess oder System"), tt("Runs on a named role", "Läuft auf einer benannten Rolle"), tt("One person or a one-off", "Eine Person oder einmalig")],
          [tt("Feasibility", "Machbarkeit"), tt("With what you have", "Mit Vorhandenem"), tt("One set-up or scarce time", "Eine Einrichtung oder knappe Zeit"), tt("Needs what you do not control", "Braucht, was Sie nicht steuern")],
        ]}
        caption={tt("The three scores", "Die drei Werte")}
      />
      <ShowMore id="A7" part="extra" label={tt("Show two notes on the scores", "Zwei Hinweise zu den Werten zeigen")}>
        <Bul
          items={[
            tt("The plan names this evaluation for the case: effect × sustainability × feasibility.", "Der Plan nennt diese Bewertung für den Fall: Wirkung × Nachhaltigkeit × Machbarkeit."),
            tt("Scores make a judgement comparable; they are not a mark.", "Werte machen ein Urteil vergleichbar; sie sind keine Note."),
          ]}
        />
      </ShowMore>
    </MaterialCard>
  );
}

export const CARDS_A = [CardA1, CardA2, CardA3, CardA4, CardA5, CardA6, CardA7];
