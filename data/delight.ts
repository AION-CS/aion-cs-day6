import { bi, t } from "@/lib/lang";

/**
 * Task 1 · Block 1.2, and the worked example of Materi A4: what is satisfaction worth, and what is delight worth? The method is
 *
 *   gross profit lost per year in a group = customers × yearly churn rate × average yearly contract × gross margin
 *   gross profit kept by moving customers = customers moved × (churn satisfied − churn delighted) × contract × margin
 *
 * Every input is a Case assumption from NetSolutions' own customer survey and contract data. Churn rates are printed as percentages
 * and have to be divided by 100; the margin too. Results are rounded to the cent.
 */
export type Group = { customers: number; churn: number };

export const NETSOL = {
  contract: 24000,
  margin: 40,
  satisfied: { customers: 90, churn: 20 } as Group,
  delighted: { customers: 40, churn: 5 } as Group,
  dissatisfied: { customers: 20, churn: 45 } as Group,
  /** How many satisfied customers the plan hopes to turn into delighted ones. */
  moved: 30,
};

const round = (x: number) => Math.round(x * 100) / 100;
export const lostProfit = (g: Group, contract: number, margin: number) => round(g.customers * (g.churn / 100) * contract * (margin / 100));
export const keptProfit = (moved: number, churnFrom: number, churnTo: number, contract: number, margin: number) => round(moved * ((churnFrom - churnTo) / 100) * contract * (margin / 100));

export const DELIGHT = {
  f1: lostProfit(NETSOL.satisfied, NETSOL.contract, NETSOL.margin),
  f2: lostProfit(NETSOL.delighted, NETSOL.contract, NETSOL.margin),
  f3: keptProfit(NETSOL.moved, NETSOL.satisfied.churn, NETSOL.delighted.churn, NETSOL.contract, NETSOL.margin),
  /** Customers leaving per year in each group, for sentences. */
  leaveSatisfied: NETSOL.satisfied.customers * (NETSOL.satisfied.churn / 100),
  leaveDelighted: NETSOL.delighted.customers * (NETSOL.delighted.churn / 100),
};

export type FigureId = "F1" | "F2" | "F3";
export const FIGURE_IDS: FigureId[] = ["F1", "F2", "F3"];

export const FIGURES = bi({
  F1: {
    id: "F1" as FigureId,
    label: t("F1 · Gross profit lost per year among satisfied customers, €", "F1 · Verlorener Rohertrag pro Jahr bei zufriedenen Kunden, €"),
    question: t("How much gross profit does NetSolutions lose each year through satisfied customers who leave?", "Wie viel Rohertrag verliert NetSolutions jedes Jahr durch zufriedene Kunden, die gehen?"),
    answer: DELIGHT.f1,
    formula: t(
      "Gross profit lost = customers in the group × yearly churn rate × average yearly contract × gross margin. Use the “satisfied” row; read the churn rate and the margin as shares of one.",
      "Verlorener Rohertrag = Kunden in der Gruppe × jährliche Churn Rate × durchschnittlicher Jahresvertrag × Bruttomarge. Nutzen Sie die Zeile „zufrieden“; lesen Sie Churn Rate und Marge als Anteile von eins.",
    ),
    taughtIn: "A4" as const,
    clue: t("Check that you used the satisfied row's customers and churn rate, divided both percentages by 100, and multiplied by the contract and the margin.", "Prüfen Sie, dass Sie Kunden und Churn Rate der Zeile „zufrieden“ genommen, beide Prozentwerte durch 100 geteilt und mit Vertrag und Marge multipliziert haben."),
    sources: [
      { label: t("Customer groups · satisfied · customers", "Kundengruppen · zufrieden · Kunden"), value: "90", target: "del-sat-customers" },
      { label: t("Customer groups · satisfied · yearly churn rate", "Kundengruppen · zufrieden · jährliche Churn Rate"), value: t("20%", "20 %"), target: "del-sat-churn" },
      { label: t("All customers · average yearly contract", "Alle Kunden · durchschnittlicher Jahresvertrag"), value: t("€24,000", "24.000 €"), target: "del-contract" },
      { label: t("All customers · gross margin", "Alle Kunden · Bruttomarge"), value: t("40%", "40 %"), target: "del-margin" },
    ],
  },
  F2: {
    id: "F2" as FigureId,
    label: t("F2 · Gross profit lost per year among delighted customers, €", "F2 · Verlorener Rohertrag pro Jahr bei begeisterten Kunden, €"),
    question: t("How much gross profit does NetSolutions lose each year through delighted customers who leave?", "Wie viel Rohertrag verliert NetSolutions jedes Jahr durch begeisterte Kunden, die gehen?"),
    answer: DELIGHT.f2,
    formula: t("The same formula as F1, with the customers and churn rate of the “delighted” row. Contract and margin are the same.", "Dieselbe Formel wie F1, mit Kunden und Churn Rate der Zeile „begeistert“. Vertrag und Marge sind gleich."),
    taughtIn: "A4" as const,
    clue: t("Same steps as F1 with the delighted row. Fewer customers and a much lower churn rate: which one makes the difference?", "Dieselben Schritte wie F1 mit der Zeile „begeistert“. Weniger Kunden und eine viel niedrigere Churn Rate: Was macht den Unterschied?"),
    sources: [
      { label: t("Customer groups · delighted · customers", "Kundengruppen · begeistert · Kunden"), value: "40", target: "del-del-customers" },
      { label: t("Customer groups · delighted · yearly churn rate", "Kundengruppen · begeistert · jährliche Churn Rate"), value: t("5%", "5 %"), target: "del-del-churn" },
      { label: t("All customers · average yearly contract", "Alle Kunden · durchschnittlicher Jahresvertrag"), value: t("€24,000", "24.000 €"), target: "del-contract" },
      { label: t("All customers · gross margin", "Alle Kunden · Bruttomarge"), value: t("40%", "40 %"), target: "del-margin" },
    ],
  },
  F3: {
    id: "F3" as FigureId,
    label: t("F3 · Gross profit kept per year if 30 satisfied customers became delighted, €", "F3 · Gehaltener Rohertrag pro Jahr, wenn 30 zufriedene Kunden begeistert würden, €"),
    question: t("How much gross profit a year would NetSolutions keep if 30 satisfied customers became delighted and churned like the delighted ones?", "Wie viel Rohertrag pro Jahr würde NetSolutions halten, wenn 30 zufriedene Kunden begeistert würden und so wenig abwanderten wie die begeisterten?"),
    answer: DELIGHT.f3,
    formula: t(
      "Gross profit kept = customers moved × (churn rate of satisfied − churn rate of delighted) × average yearly contract × gross margin.",
      "Gehaltener Rohertrag = verschobene Kunden × (Churn Rate zufrieden − Churn Rate begeistert) × durchschnittlicher Jahresvertrag × Bruttomarge.",
    ),
    taughtIn: "A4" as const,
    clue: t("Subtract the two churn rates first (in points), then multiply by the 30 customers, the contract and the margin.", "Ziehen Sie zuerst die beiden Churn Rates voneinander ab (in Punkten), dann multiplizieren Sie mit den 30 Kunden, dem Vertrag und der Marge."),
    sources: [
      { label: t("The plan · satisfied customers to be moved", "Der Plan · zu verschiebende zufriedene Kunden"), value: "30", target: "del-moved" },
      { label: t("Customer groups · satisfied · yearly churn rate", "Kundengruppen · zufrieden · jährliche Churn Rate"), value: t("20%", "20 %"), target: "del-sat-churn" },
      { label: t("Customer groups · delighted · yearly churn rate", "Kundengruppen · begeistert · jährliche Churn Rate"), value: t("5%", "5 %"), target: "del-del-churn" },
      { label: t("All customers · average yearly contract", "Alle Kunden · durchschnittlicher Jahresvertrag"), value: t("€24,000", "24.000 €"), target: "del-contract" },
      { label: t("All customers · gross margin", "Alle Kunden · Bruttomarge"), value: t("40%", "40 %"), target: "del-margin" },
    ],
  },
});

/** The worked example of Materi A4: a different provider (Kontor Systems), the same method on other numbers. Case assumption. */
export const KONTOR = { contract: 18000, margin: 35, satisfied: { customers: 60, churn: 25 } as Group, delighted: { customers: 25, churn: 8 } as Group, moved: 10 };
export const KONTOR_RESULT = {
  satisfied: lostProfit(KONTOR.satisfied, KONTOR.contract, KONTOR.margin),
  delighted: lostProfit(KONTOR.delighted, KONTOR.contract, KONTOR.margin),
  kept: keptProfit(KONTOR.moved, KONTOR.satisfied.churn, KONTOR.delighted.churn, KONTOR.contract, KONTOR.margin),
};
