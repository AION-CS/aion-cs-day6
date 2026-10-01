"use client";

import { useState } from "react";
import { SentenceKit } from "@/components/ui/SentenceKit";
import type { KitRow } from "@/components/ui/SentenceKit";
import { NEEDS_FIRST, RESTS_ON, RESTS_ON_GLYPH, RESTS_ON_LABEL } from "@/data/archFacts";
import { ARCH_BY_ID, BASELINE_ITEM, OWNERS, R2_MONTHS } from "@/data/route2";
import type { ArchId } from "@/data/route2";
import { TRIGGER_KIT } from "@/data/triggerKit";
import { numberView } from "@/lib/calcR2";
import { euro, tt } from "@/lib/lang";
import { IDS } from "@/lib/missing";
import type { R2State } from "@/store/useStore";

/**
 * The ready-to-use kits under the trigger and the pickup point of Block 3.5 (CLAUDE.md #44, the user's Route 2 standard of 2026-09-30):
 * every slot of the sentence says what to write, why, and where each number is printed, with a button that puts it into the sentence.
 * Numbers and months come from `numberView`, so the kit, the model answer and the mentor's worked answer cannot drift apart.
 */

const pct = (a: { result: string }) => (a.result === "coverage" ? tt("%", " %") : "");

/** The trigger of one funded item. `what` is the printed line saying what its trigger counts. */
export function TriggerKitFor({ id, r2, value, onChange, what }: { id: ArchId; r2: R2State; value: string; onChange: (v: string) => void; what: string }) {
  const a = ARCH_BY_ID[id];
  const kit = TRIGGER_KIT[id];
  const nv = numberView(`trig-${id}`, r2);
  const mv = numberView(`month-${id}`, r2);
  const owner = r2.owner[id] ? OWNERS[r2.owner[id]!] : null;
  const n = nv.result;
  const rows: KitRow[] = [
    {
      token: tt("[metric]", "[Kennzahl]"),
      title: tt("The metric: what you count", "Die Kennzahl: was Sie zählen"),
      what: tt("about customers, not about your own activity", "über Kunden, nicht über Ihre eigene Aktivität"),
      options: [{ text: kit.metric, why: kit.metricWhy }],
      sources: [{ label: tt("What this item's trigger counts", "Was der Trigger dieses Punkts zählt"), value: what, target: IDS.arch(id) }],
    },
    {
      token: tt("[worse than]", "[schlechter als]"),
      title: tt("Worse than: the number", "Schlechter als: die Zahl"),
      what: a.result === "coverage" ? tt("the coverage share", "der Abdeckungsanteil") : a.result === "deal" ? tt("the payback count in deals", "der Payback-Zähler in Deals") : tt("the payback count in customers", "der Payback-Zähler in Kunden"),
      detail: `${n}${pct(a)} = ${nv.show}`,
      options: [{ text: tt(`is below ${n}${pct(a)}`, `unter ${n}${pct(a)} liegt`), why: nv.why }],
      sources: nv.sources,
    },
    {
      token: tt("[month]", "[Monat]"),
      title: tt("By month: when it can first be read", "Bis Monat: wann er sich zuerst lesen lässt"),
      what: tt("never later than month 6", "nie später als Monat 6"),
      detail: mv.ready ? undefined : `${tt("month", "Monat")} ${mv.result} = ${mv.show}`,
      notReady: mv.ready ?? undefined,
      options: [{ text: String(mv.result), why: mv.why }],
      sources: mv.sources,
    },
    {
      token: tt("[action]", "[Aktion]"),
      title: tt("The action: what the owner does alone", "Die Aktion: was der Owner allein tut"),
      what: tt("change this one item, not the whole system", "diesen einen Punkt ändern, nicht das ganze System"),
      options: kit.actions,
      sources: [
        {
          label: tt("The owner you chose for this item", "Der Owner, den Sie für diesen Punkt gewählt haben"),
          value: owner ? owner.name : tt("not chosen yet", "noch nicht gewählt"),
          target: `owner-${id}`,
        },
      ],
    },
  ];
  return (
    <SentenceKit
      id={`trigger-kit-${id}`}
      label={tt("Show the trigger kit", "Den Trigger-Baukasten zeigen")}
      intro={tt(
        "A trigger is one sentence with four parts. Each part below says what to write, why, and where its numbers are printed. Put them into the sentence one at a time and read it grow; you can edit it freely. A different choice is fine if you say why.",
        "Ein Trigger ist ein Satz mit vier Teilen. Jeder Teil unten sagt, was Sie schreiben, warum, und wo seine Zahlen gedruckt stehen. Übernehmen Sie sie einzeln in den Satz und lesen Sie mit, wie er wächst; Sie können ihn frei ändern. Eine andere Wahl ist in Ordnung, wenn Sie sagen, warum.",
      )}
      template={tt("If [metric] [worse than] by month [month], then [action].", "Wenn [Kennzahl] bis Monat [Monat] [schlechter als], [Aktion].")}
      value={value}
      onChange={onChange}
      rows={rows}
    />
  );
}

/** The pickup point: which item left out, and the sentence that says when it is funded after all. */
export function PickupKitFor({ notFunded, r2, value, onChange }: { notFunded: ArchId[]; r2: R2State; value: string; onChange: (v: string) => void }) {
  const [item, setItem] = useState<ArchId | null>(null);
  const id = item && notFunded.includes(item) ? item : notFunded[0];
  if (!id) return null;
  const a = ARCH_BY_ID[id];
  const kit = TRIGGER_KIT[id];
  const pv = numberView(`pickup-${id}`, r2);
  const n = pv.result;
  const rows: KitRow[] = [
    {
      token: tt("[number]", "[Zahl]"),
      title: tt("How many customers: the cost of waiting", "Wie viele Kunden: die Kosten des Wartens"),
      what: tt("the count at which waiting has cost as much as the item", "die Zahl, bei der das Warten so viel gekostet hat wie der Punkt"),
      detail: `${n} = ${pv.show}`,
      options: [{ text: String(n), why: pv.why }],
      sources: pv.sources,
    },
    {
      token: tt("[month]", "[Monat]"),
      title: tt("By month: when you look again", "Bis Monat: wann Sie wieder hinsehen"),
      what: tt("the plan's last month or earlier", "der letzte Monat des Plans oder früher"),
      options: [
        {
          text: String(R2_MONTHS),
          why: tt("Look no later than the plan's last month, so there is still time to act on what you see.", "Schauen Sie spätestens im letzten Monat des Plans hin, damit noch Zeit bleibt, auf das Gesehene zu reagieren."),
        },
      ],
      sources: [{ label: tt("The plan's last month", "Der letzte Monat des Plans"), value: String(R2_MONTHS), target: "task-2" }],
    },
    {
      token: tt("[reason]", "[Grund]"),
      title: tt("The reason that counts", "Der Grund, der zählt"),
      what: tt("only leavers the item would have kept", "nur Abgänge, die der Punkt gehalten hätte"),
      options: [
        {
          text: kit.reason,
          why: tt(
            "Count only the customers who leave for the reason this item would fix. Others would have left anyway, and they would not show that waiting cost something.",
            "Zählen Sie nur die Kunden, die aus dem Grund gehen, den dieser Punkt beheben würde. Andere wären ohnehin gegangen und würden nicht zeigen, dass das Warten etwas gekostet hat.",
          ),
        },
      ],
      sources: [{ label: tt(`Cost of ${a.name}`, `Kosten von ${a.name}`), value: euro(a.cost), target: IDS.arch(id) }],
    },
    {
      token: tt("[action]", "[Aktion]"),
      title: tt("The action: what happens then", "Die Aktion: was dann passiert"),
      what: tt("fund the item you left out", "den weggelassenen Punkt finanzieren"),
      options: [
        {
          text: tt(`we fund ${a.name} from the next budget round`, `finanzieren wir „${a.name}“ aus der nächsten Budgetrunde`),
          why: tt(
            "A pickup point is the agreed moment when a postponed item gets its money. Saying it now turns 'not now' into a plan, not a no.",
            "Ein Pickup Point ist der vereinbarte Moment, in dem ein zurückgestellter Punkt sein Geld bekommt. Es jetzt zu sagen, macht aus „jetzt nicht“ einen Plan, kein Nein.",
          ),
        },
      ],
    },
  ];
  const chooser =
    notFunded.length > 1 ? (
      <div role="group" aria-label={tt("The item the pickup point is for", "Der Punkt, für den der Pickup Point gilt")} className="flex flex-wrap items-center gap-1.5">
        <span className="smallcaps text-ash">{tt("The item you left out", "Der weggelassene Punkt")}</span>
        {notFunded.map((x) => (
          <button key={x} type="button" aria-pressed={x === id} onClick={() => setItem(x)} className={x === id ? "btn btn-sm border border-accent bg-accentSoft" : "btn-ghost btn-sm"}>
            {ARCH_BY_ID[x].name}
          </button>
        ))}
      </div>
    ) : (
      <p className="text-ash">
        {tt("The item you left out: ", "Der weggelassene Punkt: ")}
        <strong className="text-ink">{a.name}</strong>
      </p>
    );
  return (
    <SentenceKit
      id="pickup-kit"
      label={tt("Show the pickup point kit", "Den Pickup-Point-Baukasten zeigen")}
      intro={tt(
        "A pickup point is one sentence: when this many customers have left for the reason an item would fix, you fund it after all. Choose which item you left out, then put the parts into the sentence.",
        "Ein Pickup Point ist ein Satz: Wenn so viele Kunden aus dem Grund gegangen sind, den ein Punkt beheben würde, finanzieren Sie ihn doch. Wählen Sie den weggelassenen Punkt und übernehmen Sie dann die Teile in den Satz.",
      )}
      template={tt("If [number] or more satisfied customers give notice by month [month] because [reason], then [action].", "Kündigen bis Monat [Monat] mindestens [Zahl] zufriedene Kunden, weil [Grund], [Aktion].")}
      value={value}
      onChange={onChange}
      rows={rows}
      top={chooser}
    />
  );
}

/** The three facts printed on every item card before the learner decides: what it rests on, what it needs first, what it must earn to pay back. */
export function ArchFacts({ id, r2 }: { id: ArchId; r2: R2State }) {
  const a = ARCH_BY_ID[id];
  const nv = numberView(`trig-${id}`, r2);
  const n = nv.result;
  const bar =
    a.result === "coverage"
      ? tt(`${n}% of customers need a complete record`, `${n} % der Kunden brauchen einen vollständigen Datensatz`)
      : a.result === "deal"
        ? tt(`${n} stalled deals must move forward`, `${n} stockende Deals müssen weiterkommen`)
        : tt(`${n} customers must move to 5 of 5`, `${n} Kunden müssen auf 5 von 5 steigen`);
  const rest = RESTS_ON[id];
  return (
    <dl className="grid gap-x-4 gap-y-1 rounded-md border border-line bg-mist/40 px-3 py-2 text-caption sm:grid-cols-3">
      <div>
        <dt className="smallcaps text-ash">{tt("Rests on", "Beruht auf")}</dt>
        <dd className="text-ink">
          <span aria-hidden className="mr-1 tracking-wider">
            {RESTS_ON_GLYPH[rest]}
          </span>
          {RESTS_ON_LABEL[rest]}
        </dd>
      </div>
      <div>
        <dt className="smallcaps text-ash">{tt("Needs first", "Braucht zuerst")}</dt>
        <dd className="text-ink">{id === BASELINE_ITEM ? NEEDS_FIRST.baseline : NEEDS_FIRST.view}</dd>
      </div>
      <div>
        <dt className="smallcaps text-ash">{tt("To pay back, it must earn", "Zum Bezahltmachen muss er bringen")}</dt>
        <dd className="text-ink">{bar}</dd>
      </div>
    </dl>
  );
}
