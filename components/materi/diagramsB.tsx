"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import { Insight, Story, ThePoint, Toggles, useStory } from "@/components/materi/kit";
import { SIGNALS, SIGNAL_IDS } from "@/data/signals";
import type { SignalType } from "@/data/signals";
import { TIMES } from "@/data/route2";
import type { TimeId } from "@/data/route2";
import { bi, euro, t, tt } from "@/lib/lang";
import { Gloss } from "@/lib/glossify";

/**
 * The interactive diagrams of Materi B (Route 2). Every one uses the worked-example company Elbe Managed Services (a Hamburg IT
 * services firm, Case assumption), never NetSolutions. Every control is followed by an always-visible "What this shows" (CLAUDE.md #20).
 */
/** "In plain words:" leads every reading of a control (CLAUDE.md #36). */
const plain = () => tt("In plain words: ", "In einfachen Worten: ");
const C = { ink: "#1F2328", ash: "#59606A", paper: "#FFFEFA", mist: "#ECE6D6", line: "#D8D1BF", amber: "#8A5A0B", gold: "#D99A2B", teal: "#0F6B6B", tealSoft: "#DFEEEB", data: "#2F5D62", grey: "#8B9098", soft: "#FBF0D6" };

/* ------------------------------------------------------------------ B1 · from actions to a system */

type Part = "capture" | "owner" | "rule" | "record" | "review";
const PARTS = bi([
  { id: "capture" as Part, name: t("Capture", "Erfassen"), what: t("Signals are recorded where everyone can see them.", "Signale werden dort erfasst, wo alle sie sehen."), without: t("Signals live in one seller's head. When that seller is away, they are lost.", "Signale leben im Kopf eines Verkäufers. Ist er weg, sind sie verloren.") },
  { id: "owner" as Part, name: t("Owner", "Owner"), what: t("Every signal has a named team that must act.", "Jedes Signal hat ein benanntes Team, das handeln muss."), without: t("Everyone sees the signal and each thinks someone else will act. Nobody does.", "Alle sehen das Signal, und jeder denkt, ein anderer handelt. Niemand tut es.") },
  { id: "rule" as Part, name: t("Response rule", "Antwortregel"), what: t("Each kind of signal has a response and a response time.", "Jede Signalart hat eine Antwort und eine Reaktionszeit."), without: t("The owner answers as they see fit: hesitation gets a demo, and the deal stalls.", "Der Owner antwortet nach Gutdünken: Zögern bekommt eine Demo, und der Deal stockt.") },
  { id: "record" as Part, name: t("Shared record", "Gemeinsamer Datensatz"), what: t("What was answered is written into one customer record.", "Was beantwortet wurde, steht in einem Kundendatensatz."), without: t("Service calls the customer a week later and asks the same question again.", "Der Service ruft den Kunden eine Woche später an und stellt dieselbe Frage noch einmal.") },
  { id: "review" as Part, name: t("Review", "Review"), what: t("Every month the team checks which signals stalled and adjusts the rules.", "Jeden Monat prüft das Team, welche Signale stockten, und passt die Regeln an."), without: t("The same mistake repeats, because nobody looks at the pattern.", "Derselbe Fehler wiederholt sich, weil niemand auf das Muster schaut.") },
]);

export function SystemLoop() {
  const uid = useId().replace(/:/g, "");
  const [on, setOn] = useState<Part[]>(["capture", "owner"]);
  const ALL: Part[] = ["capture", "owner", "rule", "record", "review"];
  const story = useStory([
    {
      title: tt("All five parts", "Alle fünf Teile"),
      say: tt("Meet Elbe Managed Services, an example company, not your case. With all five parts, every signal is captured, owned, answered by a rule, recorded and reviewed, whoever is on duty.", "Das ist Elbe Managed Services, ein Beispielunternehmen, nicht Ihr Fall. Mit allen fünf Teilen wird jedes Signal erfasst, verantwortet, nach Regel beantwortet, festgehalten und geprüft, egal wer Dienst hat."),
      look: tt("the closed loop and “a system” in the middle", "die geschlossene Schleife und „ein System“ in der Mitte"),
      apply: () => setOn(ALL),
    },
    {
      title: tt("One part missing", "Ein Teil fehlt"),
      say: tt("Take away the owner. Everyone sees the signal, each thinks someone else will act, and nobody does. The loop breaks at that gap.", "Nehmen Sie den Owner weg. Alle sehen das Signal, jeder denkt, ein anderer handelt, und niemand tut es. Die Schleife bricht an dieser Lücke."),
      look: tt("the dashed circle “Owner” and its broken links", "den gestrichelten Kreis „Owner“ und seine unterbrochenen Verbindungen"),
      apply: () => setOn(ALL.filter((x) => x !== "owner")),
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt("A system is all five parts; the first missing one is where it depends on individuals again. Switch the parts yourself.", "Ein System sind alle fünf Teile; der erste fehlende ist die Stelle, an der es wieder an Einzelnen hängt. Schalten Sie die Teile selbst."),
      look: tt("the buttons under the picture", "die Schaltflächen unter dem Bild"),
      apply: () => setOn(ALL),
    },
  ]);
  const toggle = (p: Part) => {
    story.leave();
    setOn((c) => (c.includes(p) ? c.filter((x) => x !== p) : [...c, p]));
  };
  const firstMissing = PARTS.find((p) => !on.includes(p.id));
  const cx = 280;
  const cy = 118;
  const R = 88;
  const pos = PARTS.map((_, i) => ({ x: cx + R * Math.cos(((i * 72 - 90) * Math.PI) / 180), y: cy + R * Math.sin(((i * 72 - 90) * Math.PI) / 180) }));
  return (
    <div className="space-y-3">
      <ThePoint>{tt("A retention system is five parts in a loop: capture, owner, response rule, shared record, review. Take one away and the loop depends on individuals again.", "Ein Bindungssystem sind fünf Teile in einer Schleife: Erfassen, Owner, Antwortregel, gemeinsamer Datensatz, Review. Fehlt einer, hängt die Schleife wieder an Einzelnen.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 240" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("The retention loop: five parts that make actions into a system", "Die Bindungsschleife: fünf Teile, die aus Aktionen ein System machen")}</title>
        <desc id={`${uid}-d`}>{tt(`${on.length} of 5 parts in place.`, `${on.length} von 5 Teilen vorhanden.`)}</desc>
        {pos.map((p, i) => {
          const n = pos[(i + 1) % pos.length];
          const ok = on.includes(PARTS[i].id) && on.includes(PARTS[(i + 1) % PARTS.length].id);
          return <line key={i} x1={p.x} y1={p.y} x2={n.x} y2={n.y} stroke={ok ? C.data : C.line} strokeWidth={ok ? 4 : 2} strokeDasharray={ok ? undefined : "6 5"} />;
        })}
        {PARTS.map((p, i) => {
          const active = on.includes(p.id);
          return (
            <g key={p.id}>
              {story.step === 1 && p.id === "owner" && <circle cx={pos[i].x} cy={pos[i].y} r="42" fill="none" stroke={C.amber} strokeWidth="2.5" strokeDasharray="5 4" className="anim-pulse" />}
              <circle cx={pos[i].x} cy={pos[i].y} r="34" fill={active ? C.tealSoft : C.paper} stroke={active ? C.teal : C.ash} strokeWidth={active ? 2.4 : 1.4} strokeDasharray={active ? undefined : "5 4"} />
              <text x={pos[i].x} y={pos[i].y + 4} textAnchor="middle" fontSize="11.5" fontWeight="700" fill={C.ink}>{p.name}</text>
            </g>
          );
        })}
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill={on.length === 5 ? C.teal : C.ash}>{on.length === 5 ? tt("a system", "ein System") : tt(`${on.length} of 5`, `${on.length} von 5`)}</text>
      </svg>
      <div className="space-y-1.5">
        <p className="smallcaps">{tt("Switch a part of Elbe's loop on or off", "Einen Teil der Schleife von Elbe ein- oder ausschalten")}</p>
        <Toggles multi label={tt("Parts", "Teile")} value={on} onChange={toggle} options={PARTS.map((p) => ({ id: p.id, label: `${p.name}${on.includes(p.id) ? tt(" · on", " · an") : tt(" · off", " · aus")}` }))} />
      </div>
      <Insight>
        {plain()}
        {firstMissing
          ? tt(`With ${on.length} of 5 parts Elbe still depends on individuals. The first gap is “${firstMissing.name}”: ${firstMissing.without}`, `Mit ${on.length} von 5 Teilen hängt Elbe noch an Einzelnen. Die erste Lücke ist „${firstMissing.name}“: ${firstMissing.without}`)
          : tt("All five parts are in place: every signal is captured, owned, answered by a rule, recorded and reviewed. Retention now works whoever is on duty, and it improves every month.", "Alle fünf Teile sind da: Jedes Signal wird erfasst, verantwortet, nach Regel beantwortet, festgehalten und geprüft. Kundenbindung funktioniert jetzt, egal wer Dienst hat, und wird jeden Monat besser.")}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ B2 · response time against open deals */

const STILL_OPEN: Record<SignalType, Record<TimeId, number>> = {
  interest: { same: 95, two: 90, week: 75, next: 55 },
  comparison: { same: 90, two: 85, week: 60, next: 35 },
  proximity: { same: 95, two: 85, week: 55, next: 30 },
  uncertainty: { same: 85, two: 65, week: 40, next: 20 },
};
export function ResponseDecay() {
  const uid = useId().replace(/:/g, "");
  const [sig, setSigRaw] = useState<SignalType>("uncertainty");
  const [spot, setSpot] = useState<number | null>(null);
  const story = useStory([
    {
      title: tt("Interest keeps", "Interesse hält"),
      say: tt(`Meet Elbe, an example company, not your case. When a buyer shows interest, ${STILL_OPEN.interest.two}% of deals are still open after two working days. Interest cools slowly.`, `Das ist Elbe, ein Beispielunternehmen, nicht Ihr Fall. Zeigt ein Käufer Interesse, sind nach zwei Arbeitstagen noch ${STILL_OPEN.interest.two} % der Deals offen. Interesse kühlt langsam ab.`),
      look: tt("the second bar", "den zweiten Balken"),
      apply: () => {
        setSigRaw("interest");
        setSpot(1);
      },
    },
    {
      title: tt("Hesitation does not keep", "Zögern hält nicht"),
      say: tt(`Hesitation is different: after a week only ${STILL_OPEN.uncertainty.week}% are still open, at the next scheduled contact ${STILL_OPEN.uncertainty.next}%. Every day the doubt grows.`, `Zögern ist anders: Nach einer Woche sind nur noch ${STILL_OPEN.uncertainty.week} % offen, beim nächsten geplanten Kontakt ${STILL_OPEN.uncertainty.next} %. Jeden Tag wächst der Zweifel.`),
      look: tt("the third and fourth bars", "den dritten und vierten Balken"),
      apply: () => {
        setSigRaw("uncertainty");
        setSpot(2);
      },
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt("Set each response time by how fast that signal cools: hesitation the same day, the others within two working days. Try the other signal types.", "Legen Sie jede Reaktionszeit danach fest, wie schnell das Signal abkühlt: Zögern am selben Tag, die anderen innerhalb von zwei Arbeitstagen. Probieren Sie die anderen Signalarten."),
      look: tt("the first bar: the same day", "den ersten Balken: am selben Tag"),
      apply: () => {
        setSigRaw("uncertainty");
        setSpot(0);
      },
    },
  ]);
  const setSig = (v: SignalType) => {
    story.leave();
    setSpot(null);
    setSigRaw(v);
  };
  const X = (i: number) => 80 + i * 120;
  const H = (v: number) => v * 1.6;
  const vals = TIMES.map((tm) => STILL_OPEN[sig][tm.id]);
  return (
    <div className="space-y-3">
      <ThePoint>{tt("A signal loses value while it waits. Hesitation loses it fastest, so it is answered the same day.", "Ein Signal verliert an Wert, während es wartet. Zögern verliert ihn am schnellsten, deshalb wird es am selben Tag beantwortet.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 220" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Deals still open after the signal, by response time", "Deals, die nach dem Signal noch offen sind, nach Reaktionszeit")}</title>
        <desc id={`${uid}-d`}>{TIMES.map((tm, i) => `${tm.label}: ${vals[i]}%`).join(". ")}</desc>
        <line x1="40" y1="180" x2="540" y2="180" stroke={C.ash} />
        {TIMES.map((tm, i) => (
          <g key={tm.id}>
            <rect x={X(i) - 34} y={180 - H(vals[i])} width="68" height={H(vals[i])} fill={i === 0 ? C.data : i === 1 ? C.teal : C.grey} stroke={C.ink} className="anim-grow-y" />
            {story.step !== null && (spot === i || (spot === 2 && i === 3)) && <rect x={X(i) - 40} y={174 - H(vals[i])} width="80" height={H(vals[i]) + 10} rx="4" fill="none" stroke={C.amber} strokeWidth="2.5" strokeDasharray="5 4" className="anim-pulse" />}
            <text x={X(i)} y={172 - H(vals[i])} textAnchor="middle" fontSize="13" fontWeight="700" fill={C.ink}>{`${vals[i]}%`}</text>
            <text x={X(i)} y="198" textAnchor="middle" fontSize="11" fill={C.ash}>{tm.label.length > 22 ? `${tm.label.slice(0, 21)}…` : tm.label}</text>
          </g>
        ))}
      </svg>
      <div className="space-y-1.5">
        <p className="smallcaps">{tt("Signal type at Elbe", "Signalart bei Elbe")}</p>
        <Toggles<SignalType> label={tt("Signal", "Signal")} value={sig} onChange={setSig} options={SIGNAL_IDS.map((s) => ({ id: s, label: SIGNALS[s].label }))} />
      </div>
      <Insight>
        {plain()}
        {tt(
          `For ${SIGNALS[sig].label}, ${vals[0]}% of deals are still open when the answer comes the same day and ${vals[3]}% when it waits for the next scheduled contact. ${sig === "uncertainty" ? "Hesitation decays fastest: every day without an answer the doubt grows. That is why it is answered the same day." : sig === "interest" ? "Interest keeps longest, but even it cools: two days is a safe response time." : "The buyer is working on its decision now; an answer after it has moved on does not count."}`,
          `Bei ${SIGNALS[sig].label} sind ${vals[0]} % der Deals noch offen, wenn die Antwort am selben Tag kommt, und ${vals[3]} %, wenn sie bis zum nächsten geplanten Kontakt wartet. ${sig === "uncertainty" ? "Zögern zerfällt am schnellsten: Jeden Tag ohne Antwort wächst der Zweifel. Deshalb wird es am selben Tag beantwortet." : sig === "interest" ? "Interesse hält am längsten, kühlt aber auch ab: Zwei Tage sind eine sichere Reaktionszeit." : "Der Käufer arbeitet jetzt an seiner Entscheidung; eine Antwort, nachdem er weitergegangen ist, zählt nicht."}`,
        )}
      </Insight>
      <p className="text-caption text-ash">{tt("Illustration on Elbe's pipeline data (Case assumption), not a measurement.", "Illustration auf Pipeline-Daten von Elbe (Fallannahme), keine Messung.")}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ B3 · lever profile */

const E_LEVERS = bi([
  { id: "record", name: t("Shared customer record", "Gemeinsamer Kundendatensatz"), r: [3, 2, 3, 3], why: [t("Every customer has one.", "Jeder Kunde hat einen."), t("Alone it creates no attachment; it enables the others.", "Allein schafft er keine Bindung; er ermöglicht die anderen."), t("A structure: it stays when people change.", "Eine Struktur: Sie bleibt, wenn Menschen wechseln."), t("Built once, serves every customer.", "Einmal gebaut, dient jedem Kunden.")] },
  { id: "rules", name: t("Signal response rules", "Signal-Antwortregeln"), r: [3, 3, 3, 3], why: [t("Every signal from every customer.", "Jedes Signal von jedem Kunden."), t("Answers the doubt that ends deals.", "Beantwortet den Zweifel, der Deals beendet."), t("A process, not a person.", "Ein Prozess, keine Person."), t("Written once, used for every signal.", "Einmal geschrieben, für jedes Signal genutzt.")] },
  { id: "hero", name: t("Star account manager", "Star-Account-Manager"), r: [2, 3, 1, 1], why: [t("Only the accounts that person holds.", "Nur die Accounts, die diese Person hält."), t("Deep ties where it works.", "Tiefe Bindung, wo es wirkt."), t("Leaves with the person.", "Geht mit der Person."), t("Every new account needs more of the same person.", "Jeder neue Account braucht mehr von derselben Person.")] },
  { id: "rebate", name: t("Renewal rebate", "Verlängerungsrabatt"), r: [3, 1, 2, 1], why: [t("Every renewal.", "Jede Verlängerung."), t("Moves the price, not the feeling.", "Bewegt den Preis, nicht das Gefühl."), t("A rule, but customers learn to wait for it.", "Eine Regel, aber Kunden lernen, darauf zu warten."), t("Paid again on every deal.", "Bei jedem Deal wieder bezahlt.")] },
]);
const CRIT_NAMES = () => [tt("Reach", "Reichweite"), tt("Depth", "Tiefe"), tt("Durability", "Dauerhaftigkeit"), tt("Scale", "Skalierung")];
const DOTS = ["", "●○○", "●●○", "●●●"];

export function LeverProfile() {
  const [sel, setSelRaw] = useState<{ l: string; c: number }>({ l: "hero", c: 2 });
  const tot = (id: string) => E_LEVERS.find((x) => x.id === id)!.r.reduce((s2, v) => s2 + v, 0);
  const story = useStory([
    {
      title: tt("A lever that holds for everyone", "Ein Hebel, der für alle gilt"),
      say: tt(`Meet Elbe, an example company, not your case. Its signal rules score 3 on every test: every customer, every signal, whoever is on duty. Total ${tot("rules")} of 12.`, `Das ist Elbe, ein Beispielunternehmen, nicht Ihr Fall. Seine Signalregeln bekommen in jedem Test 3: jeder Kunde, jedes Signal, egal wer Dienst hat. Summe ${tot("rules")} von 12.`),
      look: tt("the row “Signal response rules”", "die Zeile „Signal-Antwortregeln“"),
      apply: () => setSelRaw({ l: "rules", c: 2 }),
    },
    {
      title: tt("Deep, and gone with one person", "Tief, und weg mit einer Person"),
      say: tt(`The star account manager builds the deepest ties, for a few customers. Durability 1: the tie leaves with the person. Total ${tot("hero")}.`, `Der Star-Account-Manager baut die tiefsten Bindungen, für wenige Kunden. Dauerhaftigkeit 1: Die Bindung geht mit der Person. Summe ${tot("hero")}.`),
      look: tt("the durability cell of the star", "die Zelle Dauerhaftigkeit beim Star"),
      apply: () => setSelRaw({ l: "hero", c: 2 }),
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt("The greatest lever is not the most dramatic one: it reaches everyone and lasts when people change. Click any rating to read why.", "Der größte Hebel ist nicht der spektakulärste: Er erreicht alle und hält, wenn Menschen wechseln. Klicken Sie eine Bewertung an, um den Grund zu lesen."),
      look: tt("the totals on the right", "die Summen rechts"),
      apply: () => setSelRaw({ l: "record", c: 3 }),
    },
  ]);
  const setSel = (v: { l: string; c: number }) => {
    story.leave();
    setSelRaw(v);
  };
  const lever = E_LEVERS.find((x) => x.id === sel.l)!;
  const totals = E_LEVERS.map((l) => ({ id: l.id, name: l.name, total: l.r.reduce((s, v) => s + v, 0) })).sort((a, b) => b.total - a.total);
  return (
    <div className="space-y-3">
      <ThePoint>{tt("The greatest lever for loyalty is not the most dramatic one. It reaches every customer, builds real attachment and still works when people change.", "Der größte Hebel für Loyalität ist nicht der spektakulärste. Er erreicht jeden Kunden, baut echte Bindung auf und wirkt noch, wenn Menschen wechseln.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <div className="relative overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[34rem] border-collapse text-caption">
          <caption className="sr-only">{tt("Four levers of Elbe rated on four tests", "Vier Hebel von Elbe, bewertet nach vier Tests")}</caption>
          <thead>
            <tr className="bg-mist text-left text-micro uppercase text-ash">
              <th className="px-3 py-2">{tt("Lever", "Hebel")}</th>
              {CRIT_NAMES().map((c) => (
                <th key={c} className="px-3 py-2">
                  {c}
                </th>
              ))}
              <th className="px-3 py-2 text-right">{tt("Total", "Summe")}</th>
            </tr>
          </thead>
          <tbody>
            {E_LEVERS.map((l) => (
              <tr key={l.id} className="border-t border-line">
                <td className="px-3 py-2 font-semibold">{l.name}</td>
                {l.r.map((v, c) => (
                  <td key={c} className="px-3 py-2">
                    <button type="button" onClick={() => setSel({ l: l.id, c })} aria-pressed={sel.l === l.id && sel.c === c} className={clsx("btn-ghost btn-sm min-w-[4rem]", sel.l === l.id && sel.c === c && "border-accent bg-accentSoft", sel.l === l.id && sel.c === c && story.step !== null && "anim-pulse ring-2 ring-gold")} aria-label={`${l.name} · ${CRIT_NAMES()[c]}: ${v}`}>
                      <span aria-hidden>{DOTS[v]}</span> <span className="sr-only">{v}</span>
                    </button>
                  </td>
                ))}
                <td className="tnum px-3 py-2 text-right font-bold">{l.r.reduce((s, v) => s + v, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-lg border border-line bg-paper p-3 text-caption" aria-live="polite">
        <p className="smallcaps">
          {lever.name} · {CRIT_NAMES()[sel.c]} · {lever.r[sel.c]}
        </p>
        <p className="mt-1 text-ink">{lever.why[sel.c]}</p>
      </div>
      <Insight>
        {plain()}
        {tt(
          `By total, ${totals.map((x) => `${x.name} ${x.total}`).join(", ")}. The star account manager has the deepest effect and the lowest durability and scale: strong for a few customers, gone with one person. The rules and the record are less dramatic and win, because they hold for every customer whoever is on duty.`,
          `Nach Summe: ${totals.map((x) => `${x.name} ${x.total}`).join(", ")}. Der Star-Account-Manager hat die tiefste Wirkung und die geringste Dauerhaftigkeit und Skalierung: stark für wenige Kunden, weg mit einer Person. Regeln und Datensatz sind weniger spektakulär und gewinnen, weil sie für jeden Kunden gelten, egal wer Dienst hat.`,
        )}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ B4 · RACI worked example (Elbe) */

type Letter = "R" | "A" | "C" | "I" | "-";
const E_ROLES = bi([
  { id: "sales", name: t("Sales", "Vertrieb") },
  { id: "service", name: t("Service", "Service") },
  { id: "marketing", name: t("Marketing", "Marketing") },
  { id: "cco", name: t("CCO", "CCO") },
]);
const E_ROWS = bi([
  {
    id: "onboard",
    name: t("Onboard a new customer in its first 30 days", "Einen Neukunden in den ersten 30 Tagen onboarden"),
    cells: [
      { l: "C" as Letter, why: t("Sales knows what was promised and is asked, but no longer does the work.", "Der Vertrieb weiß, was versprochen wurde, und wird gefragt, macht die Arbeit aber nicht mehr.") },
      { l: "A" as Letter, why: t("Service runs the platform for the customer, so it answers for onboarding and does it.", "Der Service betreibt die Plattform für den Kunden, also verantwortet er das Onboarding und macht es.") },
      { l: "I" as Letter, why: t("Marketing is told, so the welcome content fits.", "Marketing wird informiert, damit die Willkommensinhalte passen.") },
      { l: "-" as Letter, why: t("A routine activity: the CCO does not need to be involved.", "Eine Routinetätigkeit: Der CCO muss nicht beteiligt sein.") },
    ],
  },
  {
    id: "quarterly",
    name: t("Send the quarterly customer newsletter", "Den Kunden-Newsletter pro Quartal versenden"),
    cells: [
      { l: "C" as Letter, why: t("Sales is asked which topics matter to its customers.", "Der Vertrieb wird gefragt, welche Themen für seine Kunden zählen.") },
      { l: "C" as Letter, why: t("Service is asked what customers struggle with.", "Der Service wird gefragt, womit Kunden kämpfen.") },
      { l: "A" as Letter, why: t("Marketing owns the content and the channel, so it answers for the newsletter.", "Marketing verantwortet Inhalte und Kanal, also verantwortet es den Newsletter.") },
      { l: "I" as Letter, why: t("The CCO is told what went out.", "Der CCO wird informiert, was verschickt wurde.") },
    ],
  },
  {
    id: "renewal",
    name: t("Renegotiate a large renewal at risk", "Eine gefährdete große Verlängerung neu verhandeln"),
    cells: [
      { l: "R" as Letter, why: t("Sales does the negotiation.", "Der Vertrieb führt die Verhandlung.") },
      { l: "R" as Letter, why: t("Service does its part: it fixes what went wrong and shows the plan.", "Der Service macht seinen Teil: Er behebt, was schiefging, und zeigt den Plan.") },
      { l: "-" as Letter, why: t("Marketing has no role in one negotiation.", "Marketing hat in einer einzelnen Verhandlung keine Rolle.") },
      { l: "A" as Letter, why: t("A large renewal trades money and effort across teams: only the CCO can decide.", "Eine große Verlängerung verschiebt Geld und Aufwand über Teams: Nur der CCO kann entscheiden.") },
    ],
  },
]);
const LETTER_TEST = bi({
  R: t("R · Responsible: who does the work?", "R · Responsible: Wer macht die Arbeit?"),
  A: t("A · Accountable: who answers for the result and has the authority to decide? Exactly one per row; they may also do the work.", "A · Accountable: Wer steht für das Ergebnis ein und hat die Befugnis zu entscheiden? Genau einer pro Zeile; er darf die Arbeit auch selbst machen."),
  C: t("C · Consulted: whose knowledge is needed before acting? Two-way.", "C · Consulted: Wessen Wissen wird vor dem Handeln gebraucht? In beide Richtungen."),
  I: t("I · Informed: who must know afterwards? One-way.", "I · Informed: Wer muss es danach wissen? In eine Richtung."),
  "-": t("– · No role: involving them would only slow it down.", "– · Keine Rolle: Sie einzubeziehen, würde es nur verlangsamen."),
});

export function RaciExample() {
  const [sel, setSelRaw] = useState<{ r: number; c: number }>({ r: 2, c: 3 });
  const story = useStory([
    {
      title: tt("One team decides and does it", "Ein Team entscheidet und macht es"),
      say: tt("Meet Elbe, an example company, not your case. Service runs onboarding for the customer and decides how it goes, so it holds the A and does the work too.", "Das ist Elbe, ein Beispielunternehmen, nicht Ihr Fall. Der Service führt das Onboarding für den Kunden durch und entscheidet, wie es läuft, also hält er das A und macht die Arbeit auch."),
      look: tt("the A of Service in the onboarding row", "das A des Service in der Zeile Onboarding"),
      apply: () => setSelRaw({ r: 0, c: 1 }),
    },
    {
      title: tt("Doing is not deciding", "Machen ist nicht Entscheiden"),
      say: tt("In a large renewal at risk, sales negotiates (R), but it cannot move money and effort across teams. So sales is not the A here.", "Bei einer gefährdeten großen Verlängerung verhandelt der Vertrieb (R), kann aber Geld und Aufwand nicht über Teams verschieben. Deshalb ist der Vertrieb hier nicht das A."),
      look: tt("the R of Sales in the renewal row", "das R des Vertriebs in der Zeile Verlängerung"),
      apply: () => setSelRaw({ r: 2, c: 0 }),
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt("Every row has exactly one A: whoever has the authority to decide. The CCO takes it only where money or effort moves across teams. Click any cell to read why.", "Jede Zeile hat genau ein A: wer die Befugnis zu entscheiden hat. Der CCO nimmt es nur, wo Geld oder Aufwand über Teams verschoben werden. Klicken Sie eine Zelle an, um den Grund zu lesen."),
      look: tt("the A of the CCO in the renewal row", "das A des CCO in der Zeile Verlängerung"),
      apply: () => setSelRaw({ r: 2, c: 3 }),
    },
  ]);
  const setSel = (v: { r: number; c: number }) => {
    story.leave();
    setSelRaw(v);
  };
  const row = E_ROWS[sel.r];
  const cell = row.cells[sel.c];
  return (
    <div className="space-y-3">
      <ThePoint>{tt("Every activity has exactly one A: the one with the authority to decide. The CCO takes the A only where money or effort moves across teams.", "Jede Tätigkeit hat genau ein A: wer die Befugnis zu entscheiden hat. Der CCO nimmt das A nur, wo Geld oder Aufwand über Teams verschoben werden.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <div className="relative overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[34rem] border-collapse text-caption">
          <caption className="sr-only">{tt("Elbe's RACI grid for three activities", "RACI-Raster von Elbe für drei Tätigkeiten")}</caption>
          <thead>
            <tr className="bg-mist text-left text-micro uppercase text-ash">
              <th className="px-3 py-2">{tt("Activity", "Tätigkeit")}</th>
              {E_ROLES.map((r) => (
                <th key={r.id} className="px-3 py-2 text-center">
                  {r.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {E_ROWS.map((rw, i) => (
              <tr key={rw.id} className="border-t border-line">
                <td className="px-3 py-2 font-semibold">{rw.name}</td>
                {rw.cells.map((c, j) => (
                  <td key={j} className="px-3 py-2 text-center">
                    <button type="button" onClick={() => setSel({ r: i, c: j })} aria-pressed={sel.r === i && sel.c === j} className={clsx("btn-ghost btn-sm min-h-[40px] min-w-[3rem] font-bold", sel.r === i && sel.c === j && "border-accent bg-accentSoft", sel.r === i && sel.c === j && story.step !== null && "anim-pulse ring-2 ring-gold")} aria-label={`${rw.name} · ${E_ROLES[j].name}: ${c.l}`}>
                      {c.l === "-" ? "–" : c.l}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-lg border border-line bg-paper p-3 text-caption" aria-live="polite">
        <p className="smallcaps">
          {row.name} · {E_ROLES[sel.c].name}: {cell.l === "-" ? "–" : cell.l}
        </p>
        <p className="mt-1 text-ink">{cell.why}</p>
        <p className="mt-1 text-ash">
          <span className="font-semibold text-ink">{tt("The test. ", "Der Test. ")}</span>
          <Gloss>{LETTER_TEST[cell.l]}</Gloss>
        </p>
      </div>
      <Insight>
        {plain()}
        {tt(
          "Every row has exactly one A. Where a team both answers for and does the work (service in onboarding), it holds the A and no separate R is needed. The CCO takes the A only where money or effort must be traded across teams, and stays out of routine work: a CCO with an A in every row becomes the queue.",
          "Jede Zeile hat genau ein A. Wo ein Team die Arbeit verantwortet und selbst macht (der Service beim Onboarding), hält es das A, und ein eigenes R ist nicht nötig. Der CCO nimmt das A nur dort, wo Geld oder Aufwand über Teams verschoben werden müssen, und bleibt aus der Routine heraus: Ein CCO mit einem A in jeder Zeile wird zur Warteschlange.",
        )}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ B5 · architecture (Elbe) */

const E_ARCH = bi([
  { id: "record", name: t("Shared customer record", "Gemeinsamer Kundendatensatz"), start: 1, owner: t("Head of Sales Operations", "Leitung Sales Operations"), trigger: t("If fewer than 75% of records are complete by month 2, the rules wait.", "Sind bis Monat 2 weniger als 75 % der Datensätze vollständig, warten die Regeln."), why: t("First, because every rule and trigger reads it.", "Zuerst, weil jede Regel und jeder Trigger ihn liest.") },
  { id: "rules", name: t("Signal response rules", "Signal-Antwortregeln"), start: 2, owner: t("Head of Sales", "Vertriebsleitung"), trigger: t("If fewer than 5 stalled deals have moved forward by month 4, owners are reassigned.", "Sind bis Monat 4 weniger als 5 stockende Deals weitergekommen, werden Owner neu zugeordnet."), why: t("After the record, so answered signals can be seen.", "Nach dem Datensatz, damit beantwortete Signale sichtbar sind.") },
  { id: "welcome", name: t("30-day onboarding programme", "30-Tage-Onboarding-Programm"), start: 3, owner: t("Head of Service", "Leitung Service"), trigger: t("If fewer than 8 new customers rate the onboarding 5 of 5 by month 5, it is shortened.", "Bewerten bis Monat 5 weniger als 8 Neukunden das Onboarding mit 5 von 5, wird es gekürzt."), why: t("Service runs onboarding, so it owns it alone.", "Der Service führt das Onboarding durch, also verantwortet er es allein.") },
]);

export function ArchExample() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSelRaw] = useState("record");
  const story = useStory([
    {
      title: tt("First the record everyone reads", "Zuerst der Datensatz, den alle lesen"),
      say: tt("Meet Elbe, an example company, not your case. Its shared customer record starts in month 1, because every rule and every trigger reads it. Its own trigger checks that enough records are complete by month 2.", "Das ist Elbe, ein Beispielunternehmen, nicht Ihr Fall. Sein gemeinsamer Kundendatensatz startet in Monat 1, weil jede Regel und jeder Trigger ihn liest. Sein eigener Trigger prüft, ob bis Monat 2 genug Datensätze vollständig sind."),
      look: tt("the first row, starting in M1", "die erste Zeile, Start in M1"),
      apply: () => setSelRaw("record"),
    },
    {
      title: tt("A rule without the record", "Eine Regel ohne den Datensatz"),
      say: tt("Had the signal rules started first, nobody could see which signals were answered, and their trigger could not be read. So they start in month 2, after the record.", "Wären die Signalregeln zuerst gestartet, könnte niemand sehen, welche Signale beantwortet wurden, und ihr Trigger ließe sich nicht lesen. Deshalb starten sie in Monat 2, nach dem Datensatz."),
      look: tt("the second row, starting in M2", "die zweite Zeile, Start in M2"),
      apply: () => setSelRaw("rules"),
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt("Start with what every other item reads, give each item one owner who can change it alone, and a trigger with a number, a month and an action. Materi B6 shows how the numbers are worked out.", "Beginnen Sie mit dem, was jeder andere Punkt liest, geben Sie jedem Punkt einen Owner, der ihn allein ändern kann, und einen Trigger mit Zahl, Monat und Aktion. Materi B6 zeigt, wie die Zahlen berechnet werden."),
      look: tt("the third row and its owner", "die dritte Zeile und ihren Owner"),
      apply: () => setSelRaw("welcome"),
    },
  ]);
  const setSel = (v: string) => {
    story.leave();
    setSelRaw(v);
  };
  const r = E_ARCH.find((x) => x.id === sel)!;
  const X = (m: number) => 190 + (m - 1) * 60;
  return (
    <div className="space-y-3">
      <ThePoint>{tt("A plan starts with the item every other item reads, and gives each item one owner and a trigger: a number, a month and an action.", "Ein Plan beginnt mit dem Punkt, den jeder andere liest, und gibt jedem Punkt einen Owner und einen Trigger: eine Zahl, einen Monat und eine Aktion.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 170" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Elbe's three funded items by start month", "Die drei finanzierten Punkte von Elbe nach Startmonat")}</title>
        <desc id={`${uid}-d`}>{E_ARCH.map((a) => `${a.name}: ${a.start}`).join(". ")}</desc>
        {[1, 2, 3, 4, 5, 6].map((m) => (
          <text key={m} x={X(m) + 30} y="14" textAnchor="middle" fontSize="11.5" fill={C.ash}>{`M${m}`}</text>
        ))}
        {E_ARCH.map((a, i) => {
          const y = 24 + i * 44;
          const on = a.id === sel;
          return (
            <g key={a.id} className="hit" role="button" tabIndex={0} aria-label={a.name} onClick={() => setSel(a.id)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSel(a.id)}>
              <text x="4" y={y + 22} fontSize="12" fontWeight={on ? 800 : 600} fill={C.ink}>{a.name.length > 28 ? `${a.name.slice(0, 27)}…` : a.name}</text>
              {[1, 2, 3, 4, 5, 6].map((m) => (
                <rect key={m} className={m === a.start ? clsx("hit-shape", on && story.step !== null && "anim-pulse") : undefined} x={X(m) + 2} y={y + 6} width="56" height="24" rx="3" fill={m === a.start ? C.data : m > a.start ? C.tealSoft : C.paper} stroke={on && m === a.start ? C.amber : C.line} strokeWidth={on && m === a.start ? 2.5 : 1} strokeDasharray={on && m === a.start && story.step !== null ? "5 3" : undefined} />
              ))}
            </g>
          );
        })}
      </svg>
      <div className="space-y-1.5">
        <p className="smallcaps">{tt("Read one item", "Einen Punkt lesen")}</p>
        <Toggles<string> label={tt("Item", "Punkt")} value={sel} onChange={setSel} options={E_ARCH.map((a) => ({ id: a.id, label: a.name }))} />
      </div>
      <div className="rounded-lg border border-line bg-paper p-3.5 text-caption" aria-live="polite">
        <p className="smallcaps">{r.name}</p>
        <p className="mt-1">
          <span className="font-semibold text-ink">Owner. </span>
          {r.owner}
        </p>
        <p className="mt-1">
          <span className="font-semibold text-ink">Trigger. </span>
          <Gloss>{r.trigger}</Gloss>
        </p>
        <p className="mt-1 text-ash">{r.why}</p>
      </div>
      <Insight>
        {plain()}
        {tt(
          "The shared record starts first, because it is the baseline every trigger reads. Each item has one owner who can change it alone and a trigger with a number, a date and an action. Elbe left out the star account manager on purpose: it would have rested on one person, which is exactly what the system is meant to end.",
          "Der gemeinsame Datensatz startet zuerst, weil er die Baseline ist, die jeder Trigger liest. Jeder Punkt hat einen Owner, der ihn allein ändern kann, und einen Trigger mit Zahl, Datum und Aktion. Elbe hat den Star-Account-Manager bewusst weggelassen: Er hätte auf einer Person geruht, genau das, was das System beenden soll.",
        )}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ B6 · numbers you can defend (Elbe) */

/**
 * Elbe's figures for the method card (Case assumption, deliberately unlike NetSolutions', CLAUDE.md #24): every number a plan needs is
 * derived from them by one of five methods. The same numbers appear in B5's triggers, so the two cards agree.
 */
export const ELBE = {
  customers: 200,
  openDeals: 150,
  rulesCost: 22000,
  dealGP: 5000,
  contract: 30000,
  margin: 35,
  churnSat: 18,
  churnDel: 6,
  years: 2,
  welcomeCost: 18000,
  starCost: 36000,
  delighted: 55,
  customerItemsCost: 45000,
  welcomeStart: 3,
  welcomeWeeks: 4,
  welcomeRespond: 1,
};
const up6 = (x: number) => Math.ceil(x - 1e-9);
export const ELBE_KEPT = ((ELBE.churnSat - ELBE.churnDel) / 100) * ELBE.contract * (ELBE.margin / 100);
export const ELBE_GP = ELBE.contract * (ELBE.margin / 100);
export const ELBE_RESULT = {
  coverage: up6((ELBE.openDeals / ELBE.customers) * 100),
  dealPayback: up6(ELBE.rulesCost / ELBE.dealGP),
  customerPayback: up6(ELBE.welcomeCost / (ELBE_KEPT * ELBE.years)),
  waiting: up6(ELBE.starCost / ELBE_GP),
  step: up6(ELBE.customerItemsCost / (ELBE_KEPT * ELBE.years)),
  month: ELBE.welcomeStart + up6(ELBE.welcomeWeeks / 4) + ELBE.welcomeRespond,
};
const GUESS = 20;
const dec = (x: number) => tt(x.toFixed(2), x.toFixed(2).replace(".", ","));

type Method = "payback" | "guess" | "coverage" | "waiting" | "baseline" | "timing";
export function NumberMethods() {
  const uid = useId().replace(/:/g, "");
  const [m, setM] = useState<Method>("payback");
  const perTerm = ELBE_KEPT * ELBE.years;
  const story = useStory([
    {
      title: tt("A number that pays back", "Eine Zahl, die sich rechnet"),
      say: tt(
        `Meet Elbe Managed Services, an example company, not your case. Its onboarding programme costs ${euro(ELBE.welcomeCost)}. Each customer it moves to 5 of 5 keeps ${euro(perTerm)} over the contract. Count the blocks until they pass the cost: ${ELBE_RESULT.customerPayback}.`,
        `Das ist Elbe Managed Services, ein Beispielunternehmen, nicht Ihr Fall. Sein Onboarding-Programm kostet ${euro(ELBE.welcomeCost)}. Jeder Kunde, den es auf 5 von 5 bringt, hält ${euro(perTerm)} über die Vertragslaufzeit. Zählen Sie die Blöcke, bis sie die Kosten übersteigen: ${ELBE_RESULT.customerPayback}.`,
      ),
      look: tt("the blocks against the dashed cost line", "die Blöcke gegen die gestrichelte Kostenlinie"),
      apply: () => setM("payback"),
    },
    {
      title: tt("A number from the air", "Eine Zahl aus der Luft"),
      say: tt(
        `Now Elbe writes “at least ${GUESS} customers” because it sounds ambitious. That asks for ${euro(GUESS * perTerm)} from an item that costs ${euro(ELBE.welcomeCost)}. A programme that paid for itself would still be called a failure.`,
        `Jetzt schreibt Elbe „mindestens ${GUESS} Kunden“, weil es ehrgeizig klingt. Das verlangt ${euro(GUESS * perTerm)} von einem Punkt, der ${euro(ELBE.welcomeCost)} kostet. Ein Programm, das sich bezahlt gemacht hat, würde trotzdem als Fehlschlag gelten.`,
      ),
      look: tt("how far the guessed blocks run past the cost line", "wie weit die geschätzten Blöcke über die Kostenlinie hinausgehen"),
      apply: () => setM("guess"),
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt(
        "Every number in a plan comes from a method on printed figures: a share, a payback count, the cost of waiting, today plus a step, and a month counted from the start. Tap the other buttons to see each one.",
        "Jede Zahl in einem Plan kommt aus einer Methode auf gedruckten Zahlen: ein Anteil, ein Payback-Zähler, die Kosten des Wartens, heute plus ein Schritt, und ein Monat, vom Start aus gezählt. Tippen Sie auf die anderen Schaltflächen, um jede zu sehen.",
      ),
      look: tt("the buttons under the picture", "die Schaltflächen unter dem Bild"),
      apply: () => setM("baseline"),
    },
  ]);
  const choose = (x: Method) => {
    story.leave();
    setM(x);
  };
  const blocks = (cost: number, per: number, n: number) => {
    const max = Math.max(cost, per * n);
    const W = (v: number) => (v / max) * 480;
    return (
      <g>
        {Array.from({ length: n }, (_, i) => (
          <rect key={i} x={40 + W(per * i)} y="70" width={Math.max(W(per) - 2, 1)} height="44" fill={per * i < cost ? C.teal : C.grey} stroke={C.ink} strokeWidth="0.8" />
        ))}
        <line x1={40 + W(cost)} y1="52" x2={40 + W(cost)} y2="132" stroke={C.amber} strokeWidth="2.5" strokeDasharray="6 4" />
        <text x={Math.min(40 + W(cost), 470)} y="46" textAnchor="middle" fontSize="12" fontWeight="700" fill={C.amber}>{tt(`cost ${euro(cost)}`, `Kosten ${euro(cost)}`)}</text>
        <text x="40" y="150" fontSize="12" fill={C.ash}>{tt(`each block = ${euro(per)}; grey blocks lie beyond the cost`, `jeder Block = ${euro(per)}; graue Blöcke liegen jenseits der Kosten`)}</text>
        <text x="40" y="172" fontSize="14" fontWeight="700" fill={C.ink}>{tt(`${n} blocks`, `${n} Blöcke`)}</text>
      </g>
    );
  };
  const dots = (filled: number, total: number) => (
    <g>
      {Array.from({ length: total / 10 }, (_, i) => (
        <circle key={i} cx={52 + (i % 10) * 46} cy={80 + Math.floor(i / 10) * 44} r="16" fill={i < filled / 10 ? C.teal : C.paper} stroke={C.ink} strokeWidth="1" strokeDasharray={i < filled / 10 ? undefined : "4 3"} />
      ))}
      <text x="40" y="172" fontSize="14" fontWeight="700" fill={C.ink}>{tt(`${filled} of ${total} customers · each circle = 10`, `${filled} von ${total} Kunden · jeder Kreis = 10`)}</text>
    </g>
  );
  const bar = () => {
    const W = (v: number) => (v / (ELBE.delighted + ELBE_RESULT.step + 10)) * 480;
    return (
      <g>
        <rect x="40" y="76" width={W(ELBE.delighted)} height="40" fill={C.grey} stroke={C.ink} />
        <rect x={40 + W(ELBE.delighted)} y="76" width={W(ELBE_RESULT.step)} height="40" fill={C.teal} stroke={C.ink} />
        <text x={40 + W(ELBE.delighted) / 2} y="101" textAnchor="middle" fontSize="12.5" fontWeight="700" fill={C.paper}>{tt(`today ${ELBE.delighted}`, `heute ${ELBE.delighted}`)}</text>
        <text x={40 + W(ELBE.delighted) + W(ELBE_RESULT.step) / 2} y="101" textAnchor="middle" fontSize="12.5" fontWeight="700" fill={C.paper}>{`+${ELBE_RESULT.step}`}</text>
        <text x="40" y="172" fontSize="14" fontWeight="700" fill={C.ink}>{tt(`tripwire: ${ELBE.delighted + ELBE_RESULT.step} delighted customers`, `Tripwire: ${ELBE.delighted + ELBE_RESULT.step} begeisterte Kunden`)}</text>
      </g>
    );
  };
  const months = () => {
    const X = (mo: number) => 40 + (mo - 1) * 80;
    const setup = up6(ELBE.welcomeWeeks / 4);
    return (
      <g>
        {[1, 2, 3, 4, 5, 6].map((mo) => {
          const kind = mo === ELBE.welcomeStart ? "start" : mo > ELBE.welcomeStart && mo < ELBE_RESULT.month ? "run" : mo === ELBE_RESULT.month ? "trigger" : "none";
          return (
            <g key={mo}>
              <rect x={X(mo)} y="72" width="74" height="44" rx="4" fill={kind === "trigger" ? C.gold : kind === "none" ? C.paper : C.tealSoft} stroke={kind === "trigger" ? C.amber : C.line} strokeWidth={kind === "trigger" ? 2.5 : 1} strokeDasharray={kind === "none" ? "4 3" : undefined} />
              <text x={X(mo) + 37} y="99" textAnchor="middle" fontSize="12.5" fontWeight="700" fill={C.ink}>{`M${mo}`}</text>
            </g>
          );
        })}
        <text x="40" y="150" fontSize="12" fill={C.ash}>{tt(`start ${ELBE.welcomeStart} + set-up ${setup} + response ${ELBE.welcomeRespond}`, `Start ${ELBE.welcomeStart} + Einrichtung ${setup} + Reaktion ${ELBE.welcomeRespond}`)}</text>
        <text x="40" y="172" fontSize="14" fontWeight="700" fill={C.ink}>{tt(`trigger month ${ELBE_RESULT.month}`, `Trigger-Monat ${ELBE_RESULT.month}`)}</text>
      </g>
    );
  };
  const picture =
    m === "payback"
      ? blocks(ELBE.welcomeCost, perTerm, ELBE_RESULT.customerPayback)
      : m === "guess"
        ? blocks(ELBE.welcomeCost, perTerm, GUESS)
        : m === "waiting"
          ? blocks(ELBE.starCost, ELBE_GP, ELBE_RESULT.waiting)
          : m === "coverage"
            ? dots(ELBE.openDeals, ELBE.customers)
            : m === "baseline"
              ? bar()
              : months();
  const METHODS: { id: Method; label: string }[] = [
    { id: "payback", label: tt("Payback count", "Payback-Zähler") },
    { id: "guess", label: tt("A guess (no method)", "Eine Schätzung (ohne Methode)") },
    { id: "coverage", label: tt("Coverage share", "Abdeckungsanteil") },
    { id: "waiting", label: tt("Cost of waiting", "Kosten des Wartens") },
    { id: "baseline", label: tt("Today plus a step", "Heute plus ein Schritt") },
    { id: "timing", label: tt("The month", "Der Monat") },
  ];
  const reading: Record<Method, string> = {
    payback: tt(
      `In plain words: the onboarding programme pays for itself once ${ELBE_RESULT.customerPayback} customers move to 5 of 5. ${euro(ELBE.welcomeCost)} ÷ ${euro(perTerm)} = ${dec(ELBE.welcomeCost / perTerm)}, rounded up to ${ELBE_RESULT.customerPayback}. Rule of thumb: round up, because one customer fewer would leave the item short.`,
      `In einfachen Worten: Das Onboarding-Programm hat sich bezahlt gemacht, sobald ${ELBE_RESULT.customerPayback} Kunden auf 5 von 5 steigen. ${euro(ELBE.welcomeCost)} ÷ ${euro(perTerm)} = ${dec(ELBE.welcomeCost / perTerm)}, aufgerundet ${ELBE_RESULT.customerPayback}. Faustregel: aufrunden, denn mit einem Kunden weniger fehlte dem Punkt noch etwas.`,
    ),
    guess: tt(
      `In plain words: “at least ${GUESS}” is ${GUESS - ELBE_RESULT.customerPayback} customers more than the item needs to pay back, and nothing on the page explains it. Rule of thumb: if you cannot say which printed rows a number comes from, it is a guess.`,
      `In einfachen Worten: „mindestens ${GUESS}“ sind ${GUESS - ELBE_RESULT.customerPayback} Kunden mehr, als der Punkt braucht, um sich zu rechnen, und nichts auf der Seite erklärt es. Faustregel: Wenn Sie nicht sagen können, aus welchen gedruckten Zeilen eine Zahl kommt, ist sie geschätzt.`,
    ),
    coverage: tt(
      `In plain words: Elbe's signal rules only work on the ${ELBE.openDeals} customers with an open deal, so the shared record must cover them first: ${ELBE.openDeals} ÷ ${ELBE.customers} = ${ELBE_RESULT.coverage}%. Rule of thumb: the share is what the next step needs, not 100%.`,
      `In einfachen Worten: Elbes Signalregeln wirken nur bei den ${ELBE.openDeals} Kunden mit offenem Deal, also muss der gemeinsame Datensatz zuerst sie abdecken: ${ELBE.openDeals} ÷ ${ELBE.customers} = ${ELBE_RESULT.coverage} %. Faustregel: Der Anteil ist, was der nächste Schritt braucht, nicht 100 %.`,
    ),
    waiting: tt(
      `In plain words: Elbe left out the star account manager (${euro(ELBE.starCost)}). Each customer who leaves takes ${euro(ELBE_GP)} of gross profit a year, so after ${ELBE_RESULT.waiting} such losses waiting has cost more than the item. That count is the pickup point.`,
      `In einfachen Worten: Elbe hat den Star-Account-Manager (${euro(ELBE.starCost)}) weggelassen. Jeder Kunde, der geht, nimmt ${euro(ELBE_GP)} Rohertrag pro Jahr mit, also hat Warten nach ${ELBE_RESULT.waiting} solchen Verlusten mehr gekostet als der Punkt. Diese Zahl ist der Pickup Point.`,
    ),
    baseline: tt(
      `In plain words: the tripwire starts from today's ${ELBE.delighted} delighted customers and adds what the customer items must move to pay back: ${euro(ELBE.customerItemsCost)} ÷ ${euro(perTerm)}, rounded up, is ${ELBE_RESULT.step}. So ${ELBE.delighted + ELBE_RESULT.step}. Rule of thumb: a tripwire beats today by the step your spending needs.`,
      `In einfachen Worten: Der Tripwire beginnt bei den heutigen ${ELBE.delighted} begeisterten Kunden und addiert, was die Kundenpunkte bewegen müssen, um sich zu rechnen: ${euro(ELBE.customerItemsCost)} ÷ ${euro(perTerm)}, aufgerundet, ist ${ELBE_RESULT.step}. Also ${ELBE.delighted + ELBE_RESULT.step}. Faustregel: Ein Tripwire übertrifft heute um den Schritt, den Ihre Ausgaben brauchen.`,
    ),
    timing: tt(
      `In plain words: the onboarding starts in month ${ELBE.welcomeStart}, needs ${ELBE.welcomeWeeks} weeks (1 month) to be in use, and customers show their response a month later: month ${ELBE_RESULT.month}. Rule of thumb: never read a trigger before the item could have worked, and never after the plan's last month.`,
      `In einfachen Worten: Das Onboarding startet in Monat ${ELBE.welcomeStart}, braucht ${ELBE.welcomeWeeks} Wochen (1 Monat) bis zum Einsatz, und Kunden zeigen ihre Reaktion einen Monat später: Monat ${ELBE_RESULT.month}. Faustregel: einen Trigger nie lesen, bevor der Punkt wirken konnte, und nie nach dem letzten Monat des Plans.`,
    ),
  };
  return (
    <div className="space-y-3">
      <ThePoint>
        {tt(
          "A number in a plan is only as good as the method behind it. Work it out from printed figures, and it tells you whether the item paid; guess it, and it only tells you what someone hoped.",
          "Eine Zahl in einem Plan ist nur so gut wie die Methode dahinter. Rechnen Sie sie aus gedruckten Zahlen aus, dann sagt sie Ihnen, ob sich der Punkt gelohnt hat; schätzen Sie sie, dann sagt sie nur, was jemand gehofft hat.",
        )}
      </ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 190" className={clsx("mx-auto h-auto w-full max-w-[600px] rounded-lg", story.step !== null && "anim-pulse ring-2 ring-gold ring-offset-2")} role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Five methods for the numbers of a plan, on Elbe's figures", "Fünf Methoden für die Zahlen eines Plans, mit Elbes Zahlen")}</title>
        <desc id={`${uid}-d`}>{reading[m]}</desc>
        {picture}
      </svg>
      <div className="space-y-1.5">
        <p className="smallcaps">{tt("Choose a method", "Eine Methode wählen")}</p>
        <Toggles<Method> label={tt("Method", "Methode")} value={m} onChange={choose} options={METHODS} />
      </div>
      <Insight>{reading[m]}</Insight>
    </div>
  );
}
