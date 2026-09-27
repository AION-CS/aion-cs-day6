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
import {
  ACTIVITIES,
  ACTIVITY_IDS,
  ARCH,
  ARCH_BY_ID,
  ARCH_IDS,
  BASELINE_ITEM,
  BOARD_CHALLENGE,
  COST_SHAPE_LABEL,
  CRITERIA,
  CRIT_IDS,
  DECISIONS,
  DEPENDS_LABEL,
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
} from "@/data/route2";
import type { ActivityId, ArchId, Criterion, DecisionId, KpiId, LeverId, OwnerId, PrincipleId, RaciLetter, RoleId, TimeId } from "@/data/route2";
import { RESPONSES, SIGNALS, SIGNAL_IDS, TEAMS, TEAM_IDS } from "@/data/signals";
import type { ResponseId, SignalType, TeamId } from "@/data/signals";
import { archCost, archLeft, archOver, funded, leverTotal, onePersonFunded, principlesHold, processHolds, raciHolds, raciRowFlags, ratingFlags, seqRules, systemicCount, tripFlagsOf } from "@/lib/checks";
import { scrollToAndFlash } from "@/lib/flash";
import { Gloss } from "@/lib/glossify";
import { euro, num, tt } from "@/lib/lang";
import { IDS } from "@/lib/missing";
import { assumptionGuide, challengeGuide, greatestGuide, postponedGuide, principleTextGuide, processNoteGuide, triggerGuide } from "@/lib/mentorGuide";
import { decisionKey, leverKey, ownerKey, principleKey, processKey, raciKey, tripKey } from "@/lib/answerKey";
import { MIN_LINE } from "@/lib/progress";
import { BLOCK_MINUTES } from "@/lib/routes";
import { useStore } from "@/store/useStore";
import type { Score } from "@/store/useStore";

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
            help={tt(`One or two sentences: what changes for NetSolutions' customers or teams, and which weakness from Route 1 it answers. At least ${MIN_LINE} characters.`, `Ein oder zwei Sätze: was sich für Kunden oder Teams von NetSolutions ändert, und welche Schwäche aus Route 1 es beantwortet. Mindestens ${MIN_LINE} Zeichen.`)}
            value={r2.principleText[c] ?? ""}
            onChange={(v) => patch((s) => ({ principleText: { ...s.principleText, [c]: v } }))}
            min={MIN_LINE}
            rows={2}
          />
          {mentor && <MentorGuide guide={principleTextGuide(c)} />}
        </div>
      ))}
      <CheckBar onCheck={check} checkLabel={tt("Check my principles", "Meine Prinzipien prüfen")} checks={r2.checks} />
      <AnswerKey block={principleKey()} />
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
      minutes={BLOCK_MINUTES["3.2"]}
      findIt={tt("Route 2 → Task 2 → one row per signal type below, and the response curve in Materi B2. Answer in the four rows.", "Route 2 → Task 2 → eine Zeile pro Signalart unten, und die Reaktionskurve in Materi B2. Antworten Sie in den vier Zeilen.")}
    >
      <MaterialRefs refs={["B2"]} />
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
            />
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
          help={tt("Name the test that decides it and the weakness from Route 1 it removes. At least 40 characters.", "Nennen Sie den Test, der es entscheidet, und die Schwäche aus Route 1, die er beseitigt. Mindestens 40 Zeichen.")}
          value={r2.greatestWhy}
          onChange={(v) => patch({ greatestWhy: v })}
          min={40}
          rows={3}
        />
        {mentor && <MentorGuide guide={greatestGuide()} />}
      </div>
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
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 3.5 */

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
    }));
  const check = () =>
    patch((s) => {
      const r = seqRules(s);
      return { checks: s.checks + 1, seqResult: { holds: Number(r.baseline) + Number(r.budget) + Number(r.system), total: 3 }, seqClue: false };
    });
  const base = r2.start[BASELINE_ITEM];
  const others = f.filter((id) => id !== BASELINE_ITEM);
  const firstOther = others.length ? Math.min(...others.map((id) => r2.start[id] ?? 99)) : null;
  const notAllFunded = !ARCH_IDS.every((id) => r2.alloc[id]);
  return (
    <AnswerBlock
      id="block-3-5"
      title={tt("Block 3.5 · The implementation architecture: fund, sequence, own", "Block 3.5 · Die Umsetzungsarchitektur: finanzieren, ordnen, verantworten")}
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["3.5"]}
      findIt={tt(`Route 2 → Task 2 → the eight items below. The budget is ${euro(R2_BUDGET)} over ${R2_MONTHS} months. Answer in the item cards.`, `Route 2 → Task 2 → die acht Punkte unten. Das Budget beträgt ${euro(R2_BUDGET)} über ${R2_MONTHS} Monate. Antworten Sie in den Karten der Punkte.`)}
    >
      <MaterialRefs refs={["B5"]} />
      <div className="flex flex-wrap items-start gap-2">
        <RevealHint id="owner-help" label={tt("Show the owner test", "Owner-Test zeigen")} title={tt("The tests · taught in Materi B5", "Die Tests · aus Materi B5")}>
          <div className="space-y-2 text-caption text-ink">
            <ul className="list-disc space-y-1 pl-5">
              <li>{tt("Owner: who can change it without asking anyone else?", "Owner: Wer kann es ändern, ohne jemanden zu fragen?")}</li>
              <li>{tt("Start: does something have to exist before it, such as the shared customer view?", "Start: Muss vorher etwas existieren, etwa die gemeinsame Kundensicht?")}</li>
              <li>{tt("System: would it still work if one person left?", "System: Würde es noch wirken, wenn eine Person ginge?")}</li>
              <li>{tt("Trigger: does it have a metric, a number, a date and an action?", "Trigger: Hat er eine Kennzahl, eine Zahl, ein Datum und eine Aktion?")}</li>
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
            <MaterialRefs refs={["B5"]} lead={tt("Taught in", "Gelehrt in")} />
          </div>
        </RevealHint>
      </div>
      <p className="text-body text-ink">
        <Gloss>
          {tt(
            "Fund the items you will carry out inside the budget. For each funded item choose the month it starts, one owner who can change it without asking anyone else, and a trigger: a number, a date and an action. Leave out what does not fit, on purpose, and fund nothing that rests on one person.",
            "Finanzieren Sie die Punkte, die Sie innerhalb des Budgets umsetzen. Wählen Sie für jeden finanzierten Punkt den Startmonat, einen Owner, der ihn ändern kann, ohne jemanden zu fragen, und einen Trigger: eine Zahl, ein Datum und eine Aktion. Lassen Sie weg, was nicht passt, bewusst, und finanzieren Sie nichts, das an einer Person hängt.",
          )}
        </Gloss>
      </p>
      <div id={IDS.archTotal} className="space-y-2">
        <BudgetBar items={f.map((id) => ({ id, short: ARCH_BY_ID[id].name.split(" ")[0], cost: ARCH_BY_ID[id].cost }))} budget={R2_BUDGET} title={tt(`Funded items against the ${euro(R2_BUDGET)} budget`, `Finanzierte Punkte gegen das Budget von ${euro(R2_BUDGET)}`)} />
        <p className="text-caption text-ash" aria-live="polite">
          {tt(`Funded ${euro(archCost(r2))} of ${euro(R2_BUDGET)}. `, `Finanziert ${euro(archCost(r2))} von ${euro(R2_BUDGET)}. `)}
          {over > 0 ? tt(`${euro(over)} over: leave out the item with the weakest case, do not trim every item a little.`, `${euro(over)} darüber: Lassen Sie den Punkt mit der schwächsten Begründung weg, kürzen Sie nicht jeden ein bisschen.`) : tt(`${euro(archLeft(r2))} left.`, `${euro(archLeft(r2))} übrig.`)}
        </p>
      </div>
      {ARCH.map((a) => {
        const on = !!r2.alloc[a.id];
        return (
          <div key={a.id} id={IDS.arch(a.id)} className={clsx("space-y-3 rounded-lg border p-3.5", on ? "border-line bg-paper" : "border-dashed border-ash/60 bg-mist/40")}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-ink">
                {a.name} <span className="font-normal text-ash">· {euro(a.cost)} · {tt(`${a.weeks} weeks to be in use`, `${a.weeks} Wochen bis zum Einsatz`)}</span>
              </p>
              <button type="button" aria-pressed={on} onClick={() => setItem(a.id, { alloc: !on })} className={clsx("btn btn-sm min-h-[40px] border", on ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash")}>
                {on ? tt("☑ Funded", "☑ Finanziert") : tt("☐ Not funded", "☐ Nicht finanziert")}
              </button>
            </div>
            <p className="text-caption text-ash">{a.what}</p>
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
                  help={tt("If [metric] is [worse than a number] by [month], then [action]. At least 20 characters, with a number.", "Wenn [Kennzahl] bis [Monat] [schlechter als eine Zahl] ist, dann [Aktion]. Mindestens 20 Zeichen, mit einer Zahl.")}
                  value={r2.trigger[a.id] ?? ""}
                  onChange={(v) => setItem(a.id, { trigger: v })}
                  min={20}
                  rows={2}
                />
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
        {over > 0 && <p>{tt(`The funded items are ${euro(over)} over the budget.`, `Die finanzierten Punkte liegen ${euro(over)} über dem Budget.`)}</p>}
      </div>

      {notAllFunded && (
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
                tt("Name the item you leave out.", "Nennen Sie den Punkt, den Sie weglassen."),
                tt("Say what it would have cost and what that would have pushed the total to.", "Sagen Sie, was er gekostet hätte und auf welche Summe das den Plan gebracht hätte."),
                tt("Say why this one: does it rest on people, or does it act on no emotional factor?", "Sagen Sie, warum gerade dieser: Hängt er an Personen, oder wirkt er auf keinen emotionalen Faktor?"),
              ]}
              refs={[{ label: tt("Budget", "Budget"), value: euro(R2_BUDGET), target: IDS.archTotal }]}
            />
          </TextBox>
          <TextBox
            id={IDS.pickup}
            label={tt("The pickup point", "Der Pickup Point")}
            help={tt("The number and the date at which you look at it again: if [metric] is [number] by [month], we revisit it. At least 15 characters, with a number.", "Die Zahl und das Datum, zu dem Sie es wieder ansehen: Wenn [Kennzahl] bis [Monat] [Zahl] ist, prüfen wir es neu. Mindestens 15 Zeichen, mit einer Zahl.")}
            value={r2.pickup}
            onChange={(v) => patch({ pickup: v })}
            min={15}
            rows={2}
          />
          {mentor && <MentorGuide guide={postponedGuide()} />}
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
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 3.6 */

export function Block36() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const mentor = useStore((s) => s.mentorUnlocked);
  const k = r2.tripKpi ? KPIS.find((x) => x.id === r2.tripKpi)! : null;
  const flags = tripFlagsOf(r2);
  const check = () => patch((s) => ({ checks: s.checks + 1, decisionFlagged: s.decision === "wait", tripFlags: tripFlagsOf(s) }));
  const unit = (x: (typeof KPIS)[number]) => (x.unit === "%" ? tt("%", " %") : ` ${x.unit}`);
  return (
    <AnswerBlock
      id="block-3-6"
      title={tt("Block 3.6 · Make the system decision despite incomplete information", "Block 3.6 · Die Systementscheidung trotz unvollständiger Information treffen")}
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["3.6"]}
      findIt={tt("Route 2 → Task 2 → your own answers in Blocks 3.1 to 3.5, the baselines below, and the decision rules in Materi B5. Answer in the fields below.", "Route 2 → Task 2 → Ihre eigenen Antworten in den Blöcken 3.1 bis 3.5, die Ausgangswerte unten und die Entscheidungsregeln in Materi B5. Antworten Sie in den Feldern unten.")}
    >
      <MaterialRefs refs={["B5"]} />
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
        {r2.assumptions.map((a, i) => (
          <div key={i} className="space-y-1.5">
            <TextBox
              id={IDS.assumption(i)}
              label={tt(`Assumption ${i + 1}`, `Annahme ${i + 1}`)}
              help={tt("What you assume about customers or teams, and the sign that would show you are wrong (a number or something you could see, and when). At least 30 characters.", "Was Sie über Kunden oder Teams annehmen, und das Anzeichen, das zeigen würde, dass Sie falsch liegen (eine Zahl oder etwas Sichtbares, und wann). Mindestens 30 Zeichen.")}
              value={a}
              onChange={(v) => patch((s) => ({ assumptions: s.assumptions.map((x, j) => (j === i ? v : x)) }))}
              min={MIN_LINE}
              rows={2}
            />
            {mentor && <MentorGuide guide={assumptionGuide(i)} />}
          </div>
        ))}
      </div>

      <div id={IDS.trip} className="space-y-3 rounded-lg border border-line bg-paper p-3.5">
        <p className="font-semibold text-ink">{tt("The tripwire", "Der Tripwire")}</p>
        <p className="text-caption text-ash">
          {tt("A metric of how customers behave, a threshold better than today's baseline, a month and an action agreed now. ", "Eine Kennzahl dafür, wie Kunden sich verhalten, ein Schwellenwert besser als die heutige Baseline, ein Monat und eine jetzt vereinbarte Aktion. ")}
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
          </div>
          <div>
            <label htmlFor="trip-action" className="smallcaps block">
              {tt("If it is missed", "Wenn er verfehlt wird")}
            </label>
            <select id="trip-action" className="field mt-1" value={r2.tripAction} onChange={(e) => patch({ tripAction: e.target.value as "" | "scale" | "adjust" | "stop" })}>
              <option value="">{tt("Choose an action…", "Aktion wählen…")}</option>
              <option value="adjust">{tt("Adjust one lever and continue", "Einen Hebel anpassen und weitermachen")}</option>
              <option value="stop">{tt("Stop the rollout and reconsider the system", "Den Rollout stoppen und das System überdenken")}</option>
              <option value="scale">{tt("Scale up anyway", "Trotzdem ausweiten")}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="rounded-lg border border-gold bg-accentSoft p-3.5 text-caption text-ink">
          <p className="smallcaps text-accent">{tt("The board's challenge", "Die Frage des Vorstands")}</p>
          <p className="mt-1">
            <Gloss>{BOARD_CHALLENGE.v}</Gloss>
          </p>
        </div>
        <TextBox
          id={IDS.challenge}
          label={tt("What do you do?", "Was tun Sie?")}
          help={tt("Say what you check first, what you keep, and the one thing you change. At least 60 characters.", "Sagen Sie, was Sie zuerst prüfen, was Sie behalten und was Sie als Einziges ändern. Mindestens 60 Zeichen.")}
          value={r2.challenge}
          onChange={(v) => patch({ challenge: v })}
          min={60}
          rows={4}
        >
          <WritingHelp
            id="challenge-help"
            steps={[
              tt("Check the two cases first: did the playbook log any signal from them, and was it answered in time?", "Prüfen Sie zuerst die beiden Fälle: Hat das Playbook ein Signal von ihnen erfasst, und wurde es rechtzeitig beantwortet?"),
              tt("Say what still holds: two customers are two cases; the tripwire measures all of them (Materi B5).", "Sagen Sie, was noch gilt: Zwei Kunden sind zwei Fälle; der Tripwire misst alle (Materi B5)."),
              tt("Change one thing, not the system, and say why moving money to one person's visits repeats the old weakness.", "Ändern Sie eine Sache, nicht das System, und sagen Sie, warum Geld für die Besuche einer Person die alte Schwäche wiederholt."),
            ]}
          />
        </TextBox>
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
    </AnswerBlock>
  );
}
