import type { ArchId } from "@/data/route2";
import { bi, t } from "@/lib/lang";

/**
 * Two facts printed on every item card of Block 3.5 before the learner decides (user decision on Day 6, 2026-10-01): what the item rests
 * on, and what it still needs from the others. The third fact, the payback bar (how many customers or deals it must move to earn its
 * cost), comes from `numberView` so it cannot drift from the trigger numbers. Facts, never a verdict: the learner decides (CLAUDE.md #38, #44).
 *
 * `restsOn` follows the same three levels as Route 1's "runs on": a process lasts, a named role lasts while people stay, one person
 * leaves with the person. It matches `ArchItem.onePerson` (the check "nothing funded rests on one person").
 */
export type RestsOn = "process" | "role" | "person";
export const RESTS_ON: Record<ArchId, RestsOn> = {
  view: "process",
  playbook: "process",
  handover: "process",
  reviews: "process",
  moments: "process",
  owners: "role",
  stars: "person",
  discount: "process",
};
export const RESTS_ON_LABEL = bi({
  process: t("a process or system", "einen Prozess oder ein System"),
  role: t("a named role: it lasts while people stay", "eine benannte Rolle: Sie hält, solange Menschen bleiben"),
  person: t("one person: it leaves when the person does", "eine Person: Sie geht, wenn die Person geht"),
});
export const RESTS_ON_GLYPH: Record<RestsOn, string> = { process: "●●●", role: "●●○", person: "●○○" };

/** What an item still needs from the others before it can work. The shared view is the baseline every trigger reads. */
export const NEEDS_FIRST = bi({
  baseline: t("nothing: every other item reads it", "nichts: jeder andere Punkt liest sie"),
  view: t("the shared customer view first, because its trigger reads it", "zuerst die gemeinsame Kundensicht, weil ihr Trigger sie liest"),
});
