import { bi, t } from "@/lib/lang";
import { TASK1_MINUTES, TASK2_MINUTES } from "@/lib/routes";

/** One registry for every material card: the rail, the cards and the task chips all read it. */
export type MaterialId = "A1" | "A2" | "A3" | "A4" | "A5" | "A6" | "A7" | "B1" | "B2" | "B3" | "B4" | "B5" | "B6";
export type Block = "A" | "B";
export type MaterialMeta = { id: MaterialId; block: Block; title: string; minutes: number; optional?: boolean };

/**
 * Day 6: Materi A (Route 1, Levels 1 and 2) seven cards, 60 minutes; Materi B (Route 2, Level 3) six cards, 60 minutes.
 *
 * `optional: true` marks a card that no Core task block (lib/progress.ts OPTIONAL_BLOCKS) draws on: collapsed by default via
 * OptionalSection, one click to open, never removed (CLAUDE.md #35). A card a Core block needs stays Core even if an Optional block also
 * cites it.
 */
export const MATERIALS: MaterialMeta[] = bi([
  { id: "A1" as MaterialId, block: "A" as Block, title: t("Satisfied is not loyal: satisfaction against delight", "Zufrieden ist nicht treu: Zufriedenheit gegen Begeisterung"), minutes: 9 },
  { id: "A2" as MaterialId, block: "A" as Block, title: t("Three emotional retention factors: trust, appreciation, relevance", "Drei emotionale Bindungsfaktoren: Vertrauen, Wertschätzung, Relevanz"), minutes: 9 },
  { id: "A3" as MaterialId, block: "A" as Block, title: t("Why attachment is missing: relationship, communication, added value", "Warum Bindung fehlt: Beziehung, Kommunikation, Mehrwert"), minutes: 8 },
  { id: "A4" as MaterialId, block: "A" as Block, title: t("What delight is worth: the churn arithmetic", "Was Begeisterung wert ist: die Churn-Rechnung"), minutes: 9 },
  { id: "A5" as MaterialId, block: "A" as Block, title: t("Reading buying signals: interest, comparison, decision proximity, uncertainty", "Kaufsignale lesen: Interesse, Vergleich, Entscheidungsnähe, Unsicherheit"), minutes: 9 },
  { id: "A6" as MaterialId, block: "A" as Block, title: t("Responding to signals: a simple retention system", "Auf Signale antworten: ein einfaches Bindungssystem"), minutes: 8, optional: true },
  { id: "A7" as MaterialId, block: "A" as Block, title: t("Measures for emotional retention: effect, sustainability, feasibility", "Maßnahmen für emotionale Bindung: Wirkung, Nachhaltigkeit, Machbarkeit"), minutes: 8 },
  { id: "B1" as MaterialId, block: "B" as Block, title: t("From actions to a system: the target vision", "Von Einzelaktionen zum System: das Zielbild"), minutes: 10, optional: true },
  { id: "B2" as MaterialId, block: "B" as Block, title: t("The central process: handling signals", "Der zentrale Prozess: Umgang mit Signalen"), minutes: 10 },
  { id: "B3" as MaterialId, block: "B" as Block, title: t("Where is the lever? Reach, depth, durability, scale", "Wo ist der Hebel? Reichweite, Tiefe, Dauerhaftigkeit, Skalierung"), minutes: 10, optional: true },
  { id: "B4" as MaterialId, block: "B" as Block, title: t("Integrating sales, service and marketing: who does what", "Vertrieb, Service und Marketing verbinden: wer was tut"), minutes: 10, optional: true },
  { id: "B5" as MaterialId, block: "B" as Block, title: t("Deciding without complete information, and the architecture", "Ohne vollständige Information entscheiden, und die Architektur"), minutes: 10 },
  { id: "B6" as MaterialId, block: "B" as Block, title: t("Numbers you can defend: thresholds, payback, the cost of waiting and the month", "Zahlen, die Sie vertreten können: Schwellen, Payback, die Kosten des Wartens und der Monat"), minutes: 10 },
]);

export const MATERIAL_BY_ID = Object.fromEntries(MATERIALS.map((m) => [m.id, m])) as Record<MaterialId, MaterialMeta>;
export const materialAnchorId = (id: MaterialId) => `mat-${id}`;

export type RailSection = { id: string; label: string; sub: string; minutes: number };
export const SECTIONS: Record<1 | 2, RailSection[]> = bi({
  1: [
    { id: "materi-a", label: t("Materi A", "Materi A"), sub: t("Levels 1 + 2 · delight and signals", "Level 1 + 2 · Begeisterung und Signale"), minutes: 60 },
    { id: "task-1", label: t("Task 1", "Task 1"), sub: t("Retention Analysis · one case", "Retention Analysis · ein Fall"), minutes: TASK1_MINUTES },
  ],
  2: [
    { id: "materi-b", label: t("Materi B", "Materi B"), sub: t("Level 3 · retention system", "Level 3 · Bindungssystem"), minutes: 60 },
    { id: "task-2", label: t("Task 2", "Task 2"), sub: t("Retention System Memo · CCO", "Retention System Memo · CCO"), minutes: TASK2_MINUTES },
  ],
});
