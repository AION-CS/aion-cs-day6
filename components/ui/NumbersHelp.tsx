"use client";

import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { RevealHint } from "@/components/ui/RevealHint";
import type { MaterialId } from "@/data/materialIndex";
import { numberView, r2Builders } from "@/lib/calcR2";
import { scrollToAndFlash } from "@/lib/flash";
import { Gloss } from "@/lib/glossify";
import { num, tt } from "@/lib/lang";
import { useStore } from "@/store/useStore";

export type NumberCalc = { key: string; title: string; fmt?: (n: number) => string; onUse?: (v: number) => void };

/**
 * "Show the numbers you can use" under a field whose answer contains a number (CLAUDE.md #44, user feedback 2026-09-30 on Day 6): the
 * learner does not calculate. Each number the printed figures support is shown, with a sentence on why it is that number, the printed
 * figures it comes from, each a button that scrolls to and flashes its row, and a button that puts it into the answer. The learner
 * chooses which number belongs in the sentence and composes it; a different number is fine when the reason is given (#38).
 * Numbers that depend on the learner's own plan (start month, funded items) are read live from their state.
 */
export function NumbersHelp({ id, card = "B6", calcs }: { id: string; card?: MaterialId; calcs: NumberCalc[] }) {
  const r2 = useStore((s) => s.r2);
  const builders = r2Builders(r2);
  return (
    <RevealHint id={id} label={tt("Show the numbers you can use", "Die Zahlen zeigen, die Sie nutzen können")} title={tt(`The numbers you can use · found as in Materi ${card}`, `Die Zahlen, die Sie nutzen können · gefunden wie in Materi ${card}`)}>
      <div className="space-y-3 text-caption text-ink">
        <p>
          <Gloss>
            {tt(
              "You do not calculate anything here. These are the numbers the printed figures support, why each one is that number, and where to find it. You decide which one goes into your sentence and how to word it. A different number is fine if you say why.",
              "Sie müssen hier nichts rechnen. Das sind die Zahlen, die die gedruckten Werte stützen, warum jede genau diese Zahl ist und wo Sie sie finden. Sie entscheiden, welche in Ihren Satz kommt und wie Sie ihn formulieren. Eine andere Zahl ist in Ordnung, wenn Sie sagen, warum.",
            )}
          </Gloss>
        </p>
        {calcs.map((c) => {
          if (!builders[c.key]) return null;
          const v = numberView(c.key, r2);
          return (
            <div key={c.key} className="space-y-1.5 rounded-md border border-line bg-paper p-2.5">
              <p className="smallcaps text-ash">{c.title}</p>
              {v.ready ? (
                <p className="text-ash">{v.ready}</p>
              ) : (
                <>
                  <p className="tnum">
                    <strong className="text-body">{c.fmt ? c.fmt(v.result) : num(v.result, { maximumFractionDigits: 2 })}</strong> <span className="text-ash">= {v.show}</span>
                  </p>
                  <p>
                    <span className="smallcaps mr-1.5 text-accent">{tt("Why this number", "Warum diese Zahl")}</span>
                    <Gloss>{v.why}</Gloss>
                  </p>
                  <div>
                    <p className="smallcaps text-ash">{tt("Where to find it · click one to see it on the page", "Wo Sie es finden · klicken Sie eines an, um es auf der Seite zu sehen")}</p>
                    <ul className="mt-1 space-y-0.5">
                      {v.sources.map((p) => (
                        <li key={p.label}>
                          <button
                            type="button"
                            onClick={() => p.target && scrollToAndFlash(p.target, "ref")}
                            className="flex min-h-[36px] w-full flex-wrap items-baseline gap-x-2 rounded px-2 py-1 text-left hover:bg-accentSoft"
                          >
                            <span className="text-ink">{p.label}:</span>
                            <span className="tnum font-semibold text-ink">{p.value}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {c.onUse && (
                    <button type="button" onClick={() => c.onUse!(v.result)} className="btn-ghost btn-sm">
                      {tt("Put this number into my answer", "Diese Zahl in meine Antwort übernehmen")}
                    </button>
                  )}
                </>
              )}
            </div>
          );
        })}
        <MaterialRefs refs={[card]} lead={tt("The idea behind it is in", "Die Idee dahinter steht in")} />
      </div>
    </RevealHint>
  );
}
