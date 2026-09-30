import { getLang } from "@/lib/lang";

/**
 * Plain-language glossary (CLAUDE.md #19), in English and German (#32). Every technical term, abbreviation or German word that the
 * material or a task uses is an entry here. In the text it becomes a dotted link; a click opens the explanation. Written for someone
 * who is NOT an expert: short sentences, everyday words, one example where it helps.
 *
 * `match` lists every English written form; `de.match` every form the German text uses (the English term itself, with the German
 * plural or genitive forms, and German words). The German `title` keeps the English term where German practitioners use it. An
 * all-capitals match ("CRM") is matched exactly, so ordinary words never turn into links.
 */
export type GlossDe = { title?: string; match: string[]; plain: string; example?: string };
export type GlossEntry = {
  id: string;
  title: string;
  match: string[];
  exactCase?: boolean;
  plain: string;
  example?: string;
  from?: string;
  de?: GlossDe;
};

export const GLOSSARY: GlossEntry[] = [
  // --- satisfaction, delight, retention -----------------------------------------
  {
    id: "satisfaction",
    title: "Customer satisfaction",
    match: ["satisfaction", "satisfied"],
    plain: "How well a customer thinks you delivered what was promised. A satisfied customer has no reason to complain, but that does not mean they have a reason to stay.",
    example: "A customer who rates the service 4 out of 5 is satisfied.",
    from: "Oliver 1997",
    de: {
      title: "Kundenzufriedenheit",
      match: ["Zufriedenheit", "Kundenzufriedenheit", "zufrieden", "zufriedene", "zufriedenen", "Zufriedene", "Zufriedenen"],
      plain: "Wie gut ein Kunde findet, dass Sie geliefert haben, was versprochen war. Ein zufriedener Kunde hat keinen Grund zur Beschwerde, aber deshalb noch keinen Grund zu bleiben.",
      example: "Ein Kunde, der den Service mit 4 von 5 bewertet, ist zufrieden.",
    },
  },
  {
    id: "delight",
    title: "Customer delight",
    match: ["delight", "delighted"],
    plain: "The feeling that a company did more than expected, in a way that mattered to the customer. Delighted customers stay much longer and recommend you, because they feel a tie, not only a contract.",
    example: "In the case, delighted customers leave at 5% a year, satisfied ones at 20%.",
    from: "Oliver, Rust & Varki 1997",
    de: {
      title: "Kundenbegeisterung",
      match: ["Begeisterung", "Kundenbegeisterung", "begeistert", "begeisterte", "begeisterten", "Begeisterte", "Begeisterten"],
      plain: "Das Gefühl, dass ein Unternehmen mehr getan hat als erwartet, und zwar auf eine Weise, die dem Kunden wichtig war. Begeisterte Kunden bleiben viel länger und empfehlen weiter, weil sie eine Bindung spüren, nicht nur einen Vertrag.",
      example: "Im Fall gehen begeisterte Kunden mit 5 % pro Jahr, zufriedene mit 20 %.",
    },
  },
  {
    id: "loyalty",
    title: "Loyalty",
    match: ["loyalty", "loyal"],
    plain: "A customer's wish to stay with you and buy again, even when a competitor calls. It shows in behaviour: renewals, repeat purchases and recommendations.",
    from: "Jones & Sasser 1995",
    de: {
      title: "Loyalität",
      match: ["Loyalität", "loyal", "treu", "Treue"],
      plain: "Der Wunsch eines Kunden, bei Ihnen zu bleiben und wieder zu kaufen, auch wenn ein Wettbewerber anruft. Sie zeigt sich im Verhalten: Verlängerungen, Wiederkäufe und Empfehlungen.",
    },
  },
  {
    id: "emotional-retention",
    title: "Emotional retention",
    match: ["emotional retention", "customer retention", "retention", "attachment"],
    plain: "Keeping customers because they feel connected to you (a person they trust, the feeling of being valued, advice that helps them), not only because a contract or a switching cost holds them. Attachment is that felt tie.",
    from: "Gustafsson et al. 2005",
    de: {
      title: "Emotionale Kundenbindung",
      match: ["emotionale Bindung", "emotionalen Bindung", "Kundenbindung", "Bindung", "Retention"],
      plain: "Kunden halten, weil sie sich verbunden fühlen (eine Person, der sie vertrauen, das Gefühl, geschätzt zu werden, Rat, der ihnen hilft), nicht nur, weil ein Vertrag oder Wechselkosten sie halten. Bindung ist genau dieses gefühlte Band.",
    },
  },
  {
    id: "kano",
    title: "Kano model",
    match: ["Kano", "Kano model", "basic factor", "basic factors", "performance factor", "performance factors", "delight factor", "delight factors"],
    plain: "A way to sort what customers expect. Basic factors are taken for granted: missing them angers, having them earns no thanks. Performance factors please more the better they are. Delight factors are unexpected and create enthusiasm.",
    example: "A network that works is a basic factor; a helpful idea nobody asked for is a delight factor.",
    from: "Kano 1984",
    de: {
      title: "Kano-Modell",
      match: ["Kano", "Kano-Modell", "Basisfaktor", "Basisfaktoren", "Leistungsfaktor", "Leistungsfaktoren", "Begeisterungsfaktor", "Begeisterungsfaktoren"],
      plain: "Eine Art, Kundenerwartungen zu sortieren. Basisfaktoren werden vorausgesetzt: Fehlen sie, ärgert das, sind sie da, gibt es keinen Dank. Leistungsfaktoren erfreuen umso mehr, je besser sie sind. Begeisterungsfaktoren sind unerwartet und wecken Begeisterung.",
      example: "Ein Netzwerk, das funktioniert, ist ein Basisfaktor; eine hilfreiche Idee, nach der niemand gefragt hat, ist ein Begeisterungsfaktor.",
    },
  },
  {
    id: "churn",
    title: "Churn, churn rate",
    match: ["churn", "churn rate", "churn rates", "churned"],
    plain: "Churn means customers leaving. The churn rate is the share who leave in a year.",
    example: "90 customers and a 20% churn rate: 18 customers leave in a year.",
    de: {
      title: "Churn, Churn Rate (Abwanderungsquote)",
      match: ["Churn", "Churn Rate", "Churn Rates", "abwandern", "abwanderten", "Abwanderung"],
      plain: "Churn heißt, dass Kunden gehen. Die Churn Rate ist der Anteil, der in einem Jahr geht.",
      example: "90 Kunden und 20 % Churn Rate: 18 Kunden gehen in einem Jahr.",
    },
  },
  {
    id: "trust",
    title: "Trust (retention factor)",
    match: ["Trust"],
    exactCase: true,
    plain: "The first emotional retention factor: the customer can rely on you, and on a person who knows them. It grows from promises kept and from a named contact who stays.",
    from: "Morgan & Hunt 1994",
    de: {
      title: "Vertrauen (Bindungsfaktor)",
      match: ["Vertrauen"],
      plain: "Der erste emotionale Bindungsfaktor: Der Kunde kann sich auf Sie verlassen, und auf eine Person, die ihn kennt. Es wächst aus gehaltenen Versprechen und aus einem festen Ansprechpartner, der bleibt.",
    },
  },
  {
    id: "appreciation",
    title: "Appreciation (retention factor)",
    match: ["Appreciation"],
    exactCase: true,
    plain: "The second emotional retention factor: the customer feels seen and valued as this customer, not as a ticket number. It shows in time and attention given, not in gifts.",
    from: "Palmatier et al. 2006",
    de: {
      title: "Wertschätzung (Bindungsfaktor)",
      match: ["Wertschätzung"],
      plain: "Der zweite emotionale Bindungsfaktor: Der Kunde fühlt sich als genau dieser Kunde gesehen und geschätzt, nicht als Ticketnummer. Sie zeigt sich in geschenkter Zeit und Aufmerksamkeit, nicht in Geschenken.",
    },
  },
  {
    id: "relevance",
    title: "Relevance (retention factor)",
    match: ["Relevance"],
    exactCase: true,
    plain: "The third emotional retention factor: what you offer fits the customer's own situation and makes them better at their work, beyond the contract.",
    example: "A review that shows how similar companies use the platform better.",
    de: {
      title: "Relevanz (Bindungsfaktor)",
      match: ["Relevanz"],
      plain: "Der dritte emotionale Bindungsfaktor: Was Sie bieten, passt zur Lage des Kunden und macht ihn in seiner Arbeit besser, über den Vertrag hinaus.",
      example: "Ein Review, das zeigt, wie ähnliche Firmen die Plattform besser nutzen.",
    },
  },
  {
    id: "areas",
    title: "Relationship, communication, added value",
    match: ["Relationship", "Communication", "Added value"],
    exactCase: true,
    plain: "Three areas where a missing tie usually shows. Relationship: no person the customer knows. Communication: messages that come at the wrong time or say nothing useful. Added value: nothing the customer gains beyond the contract.",
    de: {
      title: "Beziehung, Kommunikation, Mehrwert",
      match: ["Beziehung", "Kommunikation", "Mehrwert"],
      plain: "Drei Bereiche, in denen sich fehlende Bindung meist zeigt. Beziehung: keine Person, die der Kunde kennt. Kommunikation: Nachrichten zur falschen Zeit oder ohne Nutzen. Mehrwert: nichts, was der Kunde über den Vertrag hinaus gewinnt.",
    },
  },
  {
    id: "repeat-purchase",
    title: "Repeat purchase, renewal, expansion",
    match: ["repeat purchase", "repeat purchases", "renewal", "renewals", "expansion", "expansions"],
    plain: "A renewal is a customer extending its contract. An expansion or repeat purchase is buying more (another site, another service). Both are loyalty you can count.",
    de: {
      title: "Wiederkauf, Verlängerung, Erweiterung",
      match: ["Wiederkauf", "Wiederkäufe", "Wiederkauf", "Verlängerung", "Verlängerungen", "Erweiterung", "Erweiterungen"],
      plain: "Eine Verlängerung heißt, der Kunde verlängert seinen Vertrag. Eine Erweiterung oder ein Wiederkauf heißt, er kauft mehr (ein weiterer Standort, ein weiterer Service). Beides ist zählbare Loyalität.",
    },
  },
  // --- buying signals -------------------------------------------------------------
  {
    id: "buying-signal",
    title: "Buying signal",
    match: ["buying signal", "buying signals", "signal type", "signal types"],
    plain: "Something a buyer says or does that shows where they stand in a decision. Four types are used here: interest, comparison, decision proximity and uncertainty. Each needs a different answer.",
    from: "Rackham 1988",
    de: {
      title: "Kaufsignal",
      match: ["Kaufsignal", "Kaufsignale", "Kaufsignalen", "Signalart", "Signalarten"],
      plain: "Etwas, das ein Käufer sagt oder tut und das zeigt, wo er in einer Entscheidung steht. Hier werden vier Arten genutzt: Interesse, Vergleich, Entscheidungsnähe und Unsicherheit. Jede braucht eine andere Antwort.",
    },
  },
  {
    id: "sig-interest",
    title: "Interest (signal)",
    match: ["Interest"],
    exactCase: true,
    plain: "A buying signal: the buyer imagines using the service and asks how it would work for them. The right answer is depth and a concrete next step.",
    example: "“How would the rollout to our second site work?”",
    de: {
      title: "Interesse (Signal)",
      match: ["Interesse"],
      plain: "Ein Kaufsignal: Der Käufer stellt sich die Nutzung vor und fragt, wie es bei ihm funktionieren würde. Die richtige Antwort ist Tiefe und ein konkreter nächster Schritt.",
      example: "„Wie würde der Rollout an unserem zweiten Standort laufen?“",
    },
  },
  {
    id: "sig-comparison",
    title: "Comparison (signal)",
    match: ["Comparison"],
    exactCase: true,
    plain: "A buying signal: the buyer weighs you against a named alternative (feature lists, prices, an evaluation matrix). The right answer is a fair comparison and a reference.",
    de: {
      title: "Vergleich (Signal)",
      match: ["Vergleich"],
      plain: "Ein Kaufsignal: Der Käufer wägt Sie gegen eine benannte Alternative ab (Funktionslisten, Preise, eine Bewertungsmatrix). Die richtige Antwort ist ein fairer Vergleich und eine Referenz.",
    },
  },
  {
    id: "sig-proximity",
    title: "Decision proximity (signal)",
    match: ["decision proximity", "Decision proximity"],
    plain: "A buying signal: the buyer talks about when, who signs and with what budget. They are close to deciding. The right answer is a decision plan.",
    de: {
      title: "Entscheidungsnähe (Signal)",
      match: ["Entscheidungsnähe"],
      plain: "Ein Kaufsignal: Der Käufer spricht über wann, wer unterschreibt und mit welchem Budget. Er ist nah an der Entscheidung. Die richtige Antwort ist ein Entscheidungsplan.",
    },
  },
  {
    id: "sig-uncertainty",
    title: "Uncertainty (signal)",
    match: ["Uncertainty", "hesitation"],
    exactCase: true,
    plain: "A signal that looks like interest and is the opposite: the buyer hesitates, postpones, asks how to get out. The right answer is to name the concern and make the risk smaller, the same day.",
    example: "“What happens to our data if it fails?”",
    de: {
      title: "Unsicherheit (Signal)",
      match: ["Unsicherheit", "Zögern", "Zögersignal", "Zögersignale"],
      plain: "Ein Signal, das wie Interesse aussieht und das Gegenteil ist: Der Käufer zögert, verschiebt, fragt, wie er wieder herauskommt. Die richtige Antwort: die Sorge ansprechen und das Risiko verkleinern, am selben Tag.",
      example: "„Was passiert mit unseren Daten, wenn es scheitert?“",
    },
  },
  {
    id: "evaluation-matrix",
    title: "Evaluation matrix",
    match: ["evaluation matrix", "evaluation matrices"],
    plain: "A table a buyer uses to score several providers on the same criteria before choosing one.",
    de: {
      title: "Bewertungsmatrix",
      match: ["Bewertungsmatrix", "Bewertungsmatrizen"],
      plain: "Eine Tabelle, mit der ein Käufer mehrere Anbieter nach denselben Kriterien bewertet, bevor er einen wählt.",
    },
  },
  {
    id: "stall",
    title: "Stalled deal",
    match: ["stalled", "stall", "stalls"],
    plain: "A deal that has stopped moving: no decision, no new questions, meetings pushed back. It is not lost yet, but it is where lost deals usually start.",
    de: {
      title: "Stockender Deal",
      match: ["stockt", "stockend", "stockende", "stockten", "Stillstand"],
      plain: "Ein Deal, der sich nicht mehr bewegt: keine Entscheidung, keine neuen Fragen, verschobene Termine. Er ist noch nicht verloren, aber dort beginnen verlorene Deals meistens.",
    },
  },
  {
    id: "response-time",
    title: "Response time",
    match: ["response time", "response times"],
    plain: "How fast a signal must be answered. A signal loses value while it waits, some types faster than others.",
    de: {
      title: "Reaktionszeit",
      match: ["Reaktionszeit", "Reaktionszeiten"],
      plain: "Wie schnell ein Signal beantwortet werden muss. Ein Signal verliert an Wert, während es wartet, manche Arten schneller als andere.",
    },
  },
  // --- measures and system ----------------------------------------------------------
  {
    id: "esf",
    title: "Effect, sustainability, feasibility",
    match: ["Effect", "Sustainability", "Feasibility", "sustainability", "feasibility"],
    exactCase: true,
    plain: "The three tests a retention measure is scored on, each Low (1) to High (3), multiplied. Effect: how strongly it builds attachment. Sustainability: whether it still works next year (a process lasts longer than one person). Feasibility: whether it can be done with the time and people available.",
    example: "3 × 3 × 2 = 18.",
    de: {
      title: "Wirkung, Nachhaltigkeit, Machbarkeit",
      match: ["Wirkung", "Nachhaltigkeit", "Machbarkeit"],
      plain: "Die drei Tests, nach denen eine Bindungsmaßnahme bewertet wird, jeweils Niedrig (1) bis Hoch (3), multipliziert. Wirkung: wie stark sie Bindung aufbaut. Nachhaltigkeit: ob sie nächstes Jahr noch wirkt (ein Prozess hält länger als eine Person). Machbarkeit: ob sie mit der verfügbaren Zeit und den Leuten umsetzbar ist.",
      example: "3 × 3 × 2 = 18.",
    },
  },
  {
    id: "playbook",
    title: "Playbook",
    match: ["playbook", "playbooks"],
    plain: "A written set of rules for a recurring situation: when X happens, who does what, how fast. It makes a good response the normal one, not the lucky one.",
    de: {
      title: "Playbook",
      match: ["Playbook", "Playbooks"],
      plain: "Ein schriftliches Regelwerk für eine wiederkehrende Situation: Wenn X passiert, wer tut was, wie schnell. Es macht eine gute Reaktion zur normalen, nicht zur glücklichen.",
    },
  },
  {
    id: "shared-view",
    title: "Shared customer view",
    match: ["shared customer view", "shared view"],
    plain: "One record per customer that sales, service and marketing all see: history, contacts, open signals, next step. Without it every team acts on its own piece of the story.",
    de: {
      title: "Gemeinsame Kundensicht",
      match: ["gemeinsame Kundensicht", "gemeinsamen Kundensicht", "gemeinsame Sicht", "gemeinsamen Sicht"],
      plain: "Ein Datensatz pro Kunde, den Vertrieb, Service und Marketing alle sehen: Historie, Kontakte, offene Signale, nächster Schritt. Ohne ihn handelt jedes Team mit seinem eigenen Stück der Geschichte.",
    },
  },
  {
    id: "success-review",
    title: "Success review, benchmark",
    match: ["success review", "success reviews", "benchmark", "benchmarks", "account review", "account reviews"],
    plain: "A regular meeting with a customer about how they use the service and what they could do better. A benchmark compares them with similar companies. An account review is the same kind of meeting from the provider's side.",
    de: {
      title: "Success-Review, Benchmark",
      match: ["Success-Review", "Success-Reviews", "Benchmark", "Benchmarks", "Account-Review", "Account-Reviews"],
      plain: "Ein regelmäßiges Gespräch mit einem Kunden darüber, wie er den Service nutzt und was er besser machen könnte. Ein Benchmark vergleicht ihn mit ähnlichen Firmen. Ein Account-Review ist dasselbe Gespräch aus Sicht des Anbieters.",
    },
  },
  {
    id: "go-live",
    title: "Go-live, onboarding, handover",
    match: ["go-live", "onboarding", "handover"],
    plain: "Go-live is the day a new service starts running for the customer. Onboarding is the first weeks around it. A handover is when sales passes the customer to the people who will look after it.",
    de: {
      title: "Go-live, Onboarding, Übergabe",
      match: ["Go-live", "Onboarding", "Übergabe"],
      plain: "Go-live ist der Tag, an dem ein neuer Service für den Kunden startet. Onboarding sind die ersten Wochen drumherum. Eine Übergabe ist, wenn der Vertrieb den Kunden an die Menschen weitergibt, die ihn betreuen.",
    },
  },
  {
    id: "account-manager",
    title: "Account manager",
    match: ["account manager", "account managers"],
    plain: "The person in sales who looks after a customer's contract and relationship. When it changes often, the customer loses the person who knew its story.",
    de: {
      title: "Account Manager",
      match: ["Account Manager", "Account Managerin", "Account Managern"],
      plain: "Die Person im Vertrieb, die Vertrag und Beziehung eines Kunden betreut. Wechselt sie oft, verliert der Kunde die Person, die seine Geschichte kannte.",
    },
  },
  {
    id: "lever-tests",
    title: "Reach, depth, durability, scale",
    match: ["Reach", "Depth", "Durability", "Scale"],
    exactCase: true,
    plain: "Four tests for a strategic lever. Reach: how many customers it touches. Depth: how strongly it builds attachment in one. Durability: whether it works when people change. Scale: whether the cost per extra customer falls as the base grows.",
    de: {
      title: "Reichweite, Tiefe, Dauerhaftigkeit, Skalierung",
      match: ["Reichweite", "Tiefe", "Dauerhaftigkeit", "Skalierung"],
      plain: "Vier Tests für einen strategischen Hebel. Reichweite: wie viele Kunden er erreicht. Tiefe: wie stark er Bindung bei einem aufbaut. Dauerhaftigkeit: ob er wirkt, wenn Menschen wechseln. Skalierung: ob die Kosten pro zusätzlichem Kunden sinken, wenn die Basis wächst.",
    },
  },
  {
    id: "service-profit-chain",
    title: "Service-profit chain",
    match: ["service-profit chain"],
    plain: "The idea that how a company organises its service work drives how customers feel, which drives loyalty, which drives profit. Change the system, and the results follow.",
    from: "Heskett et al. 1994",
    de: {
      title: "Service-Profit-Chain",
      match: ["Service-Profit-Chain"],
      plain: "Die Idee, dass die Organisation der Servicearbeit bestimmt, wie Kunden sich fühlen; das bestimmt die Loyalität, und die bestimmt den Gewinn. Ändern Sie das System, folgen die Ergebnisse.",
    },
  },
  {
    id: "raci",
    title: "RACI",
    match: ["RACI"],
    plain: "A grid that says, for each activity, who does the work (R), who answers for the result and decides (A), who is asked before (C) and who is told after (I). Each activity has exactly one A.",
    from: "PMI 2021",
    de: {
      match: ["RACI"],
      plain: "Ein Raster, das für jede Aktivität sagt, wer die Arbeit macht (R), wer das Ergebnis verantwortet und entscheidet (A), wer vorher gefragt wird (C) und wer nachher informiert wird (I). Jede Aktivität hat genau ein A.",
    },
  },
  {
    id: "raci-r",
    title: "Responsible (R)",
    match: ["Responsible"],
    exactCase: true,
    plain: "In a RACI grid: the role that does the work. There can be more than one.",
    de: { title: "Responsible (R, durchführend)", match: ["Responsible"], plain: "Im RACI-Raster: die Rolle, die die Arbeit macht. Es kann mehrere geben." },
  },
  {
    id: "raci-a",
    title: "Accountable (A)",
    match: ["Accountable"],
    exactCase: true,
    plain: "In a RACI grid: the one role that answers for the result and has the authority to decide. Exactly one per activity.",
    de: { title: "Accountable (A, verantwortlich)", match: ["Accountable"], plain: "Im RACI-Raster: die eine Rolle, die für das Ergebnis geradesteht und die Befugnis hat zu entscheiden. Genau eine pro Aktivität." },
  },
  {
    id: "raci-c",
    title: "Consulted (C)",
    match: ["Consulted"],
    exactCase: true,
    plain: "In a RACI grid: a role whose knowledge is needed and that is asked before the work is done.",
    de: { title: "Consulted (C, befragt)", match: ["Consulted"], plain: "Im RACI-Raster: eine Rolle, deren Wissen gebraucht wird und die vorher gefragt wird." },
  },
  {
    id: "raci-i",
    title: "Informed (I)",
    match: ["Informed"],
    exactCase: true,
    plain: "In a RACI grid: a role that only needs to know afterwards what was done.",
    de: { title: "Informed (I, informiert)", match: ["Informed"], plain: "Im RACI-Raster: eine Rolle, die nur hinterher wissen muss, was getan wurde." },
  },
  {
    id: "cco",
    title: "CCO — Chief Customer Officer",
    match: ["CCO", "Chief Customer Officer"],
    plain: "The board-level manager who answers for customers as a whole: retention, satisfaction and how sales, service and marketing work together for the customer.",
    de: {
      match: ["CCO", "Chief Customer Officer"],
      plain: "Die Führungskraft auf Vorstandsebene, die für die Kunden als Ganzes verantwortlich ist: Bindung, Zufriedenheit und wie Vertrieb, Service und Marketing für den Kunden zusammenarbeiten.",
    },
  },
  {
    id: "sales-ops",
    title: "Sales Operations",
    match: ["Sales Operations"],
    plain: "The team that runs the tools and processes behind sales: the CRM, its fields, reports and automations.",
    de: { match: ["Sales Operations"], plain: "Das Team, das Werkzeuge und Prozesse hinter dem Vertrieb betreibt: das CRM, seine Felder, Berichte und Automatisierungen." },
  },
  {
    id: "no-regret",
    title: "No-regret move",
    match: ["no-regret", "no-regret move", "no-regret items"],
    plain: "A step that is right whatever the uncertain facts turn out to be. You can take it now, while you wait for the rest of the evidence.",
    example: "A shared customer view helps whichever lever proves strongest later.",
    from: "Courtney et al. 1997",
    de: {
      title: "No-regret-Schritt",
      match: ["No-regret", "No-regret-Punkte", "No-regret-Schritt"],
      plain: "Ein Schritt, der richtig ist, egal wie die unsicheren Fakten ausfallen. Sie können ihn jetzt gehen, während Sie auf den Rest der Evidenz warten.",
      example: "Eine gemeinsame Kundensicht hilft jedem Hebel, der sich später als stärkster erweist.",
    },
  },

  // --- general terms kept from the course ------------------------------------------
  {
    id: "gross-margin",
    title: "Gross margin, gross profit",
    match: ["gross margin", "gross profit", "margin"],
    plain: "What is left of revenue after the direct cost of delivering the service. The margin is that share in percent; the gross profit is the amount in euros.",
    example: "€10,000 of revenue at a 35% margin is €3,500 of gross profit.",
    de: {
      title: "Bruttomarge, Rohertrag",
      match: ["Bruttomarge", "Rohertrag", "Marge"],
      plain: "Was vom Umsatz übrig bleibt, nachdem die direkten Kosten der Leistung bezahlt sind. Die Marge ist dieser Anteil in Prozent; der Rohertrag ist der Betrag in Euro.",
      example: "10.000 € Umsatz bei 35 % Marge sind 3.500 € Rohertrag.",
    },
  },
  {
    id: "pilot",
    title: "Pilot",
    match: ["pilot"],
    plain: "A small, time-limited trial run on real customers before a change is rolled out to everyone. For a hesitating buyer, a pilot makes the risk of saying yes smaller.",
    de: {
      title: "Pilot",
      match: ["Pilot", "Piloten", "Pilotphase"],
      plain: "Ein kleiner, zeitlich begrenzter Versuch mit echten Kunden, bevor eine Änderung für alle eingeführt wird. Für einen zögernden Käufer macht ein Pilot das Risiko eines Ja kleiner.",
    },
  },
  {
    id: "crm",
    title: "CRM — customer relationship management system",
    match: ["CRM"],
    plain: "The software in which a sales team records every customer and deal: contacts, notes, orders, next steps. A shared customer view is built in it.",
    de: { title: "CRM — Customer Relationship Management", match: ["CRM", "CRM-Einrichtung", "CRM-Daten"], plain: "Die Software, in der ein Vertriebsteam jeden Kunden und jeden Deal festhält: Kontakte, Notizen, Bestellungen, nächste Schritte. Eine gemeinsame Kundensicht wird darin aufgebaut." },
  },
  {
    id: "managed-service",
    title: "Managed service",
    match: ["managed IT services", "managed service", "managed services"],
    plain: "A service the provider runs for the customer, including monitoring and fixing, so the customer does not need its own staff for it.",
    de: { title: "Managed Service", match: ["Managed IT Services", "Managed Service", "Managed Services", "Managed-Service"], plain: "Ein Service, den der Anbieter für den Kunden betreibt, einschließlich Überwachung und Störungsbehebung, sodass der Kunde dafür kein eigenes Personal braucht." },
  },
  {
    id: "mittelstand",
    title: "Mittelstand (mid-sized companies)",
    match: ["Mittelstand"],
    exactCase: true,
    plain: "The German word for mid-sized, often family-owned companies, the backbone of the German economy. Many have a small IT team or none.",
    de: { title: "Mittelstand", match: ["Mittelstand", "Mittelstandsunternehmen", "Mittelständler"], plain: "Mittelgroße, oft familiengeführte Unternehmen, das Rückgrat der deutschen Wirtschaft. Viele haben ein kleines oder gar kein IT-Team." },
  },
  {
    id: "tripwire",
    title: "Tripwire",
    match: ["tripwire"],
    plain: "A result agreed in advance that makes you change course: a metric, a threshold, a date and an action.",
    example: "At Elbe, an example company: if fewer than 73 customers rate 5 of 5 by month 6 (today 55), one item of the plan is adjusted.",
    de: { title: "Tripwire", match: ["Tripwire", "Tripwires"], plain: "Ein vorab vereinbartes Ergebnis, bei dem Sie den Kurs ändern: eine Kennzahl, ein Schwellenwert, ein Datum und eine Aktion.", example: "Bei Elbe, einem Beispielunternehmen: Bewerten bis Monat 6 weniger als 73 Kunden mit 5 von 5 (heute 55), wird ein Punkt des Plans angepasst." },
  },
  {
    id: "staged",
    title: "Staged decision",
    match: ["staged", "stage it"],
    plain: "Deciding the direction now, but committing money in steps, each released only when a checkpoint is met.",
    from: "Courtney et al. 1997",
    de: { title: "Gestufte Entscheidung", match: ["stufenweise", "gestufte"], plain: "Die Richtung jetzt entscheiden, das Geld aber in Schritten binden, die jeweils erst freigegeben werden, wenn ein Kontrollpunkt erreicht ist." },
  },
  {
    id: "baseline",
    title: "Baseline",
    match: ["baseline", "baselines"],
    plain: "The value of a metric before you change anything. Without it you cannot tell whether a measure made a difference.",
    de: { title: "Baseline (Ausgangswert)", match: ["Baseline", "Ausgangswert", "Ausgangswerte"], plain: "Der Wert einer Kennzahl, bevor Sie etwas ändern. Ohne ihn können Sie nicht sagen, ob eine Maßnahme etwas bewirkt hat." },
  },
  {
    id: "owner",
    title: "Owner",
    match: ["owner", "owners"],
    plain: "The one person who can change a measure without asking anyone else, and who must act when its trigger fires.",
    de: { title: "Owner", match: ["Owner"], plain: "Die eine Person, die eine Maßnahme ändern kann, ohne jemanden zu fragen, und die handeln muss, wenn ihr Trigger auslöst." },
  },
  {
    id: "trigger",
    title: "Trigger",
    match: ["trigger", "triggers"],
    plain: "A written rule that says when the owner must act: a metric, a number, a date and an action.",
    de: { title: "Trigger", match: ["Trigger"], plain: "Eine schriftliche Regel, die sagt, wann der Owner handeln muss: eine Kennzahl, eine Zahl, ein Datum und eine Aktion." },
  },
  {
    id: "pickup",
    title: "Pickup point",
    match: ["pickup point"],
    plain: "The number and the date at which you look again at something you postponed. It turns “later” into a decision.",
    de: { title: "Pickup Point", match: ["Pickup Point"], plain: "Die Zahl und das Datum, zu dem Sie etwas Zurückgestelltes wieder ansehen. So wird aus „später“ eine Entscheidung." },
  },
  {
    id: "kpi",
    title: "KPI — key performance indicator",
    match: ["KPI", "KPIs"],
    plain: "One number that shows whether something is working. A good KPI measures the customer's response, not your own activity.",
    de: { match: ["KPI", "KPIs", "Kennzahl"], plain: "Eine Zahl, die zeigt, ob etwas funktioniert. Eine gute KPI misst die Reaktion des Kunden, nicht Ihre eigene Aktivität." },
  },
  {
    id: "premortem",
    title: "Premortem",
    match: ["premortem"],
    plain: "Before a plan starts, imagine it has failed and write down why. It brings hidden assumptions into the open.",
    from: "Klein 2007",
    de: { title: "Premortem", match: ["Premortem"], plain: "Bevor ein Plan startet, stellt man sich vor, er sei gescheitert, und schreibt auf, warum. So kommen versteckte Annahmen ans Licht." },
  },

  // --- the methods for numbers (Materi B6) -----------------------------------------
  {
    id: "payback",
    title: "Payback count",
    match: ["payback count", "payback", "pays back", "pay back", "paid for itself", "pays for itself"],
    plain: "How many results an item must bring before it has earned back what it cost: the cost divided by what one result is worth, rounded up. It turns “we hope it works” into a number you can check.",
    example: "An item costs €18,000 and each customer it wins is worth €2,520: 18,000 ÷ 2,520 = 7.1, so it needs 8 customers.",
    from: "Materi B6",
    de: { title: "Payback-Zähler", match: ["Payback-Zähler", "Payback", "rechnet sich", "rechnen sich", "bezahlt gemacht"], plain: "Wie viele Ergebnisse ein Punkt bringen muss, bis er seine Kosten wieder eingespielt hat: die Kosten geteilt durch den Wert eines Ergebnisses, aufgerundet. So wird aus „wir hoffen, es wirkt“ eine prüfbare Zahl.", example: "Ein Punkt kostet 18.000 €, jeder gewonnene Kunde ist 2.520 € wert: 18.000 ÷ 2.520 = 7,1, also braucht er 8 Kunden." },
  },
  {
    id: "coverage",
    title: "Coverage share",
    match: ["coverage share", "coverage"],
    plain: "The share of customers a step must reach so that the next step can work: the customers the next step needs divided by all customers. It is rarely 100%.",
    example: "If the next step only serves the 150 customers with an open deal out of 200, the record needs 150 ÷ 200 = 75% first.",
    from: "Materi B6",
    de: { title: "Abdeckungsanteil", match: ["Abdeckungsanteil", "Abdeckung"], plain: "Der Anteil der Kunden, den ein Schritt erreichen muss, damit der nächste Schritt wirken kann: die Kunden, die der nächste Schritt braucht, geteilt durch alle Kunden. Selten 100 %.", example: "Bedient der nächste Schritt nur die 150 Kunden mit offenem Deal von 200, braucht der Datensatz zuerst 150 ÷ 200 = 75 %." },
  },
  {
    id: "waiting",
    title: "Cost of waiting",
    match: ["cost of waiting", "costs of waiting"],
    plain: "What it costs not to do something. For an item you leave out: after how many lost customers the gross profit they took equals the item's cost. That count is the point to look again.",
    example: "An item costs €36,000; each customer who leaves takes €10,500 a year: after 4 such losses, waiting has cost more than the item.",
    from: "Materi B6",
    de: { title: "Kosten des Wartens", match: ["Kosten des Wartens"], plain: "Was es kostet, etwas nicht zu tun. Für einen weggelassenen Punkt: nach wie vielen verlorenen Kunden deren mitgenommener Rohertrag die Kosten des Punkts erreicht. Diese Zahl ist der Zeitpunkt, es wieder anzusehen.", example: "Ein Punkt kostet 36.000 €; jeder Kunde, der geht, nimmt 10.500 € pro Jahr mit: Nach 4 solchen Verlusten hat Warten mehr gekostet als der Punkt." },
  },
  {
    id: "confidence",
    title: "Data confidence",
    match: ["data confidence", "data-confidence"],
    plain: "How far you can trust what the data says about a group: how many answered, who filled a field in, how many cases a figure rests on. Low confidence is where your assumptions sit.",
    example: "A churn of 5% that rests on 2 customers a year is low confidence: one more leaver changes it a lot.",
    from: "Materi B5",
    de: { title: "Datenvertrauen", match: ["Datenvertrauen", "Datenvertrauens"], plain: "Wie weit Sie dem trauen können, was die Daten über eine Gruppe sagen: wie viele geantwortet haben, wer ein Feld ausgefüllt hat, auf wie vielen Fällen eine Zahl beruht. Wo das Vertrauen niedrig ist, sitzen Ihre Annahmen.", example: "Ein Churn von 5 %, der auf 2 Kunden pro Jahr beruht, hat niedriges Vertrauen: Ein Abgang mehr ändert ihn stark." },
  },

];

// --- lookup ---------------------------------------------------------------------

export const GLOSS_BY_ID: Record<string, GlossEntry> = Object.fromEntries(GLOSSARY.map((g) => [g.id, g]));

/** The texts of an entry in the active language (the English text where a German version is missing). */
export function glossText(g: GlossEntry): { title: string; plain: string; example?: string; from?: string } {
  if (getLang() === "de" && g.de) return { title: g.de.title ?? g.title, plain: g.de.plain, example: g.de.example, from: g.from };
  return { title: g.title, plain: g.plain, example: g.example, from: g.from };
}

const isAcronym = (s: string) => s === s.toUpperCase() && /[A-Z]/.test(s);
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function build(forms: (g: GlossEntry) => string[] | undefined) {
  const lookup = new Map<string, { entry: GlossEntry; exact: string | null }>();
  for (const g of GLOSSARY) for (const m of forms(g) ?? []) if (!lookup.has(m.toLowerCase())) lookup.set(m.toLowerCase(), { entry: g, exact: g.exactCase || isAcronym(m) ? m : null });
  const re = new RegExp(
    `(?<![\\p{L}\\p{N}_])(${[...lookup.keys()]
      .sort((a, b) => b.length - a.length)
      .map(escapeRe)
      .join("|")})(?![\\p{L}\\p{N}_])`,
    "giu",
  );
  return { lookup, re };
}

const EN = build((g) => g.match);
const DE = build((g) => g.de?.match);

/** lowercase written form → its entry, and whether that form must be matched exactly. */
export const GLOSS_LOOKUP = EN.lookup;
export const GLOSS_RE = EN.re;
export const GLOSS_LOOKUP_DE = DE.lookup;
export const GLOSS_RE_DE = DE.re;
