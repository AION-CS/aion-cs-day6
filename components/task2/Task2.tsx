"use client";

import { Block31, Block32, Block33, Block34, Block35, Block36 } from "@/components/task2/Blocks";
import { MemoPanel } from "@/components/task2/MemoPanel";
import { ExportBar } from "@/components/ui/ExportBar";
import { Callout } from "@/components/ui/MaterialCard";
import { MEASURE_BY_ID } from "@/data/measures";
import { WEAK_BY_ID } from "@/data/signals";
import { R2_BUDGET, R2_MONTHS } from "@/data/route2";
import { Gloss } from "@/lib/glossify";
import { euro, tt } from "@/lib/lang";
import { memoBody } from "@/lib/exportDoc";
import { r2Missing } from "@/lib/missing";
import { TASK2_MINUTES } from "@/lib/routes";
import { exportName } from "@/lib/slug";
import { useJumpTo } from "@/lib/useJumpTo";
import { usePersisted } from "@/store/usePersisted";
import { useHydrated } from "@/store/useStore";

/** The situation of Route 2, stated once, directly above the task, with a soft pointer to the learner's own Route 1 answers. */
function CaseBrief() {
  const hydrated = useHydrated();
  const p = usePersisted();
  const jump = useJumpTo();
  const weak = p.l1.weak.map((id) => WEAK_BY_ID[id].label);
  const chosen = p.l1.chosen.map((id) => MEASURE_BY_ID[id].name);
  const has = hydrated && (weak.length > 0 || chosen.length > 0);
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
            <li>{tt("The eight levers are described in Block 3.3, the items and costs in Block 3.5, the baselines for the tripwire in Block 3.6.", "Die acht Hebel stehen in Block 3.3, die Punkte und Kosten in Block 3.5, die Ausgangswerte für den Tripwire in Block 3.6.")}</li>
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
      <div role="note" className="rounded-lg border border-gold bg-accentSoft p-3 text-caption text-ink" id="task1-quote">
        <p className="smallcaps text-accent">{tt("Where Route 1 left off · your own answers", "Wo Route 1 aufgehört hat · Ihre eigenen Antworten")}</p>
        {has ? (
          <p className="mt-1">
            {tt("Weaknesses you named: ", "Von Ihnen benannte Schwächen: ")}
            <strong>{weak.join("; ") || tt("none yet", "noch keine")}</strong>. {tt("Measures you chose: ", "Von Ihnen gewählte Maßnahmen: ")}
            <strong>{chosen.join(", ") || tt("none yet", "noch keine")}</strong>.
          </p>
        ) : (
          <p className="mt-1">{tt("You have not answered Route 1 yet. That is fine: nothing here is blocked, and this box fills in when you do.", "Sie haben Route 1 noch nicht beantwortet. Das ist in Ordnung: Hier ist nichts gesperrt, und dieses Feld füllt sich, sobald Sie es tun.")}</p>
        )}
        <button type="button" onClick={() => jump("block-2-2", "/route-1/")} className="btn-ghost btn-sm mt-2">
          {tt("Go to Block 2.2 in Route 1", "Zu Block 2.2 in Route 1")}
        </button>
      </div>
      <Callout label={tt("Case assumption", "Fallannahme")} tone="amber">
        <p>
          {tt(
            "The brief gives the role and the situation: build a scalable customer retention system with a limited budget, high time pressure and incomplete data. The budget, the costs, the levers and the baselines are made up for this exercise.",
            "Der Auftrag gibt Rolle und Lage vor: ein skalierbares Kundenbindungssystem aufbauen, mit begrenztem Budget, hohem Zeitdruck und unvollständigen Daten. Budget, Kosten, Hebel und Ausgangswerte sind für diese Übung erfunden.",
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
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <div className="min-w-0 space-y-6 pb-14 lg:pb-0">
          <Block31 />
          <Block32 />
          <Block33 />
          <Block34 />
          <Block35 />
          <Block36 />
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
        <MemoPanel />
      </div>
    </div>
  );
}
