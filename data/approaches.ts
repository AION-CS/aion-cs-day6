import { bi, t } from "@/lib/lang";

/**
 * Task 1 · Block 1.3. One forced choice (what is missing from the customer's perspective) and three approaches to increase delight,
 * each resting on one of the three emotional retention factors of Materi A2: trust, appreciation, relevance. The three approaches must
 * use three different factors and give a reason, so that they can be tried and judged apart. The check is a floor, not a judge.
 */
export type Factor = "trust" | "appreciation" | "relevance";
export const FACTORS = bi([
  { id: "trust" as Factor, label: t("Trust (they can rely on us, and on a person)", "Vertrauen (sie können sich auf uns verlassen, und auf eine Person)"), short: t("Trust", "Vertrauen"), from: "A2" },
  { id: "appreciation" as Factor, label: t("Appreciation (they feel seen and valued)", "Wertschätzung (sie fühlen sich gesehen und geschätzt)"), short: t("Appreciation", "Wertschätzung"), from: "A2" },
  { id: "relevance" as Factor, label: t("Relevance (what we offer fits their situation)", "Relevanz (was wir bieten, passt zu ihrer Lage)"), short: t("Relevance", "Relevanz"), from: "A2" },
]);
export const FACTOR_LABEL = bi({ trust: t("Trust", "Vertrauen"), appreciation: t("Appreciation", "Wertschätzung"), relevance: t("Relevance", "Relevanz") });
export const APPROACH_COUNT = 3;
export const APPROACH_MIN = 45;
export const APPROACH_FRAME = bi({ v: t("[What NetSolutions does] for [which customers], so that they [feel or do what], because [the factor].", "[Was NetSolutions tut] für [welche Kunden], damit sie [was fühlen oder tun], weil [der Faktor].") });

/** True when the sentence gives a reason. A floor, not a judge of quality; English and German forms. */
export const hasBecause = (s: string) => /\b(because|since|so that|which is why|due to|weil|da|damit|denn|sodass|deshalb)\b/i.test(s);

export type MissingId = "performance" | "attachment" | "price" | "features";
export const MISSING_QUESTION = bi({
  statement: t(
    "In the account reviews NetSolutions' customers rate the service 4 out of 5, say they have little personal contact, and name competitors who get in touch more often. From the customer's perspective, what is missing?",
    "In den Account-Reviews bewerten die Kunden von NetSolutions den Service mit 4 von 5, sagen, dass sie wenig persönlichen Kontakt haben, und nennen Wettbewerber, die sich öfter melden. Was fehlt aus Sicht des Kunden?",
  ),
  options: [
    { id: "performance" as MissingId, label: t("Better technical performance", "Bessere technische Leistung") },
    { id: "attachment" as MissingId, label: t("A personal tie and the feeling of being noticed", "Eine persönliche Bindung und das Gefühl, bemerkt zu werden") },
    { id: "price" as MissingId, label: t("A lower price", "Ein niedrigerer Preis") },
    { id: "features" as MissingId, label: t("More features", "Mehr Funktionen") },
  ],
  why: t(
    "Performance is rated good and nobody mentions price or features. What customers name is little personal contact and competitors who are more present: the missing piece is emotional, not functional.",
    "Die Leistung wird gut bewertet, und niemand nennt Preis oder Funktionen. Was Kunden nennen, ist wenig persönlicher Kontakt und Wettbewerber, die präsenter sind: Das fehlende Stück ist emotional, nicht funktional.",
  ),
  clue: t("Which of the four options do the customers actually mention in the review? Which is already rated good?", "Welche der vier Optionen nennen die Kunden im Review tatsächlich? Was wird schon gut bewertet?"),
});
export const MISSING_TRUTH: MissingId = "attachment";
