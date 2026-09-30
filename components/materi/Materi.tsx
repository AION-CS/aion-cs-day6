"use client";

import { CARDS_A } from "@/components/materi/CardsA";
import { CARDS_B } from "@/components/materi/CardsB";
import { useCardMore } from "@/store/useCardMore";
import { OptionalSection } from "@/components/ui/OptionalSection";
import { ReferencesAccordion } from "@/components/ui/ReferencesAccordion";
import { MATERIALS, SECTIONS, materialAnchorId } from "@/data/materialIndex";
import type { RefKey } from "@/data/references";
import { tt } from "@/lib/lang";

const REFS_A: RefKey[] = ["jones1995", "oliver1997", "kano1984", "dixon2010", "reichheld1996", "morgan1994", "gustafsson2005", "palmatier2006", "heskett1994", "rackham1988", "adamson2012", "meadows1999", "cialdini2021"];
const REFS_B: RefKey[] = ["meadows1999", "heskett1994", "deming1986", "rackham1988", "adamson2012", "palmatier2006", "pmi2021", "courtney1997", "klein2007", "doran1981", "hubbard2014", "reichheld1996"];

const CARDS_A_META = MATERIALS.filter((m) => m.block === "A");
const CARDS_B_META = MATERIALS.filter((m) => m.block === "B");

function Block({ id, title, intro, children }: { id: string; title: string; intro: string; children: React.ReactNode }) {
  const all = useCardMore((s) => s.all);
  const setAll = useCardMore((s) => s.setAll);
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="space-y-4">
      <header className="space-y-1">
        <p className="smallcaps text-accent">{title}</p>
        <h2 id={`${id}-h`}>{intro}</h2>
        <button type="button" aria-pressed={all} onClick={() => setAll(!all)} className="btn-ghost btn-sm">
          {all ? tt("Hide the extra explanations", "Zusatzerklärungen ausblenden") : tt("Show every extra explanation, video and rule", "Alle Zusatzerklärungen, Videos und Regeln zeigen")}
        </button>
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
      {CARDS_A.map((C, i) => {
        const m = CARDS_A_META[i];
        return m.optional ? (
          <OptionalSection
            key={i}
            id={materialAnchorId(m.id)}
            title={`${m.id} · ${m.title}`}
            minutes={m.minutes}
            reason={tt("Deepens a card a Core task block already covers. Not needed to complete the Retention Analysis File.", "Vertieft eine Karte, die ein Kern-Block schon abdeckt. Für die Retention Analysis File nicht nötig.")}
          >
            <C />
          </OptionalSection>
        ) : (
          <C key={i} />
        );
      })}
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
          "Six cards for Level 3. You stop fixing single customers and start designing how every customer is looked after. Each card ends in rules the task uses; the last card teaches how to set every number a decision needs. Each diagram uses Elbe Managed Services, another provider.",
          "Sechs Karten für Level 3. Sie reparieren keine einzelnen Kunden mehr, sondern gestalten, wie jeder Kunde betreut wird. Jede Karte endet mit Regeln, die die Aufgabe nutzt; die letzte Karte zeigt, wie Sie jede Zahl festlegen, die eine Entscheidung braucht. Jedes Diagramm nutzt Elbe Managed Services, einen anderen Anbieter.",
        )}
      </p>
      {CARDS_B.map((C, i) => {
        const m = CARDS_B_META[i];
        return m.optional ? (
          <OptionalSection
            key={i}
            id={materialAnchorId(m.id)}
            title={`${m.id} · ${m.title}`}
            minutes={m.minutes}
            reason={tt("Deepens a card a Core task block already covers. Not needed to complete the Retention System Memo.", "Vertieft eine Karte, die ein Kern-Block schon abdeckt. Für das Retention System Memo nicht nötig.")}
          >
            <C />
          </OptionalSection>
        ) : (
          <C key={i} />
        );
      })}
      <ReferencesAccordion block="B" keys={REFS_B} note={NOTE()} />
    </Block>
  );
}
