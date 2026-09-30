import { bi, t } from "@/lib/lang";

/**
 * Day 6 route registry: Customer Retention & Buying Behaviour in B2B IT Sales, Module 3, Day 2 (emotional customer retention and
 * retention systems). From Day 3 on, a day has TWO routes (CLAUDE.md #30): Route 1 merges Level 1 and Level 2 on one case, Route 2 is
 * Level 3.
 */
export const COURSE = bi({
  title: t("Building Emotional Customer Retention and Implementing It Systematically", "Emotionale Kundenbindung aufbauen und systematisch umsetzen"),
  site: t("Retention Lab · Day 6", "Retention Lab · Tag 6"),
  module: t("Module 3, Day 2 of 2", "Modul 3, Tag 2 von 2"),
  course: t("Customer Retention & Buying Behaviour in B2B IT Sales", "Customer Retention & Kaufverhalten im B2B-IT-Vertrieb"),
  day: 6,
  company: "NetSolutions GmbH",
});

export type RouteNo = 1 | 2;

export const BLOCK_MINUTES = { "1.1": 6, "1.2": 10, "1.3": 8, "1.4": 5, "2.1": 8, "2.2": 9, "2.3": 12, "3.1": 5, "3.2": 9, "3.3": 10, "3.4": 8, "3.5": 10, "3.6": 9 } as const;
const sum = (keys: (keyof typeof BLOCK_MINUTES)[]) => keys.reduce((s, k) => s + BLOCK_MINUTES[k], 0);
export const TASK1_MINUTES = sum(["1.1", "1.2", "1.3", "1.4", "2.1", "2.2", "2.3"]);
export const TASK2_MINUTES = sum(["3.1", "3.2", "3.3", "3.4", "3.5", "3.6"]);

export type RouteInfo = { n: RouteNo; href: string; short: string; title: string; level: string; blurb: string; plan: { label: string; minutes: number }[]; built: boolean };

export const ROUTES: RouteInfo[] = bi([
  {
    n: 1 as RouteNo,
    href: "/route-1/",
    short: t("Delight & signals", "Begeisterung & Signale"),
    title: t("Route 1 · From satisfied to attached", "Route 1 · Von zufrieden zu gebunden"),
    level: t("Levels 1 + 2 · Knowledge and application", "Level 1 + 2 · Wissen und Anwendung"),
    blurb: t(
      "One case, two levels: NetSolutions' customers are satisfied, and they leave anyway. You learn the difference between satisfaction and delight, the three emotional retention factors, and how to read buying signals. Then you sort what customers said, put a number on delight, tag twelve signals from live deals, design a simple response system and choose three measures inside €140,000 and six months. Material first, then one task that ends in a Retention Analysis File.",
      "Ein Fall, zwei Level: Die Kunden von NetSolutions sind zufrieden, und sie gehen trotzdem. Sie lernen den Unterschied zwischen Zufriedenheit und Begeisterung, die drei emotionalen Bindungsfaktoren und wie man Kaufsignale liest. Dann sortieren Sie, was Kunden gesagt haben, geben Begeisterung eine Zahl, ordnen zwölf Signale aus laufenden Deals ein, gestalten ein einfaches Antwortsystem und wählen drei Maßnahmen innerhalb von 140.000 € und sechs Monaten. Erst das Material, dann eine Aufgabe, die mit einer Retention Analysis File endet.",
    ),
    plan: [
      { label: t("Materi A · seven cards, Levels 1 and 2", "Materi A · sieben Karten, Level 1 und 2"), minutes: 60 },
      { label: t("Task 1 · Retention Analysis, one task", "Task 1 · Retention Analysis, eine Aufgabe"), minutes: TASK1_MINUTES },
    ],
    built: true,
  },
  {
    n: 2 as RouteNo,
    href: "/route-2/",
    short: t("Decide", "Entscheiden"),
    title: t("Route 2 · Management decision", "Route 2 · Managemententscheidung"),
    level: t("Level 3 · Management decision", "Level 3 · Managemententscheidung"),
    blurb: t(
      "You are now NetSolutions' Chief Customer Officer. Retention is not managed as a system, sales works reactively and the data is incomplete. You set the target vision, define how signals are handled, choose three strategic levers, decide who does what across sales, service and marketing, and commit to a staged plan before you have all the information. Material first, then a Retention System Memo that assembles itself from your answers, below the last question.",
      "Sie sind jetzt Chief Customer Officer von NetSolutions. Kundenbindung wird nicht als System gesteuert, der Vertrieb arbeitet reaktiv, und die Daten sind unvollständig. Sie legen das Zielbild fest, definieren den Umgang mit Signalen, wählen drei strategische Hebel, entscheiden, wer was über Vertrieb, Service und Marketing hinweg tut, und legen sich auf einen gestuften Plan fest, bevor Sie alle Informationen haben. Erst das Material, dann ein Retention System Memo, das sich unter der letzten Frage aus Ihren Antworten zusammensetzt.",
    ),
    plan: [
      { label: t("Materi B · six cards, Level 3", "Materi B · sechs Karten, Level 3"), minutes: 60 },
      { label: t("Task 2 · Retention System Memo", "Task 2 · Retention System Memo"), minutes: TASK2_MINUTES },
    ],
    built: true,
  },
]);
