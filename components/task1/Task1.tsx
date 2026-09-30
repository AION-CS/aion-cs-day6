"use client";

import { ExportBar } from "@/components/ui/ExportBar";
import { OptionalSection } from "@/components/ui/OptionalSection";
import { Block11, Block12, Block13, Block14 } from "@/components/task1/Part1";
import { Block21, Block22, Block23 } from "@/components/task1/Part2";
import { Callout } from "@/components/ui/MaterialCard";
import { BUDGET, MONTHS } from "@/data/measures";
import { analysisBody } from "@/lib/exportDoc";
import { l1Missing } from "@/lib/missing";
import { euro, tt } from "@/lib/lang";
import { exportName } from "@/lib/slug";
import { usePersisted } from "@/store/usePersisted";
import { Gloss } from "@/lib/glossify";
import { BLOCK_MINUTES, TASK1_MINUTES } from "@/lib/routes";

function CaseBrief() {
  return (
    <section id="case-brief" aria-labelledby="case-h" className="card space-y-3 p-4 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="case-h">{tt("The case: NetSolutions GmbH", "Der Fall: NetSolutions GmbH")}</h2>
        <span className="smallcaps">{tt("Read once · about 5 min", "Einmal lesen · ca. 5 Min.")}</span>
      </div>
      <p className="max-w-prose text-body text-ink">
        <Gloss>
          {tt(
            "NetSolutions GmbH is a German provider of managed IT services for the Mittelstand: it runs networks, workplaces and servers for about 150 customers. The service works and customers say so. Yet they are satisfied but not loyal, repeat purchases are rare, and competitors who are more active in customer contact win them away. Inside, sales reacts instead of managing.",
            "NetSolutions GmbH ist ein deutscher Anbieter von Managed IT Services für den Mittelstand: Er betreibt Netzwerke, Arbeitsplätze und Server für etwa 150 Kunden. Der Service funktioniert, und die Kunden sagen das. Trotzdem sind sie zufrieden, aber nicht treu, Wiederkäufe sind selten, und Wettbewerber, die im Kundenkontakt aktiver sind, werben sie ab. Intern reagiert der Vertrieb, statt zu steuern.",
          )}
        </Gloss>
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-line bg-canvas p-3 text-caption">
          <p className="smallcaps">{tt("What you have", "Was Sie haben")}</p>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-ink">
            <li>{tt("Nine things customers said in account reviews and exit calls (Block 1.1).", "Neun Aussagen von Kunden aus Account-Reviews und Abschlussgesprächen (Block 1.1).")}</li>
            <li>{tt("Customer survey and contract data (Block 1.2).", "Kundenbefragung und Vertragsdaten (Block 1.2).")}</li>
            <li>{tt("Twelve observations from current expansion and renewal deals (Block 2.1).", "Zwölf Beobachtungen aus laufenden Erweiterungs- und Verlängerungsdeals (Block 2.1).")}</li>
          </ul>
        </div>
        <div className="rounded-lg border border-line bg-canvas p-3 text-caption">
          <p className="smallcaps">{tt("The limits", "Die Grenzen")}</p>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-ink">
            <li>
              {tt("Budget: ", "Budget: ")}
              <strong>{euro(BUDGET)}</strong>
            </li>
            <li>
              {tt("Time: ", "Zeit: ")}
              <strong>{tt(`${MONTHS} months`, `${MONTHS} Monate`)}</strong>
            </li>
            <li>{tt("The cost and weeks of every measure are printed in Block 2.3.", "Kosten und Wochen jeder Maßnahme stehen in Block 2.3.")}</li>
          </ul>
        </div>
        <div className="rounded-lg border border-line bg-canvas p-3 text-caption">
          <p className="smallcaps">{tt(`How the task runs · about ${TASK1_MINUTES} min`, `So läuft die Aufgabe · ca. ${TASK1_MINUTES} Min.`)}</p>
          <ol className="mt-1 list-decimal space-y-1 pl-4 text-ink">
            <li>{tt("Understand why satisfied customers feel no tie, and what delight is worth (Level 1).", "Verstehen, warum zufriedene Kunden keine Bindung spüren, und was Begeisterung wert ist (Level 1).")}</li>
            <li>{tt("Read the signals in live deals and design a simple response system (Level 2).", "Die Signale in laufenden Deals lesen und ein einfaches Antwortsystem gestalten (Level 2).")}</li>
            <li>{tt("Choose three measures for emotional retention and defend the order.", "Drei Maßnahmen für emotionale Bindung wählen und die Reihenfolge begründen.")}</li>
          </ol>
        </div>
      </div>
      <Callout label={tt("Case assumption", "Fallannahme")} tone="amber">
        <p>
          {tt(
            "The brief says: customers satisfied but not loyal, few repeat purchases, sales reacts instead of managing, good performance, little personal attachment, competitors more active in customer contact, €140,000 and six months. Everything else is made up for this exercise: the names, the quotes, the survey figures and the costs.",
            "Der Auftrag sagt: Kunden zufrieden, aber nicht treu, wenige Wiederkäufe, der Vertrieb reagiert statt zu steuern, gute Leistung, wenig persönliche Bindung, Wettbewerber im Kundenkontakt aktiver, 140.000 € und sechs Monate. Alles andere ist für diese Übung erfunden: die Namen, die Zitate, die Befragungszahlen und die Kosten.",
          )}
        </p>
      </Callout>
    </section>
  );
}

function PartHeading({ id, n, title, level }: { id: string; n: number; title: string; level: string }) {
  return (
    <div id={id} className="flex flex-wrap items-baseline gap-x-3 border-b-2 border-ink pb-1 pt-2">
      <span className="smallcaps text-accent">{tt(`Part ${n}`, `Teil ${n}`)}</span>
      <h2>{title}</h2>
      <span className="smallcaps ml-auto">{level}</span>
    </div>
  );
}

export function Task1() {
  const p = usePersisted();
  const missing = l1Missing(p);
  const filename = exportName(p.participant.name, "l1l2-retention-analysis");
  return (
    <section id="task-1" aria-labelledby="task1-h" className="space-y-6">
      <header className="space-y-1">
        <p className="smallcaps text-accent">{tt(`Task 1 · about ${TASK1_MINUTES} minutes`, `Task 1 · ca. ${TASK1_MINUTES} Minuten`)}</p>
        <h2 id="task1-h">{tt("Retention Analysis: from satisfied to attached", "Retention Analysis: von zufrieden zu gebunden")}</h2>
      </header>
      <CaseBrief />
      <PartHeading id="part-1" n={1} title={tt("Understand the missing tie", "Die fehlende Bindung verstehen")} level={tt("Level 1 · Knowledge", "Level 1 · Wissen")} />
      <Block11 />
      <Block12 />
      <OptionalSection
        id="block-1-3"
        title={tt("Block 1.3 · What is missing, three approaches to delight", "Block 1.3 · Was fehlt, drei Ansätze für Begeisterung")}
        minutes={BLOCK_MINUTES["1.3"]}
        reason={tt("Turns the sort of Block 1.1 into approaches in your own words; the measures of Block 2.3 do not need it.", "Macht aus der Sortierung von Block 1.1 Ansätze in eigenen Worten; die Maßnahmen in Block 2.3 brauchen es nicht.")}
      >
        <Block13 />
      </OptionalSection>
      <OptionalSection
        id="block-1-4"
        title={tt("Block 1.4 · Coaching reflection", "Block 1.4 · Coaching-Reflexion")}
        minutes={BLOCK_MINUTES["1.4"]}
        reason={tt("A reflective bridge between Level 1 and Level 2, not content the Retention Analysis File itself needs.", "Eine reflektierende Brücke zwischen Level 1 und Level 2, kein Inhalt, den die Retention Analysis File selbst braucht.")}
      >
        <Block14 />
      </OptionalSection>
      <PartHeading id="part-2" n={2} title={tt("Read the signals and act", "Die Signale lesen und handeln")} level={tt("Level 2 · Application", "Level 2 · Anwendung")} />
      <Block21 />
      <OptionalSection
        id="block-2-2"
        title={tt("Block 2.2 · Weaknesses and a simple response system", "Block 2.2 · Schwächen und ein einfaches Antwortsystem")}
        minutes={BLOCK_MINUTES["2.2"]}
        reason={tt("Designs the response to each signal type from your tags in Block 2.1; Block 2.3 can be answered without it.", "Gestaltet die Antwort auf jede Signalart aus Ihrer Zuordnung in Block 2.1; Block 2.3 lässt sich auch ohne es beantworten.")}
      >
        <Block22 />
      </OptionalSection>
      <Block23 />
      <ExportBar
        id="export-l1l2"
        previewTitle={tt("Preview of your Retention Analysis File", "Vorschau Ihrer Retention Analysis File")}
        exportLabel={tt("Export the Retention Analysis File", "Retention Analysis File exportieren")}
        docTitle="Retention Analysis File"
        filename={filename}
        missing={missing}
        buildBody={() => analysisBody(p)}
      />
    </section>
  );
}
