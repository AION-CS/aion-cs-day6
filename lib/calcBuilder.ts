import { DELIGHT, FIGURE_IDS, NETSOL, keptProfit, lostProfit } from "@/data/delight";
import type { FigureId, Group } from "@/data/delight";
import { tt } from "@/lib/lang";
import { parseAmount } from "@/lib/parseAmount";

/**
 * The "automatic calculator" under a calculation question: the formula split into small labelled parts. The learner types each part
 * (a value read from a printed row); the result is computed live and can be copied into the answer field. On "Check", every part is
 * compared with the value it should hold, and a wrong part names the exact row to read, never the value. Expected values come from the
 * same constants as the tables and the model answers (data/delight.ts).
 */
export type CalcPart = { id: string; label: string; expected: number; tolerance?: number; clue: string };
export type CalcBuilder = { parts: CalcPart[]; compute: (v: Record<string, number>) => number; show: (v: Record<string, string>) => string };

const common = () => [
  { id: "contract", label: tt("Average yearly contract (€)", "Durchschnittlicher Jahresvertrag (€)"), expected: NETSOL.contract, clue: tt("“All customers”: the average yearly contract. It is the same for every group.", "„Alle Kunden“: der durchschnittliche Jahresvertrag. Er ist für jede Gruppe gleich.") },
  { id: "margin", label: tt("Gross margin (%)", "Bruttomarge (%)"), expected: NETSOL.margin, clue: tt("“All customers”: the gross margin, as printed (a percentage).", "„Alle Kunden“: die Bruttomarge, so wie gedruckt (in Prozent).") },
];

function groupBuilder(g: Group, row: () => string): CalcBuilder {
  return {
    get parts() {
      const r = row();
      return [
        { id: "customers", label: tt("Customers in the group", "Kunden in der Gruppe"), expected: g.customers, clue: tt(`“Customer groups”: the number of customers in the ${r} row.`, `„Kundengruppen“: die Zahl der Kunden in der Zeile ${r}.`) },
        { id: "churn", label: tt("Yearly churn rate (%)", "Jährliche Churn Rate (%)"), expected: g.churn, clue: tt(`“Customer groups”: the yearly churn rate in the ${r} row, as printed. The groups differ a lot here.`, `„Kundengruppen“: die jährliche Churn Rate in der Zeile ${r}, so wie gedruckt. Hier unterscheiden sich die Gruppen stark.`) },
        ...common(),
      ];
    },
    compute: (v) => lostProfit({ customers: v.customers, churn: v.churn }, v.contract, v.margin),
    show: (v) => `${v.customers} × ${v.churn}% × ${v.contract} × ${v.margin}%`,
  };
}

const keptBuilder: CalcBuilder = {
  get parts() {
    return [
      { id: "moved", label: tt("Satisfied customers moved", "Verschobene zufriedene Kunden"), expected: NETSOL.moved, clue: tt("“The plan”: how many satisfied customers are to become delighted.", "„Der Plan“: wie viele zufriedene Kunden begeistert werden sollen.") },
      { id: "from", label: tt("Churn rate of satisfied (%)", "Churn Rate zufrieden (%)"), expected: NETSOL.satisfied.churn, clue: tt("“Customer groups”: the churn rate of the satisfied row, the higher one.", "„Kundengruppen“: die Churn Rate der Zeile „zufrieden“, die höhere.") },
      { id: "to", label: tt("Churn rate of delighted (%)", "Churn Rate begeistert (%)"), expected: NETSOL.delighted.churn, clue: tt("“Customer groups”: the churn rate of the delighted row. It is subtracted.", "„Kundengruppen“: die Churn Rate der Zeile „begeistert“. Sie wird abgezogen.") },
      ...common(),
    ];
  },
  compute: (v) => keptProfit(v.moved, v.from, v.to, v.contract, v.margin),
  show: (v) => `${v.moved} × (${v.from}% − ${v.to}%) × ${v.contract} × ${v.margin}%`,
};

export const FIGURE_BUILDERS: Record<FigureId, CalcBuilder> = {
  F1: groupBuilder(NETSOL.satisfied, () => tt("“satisfied”", "„zufrieden“")),
  F2: groupBuilder(NETSOL.delighted, () => tt("“delighted”", "„begeistert“")),
  F3: keptBuilder,
};
export const figAnswer = (id: FigureId) => ({ F1: DELIGHT.f1, F2: DELIGHT.f2, F3: DELIGHT.f3 })[id];
export { FIGURE_IDS };

export const partKey = (figure: string, part: string) => `${figure}.${part}`;
export function partValues(b: CalcBuilder, figure: string, parts: Record<string, string>): Record<string, number | null> {
  return Object.fromEntries(
    b.parts.map((p) => {
      const raw = (parts[partKey(figure, p.id)] ?? "").trim();
      return [p.id, raw ? parseAmount(raw) : null];
    }),
  );
}
export function builderResult(b: CalcBuilder, figure: string, parts: Record<string, string>): number | null {
  const v = partValues(b, figure, parts);
  if (Object.values(v).some((x) => x === null)) return null;
  const r = b.compute(v as Record<string, number>);
  return Number.isFinite(r) ? Math.round(r * 1e6) / 1e6 : null;
}
export function wrongParts(b: CalcBuilder, figure: string, parts: Record<string, string>): string[] {
  const v = partValues(b, figure, parts);
  return b.parts.filter((p) => v[p.id] !== null && Math.abs((v[p.id] as number) - p.expected) > (p.tolerance ?? 1e-9)).map((p) => partKey(figure, p.id));
}
export function allPartsRight(b: CalcBuilder, figure: string, parts: Record<string, string>): boolean {
  const v = partValues(b, figure, parts);
  return Object.values(v).every((x) => x !== null) && wrongParts(b, figure, parts).length === 0;
}
export function modelParts(builders: Partial<Record<string, CalcBuilder>>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [fid, b] of Object.entries(builders)) if (b) for (const p of b.parts) out[partKey(fid, p.id)] = String(p.expected);
  return out;
}
export function figurePartFlags(parts: Record<string, string>): string[] {
  return FIGURE_IDS.flatMap((f) => wrongParts(FIGURE_BUILDERS[f], f, parts));
}
