"use client";

import clsx from "clsx";
import { AnswerBlock } from "@/components/ui/AnswerBlock";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { BudgetBar } from "@/components/ui/BudgetBar";
import { CheckBar, OptionList, Reading, ScorePick, TextBox } from "@/components/ui/Inputs";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MentorGuide } from "@/components/ui/MentorGuide";
import { RevealHint } from "@/components/ui/RevealHint";
import { WritingHelp } from "@/components/ui/WritingHelp";
import type { HelpRef } from "@/components/ui/WritingHelp";
import { MethodHelp } from "@/components/ui/MethodHelp";
import { ExampleAnswer } from "@/components/ui/ExampleAnswer";
import { BlockMissing } from "@/components/ui/BlockMissing";
import {
  ACTIVITIES,
  ACTIVITY_IDS,
  ARCH,
  ARCH_BY_ID,
  ARCH_IDS,
  BASELINE_ITEM,
  BOARD_CHALLENGE,
  CHALLENGE_LOST,
  COST_SHAPE_LABEL,
  CRITERIA,
  CRIT_IDS,
  DECISIONS,
  DEPENDS_LABEL,
  GROUPS,
  GROUP_CHURN,
  GROUP_IDS,
  GROUP_SIZE,
  KPIS,
  LEVEL_LABEL,
  LEVERS,
  LEVER_BY_ID,
  LEVER_CHOOSE,
  LEVER_IDS,
  OWNERS,
  OWNER_IDS,
  PRINCIPLES,
  PRINCIPLE_IDS,
  R2_BASELINE_NOTE,
  R2_BUDGET,
  R2_MONTHS,
  RACI_LETTERS,
  RACI_ROLES,
  ROLE_IDS,
  TIMES,
  customerItems,
  groupRowId,
  triggerMonth,
} from "@/data/route2";
import type { ActivityId, ArchId, ArchItem, Criterion, DecisionId, GroupId, KpiId, LeverId, OwnerId, PrincipleId, RaciLetter, RoleId, TimeId } from "@/data/route2";
import { RESPONSES, SIGNALS, SIGNAL_IDS, TEAMS, TEAM_IDS } from "@/data/signals";
import type { ResponseId, SignalType, TeamId } from "@/data/signals";
import { archCost, archLeft, archOver, funded, leverTotal, onePersonFunded, principlesHold, processHolds, raciHolds, raciRowFlags, ratingFlags, seqRules, systemicCount, tripFlagsOf } from "@/lib/checks";
import { scrollToAndFlash } from "@/lib/flash";
import { Gloss } from "@/lib/glossify";
import { euro, num, pct, tt } from "@/lib/lang";
import { figRef } from "@/lib/calcR2";
import { IDS } from "@/lib/missing";
import { assumptionGuide, challengeGuide, greatestGuide, pickupGuide, postponedGuide, principleTextGuide, processNoteGuide, triggerGuide, tripGuide } from "@/lib/mentorGuide";
import { decisionKey, leverKey, ownerKey, principleKey, processKey, raciKey, tripKey } from "@/lib/answerKey";
import { MIN_LINE } from "@/lib/progress";
import { BLOCK_MINUTES } from "@/lib/routes";
import { useStore } from "@/store/useStore";
import type { R2State, Score } from "@/store/useStore";

const MONTHS_LIST = Array.from({ length: R2_MONTHS }, (_, i) => i + 1);
const PRINCIPLE_CHOOSE = 3;

/* ------------------------------------------------------------------ Block 3.1 */

export function Block31() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const mentor = useStore((s) => s.mentorUnlocked);
  const toggle = (c: PrincipleId) => patch((s) => ({ principles: s.principles.includes(c) ? s.principles.filter((x) => x !== c) : [...s.principles, c], principleFlagged: false }));
  const check = () =>
    patch((s) => {
      const h = principlesHold(s);
      return { checks: s.checks + 1, principleFlagged: !(h.view && h.signals), principleClue: false };
    });
  const h = principlesHold(r2);
  return (
    <AnswerBlock
      id="block-3-1"
      title={tt("Block 3.1 · The target vision: three principles of the retention system", "Block 3.1 · Das Zielbild: drei Prinzipien des Bindungssystems")}
      kind="OBJECTIVE + JUDGED"
      core={false}
      minutes={BLOCK_MINUTES["3.1"]}
      findIt={tt("Route 2 → Task 2 → the six principles below. Answer by choosing three and saying what each means for NetSolutions.", "Route 2 → Task 2 → die sechs Prinzipien unten. Antworten Sie, indem Sie drei wählen und sagen, was jedes für NetSolutions bedeutet.")}
    >
      <MaterialRefs refs={["B1"]} />
      <div id={IDS.principlePick} className={clsx("space-y-2 rounded-lg p-1", r2.principleFlagged && "is-flagged")}>
        <p className="text-body text-ink">
          <Gloss>{tt("Choose the three principles your retention system will stand on. A system keeps working when people change; test each principle against that (Materi B1).", "Wählen Sie die drei Prinzipien, auf denen Ihr Bindungssystem stehen wird. Ein System wirkt weiter, wenn Menschen wechseln; prüfen Sie jedes Prinzip daran (Materi B1).")}</Gloss>
        </p>
        <OptionList<PrincipleId>
          multi
          cols={2}
          label={tt("System principles", "Systemprinzipien")}
          value={r2.principles}
          onChange={toggle}
          disabledIds={r2.principles.length >= PRINCIPLE_CHOOSE ? PRINCIPLE_IDS : []}
          onDisabledClick={() => scrollToAndFlash(IDS.principlePick, "warn")}
          options={PRINCIPLE_IDS.map((c) => ({ id: c, label: PRINCIPLES[c].name, sub: PRINCIPLES[c].means }))}
        />
        <p role="status" className="text-caption text-ash">
          {tt(`${r2.principles.length} of ${PRINCIPLE_CHOOSE} chosen.`, `${r2.principles.length} von ${PRINCIPLE_CHOOSE} gewählt.`)}
          {r2.principles.length >= PRINCIPLE_CHOOSE ? tt(" To choose another, first remove one.", " Um ein anderes zu wählen, entfernen Sie zuerst eines.") : ""}
        </p>
        {r2.principleFlagged && (
          <p className="text-caption text-ink">
            <span className="smallcaps mr-1 text-accent">{tt("Check", "Prüfung")}</span>
            {tt(`${[h.view, h.signals].filter(Boolean).length} of the 2 foundations a system needs are among your three. `, `${[h.view, h.signals].filter(Boolean).length} der 2 Fundamente, die ein System braucht, sind unter Ihren dreien. `)}
            {r2.principleClue ? (
              tt("Which principle lets anyone who talks to the customer act, and which makes sure someone must?", "Welches Prinzip lässt jeden handeln, der mit dem Kunden spricht, und welches sorgt dafür, dass jemand handeln muss?")
            ) : (
              <button type="button" onClick={() => patch({ principleClue: true })} className="btn-ghost btn-sm border-gold">
                {tt("Show clue", "Hinweis zeigen")}
              </button>
            )}
          </p>
        )}
      </div>
      {r2.principles.map((c) => (
        <div key={c} className="space-y-1.5">
          <TextBox
            id={IDS.principle(c)}
            label={tt(`${PRINCIPLES[c].name}: what it means at NetSolutions`, `${PRINCIPLES[c].name}: was es bei NetSolutions bedeutet`)}
            help={tt(`One or two sentences: what changes for NetSolutions' customers or teams, and which weakness it answers (customers who know no one, signals nobody owns). At least ${MIN_LINE} characters.`, `Ein oder zwei Sätze: was sich für Kunden oder Teams von NetSolutions ändert, und welche Schwäche es beantwortet (Kunden, die niemanden kennen, Signale, die niemand verantwortet). Mindestens ${MIN_LINE} Zeichen.`)}
            value={r2.principleText[c] ?? ""}
            onChange={(v) => patch((s) => ({ principleText: { ...s.principleText, [c]: v } }))}
            min={MIN_LINE}
            rows={2}
          >
            <WritingHelp
              id={`principle-kit-${c}`}
              refs={[
                { label: tt("The principle", "Das Prinzip"), value: PRINCIPLES[c].means, target: IDS.principlePick },
                { label: tt("The system test", "Der Systemtest"), value: tt("does it keep working when people change? (Materi B1)", "wirkt es weiter, wenn Menschen wechseln? (Materi B1)"), target: "mat-B1" },
                { label: tt("The case", "Der Fall"), value: tt("sales, service and marketing do not share what they hear", "Vertrieb, Service und Marketing teilen nicht, was sie hören"), target: "task-2" },
              ]}
              steps={[
                tt("Say what changes for customers or teams, in one sentence.", "Sagen Sie in einem Satz, was sich für Kunden oder Teams ändert."),
                tt("Name the weakness it ends, in NetSolutions' own terms.", "Nennen Sie die Schwäche, die es beendet, in den Worten des Falls."),
              ]}
            />
          </TextBox>
          <ExampleAnswer id={`principle-example-${c}`} guide={principleTextGuide(c)} />
          {mentor && <MentorGuide guide={principleTextGuide(c)} />}
        </div>
      ))}
      <CheckBar onCheck={check} checkLabel={tt("Check my principles", "Meine Prinzipien prüfen")} checks={r2.checks} />
      <AnswerKey block={principleKey()} />
      <BlockMissing block="3.1" route={2} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 3.2 */

export function Block32() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const mentor = useStore((s) => s.mentorUnlocked);
  const setRow = (s: SignalType, p: Partial<{ team: TeamId | null; time: TimeId | null; action: ResponseId | null; note: string }>) =>
    patch((st) => ({ process: { ...st.process, [s]: { ...st.process[s], ...p } }, processResult: p.note !== undefined ? st.processResult : null }));
  const check = () => patch((s) => ({ checks: s.checks + 1, processResult: processHolds(s), processClue: false }));
  return (
    <AnswerBlock
      id="block-3-2"
      title={tt("Block 3.2 · The central process: from signal to response", "Block 3.2 · Der zentrale Prozess: vom Signal zur Antwort")}
      kind="OBJECTIVE + JUDGED"
      core
      minutes={BLOCK_MINUTES["3.2"]}
      findIt={tt("Route 2 → Task 2 → one row per signal type below, and the response curve in Materi B2. Answer in the four rows.", "Route 2 → Task 2 → eine Zeile pro Signalart unten, und die Reaktionskurve in Materi B2. Antworten Sie in den vier Zeilen.")}
    >
      <MaterialRefs refs={["B2", "A5"]} />
      <p className="text-body text-ink">
        <Gloss>{tt("For each of the four signal types, set who owns the response, how fast it must come and the first action, then describe in one line what happens. This is the process every customer goes through, whoever is on duty.", "Legen Sie für jede der vier Signalarten fest, wer die Antwort verantwortet, wie schnell sie kommen muss und die erste Aktion, und beschreiben Sie dann in einer Zeile, was passiert. Das ist der Prozess, den jeder Kunde durchläuft, egal wer Dienst hat.")}</Gloss>
      </p>
      <RevealHint id="process-help" label={tt("Show the test questions", "Testfragen zeigen")} title={tt("How to set a row · taught in Materi A5 and B2", "Wie man eine Zeile setzt · aus Materi A5 und B2")}>
        <ul className="space-y-1.5 text-caption text-ink">
          <li>{tt("Owner: who can give what this buyer is asking for?", "Owner: Wer kann geben, wonach dieser Käufer fragt?")}</li>
          <li>{tt("Time: how fast does this signal lose its value while it waits? (the response curve in B2)", "Zeit: Wie schnell verliert dieses Signal seinen Wert, während es wartet? (die Reaktionskurve in B2)")}</li>
          <li>{tt("Action: what does the signal's own test question say the buyer needs?", "Aktion: Was braucht der Käufer laut der Testfrage des Signals?")}</li>
          <li>
            <MaterialRefs refs={["A5", "B2"]} lead={tt("Taught in", "Gelehrt in")} />
          </li>
        </ul>
      </RevealHint>
      {SIGNAL_IDS.map((s) => {
        const r = r2.process[s];
        return (
          <div key={s} id={IDS.process(s)} className="space-y-3 rounded-lg border border-line bg-paper p-3.5">
            <p className="font-semibold text-ink">
              {SIGNALS[s].label} <span className="font-normal text-ash">· {SIGNALS[s].sounds}</span>
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label htmlFor={`proc-team-${s}`} className="smallcaps block">
                  {tt("Owner team", "Zuständiges Team")}
                </label>
                <select id={`proc-team-${s}`} className="field mt-1" value={r.team ?? ""} onChange={(e) => setRow(s, { team: (e.target.value || null) as TeamId | null })}>
                  <option value="">{tt("Choose a team…", "Team wählen…")}</option>
                  {TEAM_IDS.map((t) => (
                    <option key={t} value={t}>
                      {TEAMS[t]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={`proc-time-${s}`} className="smallcaps block">
                  {tt("Response time", "Reaktionszeit")}
                </label>
                <select id={`proc-time-${s}`} className="field mt-1" value={r.time ?? ""} onChange={(e) => setRow(s, { time: (e.target.value || null) as TimeId | null })}>
                  <option value="">{tt("Choose…", "Wählen…")}</option>
                  {TIMES.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <p className="smallcaps">{tt("First action", "Erste Aktion")}</p>
              <OptionList<ResponseId> label={tt(`First action for ${SIGNALS[s].label}`, `Erste Aktion für ${SIGNALS[s].label}`)} value={r.action} onChange={(v) => setRow(s, { action: v })} options={RESPONSES.map((x) => ({ id: x.id, label: x.label }))} />
            </div>
            <TextBox
              id={`${IDS.process(s)}-note`}
              label={tt("What happens, in one line", "Was passiert, in einer Zeile")}
              help={tt("Where the signal is logged, who is told, and what the customer receives. At least 20 characters.", "Wo das Signal erfasst wird, wer informiert wird und was der Kunde bekommt. Mindestens 20 Zeichen.")}
              value={r.note}
              onChange={(v) => setRow(s, { note: v })}
              min={20}
              rows={2}
            >
              <WritingHelp
                id={`process-kit-${s}`}
                refs={[
                  { label: tt("What the buyer sounds like", "Wie der Käufer klingt"), value: SIGNALS[s].sounds, target: IDS.process(s) },
                  { label: tt("The test question (Materi A5, repeated in B2)", "Die Testfrage (Materi A5, wiederholt in B2)"), value: SIGNALS[s].test, target: "mat-B2" },
                  { label: tt("Your owner team", "Ihr zuständiges Team"), value: r.team ? TEAMS[r.team] : tt("not chosen yet", "noch nicht gewählt"), target: `proc-team-${s}` },
                  { label: tt("Your response time", "Ihre Reaktionszeit"), value: r.time ? TIMES.find((x) => x.id === r.time)!.label : tt("not chosen yet", "noch nicht gewählt"), target: `proc-time-${s}` },
                ]}
                steps={[
                  tt("Where the signal is logged: in one place every team can see.", "Wo das Signal erfasst wird: an einem Ort, den jedes Team sieht."),
                  tt("Who is told, at once.", "Wer sofort informiert wird."),
                  tt("What the customer receives, and by when: your first action and your response time.", "Was der Kunde bekommt, und bis wann: Ihre erste Aktion und Ihre Reaktionszeit."),
                ]}
              />
            </TextBox>
            <ExampleAnswer id={`process-example-${s}`} guide={processNoteGuide(s)} />
            {mentor && <MentorGuide guide={processNoteGuide(s)} />}
          </div>
        );
      })}
      <CheckBar onCheck={check} checkLabel={tt("Check my process", "Meinen Prozess prüfen")} checks={r2.checks} clueShown={r2.processClue} onClue={() => patch({ processClue: true })} />
      {r2.processResult && (
        <Reading>
          {tt(`${r2.processResult.holds} of ${r2.processResult.total} settings hold (owner, time and action for each of the four signal types). A check never says which.`, `${r2.processResult.holds} von ${r2.processResult.total} Einstellungen stimmen (Owner, Zeit und Aktion für jede der vier Signalarten). Eine Prüfung sagt nie, welche.`)}
          {r2.processClue ? tt(" Clue: start with the signal type that stalled every time in Route 1. How long can hesitation wait before it grows?", " Hinweis: Beginnen Sie mit der Signalart, die in Route 1 jedes Mal stockte. Wie lange kann Zögern warten, bevor es wächst?") : ""}
        </Reading>
      )}
      <AnswerKey block={processKey()} />
      <BlockMissing block="3.2" route={2} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 3.3 */

export function Block33() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const mentor = useStore((s) => s.mentorUnlocked);
  const toggle = (id: LeverId) =>
    patch((s) => {
      const next = s.levers.includes(id) ? s.levers.filter((x) => x !== id) : [...s.levers, id];
      return { levers: next, greatest: s.greatest && next.includes(s.greatest) ? s.greatest : null, rateFlags: [], leverResult: null };
    });
  const setRate = (id: LeverId, c: Criterion, v: Score) => patch((s) => ({ rate: { ...s.rate, [`${id}.${c}`]: v }, rateFlags: s.rateFlags.filter((x) => x !== `${id}.${c}`) }));
  const check = () => patch((s) => ({ checks: s.checks + 1, rateFlags: ratingFlags(s), leverResult: { systemic: systemicCount(s.levers) } }));
  return (
    <AnswerBlock
      id="block-3-3"
      title={tt("Block 3.3 · Strategic levers for emotional retention", "Block 3.3 · Strategische Hebel für emotionale Bindung")}
      kind="OBJECTIVE + JUDGED"
      core={false}
      minutes={BLOCK_MINUTES["3.3"]}
      findIt={tt("Route 2 → Task 2 → the eight levers below, each with its level, what it depends on and how its cost behaves. Answer by choosing three and rating them on the four tests of Materi B3.", "Route 2 → Task 2 → die acht Hebel unten, jeder mit Ebene, wovon er abhängt und wie sich seine Kosten verhalten. Antworten Sie, indem Sie drei wählen und nach den vier Tests aus Materi B3 bewerten.")}
    >
      <MaterialRefs refs={["B3"]} />
      <div id={IDS.leverPick} className="space-y-2">
        <OptionList<LeverId>
          multi
          label={tt("Levers", "Hebel")}
          value={r2.levers}
          onChange={toggle}
          disabledIds={r2.levers.length >= LEVER_CHOOSE ? LEVER_IDS : []}
          onDisabledClick={() => scrollToAndFlash(IDS.leverPick, "warn")}
          options={LEVERS.map((l) => ({
            id: l.id,
            label: l.name,
            sub: `${l.what} ${tt("Level", "Ebene")}: ${LEVEL_LABEL[l.level]} · ${tt("depends on", "hängt ab von")}: ${DEPENDS_LABEL[l.depends]} · ${tt("cost", "Kosten")}: ${COST_SHAPE_LABEL[l.costShape]} · ${l.reachAll ? tt("every customer", "jeder Kunde") : tt("some customers", "einige Kunden")}.`,
          }))}
        />
        <p role="status" className="text-caption text-ash">
          {tt(`${r2.levers.length} of ${LEVER_CHOOSE} chosen.`, `${r2.levers.length} von ${LEVER_CHOOSE} gewählt.`)}
          {r2.levers.length >= LEVER_CHOOSE ? tt(" To choose another, first remove one.", " Um einen anderen zu wählen, entfernen Sie zuerst einen.") : ""}
        </p>
        <RevealHint id="lever-tests" label={tt("Show the test questions", "Testfragen zeigen")} title={tt("The four tests · taught in Materi B3", "Die vier Tests · aus Materi B3")}>
          <ul className="space-y-1.5 text-caption text-ink">
            {CRITERIA.map((c) => (
              <li key={c.id}>
                <span className="font-semibold">{c.name}. </span>
                {c.test} {tt("Low:", "Niedrig:")} {c.low} {tt("High:", "Hoch:")} {c.high}
              </li>
            ))}
            <li>
              <MaterialRefs refs={["B3"]} lead={tt("Taught in", "Gelehrt in")} />
            </li>
          </ul>
        </RevealHint>
      </div>
      {r2.levers.map((id) => {
        const l = LEVER_BY_ID[id];
        return (
          <div key={id} id={IDS.lever(id)} className="space-y-3 rounded-lg border border-line bg-paper p-3.5">
            <p className="font-semibold text-ink">
              {l.name} <span className="font-normal text-ash">· {LEVEL_LABEL[l.level]} · {DEPENDS_LABEL[l.depends]} · {COST_SHAPE_LABEL[l.costShape]}</span>
            </p>
            <p className="text-caption text-ash">
              {tt("Acts on: ", "Wirkt auf: ")}
              {l.acts}
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {CRIT_IDS.map((c) => {
                const k = `${id}.${c}`;
                const flagged = r2.rateFlags.includes(k);
                const crit = CRITERIA.find((x) => x.id === c)!;
                return (
                  <div key={c}>
                    <p className="smallcaps">{crit.name}</p>
                    <ScorePick label={tt(`${crit.name} of ${l.name}`, `${crit.name} von ${l.name}`)} value={r2.rate[k] || 0} onChange={(v) => setRate(id, c, v)} flagged={flagged} />
                    {flagged && <p className="mt-1 text-micro normal-case tracking-normal text-ink">{tt("Higher than the printed facts allow. Read the lever's line above against this test.", "Höher, als die gedruckten Fakten erlauben. Lesen Sie die Zeile des Hebels oben gegen diesen Test.")}</p>}
                  </div>
                );
              })}
            </div>
            <p className="tnum text-caption text-ink" aria-live="polite">
              {tt("Total of the four tests: ", "Summe der vier Tests: ")}
              <strong>{leverTotal(r2, id) || "—"}</strong> / 12
            </p>
          </div>
        );
      })}
      <CheckBar onCheck={check} checkLabel={tt("Check my ratings", "Meine Bewertungen prüfen")} checks={r2.checks} />
      {r2.leverResult && (
        <Reading>
          {r2.rateFlags.length > 0
            ? tt(`${r2.rateFlags.length} rating${r2.rateFlags.length === 1 ? " is" : "s are"} higher than the printed facts of the lever allow and ${r2.rateFlags.length === 1 ? "is" : "are"} outlined. `, `${r2.rateFlags.length} ${r2.rateFlags.length === 1 ? "Bewertung ist" : "Bewertungen sind"} höher, als die gedruckten Fakten des Hebels erlauben, und markiert. `)
            : tt("No rating exceeds what the printed facts allow. ", "Keine Bewertung übersteigt, was die gedruckten Fakten erlauben. ")}
          {tt(`${r2.leverResult.systemic} of your ${r2.levers.length} levers work at the level of a process or a structure; a system needs most of its levers there (Materi B3).`, `${r2.leverResult.systemic} Ihrer ${r2.levers.length} Hebel wirken auf der Ebene eines Prozesses oder einer Struktur; ein System braucht die meisten Hebel dort (Materi B3).`)}
        </Reading>
      )}
      <AnswerKey block={leverKey()} />
      <div className="space-y-2 border-t border-line pt-3">
        <div id={IDS.greatest}>
          <p className="font-semibold text-ink">{tt("Which of your levers has the greatest effect on loyalty?", "Welcher Ihrer Hebel hat die größte Wirkung auf die Loyalität?")}</p>
          {r2.levers.length === 0 ? (
            <p className="text-caption text-ash">{tt("Choose your levers above first; nothing is blocked.", "Wählen Sie zuerst oben Ihre Hebel; nichts ist gesperrt.")}</p>
          ) : (
            <OptionList<LeverId> label={tt("Greatest lever", "Größter Hebel")} value={r2.greatest} onChange={(v) => patch({ greatest: v })} options={r2.levers.map((id) => ({ id, label: LEVER_BY_ID[id].name }))} />
          )}
        </div>
        <TextBox
          id={IDS.greatestWhy}
          label={tt("Why this one?", "Warum dieser?")}
          help={tt("Name the test that decides it and the weakness it removes (customers who know no one, signals nobody owns). At least 40 characters.", "Nennen Sie den Test, der es entscheidet, und die Schwäche, die er beseitigt (Kunden, die niemanden kennen, Signale, die niemand verantwortet). Mindestens 40 Zeichen.")}
          value={r2.greatestWhy}
          onChange={(v) => patch({ greatestWhy: v })}
          min={40}
          rows={3}
        >
          <WritingHelp
            id="greatest-kit"
            refs={[
              ...r2.levers.map((id) => ({ label: tt(`Your total for ${LEVER_BY_ID[id].name}`, `Ihre Summe für ${LEVER_BY_ID[id].name}`), value: `${leverTotal(r2, id) || "—"} / 12`, target: IDS.lever(id) })),
              { label: tt("The rule (Materi B3)", "Die Regel (Materi B3)"), value: tt("the greatest lever acts on the weakness the evidence shows most clearly and holds for every customer", "der größte Hebel wirkt auf die Schwäche, die die Evidenz am deutlichsten zeigt, und gilt für jeden Kunden"), target: "mat-B3" },
            ]}
            steps={[
              tt("Name the lever and the test that decides it (reach, depth, durability, scale).", "Nennen Sie den Hebel und den Test, der entscheidet (Reichweite, Tiefe, Dauerhaftigkeit, Skalierung)."),
              tt("Name the weakness it removes, and why it holds whoever is on duty.", "Nennen Sie die Schwäche, die er beseitigt, und warum er gilt, egal wer Dienst hat."),
            ]}
          />
        </TextBox>
        <ExampleAnswer id="greatest-example" guide={greatestGuide()} />
        {mentor && <MentorGuide guide={greatestGuide()} />}
      </div>
      <BlockMissing block="3.3" route={2} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 3.4 */

const NEXT_LETTER: Record<string, RaciLetter> = { "": "R", R: "A", A: "C", C: "I", I: "-", "-": "R" };

export function Block34() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const cycle = (a: ActivityId, r: RoleId) => patch((s) => ({ raci: { ...s.raci, [`${a}.${r}`]: NEXT_LETTER[s.raci[`${a}.${r}`] ?? ""] }, raciFlags: s.raciFlags.filter((x) => x !== a), raciResult: null }));
  const check = () => patch((s) => ({ checks: s.checks + 1, raciResult: raciHolds(s), raciFlags: raciRowFlags(s), raciClue: false }));
  const letterName = (l: RaciLetter) => (l === "-" ? tt("empty (no role)", "leer (keine Rolle)") : l);
  return (
    <AnswerBlock
      id="block-3-4"
      title={tt("Block 3.4 · Sales, service and marketing: who does what", "Block 3.4 · Vertrieb, Service und Marketing: wer macht was")}
      kind="OBJECTIVE"
      core={false}
      minutes={BLOCK_MINUTES["3.4"]}
      findIt={tt("Route 2 → Task 2 → the grid below: four activities, four roles. Answer by setting every cell.", "Route 2 → Task 2 → das Raster unten: vier Aktivitäten, vier Rollen. Antworten Sie, indem Sie jede Zelle setzen.")}
    >
      <MaterialRefs refs={["B4"]} />
      <p className="text-body text-ink">
        <Gloss>{tt("Click a cell to cycle through R, A, C, I and empty (–). Every activity needs exactly one A and at least one R or A who does the work.", "Klicken Sie auf eine Zelle, um zwischen R, A, C, I und leer (–) zu wechseln. Jede Aktivität braucht genau ein A und mindestens ein R oder A, das die Arbeit macht.")}</Gloss>
      </p>
      <RevealHint id="raci-tests" label={tt("Show the test questions", "Testfragen zeigen")} title={tt("RACI tests and role profiles · taught in Materi B4", "RACI-Tests und Rollenprofile · aus Materi B4")}>
        <div className="space-y-2 text-caption text-ink">
          <ul className="space-y-1">
            <li>
              <strong>R</strong> · {tt("Who does the work?", "Wer macht die Arbeit?")}
            </li>
            <li>
              <strong>A</strong> · {tt("Who answers for the result and has the authority to decide? Put A at the level with that authority, and only one per activity.", "Wer verantwortet das Ergebnis und hat die Befugnis zu entscheiden? A dorthin, wo diese Befugnis liegt, und nur eines pro Aktivität.")}
            </li>
            <li>
              <strong>C</strong> · {tt("Whose knowledge is needed before the work is done? (asked before)", "Wessen Wissen wird gebraucht, bevor die Arbeit getan wird? (vorher gefragt)")}
            </li>
            <li>
              <strong>I</strong> · {tt("Who only needs to know afterwards? (told after)", "Wer muss es nur hinterher wissen? (nachher informiert)")}
            </li>
            <li>
              <strong>–</strong> · {tt("A role with nothing to do or know here stays empty.", "Eine Rolle, die hier nichts tun oder wissen muss, bleibt leer.")}
            </li>
          </ul>
          <p className="smallcaps text-ash">{tt("The four roles", "Die vier Rollen")}</p>
          <ul className="space-y-1">
            {ROLE_IDS.map((r) => (
              <li key={r}>
                <span className="font-semibold">{RACI_ROLES[r].name}. </span>
                {RACI_ROLES[r].profile}
              </li>
            ))}
          </ul>
          <MaterialRefs refs={["B4"]} lead={tt("Taught in", "Gelehrt in")} />
        </div>
      </RevealHint>
      <div id={IDS.raci} className="relative overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[36rem] border-collapse text-caption">
          <caption className="sr-only">{tt("Responsibility grid", "Verantwortungsraster")}</caption>
          <thead>
            <tr className="bg-mist text-left text-micro uppercase text-ash">
              <th className="px-3 py-2">{tt("Activity", "Aktivität")}</th>
              {ROLE_IDS.map((r) => (
                <th key={r} className="px-2 py-2 text-center">
                  {RACI_ROLES[r].name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ACTIVITY_IDS.map((a) => {
              const rowFlag = r2.raciFlags.includes(a);
              return (
                <tr key={a} id={IDS.raciRow(a)} className={clsx("border-t border-line", rowFlag && "is-flagged")}>
                  <td className="px-3 py-2 font-semibold">{ACTIVITIES[a].name}</td>
                  {ROLE_IDS.map((r) => {
                    const v = r2.raci[`${a}.${r}`];
                    return (
                      <td key={r} className="px-2 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => cycle(a, r)}
                          className={clsx("btn-ghost btn-sm min-h-[40px] min-w-[3rem]", !v && "border-dashed text-ash")}
                          aria-label={tt(`${ACTIVITIES[a].name}, ${RACI_ROLES[r].name}: ${v ? letterName(v) : "not set"}. Click to change.`, `${ACTIVITIES[a].name}, ${RACI_ROLES[r].name}: ${v ? letterName(v) : "nicht gesetzt"}. Klicken zum Ändern.`)}
                        >
                          {v ? (v === "-" ? "–" : v) : "?"}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-caption text-ash">{tt(`Letters: ${RACI_LETTERS.filter((l) => l !== "-").join(", ")} and – for empty.`, `Buchstaben: ${RACI_LETTERS.filter((l) => l !== "-").join(", ")} und – für leer.`)}</p>
      <CheckBar onCheck={check} checkLabel={tt("Check my grid", "Mein Raster prüfen")} checks={r2.checks} clueShown={r2.raciClue} onClue={() => patch({ raciClue: true })} />
      {r2.raciResult && (
        <Reading>
          {tt(`${r2.raciResult.holds} of ${r2.raciResult.total} cells hold. A check never says which. `, `${r2.raciResult.holds} von ${r2.raciResult.total} Zellen stimmen. Eine Prüfung sagt nie, welche. `)}
          {r2.raciFlags.length > 0
            ? tt(`${r2.raciFlags.length} row${r2.raciFlags.length === 1 ? " breaks" : "s break"} the structure rule (exactly one A, someone doing the work) and ${r2.raciFlags.length === 1 ? "is" : "are"} outlined.`, `${r2.raciFlags.length} ${r2.raciFlags.length === 1 ? "Zeile bricht" : "Zeilen brechen"} die Strukturregel (genau ein A, jemand macht die Arbeit) und ${r2.raciFlags.length === 1 ? "ist" : "sind"} markiert.`)
            : ""}
          {r2.raciClue ? tt(" Clue: for each row, ask who has the authority to decide it. Does it sit inside one team, or does it cut across all three?", " Hinweis: Fragen Sie für jede Zeile, wer die Befugnis hat, sie zu entscheiden. Liegt sie in einem Team, oder geht sie über alle drei?") : ""}
        </Reading>
      )}
      <AnswerKey block={raciKey()} />
      <BlockMissing block="3.4" route={2} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 3.5 */

const RESULT_LABEL = (a: ArchItem) =>
  a.result === "coverage"
    ? tt("its trigger counts a share of customers (coverage)", "sein Trigger zählt einen Anteil der Kunden (Abdeckung)")
    : a.result === "deal"
      ? tt("its trigger counts deals moved forward", "sein Trigger zählt weitergekommene Deals")
      : tt("its trigger counts customers moved to 5 of 5", "sein Trigger zählt Kunden, die auf 5 von 5 steigen");
const GROUP_LABEL = (a: ArchItem) => (a.group === "all" ? tt("every team (internal)", "alle Teams (intern)") : GROUPS[a.group].name);

/** The sentence skeleton "Use this number" starts a trigger with: the learner's own number and month, the metric and action left open. */
const triggerSkeleton = (a: ArchItem, n: number, month: number | null) => {
  const m = month ?? "…";
  if (a.result === "coverage") return tt(`If fewer than ${n}% of customers have … by month ${m}, then …`, `Haben bis Monat ${m} weniger als ${n} % der Kunden …, dann …`);
  if (a.result === "deal") return tt(`If fewer than ${n} stalled deals have moved forward by month ${m}, then …`, `Sind bis Monat ${m} weniger als ${n} stockende Deals weitergekommen, dann …`);
  return tt(`If fewer than ${n} customers … rate us 5 of 5 by month ${m}, then …`, `Bewerten uns bis Monat ${m} weniger als ${n} Kunden … mit 5 von 5, dann …`);
};

export function Block35() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const mentor = useStore((s) => s.mentorUnlocked);
  const f = funded(r2);
  const over = archOver(r2);
  const rules = seqRules(r2);
  const solo = onePersonFunded(r2);
  const setItem = (id: ArchId, p: Partial<{ alloc: boolean; start: number | null; owner: OwnerId | null; trigger: string }>) =>
    patch((s) => ({
      alloc: p.alloc !== undefined ? { ...s.alloc, [id]: p.alloc } : s.alloc,
      start: p.start !== undefined ? { ...s.start, [id]: p.start } : p.alloc === false ? { ...s.start, [id]: null } : s.start,
      owner: p.owner !== undefined ? { ...s.owner, [id]: p.owner } : s.owner,
      trigger: p.trigger !== undefined ? { ...s.trigger, [id]: p.trigger } : s.trigger,
      seqResult: null,
      calcFlags: p.start !== undefined || p.alloc !== undefined ? [] : s.calcFlags,
    }));
  const check = () =>
    patch((s) => {
      const r = seqRules(s);
      return { checks: s.checks + 1, seqResult: { holds: Number(r.baseline) + Number(r.budget) + Number(r.system), total: 3 }, seqClue: false };
    });
  const base = r2.start[BASELINE_ITEM];
  const others = f.filter((id) => id !== BASELINE_ITEM);
  const firstOther = others.length ? Math.min(...others.map((id) => r2.start[id] ?? 99)) : null;
  const notFunded = ARCH_IDS.filter((id) => !r2.alloc[id]);
  const pickupItem = (r2.calc["pickup.item"] as ArchId) || null;
  return (
    <AnswerBlock
      id="block-3-5"
      title={tt("Block 3.5 · The implementation architecture: fund, sequence, own", "Block 3.5 · Die Umsetzungsarchitektur: finanzieren, ordnen, verantworten")}
      kind="OBJECTIVE + JUDGED"
      core
      minutes={BLOCK_MINUTES["3.5"]}
      findIt={tt(`Route 2 → Task 2 → the eight items below and “NetSolutions today” in the case brief. The budget is ${euro(R2_BUDGET)} over ${R2_MONTHS} months. Answer in the item cards.`, `Route 2 → Task 2 → die acht Punkte unten und „NetSolutions heute“ im Fall. Das Budget beträgt ${euro(R2_BUDGET)} über ${R2_MONTHS} Monate. Antworten Sie in den Karten der Punkte.`)}
    >
      <MaterialRefs refs={["B5", "B6"]} />
      <div className="flex flex-wrap items-start gap-2">
        <RevealHint id="owner-help" label={tt("Show the owner test", "Owner-Test zeigen")} title={tt("The tests · taught in Materi B5 and B6", "Die Tests · aus Materi B5 und B6")}>
          <div className="space-y-2 text-caption text-ink">
            <ul className="list-disc space-y-1 pl-5">
              <li>{tt("Owner: who can change it without asking anyone else?", "Owner: Wer kann es ändern, ohne jemanden zu fragen?")}</li>
              <li>{tt("Start: does something have to exist before it, such as the shared customer view?", "Start: Muss vorher etwas existieren, etwa die gemeinsame Kundensicht?")}</li>
              <li>{tt("System: would it still work if one person left?", "System: Würde es noch wirken, wenn eine Person ginge?")}</li>
              <li>{tt("Trigger: a metric, a number worked out by the item's method, the month it can first be read, and an action.", "Trigger: eine Kennzahl, eine mit der Methode des Punkts berechnete Zahl, der Monat, in dem er zuerst gelesen werden kann, und eine Aktion.")}</li>
            </ul>
            <p className="smallcaps text-ash">{tt("What each role can change", "Was jede Rolle ändern kann")}</p>
            <ul className="space-y-1">
              {OWNER_IDS.map((o) => (
                <li key={o}>
                  <span className="font-semibold">{OWNERS[o].name}. </span>
                  {OWNERS[o].profile}
                </li>
              ))}
            </ul>
            <MaterialRefs refs={["B5", "B6"]} lead={tt("Taught in", "Gelehrt in")} />
          </div>
        </RevealHint>
      </div>
      <p className="text-body text-ink">
        <Gloss>
          {tt(
            "Fund the items you will carry out. For each funded item choose the month it starts, one owner who can change it without asking anyone else, and a trigger: a metric, a number, a month and an action. The number and the month are worked out, not guessed: each item card says what its trigger counts, and “Show the method” under the trigger calculates both from the printed figures (Materi B6). Leave out what does not fit, on purpose, and fund nothing that rests on one person.",
            "Finanzieren Sie die Punkte, die Sie umsetzen. Wählen Sie für jeden finanzierten Punkt den Startmonat, einen Owner, der ihn ändern kann, ohne jemanden zu fragen, und einen Trigger: eine Kennzahl, eine Zahl, einen Monat und eine Aktion. Zahl und Monat werden berechnet, nicht geschätzt: Jede Karte sagt, was ihr Trigger zählt, und „Methode zeigen“ unter dem Trigger berechnet beide aus den gedruckten Zahlen (Materi B6). Lassen Sie weg, was nicht passt, bewusst, und finanzieren Sie nichts, das an einer Person hängt.",
          )}
        </Gloss>
      </p>
      <div id={IDS.archTotal} className="space-y-2">
        <BudgetBar items={f.map((id) => ({ id, short: ARCH_BY_ID[id].name.split(" ")[0], cost: ARCH_BY_ID[id].cost }))} budget={R2_BUDGET} title={tt(`Funded items against the ${euro(R2_BUDGET)} budget`, `Finanzierte Punkte gegen das Budget von ${euro(R2_BUDGET)}`)} />
        <p className="text-caption text-ash" aria-live="polite">
          {tt(`Funded ${euro(archCost(r2))} of ${euro(R2_BUDGET)}. `, `Finanziert ${euro(archCost(r2))} von ${euro(R2_BUDGET)}. `)}
          {over > 0
            ? tt(`${euro(over)} over. A hint, not a lock: if you keep it, say in the fields below why the extra spend is worth it; the memo prints the amount over.`, `${euro(over)} darüber. Ein Hinweis, keine Sperre: Wenn Sie dabei bleiben, sagen Sie in den Feldern unten, warum die Mehrausgabe sich lohnt; das Memo nennt den Betrag darüber.`)
            : tt(`${euro(archLeft(r2))} left.`, `${euro(archLeft(r2))} übrig.`)}
        </p>
      </div>
      {ARCH.map((a) => {
        const on = !!r2.alloc[a.id];
        const start = r2.start[a.id] ?? null;
        const month = start != null ? triggerMonth(start, a.id) : null;
        const tref = (): HelpRef[] => {
          const own: HelpRef[] = [
            { label: tt("Cost of this item", "Kosten dieses Punkts"), value: euro(a.cost), target: IDS.arch(a.id) },
            { label: tt("Weeks to be in use", "Wochen bis zum Einsatz"), value: tt(`${a.weeks} weeks`, `${a.weeks} Wochen`), target: IDS.arch(a.id) },
            { label: tt("Response shows after", "Reaktion sichtbar nach"), value: tt(`${a.respond} month${a.respond === 1 ? "" : "s"}`, `${a.respond} ${a.respond === 1 ? "Monat" : "Monaten"}`), target: IDS.arch(a.id) },
            { label: tt("Your start month", "Ihr Startmonat"), value: start != null ? String(start) : tt("not chosen yet", "noch nicht gewählt"), target: `start-${a.id}` },
          ];
          const fig =
            a.result === "coverage"
              ? [figRef("openDeals"), figRef("customers")]
              : a.result === "deal"
                ? [figRef("dealGP"), figRef("stalled")]
                : [figRef("kept"), figRef("years")];
          return [...own, ...fig];
        };
        return (
          <div key={a.id} id={IDS.arch(a.id)} className={clsx("space-y-3 rounded-lg border p-3.5", on ? "border-line bg-paper" : "border-dashed border-ash/60 bg-mist/40")}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-ink">
                {a.name}{" "}
                <span className="font-normal text-ash">
                  · {euro(a.cost)} · {tt(`${a.weeks} weeks to be in use`, `${a.weeks} Wochen bis zum Einsatz`)} · {tt(`response shows after ${a.respond} month${a.respond === 1 ? "" : "s"}`, `Reaktion sichtbar nach ${a.respond} ${a.respond === 1 ? "Monat" : "Monaten"}`)}
                </span>
              </p>
              <button type="button" aria-pressed={on} onClick={() => setItem(a.id, { alloc: !on })} className={clsx("btn btn-sm min-h-[40px] border", on ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash")}>
                {on ? tt("☑ Funded", "☑ Finanziert") : tt("☐ Not funded", "☐ Nicht finanziert")}
              </button>
            </div>
            <p className="text-caption text-ash">
              {a.what} {tt("Spends on:", "Gibt aus für:")} {GROUP_LABEL(a)} · {RESULT_LABEL(a)}.
            </p>
            {on && (
              <>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label htmlFor={`start-${a.id}`} className="smallcaps block">
                      {tt("Starts in month", "Startet in Monat")}
                    </label>
                    <select id={`start-${a.id}`} className="field mt-1 max-w-[10rem]" value={r2.start[a.id] ?? ""} onChange={(e) => setItem(a.id, { start: e.target.value ? Number(e.target.value) : null })}>
                      <option value="">{tt("Choose…", "Wählen…")}</option>
                      {MONTHS_LIST.map((m) => (
                        <option key={m} value={m}>
                          {tt(`Month ${m}`, `Monat ${m}`)}
                        </option>
                      ))}
                    </select>
                    {month != null && (
                      <p className={clsx("mt-1 text-micro normal-case tracking-normal", month > R2_MONTHS ? "text-rust" : "text-ash")}>
                        {month > R2_MONTHS
                          ? tt(`Its trigger could first be read in month ${month}, after the plan ends. Start earlier, or say why it may wait.`, `Sein Trigger ließe sich erst in Monat ${month} lesen, nach Ende des Plans. Starten Sie früher, oder sagen Sie, warum er warten darf.`)
                          : tt(`Its trigger can first be read in month ${month}.`, `Sein Trigger lässt sich zuerst in Monat ${month} lesen.`)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor={`owner-${a.id}`} className="smallcaps block">
                      {tt("Owner (who can change it without asking anyone else)", "Owner (wer es ändern kann, ohne jemanden zu fragen)")}
                    </label>
                    <select id={`owner-${a.id}`} className="field mt-1" value={r2.owner[a.id] ?? ""} onChange={(e) => setItem(a.id, { owner: (e.target.value || null) as OwnerId | null })}>
                      <option value="">{tt("Choose an owner…", "Owner wählen…")}</option>
                      {OWNER_IDS.map((o) => (
                        <option key={o} value={o}>
                          {OWNERS[o].name}
                        </option>
                      ))}
                    </select>
                    {r2.owner[a.id] && <p className="mt-1 text-micro normal-case tracking-normal text-ash">{OWNERS[r2.owner[a.id]!].profile}</p>}
                  </div>
                </div>
                <TextBox
                  id={`${IDS.arch(a.id)}-trigger`}
                  label={tt("Trigger", "Trigger")}
                  help={tt("If [metric] is [worse than your number] by [your month], then [action]. The number comes from the item's method, the month from your start month (Materi B6). At least 20 characters, with a number.", "Wenn [Kennzahl] bis [Ihr Monat] [schlechter als Ihre Zahl] ist, dann [Aktion]. Die Zahl kommt aus der Methode des Punkts, der Monat aus Ihrem Startmonat (Materi B6). Mindestens 20 Zeichen, mit einer Zahl.")}
                  value={r2.trigger[a.id] ?? ""}
                  onChange={(v) => setItem(a.id, { trigger: v })}
                  min={20}
                  rows={2}
                >
                  <div className="flex flex-wrap items-start gap-2">
                    <WritingHelp
                      id={`trigger-kit-${a.id}`}
                      refs={tref()}
                      steps={[
                        tt(`Pick the metric: ${a.result === "coverage" ? "the share of customers with a complete record" : a.result === "deal" ? "stalled deals that moved forward" : "customers this item reached who now rate you 5 of 5"}.`, `Wählen Sie die Kennzahl: ${a.result === "coverage" ? "den Anteil der Kunden mit vollständigem Datensatz" : a.result === "deal" ? "stockende Deals, die weiterkamen" : "Kunden, die dieser Punkt erreicht hat und die Sie jetzt mit 5 von 5 bewerten"}.`),
                        tt("Work out the number with the item's method (“Show the method”).", "Berechnen Sie die Zahl mit der Methode des Punkts („Methode zeigen“)."),
                        tt("Work out the month: your start month + months of set-up + months until the response shows.", "Berechnen Sie den Monat: Ihr Startmonat + Monate Einrichtung + Monate, bis die Reaktion sichtbar ist."),
                        tt("Name one action the owner can take alone if the number is missed.", "Nennen Sie eine Aktion, die der Owner allein ergreifen kann, wenn die Zahl verfehlt wird."),
                      ]}
                    />
                    <MethodHelp
                      id={`trigger-method-${a.id}`}
                      formula={[
                        a.result === "coverage"
                          ? tt("Coverage share: customers the next step needs ÷ all customers × 100, rounded up.", "Abdeckungsanteil: Kunden, die der nächste Schritt braucht ÷ alle Kunden × 100, aufgerundet.")
                          : a.result === "deal"
                            ? tt("Payback count in deals: item cost ÷ gross profit of one deal, rounded up.", "Payback-Zähler in Deals: Kosten des Punkts ÷ Rohertrag eines Deals, aufgerundet.")
                            : tt("Payback count in customers: item cost ÷ (gross profit kept a year per customer moved × contract years), rounded up.", "Payback-Zähler in Kunden: Kosten des Punkts ÷ (gehaltener Rohertrag pro Jahr je Kunde × Vertragsjahre), aufgerundet."),
                        tt("The month: your start month + weeks to be in use ÷ 4 (rounded up) + months until the response shows. No later than month 6.", "Der Monat: Ihr Startmonat + Wochen bis zum Einsatz ÷ 4 (aufgerundet) + Monate, bis die Reaktion sichtbar ist. Nicht später als Monat 6."),
                      ]}
                      calcs={[
                        {
                          key: `trig-${a.id}`,
                          title: tt("The number", "Die Zahl"),
                          useLabel: tt("my trigger", "meinen Trigger"),
                          onUse: (n) => setItem(a.id, { trigger: (r2.trigger[a.id] ?? "").trim() ? `${(r2.trigger[a.id] ?? "").trim()} (${n})` : triggerSkeleton(a, n, month) }),
                        },
                        { key: `month-${a.id}`, title: tt("The month", "Der Monat") },
                      ]}
                    />
                  </div>
                </TextBox>
                <ExampleAnswer id={`trigger-example-${a.id}`} guide={triggerGuide(a.id)} />
                {mentor && <MentorGuide guide={triggerGuide(a.id)} />}
              </>
            )}
          </div>
        );
      })}

      <div className="space-y-1 rounded-lg border border-line bg-mist/50 p-3 text-caption text-ink" aria-live="polite">
        <p className="smallcaps">{tt("What your plan means", "Was Ihr Plan bedeutet")}</p>
        {f.length === 0 && <p>{tt("Nothing is funded yet.", "Noch nichts ist finanziert.")}</p>}
        {f.length > 0 && !rules.hasBaseline && <p>{tt("The shared customer view is not funded, so no team sees the signals the others logged, and no trigger in the plan can be read.", "Die gemeinsame Kundensicht ist nicht finanziert, also sieht kein Team die Signale, die die anderen erfasst haben, und kein Trigger im Plan lässt sich ablesen.")}</p>}
        {rules.hasBaseline && base != null && firstOther !== null && base > firstOther && <p>{tt(`The first item starts in month ${firstOther}, before the shared view in month ${base}: its first weeks run without the record they depend on.`, `Der erste Punkt startet in Monat ${firstOther}, vor der gemeinsamen Sicht in Monat ${base}: Seine ersten Wochen laufen ohne den Datensatz, von dem er abhängt.`)}</p>}
        {rules.hasBaseline && base != null && firstOther !== null && base <= firstOther && <p>{tt(`The shared view starts in month ${base}, no later than the first other item (month ${firstOther}), so every team works from the same record from the start.`, `Die gemeinsame Sicht startet in Monat ${base}, nicht später als der erste andere Punkt (Monat ${firstOther}), also arbeitet jedes Team von Anfang an mit demselben Datensatz.`)}</p>}
        {solo.length > 0 && <p>{tt(`Funded on one person: ${solo.map((id) => ARCH_BY_ID[id].name).join(", ")}. That part of the plan leaves when the person does.`, `An einer Person finanziert: ${solo.map((id) => ARCH_BY_ID[id].name).join(", ")}. Dieser Teil des Plans geht, wenn die Person geht.`)}</p>}
        {over > 0 && <p>{tt(`The funded items are ${euro(over)} over the budget. That is your call to make; the memo prints it as a fact.`, `Die finanzierten Punkte liegen ${euro(over)} über dem Budget. Das ist Ihre Entscheidung; das Memo nennt es als Tatsache.`)}</p>}
      </div>

      {notFunded.length > 0 && (
        <div className="space-y-3 border-t border-line pt-3">
          <TextBox
            id={IDS.postponed}
            label={tt("What you leave out, and why", "Was Sie weglassen, und warum")}
            help={tt("Name the item and say why it is the one that goes: the budget, it rests on people, or the weakest case. At least 30 characters.", "Nennen Sie den Punkt und sagen Sie, warum gerade er wegfällt: das Budget, er hängt an Personen, oder die schwächste Begründung. Mindestens 30 Zeichen.")}
            value={r2.postponed}
            onChange={(v) => patch({ postponed: v })}
            min={MIN_LINE}
            rows={3}
          >
            <WritingHelp
              id="postponed-help"
              steps={[
                tt("Name the item you leave out, with its cost.", "Nennen Sie den Punkt, den Sie weglassen, mit seinen Kosten."),
                tt("Say what the funded items cost and what adding it would have pushed the total to (the budget bar shows both).", "Sagen Sie, was die finanzierten Punkte kosten und auf welche Summe er den Plan gebracht hätte (der Budgetbalken zeigt beides)."),
                tt("Say why this one: does it rest on people, or does it act on no emotional factor?", "Sagen Sie, warum gerade dieser: Hängt er an Personen, oder wirkt er auf keinen emotionalen Faktor?"),
              ]}
              refs={[
                { label: tt("Budget", "Budget"), value: euro(R2_BUDGET), target: IDS.archTotal },
                { label: tt("Your funded items cost", "Ihre finanzierten Punkte kosten"), value: euro(archCost(r2)), target: IDS.archTotal },
                ...notFunded.map((id) => ({ label: tt(`Not funded: ${ARCH_BY_ID[id].name}`, `Nicht finanziert: ${ARCH_BY_ID[id].name}`), value: euro(ARCH_BY_ID[id].cost), target: IDS.arch(id) })),
              ]}
            />
          </TextBox>
          <ExampleAnswer id="postponed-example" guide={postponedGuide()} />
          <div id={IDS.pickup} className="space-y-2">
            <div>
              <label htmlFor="pickup-item" className="smallcaps block">
                {tt("The item your pickup point is for", "Der Punkt, für den Ihr Pickup Point gilt")}
              </label>
              <select
                id="pickup-item"
                className="field mt-1 max-w-md"
                value={pickupItem ?? ""}
                onChange={(e) => patch((s) => ({ calc: { ...s.calc, "pickup.item": e.target.value }, calcFlags: s.calcFlags.filter((x) => !x.startsWith("pickup.")) }))}
              >
                <option value="">{tt("Choose an item you left out…", "Einen weggelassenen Punkt wählen…")}</option>
                {notFunded.map((id) => (
                  <option key={id} value={id}>
                    {ARCH_BY_ID[id].name} · {euro(ARCH_BY_ID[id].cost)}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-micro normal-case tracking-normal text-ash">{tt("Only for the calculator below; it is not exported.", "Nur für den Rechner unten; es wird nicht exportiert.")}</p>
            </div>
            <TextBox
              id={`${IDS.pickup}-text`}
              label={tt("The pickup point", "Der Pickup Point")}
              help={tt("If [number] customers leave for the reason this item would fix by [month], we fund it. The number is the cost of waiting (Materi B6). At least 15 characters, with a number.", "Wenn bis [Monat] [Zahl] Kunden aus dem Grund gehen, den dieser Punkt beheben würde, finanzieren wir ihn. Die Zahl sind die Kosten des Wartens (Materi B6). Mindestens 15 Zeichen, mit einer Zahl.")}
              value={r2.pickup}
              onChange={(v) => patch({ pickup: v })}
              min={15}
              rows={2}
            >
              <div className="flex flex-wrap items-start gap-2">
                <WritingHelp
                  id="pickup-kit"
                  refs={[
                    ...(pickupItem ? [{ label: tt(`Cost of ${ARCH_BY_ID[pickupItem].name}`, `Kosten von ${ARCH_BY_ID[pickupItem].name}`), value: euro(ARCH_BY_ID[pickupItem].cost), target: IDS.arch(pickupItem) }] : []),
                    figRef("gpCust"),
                    figRef("satisfied"),
                    { label: tt("The plan's last month", "Der letzte Monat des Plans"), value: String(R2_MONTHS), target: "task-2" },
                  ]}
                  steps={[
                    tt("Choose the item the pickup point is for (above).", "Wählen Sie den Punkt, für den der Pickup Point gilt (oben)."),
                    tt("Divide its cost by the gross profit a year one customer takes when they leave; round up.", "Teilen Sie seine Kosten durch den Rohertrag pro Jahr, den ein Kunde mitnimmt, wenn er geht; aufrunden."),
                    tt("Say which leavers count (the reason the item would fix) and the month you look, no later than month 6.", "Sagen Sie, welche Abgänge zählen (der Grund, den der Punkt beheben würde), und den Monat, in dem Sie schauen, nicht später als Monat 6."),
                  ]}
                />
                <MethodHelp
                  id="pickup-method"
                  formula={[tt("Cost of waiting: cost of the item left out ÷ gross profit lost when one customer leaves (contract × margin), rounded up.", "Kosten des Wartens: Kosten des weggelassenen Punkts ÷ verlorener Rohertrag, wenn ein Kunde geht (Vertrag × Marge), aufgerundet.")]}
                  calcs={[
                    {
                      key: "pickup",
                      title: tt("The number of customers", "Die Zahl der Kunden"),
                      useLabel: tt("my pickup point", "meinen Pickup Point"),
                      onUse: (n) => patch((s) => ({ pickup: s.pickup.trim() ? `${s.pickup.trim()} (${n})` : tt(`If ${n} or more customers leave because … by month ${R2_MONTHS}, we fund …`, `Gehen bis Monat ${R2_MONTHS} ${n} oder mehr Kunden, weil …, finanzieren wir …`) })),
                    },
                  ]}
                />
              </div>
            </TextBox>
            <ExampleAnswer id="pickup-example" guide={pickupGuide()} />
          </div>
          {mentor && <MentorGuide guide={postponedGuide()} />}
          {mentor && <MentorGuide guide={pickupGuide()} />}
        </div>
      )}

      <CheckBar onCheck={check} checkLabel={tt("Check my architecture", "Meine Architektur prüfen")} checks={r2.checks} clueShown={r2.seqClue} onClue={() => patch({ seqClue: true })} />
      {r2.seqResult && (
        <Reading>
          {tt(`${r2.seqResult.holds} of ${r2.seqResult.total} rules hold (the shared view starts no later than the first other item, the funded items fit the budget, nothing funded rests on one person).`, `${r2.seqResult.holds} von ${r2.seqResult.total} Regeln stimmen (die gemeinsame Sicht startet nicht später als der erste andere Punkt, die finanzierten Punkte passen ins Budget, nichts Finanziertes hängt an einer Person).`)}
          {r2.seqClue ? tt(" Clue: which item do all the others read from? And which item would stop working if one person left?", " Hinweis: Aus welchem Punkt lesen alle anderen? Und welcher Punkt würde aufhören zu wirken, wenn eine Person ginge?") : ""}
        </Reading>
      )}
      <AnswerKey block={ownerKey(f)} />
      <BlockMissing block="3.5" route={2} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 3.6 */

/** The groups the learner's own plan serves, in the order an assumption is written for them (CLAUDE.md #41). */
function planGroups(r2: R2State) {
  const f = funded(r2);
  const spend = (g: GroupId) => f.filter((id) => ARCH_BY_ID[id].group === g);
  return GROUP_IDS.map((g) => {
    const items = spend(g);
    const role: "funded" | "standard" | "outside" = items.length > 0 ? "funded" : g === "dissatisfied" ? "outside" : "standard";
    return { g, items, cost: items.reduce((s, id) => s + ARCH_BY_ID[id].cost, 0), role };
  });
}

export function Block36() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const mentor = useStore((s) => s.mentorUnlocked);
  const k = r2.tripKpi ? KPIS.find((x) => x.id === r2.tripKpi)! : null;
  const flags = tripFlagsOf(r2);
  const check = () => patch((s) => ({ checks: s.checks + 1, decisionFlagged: s.decision === "wait", tripFlags: tripFlagsOf(s) }));
  const unit = (x: (typeof KPIS)[number]) => (x.unit === "%" ? tt("%", " %") : ` ${x.unit}`);
  const groups = planGroups(r2);
  const served = groups.filter((x) => x.role !== "outside");
  const f = funded(r2);
  const custItems = customerItems(f);
  const tripMonthHint = custItems.length && custItems.every((id) => r2.start[id] != null) ? Math.min(R2_MONTHS, Math.max(...custItems.map((id) => triggerMonth(r2.start[id]!, id)))) : null;
  const roleLabel = (r: "funded" | "standard" | "outside") => (r === "funded" ? tt("your plan spends here", "Ihr Plan gibt hier aus") : r === "standard" ? tt("left on the standard offer", "beim Standardangebot belassen") : tt("outside this plan", "außerhalb dieses Plans"));
  return (
    <AnswerBlock
      id="block-3-6"
      title={tt("Block 3.6 · Make the system decision despite incomplete information", "Block 3.6 · Die Systementscheidung trotz unvollständiger Information treffen")}
      kind="OBJECTIVE + JUDGED"
      core
      minutes={BLOCK_MINUTES["3.6"]}
      findIt={tt("Route 2 → Task 2 → your own answers in Blocks 3.2 and 3.5, “NetSolutions today” in the case brief, the group table and the baselines below, and the decision rules in Materi B5 and B6. Answer in the fields below.", "Route 2 → Task 2 → Ihre eigenen Antworten in den Blöcken 3.2 und 3.5, „NetSolutions heute“ im Fall, die Gruppentabelle und die Ausgangswerte unten und die Entscheidungsregeln in Materi B5 und B6. Antworten Sie in den Feldern unten.")}
    >
      <MaterialRefs refs={["B5", "B6"]} />
      <div id={IDS.decision} className={clsx("space-y-2 rounded-lg p-1", r2.decisionFlagged && "is-flagged")}>
        <p className="font-semibold text-ink">{tt("Your decision", "Ihre Entscheidung")}</p>
        <p className="text-caption text-ash">{tt("The brief asks you to decide on the system although the customer data is incomplete. Choose one.", "Der Auftrag verlangt, dass Sie über das System entscheiden, obwohl die Kundendaten unvollständig sind. Wählen Sie eine.")}</p>
        <OptionList<DecisionId> label={tt("Decision", "Entscheidung")} value={r2.decision} onChange={(v) => patch({ decision: v, decisionFlagged: false })} options={DECISIONS.map((d) => ({ id: d.id, label: d.label, sub: d.detail }))} />
        {r2.decisionFlagged && (
          <p className="text-caption text-ink">
            <span className="smallcaps mr-1 text-accent">{tt("Clue", "Hinweis")}</span>
            {tt("Does waiting give the board the system decision it asked for, and what happens to every signal in the six months of waiting? Read the first decision rule of Materi B5.", "Gibt Warten dem Vorstand die Systementscheidung, um die er gebeten hat, und was passiert mit jedem Signal in den sechs Monaten des Wartens? Lesen Sie die erste Entscheidungsregel aus Materi B5.")}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <p className="font-semibold text-ink">{tt("Three assumptions your decision rests on", "Drei Annahmen, auf denen Ihre Entscheidung beruht")}</p>
        <p className="text-body text-ink">
          <Gloss>
            {tt(
              "An assumption has two sentences (Materi B5). “I assume …” about one customer group: its clue is the group's data-confidence note below, tied to what your plan bets there. “I am wrong if … by …”: a number you can watch yourself, compared with today's figure. Write one for each group your plan spends on and one for the group you leave on the standard offer.",
              "Eine Annahme hat zwei Sätze (Materi B5). „Ich nehme an, …“ über eine Kundengruppe: Ihr Hinweis ist die Notiz zum Datenvertrauen der Gruppe unten, verbunden mit dem, worauf Ihr Plan dort setzt. „Ich liege falsch, wenn … bis …“: eine Zahl, die Sie selbst beobachten können, verglichen mit dem heutigen Wert. Schreiben Sie eine für jede Gruppe, für die Ihr Plan ausgibt, und eine für die Gruppe, die Sie beim Standardangebot lassen.",
            )}
          </Gloss>
        </p>
        <div className="relative overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[40rem] border-collapse text-caption">
            <caption className="bg-mist px-3 py-2 text-left text-micro font-semibold uppercase text-ash">{tt("NetSolutions' customer groups · data confidence and your plan (Case assumption)", "Kundengruppen von NetSolutions · Datenvertrauen und Ihr Plan (Fallannahme)")}</caption>
            <thead>
              <tr className="text-left text-micro uppercase text-ash">
                <th className="px-3 py-2">{tt("Group", "Gruppe")}</th>
                <th className="px-3 py-2 text-right">{tt("Customers", "Kunden")}</th>
                <th className="px-3 py-2 text-right">{tt("Yearly churn", "Jährl. Churn")}</th>
                <th className="px-3 py-2">{tt("Data confidence", "Datenvertrauen")}</th>
                <th className="px-3 py-2">{tt("Your plan", "Ihr Plan")}</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((x) => (
                <tr key={x.g} id={groupRowId(x.g)} className="border-t border-line align-top">
                  <td className="px-3 py-2 font-semibold">{GROUPS[x.g].name}</td>
                  <td className="tnum px-3 py-2 text-right">{GROUP_SIZE[x.g]}</td>
                  <td className="tnum px-3 py-2 text-right">{GROUP_CHURN[x.g] == null ? "—" : pct(GROUP_CHURN[x.g]!)}</td>
                  <td className="px-3 py-2">
                    <span className="font-semibold">{GROUPS[x.g].confidence}.</span> <span className="text-ash">{GROUPS[x.g].confidenceWhy}</span>
                  </td>
                  <td className="px-3 py-2">
                    {roleLabel(x.role)}
                    {x.items.length > 0 && (
                      <span className="text-ash">
                        : {x.items.map((id) => ARCH_BY_ID[id].name).join(", ")} · {euro(x.cost)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {r2.assumptions.map((a, i) => {
          const sg = served[i];
          const refs: HelpRef[] = sg
            ? [
                { label: tt(`Suggested group for this assumption`, `Vorgeschlagene Gruppe für diese Annahme`), value: `${GROUPS[sg.g].name} · ${roleLabel(sg.role)}`, target: groupRowId(sg.g) },
                { label: tt("Its data confidence", "Ihr Datenvertrauen"), value: `${GROUPS[sg.g].confidence}: ${GROUPS[sg.g].confidenceWhy}`, target: groupRowId(sg.g) },
                ...(sg.role === "funded" ? [{ label: tt("What your plan bets there", "Worauf Ihr Plan dort setzt"), value: `${sg.items.map((id) => ARCH_BY_ID[id].name).join(", ")} · ${euro(sg.cost)}`, target: groupRowId(sg.g) }] : []),
                ...(sg.g === "satisfied" ? [figRef("delighted")] : sg.g === "deals" ? [figRef("stalled"), figRef("dealGP")] : sg.g === "delighted" ? [figRef("delighted"), figRef("churnDel")] : []),
              ]
            : [{ label: tt("The group table", "Die Gruppentabelle"), value: tt("choose a group your plan serves", "wählen Sie eine Gruppe, die Ihr Plan bedient"), target: groupRowId("satisfied") }];
          const signHint =
            sg?.g === "satisfied"
              ? tt("For a funded group that should move to 5 of 5, the sign uses the same number as your tripwire (below).", "Für eine finanzierte Gruppe, die auf 5 von 5 steigen soll, nutzt das Anzeichen dieselbe Zahl wie Ihr Tripwire (unten).")
              : sg?.g === "deals"
                ? tt("For the open-deal group, the sign uses the same number and month as your playbook trigger in Block 3.5.", "Für die Gruppe mit offenen Deals nutzt das Anzeichen dieselbe Zahl und denselben Monat wie Ihr Playbook-Trigger in Block 3.5.")
                : tt("For a group left on the standard offer, the sign is one customer more than the leavers expected in six months (“Show the method”).", "Für eine Gruppe beim Standardangebot ist das Anzeichen ein Kunde mehr als die in sechs Monaten erwarteten Abgänge („Methode zeigen“).");
          return (
            <div key={i} className="space-y-1.5">
              <TextBox
                id={IDS.assumption(i)}
                label={tt(`Assumption ${i + 1}${sg ? ` · ${GROUPS[sg.g].name}` : ""}`, `Annahme ${i + 1}${sg ? ` · ${GROUPS[sg.g].name}` : ""}`)}
                help={tt("Two sentences: “I assume … [the group, what your plan bets there, what the data cannot yet tell]. I am wrong if … [a number you can watch] by [month] (today …).” At least 30 characters.", "Zwei Sätze: „Ich nehme an, … [die Gruppe, worauf Ihr Plan dort setzt, was die Daten noch nicht sagen]. Ich liege falsch, wenn … [eine Zahl, die Sie beobachten können] bis [Monat] (heute …).“ Mindestens 30 Zeichen.")}
                value={a}
                onChange={(v) => patch((s) => ({ assumptions: s.assumptions.map((x, j) => (j === i ? v : x)) }))}
                min={MIN_LINE}
                rows={3}
              >
                <div className="flex flex-wrap items-start gap-2">
                  <WritingHelp
                    id={`assumption-kit-${i}`}
                    label={tt("Show how to build an assumption", "Zeigen, wie man eine Annahme baut")}
                    refs={refs}
                    steps={[
                      tt("Sentence 1: name the group, what your plan bets there (or that it gets nothing extra), and what the data-confidence note says is still unsure.", "Satz 1: Nennen Sie die Gruppe, worauf Ihr Plan dort setzt (oder dass sie nichts extra bekommt), und was laut Notiz zum Datenvertrauen noch unsicher ist."),
                      tt("Sentence 2: “I am wrong if …”: a count or rate you can read in your own CRM, a number worked out by a method, today's figure, and the month.", "Satz 2: „Ich liege falsch, wenn …“: eine Zahl oder Quote aus Ihrem eigenen CRM, eine mit einer Methode berechnete Zahl, der heutige Wert und der Monat."),
                      signHint,
                      tt("Never a market estimate: it does not move inside your plan.", "Nie eine Marktschätzung: Sie bewegt sich in Ihrem Plan nicht."),
                    ]}
                  />
                  {sg?.role === "standard" && (
                    <MethodHelp
                      id={`assumption-method-${i}`}
                      card="B6"
                      formula={[tt("Expected leavers = customers × yearly churn × months ÷ 12. You are wrong at the first whole customer above that.", "Erwartete Abgänge = Kunden × jährlicher Churn × Monate ÷ 12. Sie liegen falsch beim ersten ganzen Kunden darüber.")]}
                      calcs={[{ key: "stay", title: tt("The count that proves you wrong", "Die Zahl, die Sie widerlegt") }]}
                    />
                  )}
                </div>
              </TextBox>
              <ExampleAnswer id={`assumption-${i}-example`} guide={assumptionGuide(i)} />
              {mentor && <MentorGuide guide={assumptionGuide(i)} />}
            </div>
          );
        })}
      </div>

      <div id={IDS.trip} className="space-y-3 rounded-lg border border-line bg-paper p-3.5">
        <p className="font-semibold text-ink">{tt("The tripwire", "Der Tripwire")}</p>
        <p className="text-caption text-ash">
          {tt("A metric of how customers behave, a threshold that beats today's baseline by the step your spending needs (today plus a step, Materi B6), the month your last customer item can first be read, and an action agreed now. ", "Eine Kennzahl dafür, wie Kunden sich verhalten, ein Schwellenwert, der die heutige Baseline um den Schritt übertrifft, den Ihre Ausgaben brauchen (heute plus ein Schritt, Materi B6), der Monat, in dem Ihr letzter Kundenpunkt zuerst gelesen werden kann, und eine jetzt vereinbarte Aktion. ")}
          {R2_BASELINE_NOTE.v}
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className={clsx(flags.includes("kpi") && r2.tripFlags.includes("kpi") && "is-flagged p-1")}>
            <label htmlFor="trip-kpi" className="smallcaps block">
              {tt("Metric", "Kennzahl")}
            </label>
            <select id="trip-kpi" className="field mt-1" value={r2.tripKpi ?? ""} onChange={(e) => patch({ tripKpi: (e.target.value || null) as KpiId | null, tripFlags: [] })}>
              <option value="">{tt("Choose a metric…", "Kennzahl wählen…")}</option>
              {KPIS.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.label} ({tt("today", "heute")}: {num(x.baseline)}
                  {unit(x)})
                </option>
              ))}
            </select>
            {flags.includes("kpi") && r2.tripFlags.includes("kpi") && (
              <p className="mt-1 text-micro normal-case tracking-normal text-ink">
                <span className="font-semibold text-accent">{tt("Clue. ", "Hinweis. ")}</span>
                {tt("Does this metric measure how customers feel or behave, or how much NetSolutions itself did?", "Misst diese Kennzahl, wie Kunden empfinden oder sich verhalten, oder wie viel NetSolutions selbst getan hat?")}
              </p>
            )}
          </div>
          <div className={clsx(flags.includes("threshold") && r2.tripFlags.includes("threshold") && "is-flagged p-1")}>
            <label htmlFor="trip-threshold" className="smallcaps block">
              {tt("Threshold", "Schwellenwert")}
              {k ? tt(` (${k.unit}; better is ${k.better === "up" ? "higher" : "lower"})`, ` (${k.unit}; besser ist ${k.better === "up" ? "höher" : "niedriger"})`) : ""}
            </label>
            <input id="trip-threshold" className="field tnum mt-1" inputMode="decimal" value={r2.tripThreshold} onChange={(e) => patch({ tripThreshold: e.target.value, tripFlags: [] })} />
            {flags.includes("threshold") && r2.tripFlags.includes("threshold") && k && (
              <p className="mt-1 text-micro normal-case tracking-normal text-ink">
                <span className="font-semibold text-accent">{tt("Clue. ", "Hinweis. ")}</span>
                {tt(`Compare it with today's figure, ${num(k.baseline)}${unit(k)}. Would reaching it show a real change?`, `Vergleichen Sie ihn mit dem heutigen Wert, ${num(k.baseline)}${unit(k)}. Würde das Erreichen eine echte Veränderung zeigen?`)}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="trip-month" className="smallcaps block">
              {tt("By month", "Bis Monat")}
            </label>
            <select id="trip-month" className="field mt-1 max-w-[10rem]" value={r2.tripMonth ?? ""} onChange={(e) => patch({ tripMonth: e.target.value ? Number(e.target.value) : null })}>
              <option value="">{tt("Choose…", "Wählen…")}</option>
              {MONTHS_LIST.map((m) => (
                <option key={m} value={m}>
                  {tt(`Month ${m}`, `Monat ${m}`)}
                </option>
              ))}
            </select>
            <p className="mt-1 text-micro normal-case tracking-normal text-ash">
              {tripMonthHint != null
                ? tt(`Your latest customer item can first be read in month ${tripMonthHint} (from your start months in Block 3.5).`, `Ihr letzter Kundenpunkt lässt sich zuerst in Monat ${tripMonthHint} lesen (aus Ihren Startmonaten in Block 3.5).`)
                : tt("Set start months for your funded customer items in Block 3.5 to see the month they can first be read.", "Setzen Sie in Block 3.5 Startmonate für Ihre finanzierten Kundenpunkte, um den Monat zu sehen, in dem sie zuerst gelesen werden können.")}
            </p>
          </div>
          <div>
            <label htmlFor="trip-action" className="smallcaps block">
              {tt("If it is missed", "Wenn er verfehlt wird")}
            </label>
            <select id="trip-action" className="field mt-1" value={r2.tripAction} onChange={(e) => patch({ tripAction: e.target.value as "" | "scale" | "adjust" | "stop" })}>
              <option value="">{tt("Choose an action…", "Aktion wählen…")}</option>
              <option value="adjust">{tt("Adjust one item and continue", "Einen Punkt anpassen und weitermachen")}</option>
              <option value="stop">{tt("Stop the rollout and reconsider the system", "Den Rollout stoppen und das System überdenken")}</option>
              <option value="scale">{tt("Scale up anyway", "Trotzdem ausweiten")}</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap items-start gap-2">
          <WritingHelp
            id="trip-kit"
            refs={[
              figRef("delighted"),
              { label: tt("Your funded items that move customers", "Ihre finanzierten Punkte, die Kunden bewegen"), value: custItems.length ? `${custItems.map((id) => ARCH_BY_ID[id].name).join(", ")} · ${euro(custItems.reduce((s, id) => s + ARCH_BY_ID[id].cost, 0))}` : tt("none yet", "noch keine"), target: IDS.archTotal },
              figRef("kept"),
              figRef("years"),
              { label: tt("Latest month your customer items can be read", "Letzter Monat, in dem Ihre Kundenpunkte gelesen werden können"), value: tripMonthHint != null ? String(tripMonthHint) : "—", target: IDS.archTotal },
            ]}
            steps={[
              tt("Choose a metric of customer behaviour, not of your own activity.", "Wählen Sie eine Kennzahl für Kundenverhalten, nicht für Ihre eigene Aktivität."),
              tt("Threshold = today's delighted customers + the payback count of your funded customer items (“Show the method”).", "Schwellenwert = heutige begeisterte Kunden + der Payback-Zähler Ihrer finanzierten Kundenpunkte („Methode zeigen“)."),
              tt("Month = the latest month your customer items can first be read, never after month 6.", "Monat = der letzte Monat, in dem Ihre Kundenpunkte zuerst gelesen werden können, nie nach Monat 6."),
              tt("Agree now what you do if it is missed: change one item, not the whole system.", "Vereinbaren Sie jetzt, was Sie tun, wenn er verfehlt wird: einen Punkt ändern, nicht das ganze System."),
            ]}
          />
          <MethodHelp
            id="trip-method"
            formula={[tt("Today plus a step: delighted customers today + (cost of your funded items that move customers ÷ (gross profit kept a year per customer moved × contract years)), the step rounded up.", "Heute plus ein Schritt: begeisterte Kunden heute + (Kosten Ihrer finanzierten Punkte, die Kunden bewegen ÷ (gehaltener Rohertrag pro Jahr je Kunde × Vertragsjahre)), der Schritt aufgerundet.")]}
            calcs={[{ key: "trip", title: tt("The threshold", "Der Schwellenwert"), useLabel: tt("the threshold", "den Schwellenwert"), onUse: (n) => patch({ tripThreshold: String(n), tripFlags: [] }) }]}
          />
        </div>
        {mentor && <MentorGuide guide={tripGuide()} />}
      </div>

      <div className="space-y-2">
        <div id="board-challenge" className="rounded-lg border border-gold bg-accentSoft p-3.5 text-caption text-ink">
          <p className="smallcaps text-accent">{tt("The board's challenge", "Die Frage des Vorstands")}</p>
          <p className="mt-1">
            <Gloss>{BOARD_CHALLENGE.v}</Gloss>
          </p>
        </div>
        <TextBox
          id={IDS.challenge}
          label={tt("What do you do?", "Was tun Sie?")}
          help={tt("Say what you check first, what you keep, and the one thing you change. Put a number on what the two losses cost and compare it with what the proposal would cost. At least 60 characters.", "Sagen Sie, was Sie zuerst prüfen, was Sie behalten und was Sie als Einziges ändern. Beziffern Sie, was die zwei Verluste kosten, und vergleichen Sie es mit den Kosten des Vorschlags. Mindestens 60 Zeichen.")}
          value={r2.challenge}
          onChange={(v) => patch({ challenge: v })}
          min={60}
          rows={4}
        >
          <div className="flex flex-wrap items-start gap-2">
            <WritingHelp
              id="challenge-help"
              refs={[
                { label: tt("Customers who announce they will leave", "Kunden, die ihren Abgang ankündigen"), value: String(CHALLENGE_LOST), target: "board-challenge" },
                figRef("gpCust"),
                { label: tt(`Cost of ${ARCH_BY_ID.stars.name}`, `Kosten von ${ARCH_BY_ID.stars.name}`), value: euro(ARCH_BY_ID.stars.cost), target: IDS.arch("stars") },
                { label: tt("Your tripwire", "Ihr Tripwire"), value: r2.tripKpi && r2.tripThreshold ? `${r2.tripThreshold}${k ? unit(k) : ""}${r2.tripMonth ? tt(` by month ${r2.tripMonth}`, ` bis Monat ${r2.tripMonth}`) : ""}` : tt("not set yet", "noch nicht gesetzt"), target: IDS.trip },
              ]}
              steps={[
                tt("Check the two cases first: did the playbook log any signal from them, and was it answered in time?", "Prüfen Sie zuerst die beiden Fälle: Hat das Playbook ein Signal von ihnen erfasst, und wurde es rechtzeitig beantwortet?"),
                tt("Put a number on the loss (customers lost × gross profit per customer) and compare it with what the proposal costs.", "Beziffern Sie den Verlust (verlorene Kunden × Rohertrag pro Kunde) und vergleichen Sie ihn mit den Kosten des Vorschlags."),
                tt("Say what still holds: two customers are two cases; your tripwire measures all of them, in its own month (Materi B5).", "Sagen Sie, was noch gilt: Zwei Kunden sind zwei Fälle; Ihr Tripwire misst alle, in seinem eigenen Monat (Materi B5)."),
                tt("Change one thing, not the system, and say why moving money to one person's visits repeats the old weakness.", "Ändern Sie eine Sache, nicht das System, und sagen Sie, warum Geld für die Besuche einer Person die alte Schwäche wiederholt."),
              ]}
            />
            <MethodHelp
              id="challenge-method"
              formula={[tt("What the losses cost a year: customers lost × gross profit a year per customer (contract × margin).", "Was die Verluste pro Jahr kosten: verlorene Kunden × Rohertrag pro Kunde und Jahr (Vertrag × Marge).")]}
              calcs={[{ key: "loss", title: tt("What the two losses cost a year", "Was die zwei Verluste pro Jahr kosten"), unit: "€" }]}
            />
          </div>
        </TextBox>
        <ExampleAnswer id="challenge-example" guide={challengeGuide()} />
        {mentor && <MentorGuide guide={challengeGuide()} />}
      </div>

      <CheckBar onCheck={check} checkLabel={tt("Check my decision", "Meine Entscheidung prüfen")} checks={r2.checks} />
      {r2.checks > 0 && (r2.decisionFlagged || r2.tripFlags.length > 0) && (
        <Reading>
          {r2.decisionFlagged ? tt("Your decision is outlined.", "Ihre Entscheidung ist markiert.") : ""}
          {r2.tripFlags.length > 0 ? tt(` ${r2.tripFlags.length} part${r2.tripFlags.length === 1 ? "" : "s"} of the tripwire ${r2.tripFlags.length === 1 ? "is" : "are"} outlined.`, ` ${r2.tripFlags.length} ${r2.tripFlags.length === 1 ? "Teil" : "Teile"} des Tripwires ${r2.tripFlags.length === 1 ? "ist" : "sind"} markiert.`) : ""}
        </Reading>
      )}
      <AnswerKey block={decisionKey()} />
      <AnswerKey block={tripKey()} />
      <BlockMissing block="3.6" route={2} />
    </AnswerBlock>
  );
}
