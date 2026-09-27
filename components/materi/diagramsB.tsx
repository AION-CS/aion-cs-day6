"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import { Insight, Toggles } from "@/components/materi/kit";
import { SIGNALS, SIGNAL_IDS } from "@/data/signals";
import type { SignalType } from "@/data/signals";
import { TIMES } from "@/data/route2";
import type { TimeId } from "@/data/route2";
import { bi, t, tt } from "@/lib/lang";
import { Gloss } from "@/lib/glossify";

/**
 * The interactive diagrams of Materi B (Route 2). Every one uses the worked-example company Elbe Managed Services (a Hamburg IT
 * services firm, Case assumption), never NetSolutions. Every control is followed by an always-visible "What this shows" (CLAUDE.md #20).
 */
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
  const toggle = (p: Part) => setOn((c) => (c.includes(p) ? c.filter((x) => x !== p) : [...c, p]));
  const firstMissing = PARTS.find((p) => !on.includes(p.id));
  const cx = 280;
  const cy = 118;
  const R = 88;
  const pos = PARTS.map((_, i) => ({ x: cx + R * Math.cos(((i * 72 - 90) * Math.PI) / 180), y: cy + R * Math.sin(((i * 72 - 90) * Math.PI) / 180) }));
  return (
    <div className="space-y-3">
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
  const [sig, setSig] = useState<SignalType>("uncertainty");
  const X = (i: number) => 80 + i * 120;
  const H = (v: number) => v * 1.6;
  const vals = TIMES.map((tm) => STILL_OPEN[sig][tm.id]);
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 220" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Deals still open after the signal, by response time", "Deals, die nach dem Signal noch offen sind, nach Reaktionszeit")}</title>
        <desc id={`${uid}-d`}>{TIMES.map((tm, i) => `${tm.label}: ${vals[i]}%`).join(". ")}</desc>
        <line x1="40" y1="180" x2="540" y2="180" stroke={C.ash} />
        {TIMES.map((tm, i) => (
          <g key={tm.id}>
            <rect x={X(i) - 34} y={180 - H(vals[i])} width="68" height={H(vals[i])} fill={i === 0 ? C.data : i === 1 ? C.teal : C.grey} stroke={C.ink} className="anim-grow-y" />
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
  const [sel, setSel] = useState<{ l: string; c: number }>({ l: "hero", c: 2 });
  const lever = E_LEVERS.find((x) => x.id === sel.l)!;
  const totals = E_LEVERS.map((l) => ({ id: l.id, name: l.name, total: l.r.reduce((s, v) => s + v, 0) })).sort((a, b) => b.total - a.total);
  return (
    <div className="space-y-3">
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
                    <button type="button" onClick={() => setSel({ l: l.id, c })} aria-pressed={sel.l === l.id && sel.c === c} className={clsx("btn-ghost btn-sm min-w-[4rem]", sel.l === l.id && sel.c === c && "border-accent bg-accentSoft")} aria-label={`${l.name} · ${CRIT_NAMES()[c]}: ${v}`}>
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
  const [sel, setSel] = useState<{ r: number; c: number }>({ r: 2, c: 3 });
  const row = E_ROWS[sel.r];
  const cell = row.cells[sel.c];
  return (
    <div className="space-y-3">
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
                    <button type="button" onClick={() => setSel({ r: i, c: j })} aria-pressed={sel.r === i && sel.c === j} className={clsx("btn-ghost btn-sm min-h-[40px] min-w-[3rem] font-bold", sel.r === i && sel.c === j && "border-accent bg-accentSoft")} aria-label={`${rw.name} · ${E_ROLES[j].name}: ${c.l}`}>
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
  { id: "record", name: t("Shared customer record", "Gemeinsamer Kundendatensatz"), start: 1, owner: t("Head of Sales Operations", "Leitung Sales Operations"), trigger: t("If fewer than 80% of records are complete by month 2, the rules wait.", "Sind bis Monat 2 weniger als 80 % der Datensätze vollständig, warten die Regeln."), why: t("First, because every rule and trigger reads it.", "Zuerst, weil jede Regel und jeder Trigger ihn liest.") },
  { id: "rules", name: t("Signal response rules", "Signal-Antwortregeln"), start: 2, owner: t("Head of Sales", "Vertriebsleitung"), trigger: t("If fewer than 70% of signals are answered in time by month 3, owners are reassigned.", "Werden bis Monat 3 weniger als 70 % der Signale rechtzeitig beantwortet, werden Owner neu zugeordnet."), why: t("After the record, so answered signals can be seen.", "Nach dem Datensatz, damit beantwortete Signale sichtbar sind.") },
  { id: "welcome", name: t("30-day onboarding programme", "30-Tage-Onboarding-Programm"), start: 3, owner: t("Head of Service", "Leitung Service"), trigger: t("If fewer than 85% of new customers finish it by month 5, it is shortened.", "Schließen bis Monat 5 weniger als 85 % der Neukunden es ab, wird es gekürzt."), why: t("Service runs onboarding, so it owns it alone.", "Der Service führt das Onboarding durch, also verantwortet er es allein.") },
]);

export function ArchExample() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSel] = useState("record");
  const r = E_ARCH.find((x) => x.id === sel)!;
  const X = (m: number) => 190 + (m - 1) * 60;
  return (
    <div className="space-y-3">
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
                <rect key={m} className={m === a.start ? "hit-shape" : undefined} x={X(m) + 2} y={y + 6} width="56" height="24" rx="3" fill={m === a.start ? C.data : m > a.start ? C.tealSoft : C.paper} stroke={on && m === a.start ? C.amber : C.line} strokeWidth={on && m === a.start ? 2.5 : 1} />
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
        {tt(
          "The shared record starts first, because it is the baseline every trigger reads. Each item has one owner who can change it alone and a trigger with a number, a date and an action. Elbe left out the star account manager on purpose: it would have rested on one person, which is exactly what the system is meant to end.",
          "Der gemeinsame Datensatz startet zuerst, weil er die Baseline ist, die jeder Trigger liest. Jeder Punkt hat einen Owner, der ihn allein ändern kann, und einen Trigger mit Zahl, Datum und Aktion. Elbe hat den Star-Account-Manager bewusst weggelassen: Er hätte auf einer Person geruht, genau das, was das System beenden soll.",
        )}
      </Insight>
    </div>
  );
}
