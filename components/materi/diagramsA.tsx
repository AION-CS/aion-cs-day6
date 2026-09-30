"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import { Diagram, Insight, Story, ThePoint, Toggles, useStory } from "@/components/materi/kit";
import { AREA_LABEL } from "@/data/reasons";
import type { AreaTag } from "@/data/reasons";
import { SIGNALS, SIGNAL_IDS } from "@/data/signals";
import type { SignalType } from "@/data/signals";
import { KONTOR, keptProfit, lostProfit } from "@/data/delight";
import { sustainBucket } from "@/data/measures";
import type { RunsOn } from "@/data/measures";
import { RUNS_ON_LABEL } from "@/data/measures";
import { bi, euro, num, t, tt } from "@/lib/lang";
import { Gloss } from "@/lib/glossify";

/**
 * The interactive diagrams of Materi A (Route 1). Every one uses the worked-example company Kontor Systems (a Hanover IT services firm,
 * Case assumption), never NetSolutions, so the answer to a task block is never printed. Every control is followed by an always-visible
 * "What this shows" (CLAUDE.md #20).
 */
/** "In plain words:" leads every reading of a control (CLAUDE.md #36). */
const plain = () => tt("In plain words: ", "In einfachen Worten: ");
const C = { ink: "#1F2328", ash: "#59606A", paper: "#FFFEFA", mist: "#ECE6D6", line: "#D8D1BF", amber: "#8A5A0B", gold: "#D99A2B", teal: "#0F6B6B", tealSoft: "#DFEEEB", rust: "#A4472A", data: "#2F5D62", grey: "#8B9098", soft: "#FBF0D6" };

/* ------------------------------------------------------------------ A1 · satisfaction against loyalty */

const STAY = [0, 20, 35, 50, 60, 92];
export function SatisfactionCurve() {
  const uid = useId().replace(/:/g, "");
  const [score, setScoreRaw] = useState(4);
  const story = useStory([
    {
      title: tt("Delighted customers stay", "Begeisterte Kunden bleiben"),
      say: tt(`Meet Kontor Systems, an example IT company, not your case. Of 100 customers who rate it 5 of 5 (delighted), ${STAY[5]} are still there a year later.`, `Das ist Kontor Systems, ein Beispielunternehmen, nicht Ihr Fall. Von 100 Kunden, die es mit 5 von 5 bewerten (begeistert), sind ein Jahr später noch ${STAY[5]} da.`),
      look: tt("the point at 5", "den Punkt bei 5"),
      apply: () => setScoreRaw(5),
    },
    {
      title: tt("Satisfied customers leave", "Zufriedene Kunden gehen"),
      say: tt(`Now the customers who rate it 4 of 5 (satisfied). Only ${STAY[4]} of 100 stay. They have no complaint, and no reason to stay either.`, `Jetzt die Kunden, die 4 von 5 geben (zufrieden). Nur ${STAY[4]} von 100 bleiben. Sie haben keine Beschwerde, aber auch keinen Grund zu bleiben.`),
      look: tt("the point at 4, and the gap up to 5", "den Punkt bei 4 und die Lücke bis 5"),
      apply: () => setScoreRaw(4),
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt(`The step from 4 to 5 (+${STAY[5] - STAY[4]}) is the largest on the curve. A 4 feels safe and is not: aim for delight, not for “no complaints”. Tap the other scores to compare.`, `Der Schritt von 4 auf 5 (+${STAY[5] - STAY[4]}) ist der größte der Kurve. Eine 4 fühlt sich sicher an und ist es nicht: Zielen Sie auf Begeisterung, nicht auf „keine Beschwerden“. Tippen Sie auf die anderen Werte zum Vergleich.`),
      look: tt("the shaded zone of the big jump", "die schattierte Zone des großen Sprungs"),
      apply: () => setScoreRaw(5),
    },
  ]);
  const setScore = (v: number) => {
    story.leave();
    setScoreRaw(v);
  };
  const X = (s: number) => 70 + (s - 1) * 110;
  const Y = (p: number) => 200 - p * 1.8;
  const jump = STAY[score] - STAY[score - 1];
  return (
    <div className="space-y-3">
      <ThePoint>{tt("A customer who gives 4 out of 5 is not safe. Loyalty stays low up to “satisfied” and jumps only at “delighted”.", "Ein Kunde, der 4 von 5 gibt, ist nicht sicher. Die Treue bleibt bis „zufrieden“ niedrig und springt erst bei „begeistert“.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 240" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Share of customers still with Kontor a year later, by satisfaction score", "Anteil der Kunden, die ein Jahr später noch bei Kontor sind, nach Zufriedenheitswert")}</title>
        <desc id={`${uid}-d`}>{[1, 2, 3, 4, 5].map((s) => `${s}: ${STAY[s]}%`).join(", ")}</desc>
        <rect x={X(3.5)} y="20" width={X(5) - X(3.5) + 20} height="180" fill={C.soft} opacity="0.6" />
        <text x={X(4.5)} y="36" textAnchor="middle" fontSize="11.5" fill={C.amber} fontWeight="700">{tt("zone of the big jump", "Zone des großen Sprungs")}</text>
        <line x1="50" y1="200" x2="540" y2="200" stroke={C.ash} />
        <polyline points={[1, 2, 3, 4, 5].map((s) => `${X(s)},${Y(STAY[s])}`).join(" ")} fill="none" stroke={C.data} strokeWidth="3.5" />
        {[1, 2, 3, 4, 5].map((s) => (
          <g key={s} className="hit" role="button" tabIndex={0} aria-label={tt(`Score ${s}`, `Wert ${s}`)} onClick={() => setScore(s)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setScore(s)}>
            {story.step !== null && s === score && <circle cx={X(s)} cy={Y(STAY[s])} r="17" fill="none" stroke={C.amber} strokeWidth="2.5" strokeDasharray="5 4" className="anim-pulse" />}
            <circle className="hit-shape" cx={X(s)} cy={Y(STAY[s])} r={s === score ? 10 : 7} fill={s === score ? C.gold : C.paper} stroke={C.ink} strokeWidth="1.6" />
            <text x={X(s)} y={Y(STAY[s]) - 14} textAnchor="middle" fontSize="12.5" fontWeight="700" fill={C.ink}>{`${STAY[s]}%`}</text>
            <text x={X(s)} y="218" textAnchor="middle" fontSize="12" fill={C.ash}>{s}</text>
          </g>
        ))}
        <text x="295" y="236" textAnchor="middle" fontSize="11.5" fill={C.ash}>{tt("satisfaction score (1 = very dissatisfied, 5 = delighted)", "Zufriedenheitswert (1 = sehr unzufrieden, 5 = begeistert)")}</text>
      </svg>
      <div className="space-y-1.5">
        <p className="smallcaps">{tt("Read one satisfaction score", "Einen Zufriedenheitswert lesen")}</p>
        <Toggles<string> label={tt("Score", "Wert")} value={String(score)} onChange={(v) => setScore(Number(v))} options={[1, 2, 3, 4, 5].map((s) => ({ id: String(s), label: `${s}` }))} />
      </div>
      <Insight>
        {plain()}
        {score === 1
          ? tt("At 1 only 20 of 100 customers are still there a year later. Nobody argues about this group; the question is the others.", "Bei 1 sind nur 20 von 100 Kunden ein Jahr später noch da. Über diese Gruppe streitet niemand; die Frage sind die anderen.")
          : tt(
              `From ${score - 1} to ${score}, ${jump} more of every 100 customers stay. ${score === 5 ? "This is the largest step on the curve: from “satisfied” (4) to “delighted” (5) retention jumps from 60% to 92%. A 4 feels safe and is not." : score === 4 ? "Satisfied (4) customers still leave at 40 in 100 a year. They have no reason to complain and no reason to stay." : "Below 4 every step helps a little; the curve stays flat until customers are delighted."}`,
              `Von ${score - 1} auf ${score} bleiben ${jump} mehr von 100 Kunden. ${score === 5 ? "Das ist der größte Schritt der Kurve: von „zufrieden“ (4) zu „begeistert“ (5) springt die Bindung von 60 % auf 92 %. Eine 4 fühlt sich sicher an und ist es nicht." : score === 4 ? "Zufriedene Kunden (4) gehen immer noch mit 40 von 100 pro Jahr. Sie haben keinen Grund zu klagen und keinen Grund zu bleiben." : "Unter 4 hilft jeder Schritt ein wenig; die Kurve bleibt flach, bis Kunden begeistert sind."}`,
            )}
      </Insight>
      <p className="text-caption text-ash">{tt("Illustration on Kontor's customer data (Case assumption); the shape follows Jones and Sasser (1995).", "Illustration auf Kundendaten von Kontor (Fallannahme); die Form folgt Jones und Sasser (1995).")}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ A2 · three factors of emotional retention */

type FactorKey = "trust" | "appreciation" | "relevance";
const F_TEXT = bi({
  trust: { name: t("Trust", "Vertrauen"), idea: t("The customer can rely on NetSolutions and on a person there: promises kept, problems announced early.", "Der Kunde kann sich auf den Anbieter und eine Person dort verlassen: Versprechen gehalten, Probleme früh angekündigt."), sign: t("They call their contact before a decision.", "Sie rufen ihren Ansprechpartner vor einer Entscheidung an.") },
  appreciation: { name: t("Appreciation", "Wertschätzung"), idea: t("The customer feels seen and valued as a customer, not only as an invoice.", "Der Kunde fühlt sich als Kunde gesehen und geschätzt, nicht nur als Rechnung."), sign: t("Someone remembers their go-live and asks how it went.", "Jemand erinnert sich an ihren Go-live und fragt, wie es lief.") },
  relevance: { name: t("Relevance", "Relevanz"), idea: t("What the provider offers fits the customer's situation and makes it better at its own work.", "Was der Anbieter bietet, passt zur Lage des Kunden und macht ihn in seiner eigenen Arbeit besser."), sign: t("They forward the provider's advice inside their company.", "Sie leiten den Rat des Anbieters im eigenen Unternehmen weiter.") },
});
const F_READING = bi({
  "": t("Nothing ties this customer to Kontor but the contract. It stays while the service works and leaves the day a competitor calls more often.", "Nichts bindet diesen Kunden an Kontor außer dem Vertrag. Er bleibt, solange der Service läuft, und geht an dem Tag, an dem ein Wettbewerber öfter anruft."),
  trust: t("The customer relies on Kontor but feels no more than a well-served number. Reliable, and replaceable by anyone equally reliable.", "Der Kunde verlässt sich auf Kontor, fühlt sich aber nur als gut bediente Nummer. Verlässlich, und ersetzbar durch jeden gleich Verlässlichen."),
  appreciation: t("Warm feelings without substance: the customer likes the people but would not miss what they deliver. Warmth wears off at the first problem.", "Warme Gefühle ohne Substanz: Der Kunde mag die Menschen, würde aber nicht vermissen, was sie liefern. Wärme verfliegt beim ersten Problem."),
  relevance: t("The customer values the advice but has no one to rely on. A competitor with the same advice and a person to call wins.", "Der Kunde schätzt den Rat, hat aber niemanden, auf den er sich verlassen kann. Ein Wettbewerber mit demselben Rat und einer Person zum Anrufen gewinnt."),
  "appreciation+trust": t("Relied on and valued: a solid relationship. What is missing is a reason beyond the service; a competitor with better advice has an opening.", "Verlässlich und geschätzt: eine solide Beziehung. Es fehlt ein Grund über den Service hinaus; ein Wettbewerber mit besserem Rat hat eine Chance."),
  "relevance+trust": t("Reliable and useful, but nobody shows the customer it matters. Rational loyalty, open to a warmer rival.", "Verlässlich und nützlich, aber niemand zeigt dem Kunden, dass er zählt. Rationale Loyalität, offen für einen herzlicheren Konkurrenten."),
  "appreciation+relevance": t("Liked and helped, but not sure the provider will deliver when it counts. One missed promise tests it.", "Gemocht und unterstützt, aber nicht sicher, dass der Anbieter liefert, wenn es drauf ankommt. Ein gebrochenes Versprechen stellt es auf die Probe."),
  "appreciation+relevance+trust": t("Emotional retention: the customer relies on the people, feels valued and gains from the relationship. It would choose Kontor again even if leaving were easy.", "Emotionale Bindung: Der Kunde verlässt sich auf die Menschen, fühlt sich geschätzt und gewinnt aus der Beziehung. Er würde Kontor wieder wählen, auch wenn Gehen leicht wäre."),
});

export function ThreeFactors() {
  const uid = useId().replace(/:/g, "");
  const [on, setOn] = useState<FactorKey[]>(["trust"]);
  const [focus, setFocus] = useState<FactorKey>("trust");
  const story = useStory([
    {
      title: tt("All three pillars", "Alle drei Säulen"),
      say: tt("Meet Kontor, an example company, not your case. This customer relies on a person there, feels valued and gets useful advice. All three pillars stand: it would choose Kontor again.", "Das ist Kontor, ein Beispielunternehmen, nicht Ihr Fall. Dieser Kunde verlässt sich auf eine Person dort, fühlt sich geschätzt und bekommt nützlichen Rat. Alle drei Säulen stehen: Er würde Kontor wieder wählen."),
      look: tt("the bar on top, carried by three pillars", "den Balken oben, von drei Säulen getragen"),
      apply: () => {
        setOn(["trust", "appreciation", "relevance"]);
        setFocus("trust");
      },
    },
    {
      title: tt("One pillar missing", "Eine Säule fehlt"),
      say: tt("Now take away relevance. The customer trusts and likes the people but gains nothing beyond the service. A rival with better advice has an opening.", "Jetzt fehlt die Relevanz. Der Kunde vertraut den Menschen und mag sie, gewinnt aber nichts über den Service hinaus. Ein Konkurrent mit besserem Rat hat eine Chance."),
      look: tt("the dashed pillar “Relevance”", "die gestrichelte Säule „Relevanz“"),
      apply: () => {
        setOn(["trust", "appreciation"]);
        setFocus("relevance");
      },
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt("Each pillar needs its own action: a person for trust, time and attention for appreciation, advice for relevance. A gift is not advice. Switch the pillars yourself.", "Jede Säule braucht ihre eigene Maßnahme: eine Person für Vertrauen, Zeit und Aufmerksamkeit für Wertschätzung, Rat für Relevanz. Ein Geschenk ist kein Rat. Schalten Sie die Säulen selbst."),
      look: tt("the buttons under the picture", "die Schaltflächen unter dem Bild"),
      apply: () => {
        setOn(["trust", "appreciation", "relevance"]);
        setFocus("appreciation");
      },
    },
  ]);
  const toggle = (k: FactorKey) => {
    story.leave();
    setFocus(k);
    setOn((c) => (c.includes(k) ? c.filter((x) => x !== k) : [...c, k]));
  };
  const key = [...on].sort().join("+") as keyof typeof F_READING;
  const X = { trust: 120, appreciation: 280, relevance: 440 } as const;
  const f = F_TEXT[focus];
  return (
    <div className="space-y-3">
      <ThePoint>{tt("A customer is tied to you only when three things hold: trust, appreciation and relevance. Missing any one leaves a gap a competitor can use.", "Ein Kunde ist nur gebunden, wenn drei Dinge stimmen: Vertrauen, Wertschätzung und Relevanz. Fehlt eines, bleibt eine Lücke, die ein Wettbewerber nutzen kann.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 220" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Three factors hold up emotional retention", "Drei Faktoren tragen emotionale Bindung")}</title>
        <desc id={`${uid}-d`}>{tt(`${on.length} of 3 factors present: ${on.join(", ") || "none"}.`, `${on.length} von 3 Faktoren vorhanden: ${on.join(", ") || "keiner"}.`)}</desc>
        <rect x="60" y="20" width="440" height="36" rx="8" fill={on.length === 3 ? C.tealSoft : C.mist} stroke={on.length === 3 ? C.teal : C.ash} strokeWidth="2" strokeDasharray={on.length === 3 ? undefined : "6 4"} />
        <text x="280" y="43" textAnchor="middle" fontSize="14" fontWeight="700" fill={C.ink}>{on.length === 3 ? tt("Emotional retention", "Emotionale Bindung") : tt(`Emotional retention: ${on.length} of 3 pillars`, `Emotionale Bindung: ${on.length} von 3 Säulen`)}</text>
        {(Object.keys(X) as FactorKey[]).map((k) => {
          const active = on.includes(k);
          return (
            <g key={k}>
              {story.step !== null && k === focus && <rect x={X[k] - 63} y="52" width="126" height="136" rx="6" fill="none" stroke={C.amber} strokeWidth="2.5" strokeDasharray="6 4" className="anim-pulse" />}
              <rect x={X[k] - 55} y="60" width="110" height="120" fill={active ? C.data : C.paper} stroke={active ? C.ink : C.ash} strokeWidth="1.6" strokeDasharray={active ? undefined : "6 4"} />
              <text x={X[k]} y="126" textAnchor="middle" fontSize="14" fontWeight="700" fill={active ? C.paper : C.ash}>{F_TEXT[k].name}</text>
              <text x={X[k]} y="200" textAnchor="middle" fontSize="12" fontWeight="600" fill={active ? C.teal : C.ash}>{active ? tt("● present", "● vorhanden") : tt("○ missing", "○ fehlt")}</text>
            </g>
          );
        })}
      </svg>
      <div className="space-y-1.5">
        <p className="smallcaps">{tt("Switch a factor on or off", "Einen Faktor ein- oder ausschalten")}</p>
        <Toggles multi label={tt("Factors", "Faktoren")} value={on} onChange={toggle} options={(Object.keys(X) as FactorKey[]).map((k) => ({ id: k, label: `${F_TEXT[k].name}${on.includes(k) ? tt(" · on", " · an") : tt(" · off", " · aus")}` }))} />
      </div>
      <Insight>
        {plain()}
        {F_READING[key]}
      </Insight>
      <div className="rounded-lg border border-line bg-paper p-3.5 text-caption">
        <p className="smallcaps">{f.name}</p>
        <p className="mt-1 text-ink">
          <Gloss>{f.idea}</Gloss>
        </p>
        <p className="mt-1 text-ash">
          <span className="font-semibold text-ink">{tt("How you can see it. ", "Woran man es sieht. ")}</span>
          {f.sign}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ A3 · worked sort: Kontor's customers */

const K_REASONS = bi([
  { id: "k1", quote: t("“Our contact changed three times; each new one asked us the same questions.”", "„Unser Ansprechpartner wechselte dreimal; jeder neue stellte uns dieselben Fragen.“"), tag: "rel" as AreaTag, why: t("Nobody the customer knows, and nobody who knows the customer: relationship.", "Niemand, den der Kunde kennt, und niemand, der den Kunden kennt: Beziehung.") },
  { id: "k2", quote: t("“Their only calls are about upgrades we did not ask for.”", "„Sie rufen nur wegen Upgrades an, nach denen wir nicht gefragt haben.“"), tag: "comm" as AreaTag, why: t("What and when they get in touch about: communication.", "Worüber und wann sie sich melden: Kommunikation.") },
  { id: "k3", quote: t("“We never heard about the outage until it was over.”", "„Vom Ausfall haben wir erst gehört, als er vorbei war.“"), tag: "comm" as AreaTag, why: t("Not told in time: communication.", "Nicht rechtzeitig informiert: Kommunikation.") },
  { id: "k4", quote: t("“It works, but they never suggest anything that would help us.”", "„Es funktioniert, aber sie schlagen nie etwas vor, das uns helfen würde.“"), tag: "value" as AreaTag, why: t("Nothing beyond the contract: added value.", "Nichts über den Vertrag hinaus: Mehrwert.") },
  { id: "k5", quote: t("“I would not know whom to call if something serious happened.”", "„Ich wüsste nicht, wen ich anrufen soll, wenn etwas Ernstes passiert.“"), tag: "rel" as AreaTag, why: t("No person to rely on: relationship.", "Keine Person, auf die man sich verlassen kann: Beziehung.") },
  { id: "k6", quote: t("“Another provider showed us how three firms like ours cut their costs.”", "„Ein anderer Anbieter zeigte uns, wie drei Firmen wie unsere ihre Kosten senkten.“"), tag: "value" as AreaTag, why: t("Useful advice from a competitor: the missing piece is added value.", "Nützlicher Rat von einem Wettbewerber: Das fehlende Stück ist Mehrwert.") },
]);
const TAG_STYLE: Record<AreaTag, string> = { rel: "border-signal/50 bg-signalSoft text-signal", comm: "border-accent/50 bg-accentSoft text-accent", value: "border-ash/50 bg-mist text-ink" };

export function AreaSortExample() {
  const [sel, setSel] = useState("k1");
  const [seen, setSeen] = useState<string[]>(["k1"]);
  const r = K_REASONS.find((x) => x.id === sel)!;
  const open = (id: string) => {
    setSel(id);
    setSeen((s) => (s.includes(id) ? s : [...s, id]));
  };
  const story = useStory([
    {
      title: tt("A contact who keeps changing", "Ein Ansprechpartner, der ständig wechselt"),
      say: tt("Meet Kontor, an example company, not your case. A customer says its contact changed three times. What would fix it? A person who stays. So it is a relationship gap.", "Das ist Kontor, ein Beispielunternehmen, nicht Ihr Fall. Ein Kunde sagt, sein Ansprechpartner wechselte dreimal. Was würde es beheben? Eine Person, die bleibt. Also eine Beziehungslücke."),
      look: tt("the first statement and its area", "die erste Aussage und ihren Bereich"),
      apply: () => open("k1"),
    },
    {
      title: tt("It sounds the same, and is not", "Es klingt gleich und ist es nicht"),
      say: tt("Another customer says Kontor only calls about upgrades. It sounds like a people problem, but a person would not fix it. Better messages at the right time would: communication.", "Ein anderer Kunde sagt, Kontor rufe nur wegen Upgrades an. Es klingt nach einem Personenproblem, aber eine Person würde es nicht beheben. Bessere Nachrichten zur richtigen Zeit schon: Kommunikation."),
      look: tt("the second statement and its area", "die zweite Aussage und ihren Bereich"),
      apply: () => open("k2"),
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt("Sort by what would fix it, not by the words used. Something useful beyond the contract is added value, like this one. Open the other statements yourself.", "Sortieren Sie danach, was es beheben würde, nicht nach den Worten. Etwas Nützliches über den Vertrag hinaus ist Mehrwert, wie hier. Öffnen Sie die anderen Aussagen selbst."),
      look: tt("the fourth statement and its area", "die vierte Aussage und ihren Bereich"),
      apply: () => open("k4"),
    },
  ]);
  const pick = (id: string) => {
    story.leave();
    open(id);
  };
  return (
    <Diagram label={tt("Worked example · six things Kontor's customers said (Case assumption, read-only)", "Durchgerechnetes Beispiel · sechs Aussagen von Kontors Kunden (Fallannahme, nur lesen)")}>
      <div className="mb-3 space-y-3">
        <ThePoint>{tt("Sort a reason by what would fix it: a person who stays (relationship), the right message at the right time (communication), or something useful beyond the contract (added value).", "Sortieren Sie einen Grund danach, was ihn beheben würde: eine Person, die bleibt (Beziehung), die richtige Nachricht zur richtigen Zeit (Kommunikation) oder etwas Nützliches über den Vertrag hinaus (Mehrwert).")}</ThePoint>
        <Story steps={story.plan} step={story.step} onStep={story.go} />
      </div>
      <ol className="grid gap-2 sm:grid-cols-2">
        {K_REASONS.map((h) => (
          <li key={h.id}>
            <button type="button" onClick={() => pick(h.id)} aria-pressed={h.id === sel} className={clsx("flex min-h-[48px] w-full flex-col items-start gap-1 rounded-lg border bg-paper px-3 py-2 text-left text-caption transition-colors", h.id === sel ? "border-accent bg-accentSoft ring-2 ring-gold" : "border-line hover:border-ash", h.id === sel && story.step !== null && "anim-pulse")}>
              <span className="text-ink">{h.quote}</span>
              {seen.includes(h.id) && <span className={clsx("pill", TAG_STYLE[h.tag])}>{AREA_LABEL[h.tag]}</span>}
            </button>
          </li>
        ))}
      </ol>
      <div className="mt-3 space-y-1 rounded-lg border border-line bg-paper p-3 text-caption" aria-live="polite">
        <p className="smallcaps">
          {tt("Area: ", "Bereich: ")}
          <span className="text-accent">{AREA_LABEL[r.tag]}</span>
        </p>
        <p>
          <span className="font-semibold text-ink">{tt("Why. ", "Warum. ")}</span>
          {r.why}
        </p>
      </div>
      <Insight className="mt-3">
        {plain()}
        {tt(
          `Two statements each. The pair that needs a second look is the contact who changed three times and the calls only about upgrades: a contact who changes is a relationship problem; a contact who only calls to sell is a communication problem. Ask: would a better message fix it, or does it need a person? You have opened ${seen.length} of 6.`,
          `Je zwei Aussagen. Das Paar, das einen zweiten Blick braucht, sind der dreimal wechselnde Ansprechpartner und die Anrufe nur wegen Upgrades: Ein wechselnder Ansprechpartner ist ein Beziehungsproblem; einer, der nur zum Verkaufen anruft, ein Kommunikationsproblem. Fragen Sie: Würde eine bessere Nachricht es lösen, oder braucht es eine Person? Sie haben ${seen.length} von 6 geöffnet.`,
        )}
      </Insight>
    </Diagram>
  );
}

/* ------------------------------------------------------------------ A4 · what delight is worth (Kontor) */

export function DelightValue() {
  const uid = useId().replace(/:/g, "");
  const [moved, setMovedRaw] = useState(KONTOR.moved);
  const keptFor = (m: number) => keptProfit(m, KONTOR.satisfied.churn, KONTOR.delighted.churn, KONTOR.contract, KONTOR.margin);
  const story = useStory([
    {
      title: tt("Where the money leaks", "Wo das Geld abfließt"),
      say: tt(`Meet Kontor, an example company, not your case. Its ${KONTOR.satisfied.customers} satisfied customers leave at ${KONTOR.satisfied.churn}% a year and take ${euro(lostProfit(KONTOR.satisfied, KONTOR.contract, KONTOR.margin))} of gross profit with them. Moving 30 of them to delighted keeps ${euro(keptFor(30))} a year.`, `Das ist Kontor, ein Beispielunternehmen, nicht Ihr Fall. Seine ${KONTOR.satisfied.customers} zufriedenen Kunden gehen mit ${KONTOR.satisfied.churn} % pro Jahr und nehmen ${euro(lostProfit(KONTOR.satisfied, KONTOR.contract, KONTOR.margin))} Rohertrag mit. 30 davon zu begeisterten zu machen, hält ${euro(keptFor(30))} pro Jahr.`),
      look: tt("the grey bar, and the teal bar of what is kept", "den grauen Balken und den türkisen Balken des Gehaltenen"),
      apply: () => setMovedRaw(30),
    },
    {
      title: tt("A few moves keep little", "Wenige Verschiebungen halten wenig"),
      say: tt(`Move only 5 customers and Kontor keeps ${euro(keptFor(5))}: each move is worth only the churn gap of ${KONTOR.satisfied.churn - KONTOR.delighted.churn} points.`, `Verschiebt Kontor nur 5 Kunden, hält es ${euro(keptFor(5))}: Jede Verschiebung ist nur die Churn-Lücke von ${KONTOR.satisfied.churn - KONTOR.delighted.churn} Punkten wert.`),
      look: tt("the teal bar getting short", "den kürzer werdenden türkisen Balken"),
      apply: () => setMovedRaw(5),
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt("The money is in the churn gap times the number of customers moved, not in the satisfaction score. Block 1.2 asks you to work this out for NetSolutions. Try the buttons.", "Das Geld steckt in der Churn-Lücke mal der Zahl verschobener Kunden, nicht im Zufriedenheitswert. Block 1.2 bittet Sie, das für NetSolutions auszurechnen. Probieren Sie die Schaltflächen."),
      look: tt("the buttons under the picture", "die Schaltflächen unter dem Bild"),
      apply: () => setMovedRaw(KONTOR.moved),
    },
  ]);
  const setMoved = (v: number) => {
    story.leave();
    setMovedRaw(v);
  };
  const lostSat = lostProfit(KONTOR.satisfied, KONTOR.contract, KONTOR.margin);
  const lostDel = lostProfit(KONTOR.delighted, KONTOR.contract, KONTOR.margin);
  const kept = keptProfit(moved, KONTOR.satisfied.churn, KONTOR.delighted.churn, KONTOR.contract, KONTOR.margin);
  const max = 110000;
  const W = (v: number) => (v / max) * 360;
  const rows = [
    { label: tt(`Lost: ${KONTOR.satisfied.customers} satisfied`, `Verloren: ${KONTOR.satisfied.customers} zufriedene`), v: lostSat, fill: C.grey },
    { label: tt(`Lost: ${KONTOR.delighted.customers} delighted`, `Verloren: ${KONTOR.delighted.customers} begeisterte`), v: lostDel, fill: C.data },
    { label: tt(`Kept: ${moved} moved`, `Gehalten: ${moved} verschoben`), v: kept, fill: C.teal },
  ];
  return (
    <div className="space-y-3">
      <ThePoint>{tt("Delight is worth money: satisfied customers leave far more often than delighted ones, and every one who leaves takes its gross profit.", "Begeisterung ist Geld wert: Zufriedene Kunden gehen viel öfter als begeisterte, und jeder, der geht, nimmt seinen Rohertrag mit.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 150" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Gross profit lost per year by group, and kept by moving customers", "Rohertrag, der pro Jahr je Gruppe verloren geht, und der durch Verschieben gehalten wird")}</title>
        <desc id={`${uid}-d`}>{rows.map((r) => `${r.label}: ${euro(r.v)}`).join(". ")}</desc>
        {rows.map((r, i) => (
          <g key={i}>
            <text x="4" y={30 + i * 44} fontSize="12.5" fontWeight="700" fill={C.ink}>{r.label}</text>
            <rect x="180" y={14 + i * 44} width={Math.max(W(r.v), 1)} height="26" fill={r.fill} stroke={C.ink} className="anim-grow-x" />
            {story.step !== null && i === 2 && <rect x="176" y={10 + i * 44} width={Math.max(W(r.v), 1) + 8} height="34" rx="4" fill="none" stroke={C.amber} strokeWidth="2.5" strokeDasharray="5 4" className="anim-pulse" />}
            <text x={186 + W(r.v)} y={32 + i * 44} fontSize="12.5" fontWeight="700" fill={C.ink}>{euro(r.v)}</text>
          </g>
        ))}
      </svg>
      <div className="space-y-1.5">
        <p className="smallcaps">{tt("How many satisfied customers become delighted?", "Wie viele zufriedene Kunden werden begeistert?")}</p>
        <Toggles<string> label={tt("Customers moved", "Verschobene Kunden")} value={String(moved)} onChange={(v) => setMoved(Number(v))} options={[5, 10, 20, 30].map((v) => ({ id: String(v), label: String(v) }))} />
      </div>
      <Insight>
        {plain()}
        {tt(
          `Kontor's ${KONTOR.satisfied.customers} satisfied customers leave at ${KONTOR.satisfied.churn}% a year and cost ${euro(lostSat)} of gross profit; its ${KONTOR.delighted.customers} delighted ones leave at ${KONTOR.delighted.churn}% and cost only ${euro(lostDel)}. Moving ${moved} customers from satisfied to delighted keeps ${moved} × ${KONTOR.satisfied.churn - KONTOR.delighted.churn} points × ${euro(KONTOR.contract)} × ${KONTOR.margin}% = ${euro(kept)} a year. The difference in churn, not the satisfaction score, is where the money is.`,
          `Kontors ${KONTOR.satisfied.customers} zufriedene Kunden gehen mit ${KONTOR.satisfied.churn} % pro Jahr und kosten ${euro(lostSat)} Rohertrag; seine ${KONTOR.delighted.customers} begeisterten gehen mit ${KONTOR.delighted.churn} % und kosten nur ${euro(lostDel)}. ${moved} Kunden von zufrieden zu begeistert zu bringen, hält ${moved} × ${KONTOR.satisfied.churn - KONTOR.delighted.churn} Punkte × ${euro(KONTOR.contract)} × ${KONTOR.margin} % = ${euro(kept)} pro Jahr. Der Unterschied im Churn, nicht der Zufriedenheitswert, ist dort, wo das Geld liegt.`,
        )}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ A5 · worked tagging: Kontor's deals */

const K_OBS = bi([
  { id: "y1", text: t("“How would we move our 60 users over a weekend?”", "„Wie würden wir unsere 60 Nutzer an einem Wochenende umziehen?“"), key: t("How would we move our 60 users", "Wie würden wir unsere 60 Nutzer"), sig: "interest" as SignalType, alt: "uncertainty" as SignalType, altWhy: t("It pictures the move, not an exit.", "Es malt den Umzug aus, keinen Ausstieg.") },
  { id: "y2", text: t("“Our CFO wants your offer next to the two others by Friday.”", "„Unser CFO will Ihr Angebot bis Freitag neben den zwei anderen sehen.“"), key: t("next to the two others", "neben den zwei anderen"), sig: "comparison" as SignalType, alt: "proximity" as SignalType, altWhy: t("Friday is a deadline, but the task is putting three offers side by side.", "Freitag ist eine Frist, aber die Aufgabe ist, drei Angebote nebeneinanderzulegen.") },
  { id: "y3", text: t("“If we sign in March, can you start in April?”", "„Wenn wir im März unterschreiben, können Sie im April starten?“"), key: t("If we sign in March", "Wenn wir im März unterschreiben"), sig: "proximity" as SignalType, alt: "interest" as SignalType, altWhy: t("It is about when, not how it works.", "Es geht um das Wann, nicht um das Wie.") },
  { id: "y4", text: t("“Can we cancel without cost if our board changes its mind?”", "„Können wir kostenlos kündigen, wenn unser Vorstand es sich anders überlegt?“"), key: t("cancel without cost", "kostenlos kündigen"), sig: "uncertainty" as SignalType, alt: "proximity" as SignalType, altWhy: t("It sounds close to signing, but it asks for a way out.", "Es klingt nah an der Unterschrift, fragt aber nach einem Ausweg.") },
  { id: "y5", text: t("“Which reports would our finance team get each month?”", "„Welche Berichte bekäme unser Finanzteam jeden Monat?“"), key: t("Which reports would our finance team get", "Welche Berichte bekäme unser Finanzteam"), sig: "interest" as SignalType, alt: "comparison" as SignalType, altWhy: t("No other provider is named; it pictures using the reports.", "Kein anderer Anbieter wird genannt; es malt die Nutzung der Berichte aus.") },
  { id: "y6", text: t("“We are positive, but let us speak again after the summer.”", "„Wir sind positiv, aber lassen Sie uns nach dem Sommer wieder sprechen.“"), key: t("let us speak again after the summer", "lassen Sie uns nach dem Sommer wieder sprechen"), sig: "uncertainty" as SignalType, alt: "interest" as SignalType, altWhy: t("Friendly words, but the decision moves away.", "Freundliche Worte, aber die Entscheidung rückt weg.") },
]);

function Marked({ text, mark }: { text: string; mark: string }) {
  const i = text.indexOf(mark);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-gold/40 px-0.5 font-semibold text-ink">{mark}</mark>
      {text.slice(i + mark.length)}
    </>
  );
}

export function SignalExample() {
  const [sel, setSel] = useState("y1");
  const [seen, setSeen] = useState<string[]>(["y1"]);
  const w = K_OBS.find((x) => x.id === sel)!;
  const open = (id: string) => {
    setSel(id);
    setSeen((s) => (s.includes(id) ? s : [...s, id]));
  };
  const story = useStory([
    {
      title: tt("A buyer close to signing", "Ein Käufer kurz vor der Unterschrift"),
      say: tt("Meet Kontor, an example company, not your case. A buyer asks: “If we sign in March, can you start in April?” The words “if we sign” decide it: decision proximity.", "Das ist Kontor, ein Beispielunternehmen, nicht Ihr Fall. Ein Käufer fragt: „Wenn wir im März unterschreiben, können Sie im April starten?“ Die Worte „wenn wir unterschreiben“ entscheiden: Entscheidungsnähe."),
      look: tt("the marked words in the box below", "die markierten Worte im Feld unten"),
      apply: () => open("y3"),
    },
    {
      title: tt("Close-sounding, and moving away", "Klingt nah und entfernt sich"),
      say: tt("Another asks: “Can we cancel without cost if our board changes its mind?” It sounds close to signing, but it asks for a way out: uncertainty.", "Ein anderer fragt: „Können wir kostenlos kündigen, wenn unser Vorstand es sich anders überlegt?“ Es klingt nah an der Unterschrift, fragt aber nach einem Ausweg: Unsicherheit."),
      look: tt("“cancel without cost” marked below", "„kostenlos kündigen“ unten markiert"),
      apply: () => open("y4"),
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt("Find the one phrase, then ask: towards the decision, or away from it? A friendly “later” with no reason is uncertainty too. Open the other observations yourself.", "Finden Sie die eine Wendung und fragen Sie dann: zur Entscheidung hin oder weg davon? Ein freundliches „später“ ohne Grund ist auch Unsicherheit. Öffnen Sie die anderen Beobachtungen selbst."),
      look: tt("the “after the summer” observation", "die Beobachtung „nach dem Sommer“"),
      apply: () => open("y6"),
    },
  ]);
  const pick = (id: string) => {
    story.leave();
    open(id);
  };
  return (
    <Diagram label={tt("Worked example · six observations from Kontor's deals (Case assumption, read-only)", "Durchgerechnetes Beispiel · sechs Beobachtungen aus Kontors Deals (Fallannahme, nur lesen)")}>
      <div className="mb-3 space-y-3">
        <ThePoint>{tt("One phrase decides a signal. A question about cancelling, or a friendly “later”, is uncertainty however positive it sounds.", "Eine Wendung entscheidet ein Signal. Eine Frage nach Kündigung oder ein freundliches „später“ ist Unsicherheit, so positiv es auch klingt.")}</ThePoint>
        <Story steps={story.plan} step={story.step} onStep={story.go} />
      </div>
      <ol className="grid gap-2 sm:grid-cols-2">
        {K_OBS.map((n) => (
          <li key={n.id}>
            <button type="button" onClick={() => pick(n.id)} aria-pressed={n.id === sel} className={clsx("flex min-h-[48px] w-full flex-col items-start gap-1 rounded-lg border bg-paper px-3 py-2 text-left text-caption transition-colors", n.id === sel ? "border-accent bg-accentSoft ring-2 ring-gold" : "border-line hover:border-ash", n.id === sel && story.step !== null && "anim-pulse")}>
              <span className="text-ink">{n.text}</span>
              {seen.includes(n.id) && <span className="pill border-signal/50 bg-signalSoft text-signal">{SIGNALS[n.sig].label}</span>}
            </button>
          </li>
        ))}
      </ol>
      <div className="mt-3 space-y-1.5 rounded-lg border border-line bg-paper p-3 text-caption" aria-live="polite">
        <p className="smallcaps">
          {tt("Signal: ", "Signal: ")}
          <span className="text-accent">{SIGNALS[w.sig].label}</span>
        </p>
        <p>
          <span className="font-semibold text-ink">{tt("The words that decide it. ", "Die entscheidenden Worte. ")}</span>
          <Marked text={w.text} mark={w.key} />
        </p>
        <p>
          <span className="font-semibold text-ink">{tt("The test question. ", "Die Testfrage. ")}</span>
          {SIGNALS[w.sig].test}
        </p>
        <p>
          <span className="font-semibold text-ink">{tt(`Why not ${SIGNALS[w.alt].label}? `, `Warum nicht ${SIGNALS[w.alt].label}? `)}</span>
          {w.altWhy}
        </p>
      </div>
      <Insight className="mt-3">
        {plain()}
        {tt(
          `Each observation is settled by one phrase. The trap is the question about cancelling and the “after the summer”: both sound close to a decision, and both move away from it. A question about cancelling or a “later” with no reason is uncertainty, however friendly. You have opened ${seen.length} of 6.`,
          `Jede Beobachtung wird von einer Wendung entschieden. Die Falle sind die Frage nach der Kündigung und das „nach dem Sommer“: Beide klingen nah an einer Entscheidung, und beide entfernen sich davon. Eine Frage nach Kündigung oder ein „später“ ohne Grund ist Unsicherheit, egal wie freundlich. Sie haben ${seen.length} von 6 geöffnet.`,
        )}
      </Insight>
    </Diagram>
  );
}

/* ------------------------------------------------------------------ A6 · reading a signal right, or wrong */

const OUTCOME = bi({
  same: t("The response fits: the buyer feels understood and the deal moves to its next step.", "Die Antwort passt: Der Käufer fühlt sich verstanden, und der Deal geht zum nächsten Schritt."),
  "uncertainty-as-interest": t("A hesitating buyer gets a demo or more features. The worry is not addressed, so the buyer feels unheard and goes quiet. This is how most stalls start.", "Ein zögernder Käufer bekommt eine Demo oder mehr Funktionen. Die Sorge wird nicht angesprochen, also fühlt er sich überhört und verstummt. So beginnen die meisten Stillstände."),
  "uncertainty-as-proximity": t("A hesitating buyer gets a signing plan. It feels like pressure, and pressure on a worried buyer adds to the worry.", "Ein zögernder Käufer bekommt einen Unterschriftsplan. Es fühlt sich wie Druck an, und Druck auf einen besorgten Käufer vergrößert die Sorge."),
  "uncertainty-as-comparison": t("A hesitating buyer gets a comparison with competitors it was not thinking about. Now it has more to worry about, not less.", "Ein zögernder Käufer bekommt einen Vergleich mit Wettbewerbern, an die er nicht dachte. Jetzt hat er mehr Sorgen, nicht weniger."),
  "interest-as-uncertainty": t("An interested buyer gets reassurance it did not ask for. Harmless, but slow: the next step waits.", "Ein interessierter Käufer bekommt Beruhigung, nach der er nicht fragte. Harmlos, aber langsam: Der nächste Schritt wartet."),
  "proximity-as-interest": t("A buyer ready to decide gets another demo. The moment passes, and the budget may go elsewhere.", "Ein entscheidungsbereiter Käufer bekommt noch eine Demo. Der Moment vergeht, und das Budget geht vielleicht woandershin."),
  other: t("The response answers a question the buyer did not ask. It costs time and some trust.", "Die Antwort beantwortet eine Frage, die der Käufer nicht stellte. Das kostet Zeit und etwas Vertrauen."),
});

export function ReadAndRespond() {
  const [actual, setActualRaw] = useState<SignalType>("uncertainty");
  const [read, setReadRaw] = useState<SignalType>("interest");
  const story = useStory([
    {
      title: tt("Read right", "Richtig gelesen"),
      say: tt("Meet Kontor, an example company, not your case. A hesitating buyer asks what happens if it fails. Sales reads it as uncertainty, names the worry and offers a pilot. The buyer feels heard and goes on.", "Das ist Kontor, ein Beispielunternehmen, nicht Ihr Fall. Ein zögernder Käufer fragt, was passiert, wenn es scheitert. Der Vertrieb liest Unsicherheit, spricht die Sorge an und bietet einen Pilot. Der Käufer fühlt sich gehört und macht weiter."),
      look: tt("the teal box: the response sent matches the one needed", "das türkise Feld: gesendete und nötige Antwort passen"),
      apply: () => {
        setActualRaw("uncertainty");
        setReadRaw("uncertainty");
      },
    },
    {
      title: tt("Read wrong", "Falsch gelesen"),
      say: tt("Same question, but sales hears interest and sends a demo. The worry stays open, the buyer feels unheard and goes quiet. Most stalls start like this.", "Dieselbe Frage, aber der Vertrieb hört Interesse und schickt eine Demo. Die Sorge bleibt offen, der Käufer fühlt sich überhört und verstummt. So beginnen die meisten Stillstände."),
      look: tt("the dashed box: two different responses", "das gestrichelte Feld: zwei verschiedene Antworten"),
      apply: () => {
        setActualRaw("uncertainty");
        setReadRaw("interest");
      },
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt("Read the signal first, then answer the question the buyer actually asked. Try other pairs with the buttons.", "Lesen Sie zuerst das Signal und beantworten Sie dann die Frage, die der Käufer wirklich gestellt hat. Probieren Sie andere Paare mit den Schaltflächen."),
      look: tt("the two rows of buttons", "die zwei Reihen Schaltflächen"),
      apply: () => {
        setActualRaw("proximity");
        setReadRaw("interest");
      },
    },
  ]);
  const setActual = (v: SignalType) => {
    story.leave();
    setActualRaw(v);
  };
  const setRead = (v: SignalType) => {
    story.leave();
    setReadRaw(v);
  };
  const key = actual === read ? "same" : (`${actual}-as-${read}` as keyof typeof OUTCOME);
  const outcome = OUTCOME[key] ?? OUTCOME.other;
  const fits = actual === read;
  return (
    <div className="space-y-3">
      <ThePoint>{tt("Reading a signal wrong means answering a question the buyer did not ask. With a hesitating buyer, that is how deals stall.", "Ein Signal falsch lesen heißt, eine Frage zu beantworten, die der Käufer nicht gestellt hat. Bei einem zögernden Käufer stocken so Deals.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <p className="smallcaps">{tt("What the buyer is really signalling", "Was der Käufer wirklich signalisiert")}</p>
          <Toggles<SignalType> label={tt("Actual signal", "Tatsächliches Signal")} value={actual} onChange={setActual} options={SIGNAL_IDS.map((s) => ({ id: s, label: SIGNALS[s].label }))} />
        </div>
        <div className="space-y-1.5">
          <p className="smallcaps">{tt("How sales reads it", "Wie der Vertrieb es liest")}</p>
          <Toggles<SignalType> label={tt("Signal as read", "Signal, wie gelesen")} value={read} onChange={setRead} options={SIGNAL_IDS.map((s) => ({ id: s, label: SIGNALS[s].label }))} />
        </div>
      </div>
      <div className={clsx("rounded-lg border p-3.5 text-caption", fits ? "border-signal/40 bg-signalSoft" : "border-dashed border-ash bg-mist", story.step !== null && "anim-pulse ring-2 ring-gold")} aria-live="polite">
        <p className="smallcaps">{tt("Response sent", "Gesendete Antwort")}</p>
        <p className="mt-1 text-ink">{SIGNALS[read].response}</p>
        <p className="smallcaps mt-2">{tt("What the buyer needed", "Was der Käufer brauchte")}</p>
        <p className="mt-1 text-ink">{SIGNALS[actual].response}</p>
      </div>
      <Insight>
        {plain()}
        {outcome}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ A7 · scoring: Kontor's three measures */

type EM = { id: string; name: string; cost: number; runsOn: RunsOn; eff: 1 | 2 | 3; fea: 1 | 2 | 3 };
const BUD_K = 50000;
export function ScoreExample() {
  const uid = useId().replace(/:/g, "");
  const start = (): EM[] => [
    { id: "p", name: tt("Named service lead per customer", "Benannte Service-Leitung pro Kunde"), cost: 28000, runsOn: "role", eff: 3, fea: 2 },
    { id: "q", name: tt("Outage messages within 15 minutes", "Störungsmeldungen innerhalb von 15 Minuten"), cost: 12000, runsOn: "process", eff: 2, fea: 3 },
    { id: "r", name: tt("Founder's personal calls to key customers", "Persönliche Anrufe des Gründers bei Schlüsselkunden"), cost: 15000, runsOn: "person", eff: 3, fea: 3 },
  ];
  const [rows, setRows] = useState<EM[]>(start);
  const [inc, setInc] = useState<string[]>(["p", "q", "r"]);
  const [spot, setSpot] = useState<string | null>(null);
  const base = start();
  const sc = (id: string) => {
    const r = base.find((x) => x.id === id)!;
    return r.eff * sustainBucket(r.runsOn) * r.fea;
  };
  const allCost = base.reduce((s2, r) => s2 + r.cost, 0);
  const story = useStory([
    {
      title: tt("A measure that lasts", "Eine Maßnahme, die bleibt"),
      say: tt(`Meet Kontor, an example company, not your case, with ${euro(BUD_K)}. Its outage messages have a medium effect but run on a process, so they keep working: 2 × 3 × 3 = ${sc("q")}.`, `Das ist Kontor, ein Beispielunternehmen, nicht Ihr Fall, mit ${euro(BUD_K)}. Seine Störungsmeldungen wirken mittel, laufen aber auf einem Prozess und wirken daher weiter: 2 × 3 × 3 = ${sc("q")}.`),
      look: tt("the row “Outage messages”", "die Zeile „Störungsmeldungen“"),
      apply: () => {
        setRows(start());
        setInc(["p", "q", "r"]);
        setSpot("q");
      },
    },
    {
      title: tt("Strong, and gone when one person is busy", "Stark, und weg, wenn eine Person keine Zeit hat"),
      say: tt(`The founder's personal calls have the strongest effect, but they stop when the founder is busy: 3 × 1 × 3 = ${sc("r")}. And all three together cost ${euro(allCost)}: ${euro(allCost - BUD_K)} over.`, `Die persönlichen Anrufe des Gründers wirken am stärksten, hören aber auf, wenn der Gründer keine Zeit hat: 3 × 1 × 3 = ${sc("r")}. Und alle drei zusammen kosten ${euro(allCost)}: ${euro(allCost - BUD_K)} zu viel.`),
      look: tt("the founder's row and the plan line under the table", "die Zeile des Gründers und die Planzeile unter der Tabelle"),
      apply: () => {
        setRows(start());
        setInc(["p", "q", "r"]);
        setSpot("r");
      },
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt("Leave out the lowest score: the plan fits the budget and lasts when people change. Change the effect and feasibility scores yourself.", "Lassen Sie den niedrigsten Wert weg: Der Plan passt ins Budget und hält, wenn Menschen wechseln. Ändern Sie die Werte für Wirkung und Machbarkeit selbst."),
      look: tt("the plan line: inside the budget", "die Planzeile: innerhalb des Budgets"),
      apply: () => {
        setRows(start());
        setInc(["p", "q"]);
        setSpot(null);
      },
    },
  ]);
  const cycle = (id: string, f: "eff" | "fea") => {
    story.leave();
    setSpot(null);
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [f]: ((r[f] % 3) + 1) as 1 | 2 | 3 } : r)));
  };
  const toggle = (id: string) => {
    story.leave();
    setSpot(null);
    setInc((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  };
  const scored = rows.map((r) => ({ ...r, sus: sustainBucket(r.runsOn), score: r.eff * sustainBucket(r.runsOn) * r.fea }));
  const chosen = scored.filter((r) => inc.includes(r.id));
  const total = chosen.reduce((s, r) => s + r.cost, 0);
  const over = total - BUD_K;
  const lowest = [...chosen].sort((a, b) => a.score - b.score)[0];
  return (
    <div className="space-y-3">
      <ThePoint>{tt("A measure is worth funding when its effect, how long it lasts and how easy it is are all decent. A strong measure that rests on one person scores low, on purpose.", "Eine Maßnahme lohnt sich, wenn Wirkung, Dauer und Machbarkeit alle ordentlich sind. Eine starke Maßnahme, die an einer Person hängt, bekommt absichtlich wenig.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <div className="relative overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[38rem] border-collapse text-caption">
          <caption className="sr-only">{tt("Three measures of Kontor scored on effect, sustainability and feasibility", "Drei Maßnahmen von Kontor, bewertet nach Wirkung, Nachhaltigkeit und Machbarkeit")}</caption>
          <thead>
            <tr className="bg-mist text-left text-micro uppercase text-ash">
              <th className="px-3 py-2">{tt("In the plan", "Im Plan")}</th>
              <th className="px-3 py-2">{tt("Measure · runs on", "Maßnahme · läuft auf")}</th>
              <th className="px-3 py-2">{tt("Cost", "Kosten")}</th>
              <th className="px-3 py-2">{tt("Effect", "Wirkung")}</th>
              <th className="px-3 py-2">{tt("Sustainab.", "Nachhalt.")}</th>
              <th className="px-3 py-2">{tt("Feasibility", "Machbarkeit")}</th>
              <th className="px-3 py-2 text-right">{tt("Score", "Wert")}</th>
            </tr>
          </thead>
          <tbody>
            {scored.map((r) => (
              <tr key={r.id} className={clsx("border-t border-line align-top", !inc.includes(r.id) && "opacity-60", story.step !== null && spot === r.id && "bg-accentSoft outline outline-2 outline-gold")}>
                <td className="px-3 py-2">
                  <input type="checkbox" checked={inc.includes(r.id)} onChange={() => toggle(r.id)} aria-label={tt(`Include ${r.name}`, `${r.name} aufnehmen`)} className="h-5 w-5 accent-[#8A5A0B]" />
                </td>
                <td className="px-3 py-2">
                  <span className="font-semibold">{r.name}</span>
                  <br />
                  <span className="text-ash">{RUNS_ON_LABEL[r.runsOn]}</span>
                </td>
                <td className="tnum px-3 py-2">{euro(r.cost)}</td>
                <td className="px-3 py-2">
                  <button type="button" onClick={() => cycle(r.id, "eff")} className="btn-ghost btn-sm min-w-[3rem]" aria-label={tt(`Effect of ${r.name}: ${r.eff}. Click to change.`, `Wirkung von ${r.name}: ${r.eff}. Klicken zum Ändern.`)}>
                    {r.eff}
                  </button>
                </td>
                <td className="tnum px-3 py-2">{r.sus}</td>
                <td className="px-3 py-2">
                  <button type="button" onClick={() => cycle(r.id, "fea")} className="btn-ghost btn-sm min-w-[3rem]" aria-label={tt(`Feasibility of ${r.name}: ${r.fea}. Click to change.`, `Machbarkeit von ${r.name}: ${r.fea}. Klicken zum Ändern.`)}>
                    {r.fea}
                  </button>
                </td>
                <td className="tnum px-3 py-2 text-right font-bold">{r.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="tnum text-caption text-ink" id={`${uid}-budget`}>
        {tt(`Plan ${euro(total)} of ${euro(BUD_K)}${over > 0 ? `, ${euro(over)} over` : ""}.`, `Plan ${euro(total)} von ${euro(BUD_K)}${over > 0 ? `, ${euro(over)} darüber` : ""}.`)}
      </p>
      <Insight>
        {plain()}
        {over > 0
          ? tt(`Over budget by ${euro(over)}: leave out the lowest score, ${lowest ? `“${lowest.name}” (${lowest.score})` : "none"}. `, `${euro(over)} über dem Budget: Lassen Sie den niedrigsten Wert weg, ${lowest ? `„${lowest.name}“ (${lowest.score})` : "keinen"}. `)
          : tt("Inside the budget. ", "Innerhalb des Budgets. ")}
        {tt(
          "Sustainability follows from what a measure runs on, so you do not judge it: the founder's calls have the strongest effect and score only 9, because they stop the day the founder is busy. The outage messages have a smaller effect and last, because a process sends them.",
          "Die Nachhaltigkeit folgt daraus, worauf eine Maßnahme läuft, Sie beurteilen sie also nicht: Die Anrufe des Gründers haben die stärkste Wirkung und erzielen nur 9, weil sie aufhören, sobald der Gründer beschäftigt ist. Die Störungsmeldungen wirken schwächer und bleiben, weil ein Prozess sie verschickt.",
        )}
      </Insight>
    </div>
  );
}

export { num };
