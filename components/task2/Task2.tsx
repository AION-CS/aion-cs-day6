"use client";

import { Block31, Block32, Block33, Block34, Block35, Block36 } from "@/components/task2/Blocks";
import { MemoPanel } from "@/components/task2/MemoPanel";
import { ExportBar } from "@/components/ui/ExportBar";
import { Callout } from "@/components/ui/MaterialCard";
import { OptionalSection } from "@/components/ui/OptionalSection";
import { MEASURE_BY_ID } from "@/data/measures";
import { FIG_ROW_ID, GP_PER_CUSTOMER, KEPT_PER_MOVE, R2_BUDGET, R2_FIG, R2_MONTHS } from "@/data/route2";
import type { FigKey } from "@/data/route2";
import { tallyOf } from "@/lib/checks";
import { BLOCK_MINUTES } from "@/lib/routes";
import { Gloss } from "@/lib/glossify";
import { euro, pct, tt } from "@/lib/lang";
import { memoBody } from "@/lib/exportDoc";
import { r2Missing } from "@/lib/missing";
import { TASK2_MINUTES } from "@/lib/routes";
import { exportName } from "@/lib/slug";
import { useJumpTo } from "@/lib/useJumpTo";
import { usePersisted } from "@/store/usePersisted";
import { useHydrated } from "@/store/useStore";


/** Every figure a Route 2 number is built from, printed once, each row with a stable id for the clue kits (CLAUDE.md #42, #43). */
function FiguresTable() {
  const rows: [FigKey, string, string][] = [
    ["customers", tt("Customers", "Kunden"), String(R2_FIG.customers)],
    ["delighted", tt("Delighted customers today (5 of 5)", "Begeisterte Kunden heute (5 von 5)"), String(R2_FIG.delighted)],
    ["satisfied", tt("Satisfied customers (4 of 5)", "Zufriedene Kunden (4 von 5)"), String(R2_FIG.satisfied)],
    ["churnSat", tt("Yearly churn, satisfied", "Jährlicher Churn, zufrieden"), pct(R2_FIG.churnSat)],
    ["churnDel", tt("Yearly churn, delighted", "Jährlicher Churn, begeistert"), pct(R2_FIG.churnDel)],
    ["contract", tt("Average yearly contract", "Durchschnittlicher Jahresvertrag"), euro(R2_FIG.contract)],
    ["margin", tt("Gross margin", "Bruttomarge"), pct(R2_FIG.margin)],
    ["gpCust", tt("Gross profit a year per customer (contract × margin)", "Rohertrag pro Kunde und Jahr (Vertrag × Marge)"), euro(GP_PER_CUSTOMER)],
    ["kept", tt("Gross profit kept a year per customer moved to 5 of 5 ((20% − 5%) × contract × margin)", "Gehaltener Rohertrag pro Jahr je Kunde, der auf 5 von 5 steigt ((20 % − 5 %) × Vertrag × Marge)"), euro(KEPT_PER_MOVE)],
    ["years", tt("Contract term", "Vertragslaufzeit"), tt(`${R2_FIG.years} years`, `${R2_FIG.years} Jahre`)],
    ["openDeals", tt("Customers with an open deal or a renewal in the next six months", "Kunden mit offenem Deal oder Verlängerung in den nächsten sechs Monaten"), String(R2_FIG.openDeals)],
    ["stalled", tt("Deals that stalled in the last six months", "Deals, die in den letzten sechs Monaten stockten"), String(R2_FIG.stalled)],
    ["dealGP", tt("Gross profit of an average expansion deal", "Rohertrag eines durchschnittlichen Erweiterungsdeals"), euro(R2_FIG.dealGP)],
  ];
  return (
    <div className="relative overflow-x-auto rounded-lg border border-line">
      <table className="w-full border-collapse text-caption">
        <caption className="bg-mist px-3 py-2 text-left text-micro font-semibold uppercase text-ash">{tt("NetSolutions today · the figures every number in this task is built from (Case assumption)", "NetSolutions heute · die Zahlen, aus denen jede Zahl dieser Aufgabe gebaut wird (Fallannahme)")}</caption>
        <tbody>
          {rows.map(([k, label, value]) => (
            <tr key={k} id={FIG_ROW_ID(k)} className="border-t border-line">
              <td className="px-3 py-1.5">{label}</td>
              <td className="tnum px-3 py-1.5 text-right font-semibold">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** The situation of Route 2, stated once, directly above the task, with a soft pointer to the learner's own Route 1 Core answers (#40). */
function CaseBrief() {
  const hydrated = useHydrated();
  const p = usePersisted();
  const jump = useJumpTo();
  const tally = tallyOf(p.l1.tags);
  const chosen = p.l1.chosen.map((id) => MEASURE_BY_ID[id].name);
  const has = hydrated && (tally.tagged > 0 || chosen.length > 0);
  return (
    <section id="task-2" aria-labelledby="task2-h" className="card space-y-3 p-4 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="task2-h">{tt("The situation: you are the Chief Customer Officer", "Die Lage: Sie sind Chief Customer Officer")}</h2>
        <span className="smallcaps">{tt("Read once · about 4 min", "Einmal lesen · ca. 4 Min.")}</span>
      </div>
      <p className="max-w-prose text-body text-ink">
        <Gloss>
          {tt(
            "NetSolutions has tried its first measures for emotional retention. You now answer for customer retention as a whole, and the board wants a scalable customer retention system, not more single actions. Sales, service and marketing each talk to the same customers and do not share what they hear. The budget is limited, the time is short, and the customer data is incomplete. You are asked to decide on the system anyway.",
            "NetSolutions hat seine ersten Maßnahmen für emotionale Bindung ausprobiert. Sie verantworten jetzt die Kundenbindung als Ganzes, und der Vorstand will ein skalierbares Kundenbindungssystem, keine weiteren Einzelaktionen. Vertrieb, Service und Marketing sprechen jeweils mit denselben Kunden und teilen nicht, was sie hören. Das Budget ist begrenzt, die Zeit ist knapp, und die Kundendaten sind unvollständig. Sie sollen trotzdem über das System entscheiden.",
          )}
        </Gloss>
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-line bg-canvas p-3 text-caption">
          <p className="smallcaps">{tt("The limits", "Die Grenzen")}</p>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-ink">
            <li>
              {tt("Budget: ", "Budget: ")}
              <strong>{euro(R2_BUDGET)}</strong> {tt("(Case assumption)", "(Fallannahme)")}
            </li>
            <li>
              {tt("Time: ", "Zeit: ")}
              <strong>{tt(`${R2_MONTHS} months`, `${R2_MONTHS} Monate`)}</strong>
            </li>
            <li>{tt("The items and costs are in Block 3.5, the customer groups and the baselines for the tripwire in Block 3.6, and every figure a number needs in “NetSolutions today” below.", "Die Punkte und Kosten stehen in Block 3.5, die Kundengruppen und die Ausgangswerte für den Tripwire in Block 3.6, und jede Zahl, die eine Rechnung braucht, in „NetSolutions heute“ unten.")}</li>
          </ul>
        </div>
        <div className="rounded-lg border border-line bg-canvas p-3 text-caption md:col-span-2">
          <p className="smallcaps">{tt(`What you build · about ${TASK2_MINUTES} min`, `Was Sie bauen · ca. ${TASK2_MINUTES} Min.`)}</p>
          <ol className="mt-1 grid list-decimal gap-x-6 pl-4 text-ink sm:grid-cols-2">
            <li>{tt("The target vision of the retention system", "Das Zielbild des Bindungssystems")}</li>
            <li>{tt("The central process for handling signals", "Den zentralen Prozess für den Umgang mit Signalen")}</li>
            <li>{tt("Strategic levers for emotional retention", "Strategische Hebel für emotionale Bindung")}</li>
            <li>{tt("Integrating sales, service and marketing", "Die Verbindung von Vertrieb, Service und Marketing")}</li>
            <li>{tt("The implementation architecture", "Die Umsetzungsarchitektur")}</li>
            <li>{tt("A system decision despite incomplete information", "Eine Systementscheidung trotz unvollständiger Information")}</li>
          </ol>
        </div>
      </div>
      <FiguresTable />
      <div role="note" className="rounded-lg border border-gold bg-accentSoft p-3 text-caption text-ink" id="task1-quote">
        <p className="smallcaps text-accent">{tt("Where Route 1 left off · your own answers", "Wo Route 1 aufgehört hat · Ihre eigenen Antworten")}</p>
        {has ? (
          <p className="mt-1">
            {tt("Uncertainty signals you tagged in live deals: ", "Von Ihnen eingeordnete Unsicherheitssignale in laufenden Deals: ")}
            <strong>{tt(`${tally.count.uncertainty}, of which ${tally.stalled.uncertainty} stalled`, `${tally.count.uncertainty}, davon ${tally.stalled.uncertainty} stockend`)}</strong>. {tt("Measures you chose: ", "Von Ihnen gewählte Maßnahmen: ")}
            <strong>{chosen.join(", ") || tt("none yet", "noch keine")}</strong>.
          </p>
        ) : (
          <p className="mt-1">{tt("You have not answered Route 1 yet. That is fine: nothing here is blocked, and this box fills in when you do.", "Sie haben Route 1 noch nicht beantwortet. Das ist in Ordnung: Hier ist nichts gesperrt, und dieses Feld füllt sich, sobald Sie es tun.")}</p>
        )}
        <button type="button" onClick={() => jump("block-2-3", "/route-1/")} className="btn-ghost btn-sm mt-2">
          {tt("Go to Block 2.3 in Route 1", "Zu Block 2.3 in Route 1")}
        </button>
      </div>
      <Callout label={tt("Case assumption", "Fallannahme")} tone="amber">
        <p>
          {tt(
            "The brief gives the role and the situation: build a scalable customer retention system with a limited budget, high time pressure and incomplete data. The budget, the costs, the levers, the figures in “NetSolutions today” and the baselines are made up for this exercise.",
            "Der Auftrag gibt Rolle und Lage vor: ein skalierbares Kundenbindungssystem aufbauen, mit begrenztem Budget, hohem Zeitdruck und unvollständigen Daten. Budget, Kosten, Hebel, die Zahlen in „NetSolutions heute“ und die Ausgangswerte sind für diese Übung erfunden.",
          )}
        </p>
      </Callout>
    </section>
  );
}

export function Task2() {
  const p = usePersisted();
  const missing = r2Missing(p);
  const filename = exportName(p.participant.name, "l3-system-memo");
  return (
    <div className="space-y-6">
      <CaseBrief />
      <OptionalSection
        id="block-3-1"
        title={tt("Block 3.1 · The target vision: three principles", "Block 3.1 · Das Zielbild: drei Prinzipien")}
        minutes={BLOCK_MINUTES["3.1"]}
        reason={tt("Names the principles behind the system; the process in Block 3.2 and the plan in Block 3.5 can be set without them.", "Benennt die Prinzipien hinter dem System; der Prozess in Block 3.2 und der Plan in Block 3.5 lassen sich auch ohne sie festlegen.")}
      >
        <Block31 />
      </OptionalSection>
      <Block32 />
      <OptionalSection
        id="block-3-3"
        title={tt("Block 3.3 · Three strategic levers", "Block 3.3 · Drei strategische Hebel")}
        minutes={BLOCK_MINUTES["3.3"]}
        reason={tt("Rates levers on four tests; the items in Block 3.5 carry their own costs and methods, so the plan does not need the ratings.", "Bewertet Hebel nach vier Tests; die Punkte in Block 3.5 tragen ihre eigenen Kosten und Methoden, der Plan braucht die Bewertungen also nicht.")}
      >
        <Block33 />
      </OptionalSection>
      <OptionalSection
        id="block-3-4"
        title={tt("Block 3.4 · Who does what (RACI)", "Block 3.4 · Wer was tut (RACI)")}
        minutes={BLOCK_MINUTES["3.4"]}
        reason={tt("A responsibility grid across the teams; Block 3.5 already names one owner per funded item.", "Ein Verantwortungsraster über die Teams; Block 3.5 benennt schon einen Owner pro finanziertem Punkt.")}
      >
        <Block34 />
      </OptionalSection>
      <Block35 />
      <Block36 />
      <MemoPanel />
      <ExportBar
        id="export-l3"
        previewTitle={tt("Preview of your memo", "Vorschau Ihres Memos")}
        exportLabel={tt("Export the Retention System Memo", "Retention System Memo exportieren")}
        docTitle="Retention System Memo"
        filename={filename}
        missing={missing}
        buildBody={() => memoBody(p)}
        showPreview={false}
      />
    </div>
  );
}
