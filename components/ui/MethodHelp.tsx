"use client";

import type { ReactNode } from "react";
import { FormulaBuilder } from "@/components/ui/FormulaBuilder";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { RevealHint } from "@/components/ui/RevealHint";
import type { MaterialId } from "@/data/materialIndex";
import { builderResult, partKey } from "@/lib/calcBuilder";
import { calcFlagsFor, r2Builders } from "@/lib/calcR2";
import { Gloss } from "@/lib/glossify";
import { num, tt } from "@/lib/lang";
import { useStore } from "@/store/useStore";

export type MethodCalc = { key: string; title: string; unit?: string; onUse?: (v: number) => void; useLabel?: string };

/**
 * "Show the method" under a field whose answer contains a number (CLAUDE.md #43): the formula in words, with no numbers, naming the
 * card that teaches it; then one automatic calculator per number (lib/calcR2.ts). "Check my figures" outlines each part that holds the
 * wrong number and names the row to read, never the value; it checks the learner's arithmetic on their own inputs, never their choice
 * (#38). Opens by itself while a part is flagged, so a flag never sits in a closed panel (#26).
 */
export function MethodHelp({ id, formula, card = "B6", calcs, children }: { id: string; formula: string[]; card?: MaterialId; calcs: MethodCalc[]; children?: ReactNode }) {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const builders = r2Builders(r2);
  const flagged = calcs.some((c) => builders[c.key]?.parts.some((p) => r2.calcFlags.includes(partKey(c.key, p.id))));
  return (
    <RevealHint id={id} label={tt("Show the method", "Methode zeigen")} title={tt(`The method · taught in Materi ${card}`, `Die Methode · aus Materi ${card}`)} forceOpen={flagged}>
      <div className="space-y-3 text-caption text-ink">
        <ul className="list-disc space-y-1 pl-5">
          {formula.map((f) => (
            <li key={f}>
              <Gloss>{f}</Gloss>
            </li>
          ))}
        </ul>
        <MaterialRefs refs={[card]} lead={tt("Taught in", "Gelehrt in")} />
        {children}
        {calcs.map((c) => {
          const b = builders[c.key];
          if (!b) return null;
          const result = builderResult(b, c.key, r2.calc);
          return (
            <div key={c.key} className="rounded-md border border-line bg-paper p-2.5">
              <p className="smallcaps text-ash">{c.title}</p>
              <FormulaBuilder
                figure={c.key}
                builder={b}
                parts={r2.calc}
                partFlags={r2.calcFlags}
                onPart={(k, v) => patch((s) => ({ calc: { ...s.calc, [k]: v }, calcFlags: s.calcFlags.filter((x) => x !== k) }))}
                onUse={c.onUse}
                unit={c.unit}
                label={c.useLabel}
                source={tt("the printed rows", "den gedruckten Zeilen")}
              />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => patch((s) => ({ checks: s.checks + 1, calcFlags: [...s.calcFlags.filter((x) => !x.startsWith(`${c.key}.`)), ...calcFlagsFor(c.key, s)] }))}
                  className="btn-ghost btn-sm"
                >
                  {tt("Check my figures", "Meine Zahlen prüfen")}
                </button>
                {result !== null && (
                  <span className="tnum text-caption text-ink">
                    {tt("Your number: ", "Ihre Zahl: ")}
                    <strong>{num(result, { maximumFractionDigits: 2 })}</strong>
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <p className="text-micro normal-case tracking-normal text-ash">
          {tt(
            "The calculator checks your arithmetic on your own inputs, not your choice. If you argue for a different item or month, your own number is checked.",
            "Der Rechner prüft Ihre Rechnung mit Ihren eigenen Eingaben, nicht Ihre Wahl. Wenn Sie für einen anderen Punkt oder Monat argumentieren, wird Ihre eigene Zahl geprüft.",
          )}
        </p>
      </div>
    </RevealHint>
  );
}
