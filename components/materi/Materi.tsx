"use client";

import { CARDS_A } from "@/components/materi/CardsA";
import { CARDS_B } from "@/components/materi/CardsB";
import { ReferencesAccordion } from "@/components/ui/ReferencesAccordion";
import { SECTIONS } from "@/data/materialIndex";
import type { RefKey } from "@/data/references";
import { tt } from "@/lib/lang";

const REFS_A: RefKey[] = ["jones1995", "oliver1997", "kano1984", "dixon2010", "reichheld1996", "morgan1994", "gustafsson2005", "palmatier2006", "heskett1994", "rackham1988", "adamson2012", "meadows1999", "cialdini2021"];
const REFS_B: RefKey[] = ["meadows1999", "heskett1994", "deming1986", "rackham1988", "adamson2012", "palmatier2006", "pmi2021", "courtney1997", "klein2007", "doran1981"];

function Block({ id, title, intro, children }: { id: string; title: string; intro: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="space-y-4">
      <header className="space-y-1">
        <p className="smallcaps text-accent">{title}</p>
        <h2 id={`${id}-h`}>{intro}</h2>
      </header>
      {children}
    </section>
  );
}
const NOTE = () => tt("Check every source before you teach from it: page numbers and editions differ between printings.", "Prüfen Sie jede Quelle, bevor Sie damit unterrichten: Seitenzahlen und Auflagen unterscheiden sich.");

export function MateriA() {
  const s = SECTIONS[1][0];
  return (
    <Block id={s.id} title={tt(`Materi A · ${s.minutes} minutes, facilitator-led`, `Materi A · ${s.minutes} Minuten, moderiert`)} intro={tt("Emotional retention: why satisfied customers leave, what makes them stay, and how to read and answer their signals", "Emotionale Bindung: warum zufriedene Kunden gehen, was sie bleiben lässt, und wie man ihre Signale liest und beantwortet")}>
      <p className="max-w-prose text-body text-ash">
        {tt(
          "Seven cards, Level 1 and Level 2 in one run: knowledge first (satisfaction and delight, three factors, three areas, what delight is worth), then application (reading signals, answering them, choosing measures). Every diagram uses Kontor Systems, another provider, so the task is never answered for you.",
          "Sieben Karten, Level 1 und Level 2 in einem Durchgang: zuerst Wissen (Zufriedenheit und Begeisterung, drei Faktoren, drei Bereiche, was Begeisterung wert ist), dann Anwendung (Signale lesen, beantworten, Maßnahmen wählen). Jedes Diagramm nutzt Kontor Systems, einen anderen Anbieter, damit die Aufgabe nie für Sie gelöst wird.",
        )}
      </p>
      {CARDS_A.map((C, i) => (
        <C key={i} />
      ))}
      <ReferencesAccordion block="A" keys={REFS_A} note={NOTE()} />
    </Block>
  );
}

export function MateriB() {
  const s = SECTIONS[2][0];
  return (
    <Block id={s.id} title={tt(`Materi B · ${s.minutes} minutes, facilitator-led`, `Materi B · ${s.minutes} Minuten, moderiert`)} intro={tt("A scalable retention system: the vision, the signal process, the levers, who does what, and deciding without all the information", "Ein skalierbares Bindungssystem: das Zielbild, der Signalprozess, die Hebel, wer was tut, und entscheiden ohne alle Informationen")}>
      <p className="max-w-prose text-body text-ash">
        {tt(
          "Five cards for Level 3. You stop fixing single customers and start designing how every customer is looked after. Each card ends in rules the task uses; each diagram uses Elbe Managed Services, another provider.",
          "Fünf Karten für Level 3. Sie reparieren keine einzelnen Kunden mehr, sondern gestalten, wie jeder Kunde betreut wird. Jede Karte endet mit Regeln, die die Aufgabe nutzt; jedes Diagramm nutzt Elbe Managed Services, einen anderen Anbieter.",
        )}
      </p>
      {CARDS_B.map((C, i) => (
        <C key={i} />
      ))}
      <ReferencesAccordion block="B" keys={REFS_B} note={NOTE()} />
    </Block>
  );
}
