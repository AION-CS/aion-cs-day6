"use client";

import clsx from "clsx";
import { AnswerBlock } from "@/components/ui/AnswerBlock";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { BudgetBar } from "@/components/ui/BudgetBar";
import { CheckBar, OptionList, Reading, ScorePick, TextBox } from "@/components/ui/Inputs";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MentorGuide } from "@/components/ui/MentorGuide";
import { PlacementBoard } from "@/components/ui/PlacementBoard";
import { RevealHint } from "@/components/ui/RevealHint";
import { WritingHelp } from "@/components/ui/WritingHelp";
import { OBSERVATIONS, OBS_KEY, OUTCOME_LABEL, RESPONSES, SIGNALS, SIGNAL_IDS, SIGNAL_PAIR_TESTS, TEAMS, TEAM_IDS, WEAKNESSES } from "@/data/signals";
import { ExampleAnswer } from "@/components/ui/ExampleAnswer";
import { BlockMissing } from "@/components/ui/BlockMissing";
import { REASONS } from "@/data/reasons";
import type { ObsId, ResponseId, SignalType, TeamId, WeakId } from "@/data/signals";
import { FACTORS, FACTOR_LABEL } from "@/data/approaches";
import type { Factor } from "@/data/approaches";
import { BUDGET, CHOOSE, MEASURES, MEASURE_AREA_LABEL, MEASURE_BY_ID, MONTHS, RUNS_ON_LABEL, SUSTAIN_RULE } from "@/data/measures";
import type { MeasureId } from "@/data/measures";
import { aimsHold, allTagged, coverage, measureScore, measureScored, orderInversions, susHolds, systemHolds, tagHolds, tallyOf, totalCost, weakHolds } from "@/lib/checks";
import { scrollToAndFlash } from "@/lib/flash";
import { Gloss } from "@/lib/glossify";
import { euro, tt } from "@/lib/lang";
import { IDS } from "@/lib/missing";
import { measureKey, orderKey, systemKey, tagKey, weakKey } from "@/lib/answerKey";
import { misreadGuide, scoreGuide, whyGuide } from "@/lib/mentorGuide";
import { MIN_LINE } from "@/lib/progress";
import { BLOCK_MINUTES } from "@/lib/routes";
import { useStore } from "@/store/useStore";
import type { Score } from "@/store/useStore";

/* ------------------------------------------------------------------ Block 2.1 */

export function Block21() {
  const l1 = useStore((s) => s.l1);
  const place = useStore((s) => s.placeTag);
  const undo = useStore((s) => s.undoTags);
  const redo = useStore((s) => s.redoTags);
  const patch = useStore((s) => s.patchL1);
  return (
    <AnswerBlock
      id="block-2-1"
      title={tt("Block 2.1 · Tag the twelve observations with a signal type", "Block 2.1 · Die zwölf Beobachtungen einer Signalart zuordnen")}
      kind="OBJECTIVE"
      core
      minutes={BLOCK_MINUTES["2.1"]}
      findIt={tt("Route 1 → Task 1 → the twelve observations on the board below, from NetSolutions' current deals. Find the phrase that decides each one and answer on the board.", "Route 1 → Task 1 → die zwölf Beobachtungen auf der Tafel unten, aus laufenden Deals von NetSolutions. Finden Sie die Wendung, die jede entscheidet, und antworten Sie auf der Tafel.")}
    >
      <MaterialRefs refs={["A5"]} />
      <PlacementBoard<SignalType>
        items={OBSERVATIONS.map((o) => ({ id: o.id, meta: `${o.deal} · ${o.kind} · ${OUTCOME_LABEL[o.outcome]}`, text: o.text }))}
        bins={SIGNAL_IDS.map((s) => ({ id: s, label: SIGNALS[s].label, hint: SIGNALS[s].means }))}
        binCols={2}
        value={l1.tags}
        onPlace={(id, s) => place(id as ObsId, s)}
        onUndo={undo}
        onRedo={redo}
        undoCount={l1.tagHistory.length}
        redoCount={l1.tagFuture.length}
        domId={IDS.obs}
        keyPhrases={OBS_KEY}
        clues={Object.fromEntries(OBSERVATIONS.map((o) => [o.id, o.clue]))}
        reasons={Object.fromEntries(OBSERVATIONS.map((o) => [o.id, o.why]))}
        result={l1.tagResult}
        checks={l1.tagChecks}
        onCheck={() => patch((s) => ({ checks: s.checks + 1, tagChecks: s.tagChecks + 1, tagResult: tagHolds(s.tags) }))}
        onClue={() => patch({ tagClue: true })}
        clueShown={l1.tagClue}
        reasoningOpened={l1.tagReasoning}
        onOpenReasoning={() => patch({ tagReasoning: true })}
        noun={tt("observation", "Beobachtung")}
        checkLabel={tt("Check my tags", "Meine Zuordnung prüfen")}
        intro={tt("Drag an observation into a signal type, or select it and then select a type. One type per observation.", "Ziehen Sie eine Beobachtung in eine Signalart, oder wählen Sie sie aus und dann eine Art. Eine Art pro Beobachtung.")}
        tests={
          <RevealHint id="tag-tests" label={tt("Show the test questions", "Testfragen zeigen")} title={tt("Test questions · taught in Materi A5", "Testfragen · aus Materi A5")}>
            <div className="space-y-2 text-caption text-ink">
              <ul className="space-y-1.5">
                {SIGNAL_IDS.map((s) => (
                  <li key={s}>
                    <span className="font-semibold">{SIGNALS[s].label}. </span>
                    <Gloss>{SIGNALS[s].test}</Gloss>
                  </li>
                ))}
              </ul>
              <p className="smallcaps text-ash">{tt("When two types seem to fit", "Wenn zwei Arten zu passen scheinen")}</p>
              <ul className="space-y-1.5">
                {SIGNAL_PAIR_TESTS.map((x) => (
                  <li key={x.pair}>
                    <span className="font-semibold">{x.pair} </span>
                    <Gloss>{x.test}</Gloss>
                  </li>
                ))}
              </ul>
              <MaterialRefs refs={["A5"]} lead={tt("Taught in", "Gelehrt in")} />
            </div>
          </RevealHint>
        }
      />
      <AnswerKey block={tagKey()} />
      <BlockMissing block="2.1" route={1} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 2.2 */

export function Block22() {
  const l1 = useStore((s) => s.l1);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  const tally = tallyOf(l1.tags);
  const complete = allTagged(l1.tags);
  const sh = systemHolds(l1);
  const toggleWeak = (id: WeakId) => patch((s) => ({ weak: s.weak.includes(id) ? s.weak.filter((x) => x !== id) : [...s.weak, id], weakResult: null }));
  const setSys = (sig: SignalType, p: Partial<{ response: ResponseId | null; team: TeamId | null }>) => patch((s) => ({ system: { ...s.system, [sig]: { ...s.system[sig], ...p } }, sysResult: null }));
  return (
    <AnswerBlock
      id="block-2-2"
      title={tt("Block 2.2 · Weaknesses and a simple response system", "Block 2.2 · Schwächen und ein einfaches Antwortsystem")}
      kind="OBJECTIVE + JUDGED"
      core={false}
      minutes={BLOCK_MINUTES["2.2"]}
      findIt={tt("Route 1 → Task 1 → “Your tally” below (from your own tags in Block 2.1), the statements in Block 1.1 and the responses in Materi A6. Answer in the fields below.", "Route 1 → Task 1 → „Ihre Auszählung“ unten (aus Ihren eigenen Zuordnungen in Block 2.1), die Aussagen in Block 1.1 und die Antworten in Materi A6. Antworten Sie in den Feldern unten.")}
    >
      <MaterialRefs refs={["A3", "A6"]} />
      <div id="tally-panel" className="space-y-2 rounded-lg border border-line bg-mist/50 p-3">
        <p className="smallcaps">{tt("Your tally · from your tags in Block 2.1", "Ihre Auszählung · aus Ihren Zuordnungen in Block 2.1")}</p>
        {!complete && (
          <p className="text-caption text-ash">
            {tt(`${tally.tagged} of 12 observations are tagged. `, `${tally.tagged} von 12 Beobachtungen sind zugeordnet. `)}
            <button type="button" onClick={() => scrollToAndFlash("block-2-1", "ref", "start")} className="font-semibold text-ink underline decoration-dotted underline-offset-2">
              {tt("Go to Block 2.1", "Zu Block 2.1")}
            </button>
            {tt(". Nothing is blocked.", ". Nichts ist gesperrt.")}
          </p>
        )}
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[22rem] border-collapse text-caption">
            <caption className="sr-only">{tt("Observations and stalled deals per signal type", "Beobachtungen und stockende Deals pro Signalart")}</caption>
            <thead>
              <tr className="text-left text-micro uppercase text-ash">
                <th className="py-1 pr-2">{tt("Signal type", "Signalart")}</th>
                <th className="py-1 pr-2 text-right">{tt("Observations", "Beobachtungen")}</th>
                <th className="py-1 pr-2 text-right">{tt("Of those, stalled", "Davon stockend")}</th>
              </tr>
            </thead>
            <tbody>
              {SIGNAL_IDS.map((s) => (
                <tr key={s} className="border-t border-line">
                  <td className="py-1 pr-2 font-semibold">{SIGNALS[s].label}</td>
                  <td className="tnum py-1 pr-2 text-right">{tally.count[s]}</td>
                  <td className="tnum py-1 pr-2 text-right">{tally.stalled[s]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div id={IDS.weak} className="space-y-2">
        <p className="font-semibold text-ink">{tt("a · What are the weaknesses in NetSolutions' customer retention?", "a · Was sind die Schwächen in der Kundenbindung von NetSolutions?")}</p>
        <p className="text-caption text-ash">{tt("Choose two or more that the evidence (the statements in 1.1, the tally above) actually shows.", "Wählen Sie zwei oder mehr, die die Evidenz (die Aussagen in 1.1, die Auszählung oben) tatsächlich zeigt.")}</p>
        <OptionList<WeakId> multi label={tt("Weaknesses", "Schwächen")} options={WEAKNESSES.map((w) => ({ id: w.id, label: w.label }))} value={l1.weak} onChange={toggleWeak} />
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => patch((s) => ({ checks: s.checks + 1, weakResult: weakHolds(s.weak) }))} className="btn-ghost btn-sm">
            {tt("Check my choices", "Meine Auswahl prüfen")}
          </button>
          {l1.weakResult && (
            <span role="status" className="text-caption text-ink">
              {l1.weakResult.chosen === 0 ? tt("Nothing chosen yet.", "Noch nichts gewählt.") : tt(`${l1.weakResult.holds} of ${l1.weakResult.chosen} chosen are shown by the evidence. The others are things customers praise or never mention.`, `${l1.weakResult.holds} von ${l1.weakResult.chosen} gewählten zeigt die Evidenz. Die anderen sind Dinge, die Kunden loben oder nie erwähnen.`)}
            </span>
          )}
        </div>
        <AnswerKey block={weakKey()} />
      </div>

      <div className="space-y-3 border-t border-line pt-3">
        <p className="font-semibold text-ink">{tt("b · A simple response system: for each signal type, the response and the team that owns it", "b · Ein einfaches Antwortsystem: für jede Signalart die Antwort und das zuständige Team")}</p>
        {SIGNAL_IDS.map((s) => {
          const r = l1.system[s];
          const flagged = !!l1.sysResult && ((!!r.response && !sh.rows[s].response) || (!!r.team && !sh.rows[s].team));
          return (
            <div key={s} id={IDS.system(s)} className={clsx("space-y-2 rounded-lg border border-line bg-paper p-3", flagged && "is-flagged")}>
              <p className="font-semibold text-ink">
                {SIGNALS[s].label} <span className="font-normal text-ash">· {tt(`your tally: ${tally.count[s]}, ${tally.stalled[s]} stalled`, `Ihre Auszählung: ${tally.count[s]}, ${tally.stalled[s]} stockend`)}</span>
              </p>
              <OptionList<ResponseId> label={tt(`Response to ${SIGNALS[s].label}`, `Antwort auf ${SIGNALS[s].label}`)} value={r.response} onChange={(v) => setSys(s, { response: v })} options={RESPONSES.map((x) => ({ id: x.id, label: x.label }))} />
              <div>
                <label htmlFor={`team-${s}`} className="smallcaps block">
                  {tt("Owner team", "Zuständiges Team")}
                </label>
                <select id={`team-${s}`} className="field mt-1 max-w-xs" value={r.team ?? ""} onChange={(e) => setSys(s, { team: (e.target.value || null) as TeamId | null })}>
                  <option value="">{tt("Choose a team…", "Team wählen…")}</option>
                  {TEAM_IDS.map((t) => (
                    <option key={t} value={t}>
                      {TEAMS[t]}
                    </option>
                  ))}
                </select>
              </div>
              {flagged && (
                <p className="text-caption text-ink">
                  <span className="smallcaps mr-1 text-accent">{tt("Clue", "Hinweis")}</span>
                  {tt("Read the test question of this signal type in Materi A5: what is the buyer asking for? Then ask which team can give exactly that.", "Lesen Sie die Testfrage dieser Signalart in Materi A5: Wonach fragt der Käufer? Fragen Sie dann, welches Team genau das geben kann.")}
                </p>
              )}
            </div>
          );
        })}
        <CheckBar onCheck={() => patch((s) => ({ checks: s.checks + 1, sysResult: { holds: systemHolds(s).holds, total: systemHolds(s).total }, sysClue: false }))} checkLabel={tt("Check my system", "Mein System prüfen")} checks={l1.checks} />
        {l1.sysResult && (
          <Reading>
            {tt(`${l1.sysResult.holds} of ${l1.sysResult.total} picks hold (a response and an owner for each signal type). Rows with a pick that does not hold are outlined; each has a clue.`, `${l1.sysResult.holds} von ${l1.sysResult.total} Wahlen stimmen (eine Antwort und ein Owner pro Signalart). Zeilen mit einer nicht stimmenden Wahl sind markiert; jede hat einen Hinweis.`)}
          </Reading>
        )}
        <AnswerKey block={systemKey()} />
        <TextBox
          id={IDS.misread}
          label={tt("The risk of misreading a signal, and the sign you would see", "Das Risiko, ein Signal falsch zu lesen, und das Anzeichen, das Sie sehen würden")}
          help={tt(`Name one signal NetSolutions could misread, what would happen, and what you would notice in the deal. At least ${MIN_LINE} characters.`, `Nennen Sie ein Signal, das NetSolutions falsch lesen könnte, was passieren würde und was Sie im Deal bemerken würden. Mindestens ${MIN_LINE} Zeichen.`)}
          value={l1.misread}
          onChange={(v) => patch({ misread: v })}
          min={MIN_LINE}
          rows={3}
        >
          <WritingHelp
            id="misread-kit"
            refs={[
              { label: tt("Your tally: uncertainty signals, stalled", "Ihre Auszählung: Unsicherheitssignale, stockend"), value: `${tally.count.uncertainty} · ${tally.stalled.uncertainty}`, target: "tally-panel" },
              { label: tt("The pair tests (Materi A5)", "Die Paartests (Materi A5)"), value: SIGNAL_PAIR_TESTS.map((x) => x.pair).join(" "), target: "mat-A5" },
              { label: tt("Reading a signal right or wrong (Materi A6)", "Ein Signal richtig oder falsch lesen (Materi A6)"), value: tt("the response sent against the one needed", "die gesendete gegen die nötige Antwort"), target: "mat-A6" },
            ]}
            steps={[
              tt("Name one signal type and the one it could be mistaken for.", "Nennen Sie eine Signalart und die, mit der sie verwechselt werden könnte."),
              tt("Say what would go wrong (a stall, a lost deal, a discount given away).", "Sagen Sie, was schiefginge (ein Stillstand, ein verlorener Deal, ein verschenkter Rabatt)."),
              tt("Name the sign you would see in the deal.", "Nennen Sie das Anzeichen, das Sie im Deal sehen würden."),
            ]}
          />
        </TextBox>
        <ExampleAnswer id="misread-example" guide={misreadGuide()} />
        {mentor && <MentorGuide guide={misreadGuide()} />}
      </div>
      <BlockMissing block="2.2" route={1} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 2.3 */

export function Block23() {
  const l1 = useStore((s) => s.l1);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  const chosen = l1.chosen;
  const cost = totalCost(chosen);
  const cov = coverage(l1);
  const shown = l1.order.length === chosen.length && chosen.every((id) => l1.order.includes(id)) ? l1.order : chosen;
  const inv = orderInversions({ ...l1, order: shown });
  const toggle = (id: MeasureId) =>
    patch((s) => {
      const next = s.chosen.includes(id) ? s.chosen.filter((x) => x !== id) : [...s.chosen, id];
      return { chosen: next, order: s.order.filter((x) => next.includes(x)), measureFlags: [] };
    });
  const setAims = (id: MeasureId, aims: Factor[]) => patch((s) => ({ aims: { ...s.aims, [id]: aims }, measureFlags: s.measureFlags.filter((f) => f !== `${id}.aims`) }));
  const setScore = (k: "eff" | "sus" | "fea", id: MeasureId, v: Score) => patch((s) => ({ [k]: { ...s[k], [id]: v }, measureFlags: k === "sus" ? s.measureFlags.filter((f) => f !== `${id}.sus`) : s.measureFlags }) as Partial<typeof s>);
  const move = (id: MeasureId, d: -1 | 1) => {
    const list = [...shown];
    const i = list.indexOf(id);
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    patch({ order: list });
  };
  const check = () =>
    patch((s) => {
      const flags: string[] = [];
      for (const id of s.chosen) {
        if (s.aims[id] !== undefined && !aimsHold(id, s.aims[id])) flags.push(`${id}.aims`);
        if (s.sus[id] && !susHolds(id, s.sus[id])) flags.push(`${id}.sus`);
      }
      return { checks: s.checks + 1, measureFlags: flags };
    });
  const nA = l1.measureFlags.filter((f) => f.endsWith(".aims")).length;
  const nS = l1.measureFlags.filter((f) => f.endsWith(".sus")).length;
  return (
    <AnswerBlock
      id="block-2-3"
      title={tt("Block 2.3 · Choose three measures, score them, put them in order", "Block 2.3 · Drei Maßnahmen wählen, bewerten, in eine Reihenfolge bringen")}
      kind="OBJECTIVE + JUDGED"
      core
      minutes={BLOCK_MINUTES["2.3"]}
      findIt={tt(`Route 1 → Task 1 → “The limits” in the case above (${euro(BUDGET)}, ${MONTHS} months) and the nine measures below. Answer by choosing three and filling their cards.`, `Route 1 → Task 1 → „Die Grenzen“ im Fall oben (${euro(BUDGET)}, ${MONTHS} Monate) und die neun Maßnahmen unten. Antworten Sie, indem Sie drei wählen und ihre Karten ausfüllen.`)}
    >
      <MaterialRefs refs={["A7", "A2", "A3"]} />
      <div id={IDS.measurePick} className="space-y-2">
        <p className="text-body text-ink">
          <Gloss>{tt("Choose exactly three of the nine measures. Each says what it does, what it changes for the customer, what it runs on, and, after the weeks, which area it acts on (Materi A3); it does not say which factor it builds. That is your job.", "Wählen Sie genau drei der neun Maßnahmen. Jede sagt, was sie tut, was sie für den Kunden ändert, worauf sie läuft und, hinter den Wochen, auf welchen Bereich sie wirkt (Materi A3); sie sagt nicht, welchen Faktor sie aufbaut. Das ist Ihre Aufgabe.")}</Gloss>
        </p>
        <p className="text-caption text-ash">
          {tt("Customers named three areas in Block 1.1: relationship, communication and added value. Not one of the nine statements mentions price. A measure is worth choosing when it acts on an area customers named and keeps working when people change.", "Kunden nannten in Block 1.1 drei Bereiche: Beziehung, Kommunikation und Mehrwert. Keine der neun Aussagen erwähnt den Preis. Eine Maßnahme lohnt sich, wenn sie auf einen Bereich wirkt, den Kunden nannten, und weiterwirkt, wenn Menschen wechseln.")}
        </p>
        <OptionList<MeasureId>
          multi
          label={tt("Measures", "Maßnahmen")}
          value={chosen}
          onChange={toggle}
          disabledIds={chosen.length >= CHOOSE ? MEASURES.map((m) => m.id) : []}
          onDisabledClick={() => scrollToAndFlash(IDS.measurePick, "warn")}
          options={MEASURES.map((m) => ({ id: m.id, label: tt(`${m.name} · ${euro(m.cost)} · ${m.weeks} ${m.weeks === 1 ? "week" : "weeks"}`, `${m.name} · ${euro(m.cost)} · ${m.weeks} ${m.weeks === 1 ? "Woche" : "Wochen"}`), tag: tt(`Acts on: ${MEASURE_AREA_LABEL[m.area]}`, `Wirkt auf: ${MEASURE_AREA_LABEL[m.area]}`), sub: `${m.what} ${m.mechanism} ${tt("Runs on:", "Läuft auf:")} ${RUNS_ON_LABEL[m.runsOn]}.` }))}
        />
        <p role="status" className="text-caption text-ash">
          {tt(`${chosen.length} of ${CHOOSE} chosen.`, `${chosen.length} von ${CHOOSE} gewählt.`)}
          {chosen.length >= CHOOSE ? tt(" To choose another, first remove one.", " Um eine andere zu wählen, entfernen Sie zuerst eine.") : ""}
        </p>
        <RevealHint id="aims-help" label={tt("Show the test questions", "Testfragen zeigen")} title={tt("How to match a measure to a factor · taught in Materi A2, A3 and A7", "Wie man eine Maßnahme einem Faktor zuordnet · aus Materi A2, A3 und A7")}>
          <div className="space-y-2 text-caption text-ink">
            <ul className="space-y-1.5">
              {FACTORS.map((f) => (
                <li key={f.id}>
                  <span className="font-semibold">{f.label}.</span>
                </li>
              ))}
            </ul>
            <p>{tt("The label after the weeks says which area of Materi A3 a measure acts on. Customers named relationship, communication and added value, never price. A price cut, or more of the same message for everyone, builds none of the three factors.", "Das Etikett hinter den Wochen sagt, auf welchen Bereich aus Materi A3 eine Maßnahme wirkt. Kunden nannten Beziehung, Kommunikation und Mehrwert, nie den Preis. Eine Preissenkung oder mehr derselben Nachricht an alle baut keinen der drei Faktoren auf.")}</p>
            <p>{SUSTAIN_RULE.v}</p>
            <MaterialRefs refs={["A2", "A3", "A7"]} lead={tt("Taught in", "Gelehrt in")} />
          </div>
        </RevealHint>
      </div>
      {chosen.length > 0 && (
        <div className="space-y-3">
          <BudgetBar items={chosen.map((id) => ({ id, short: MEASURE_BY_ID[id].name.split(" ")[0], cost: MEASURE_BY_ID[id].cost }))} budget={BUDGET} title={tt(`Chosen measures against the ${euro(BUDGET)} budget`, `Gewählte Maßnahmen gegen das Budget von ${euro(BUDGET)}`)} />
          <p className="text-caption text-ash">
            {tt(`${chosen.length} measure${chosen.length === 1 ? "" : "s"} cost ${euro(cost)} of ${euro(BUDGET)}.`, `${chosen.length} ${chosen.length === 1 ? "Maßnahme kostet" : "Maßnahmen kosten"} ${euro(cost)} von ${euro(BUDGET)}.`)}
            {cost > BUDGET ? tt(` That is ${euro(cost - BUDGET)} over. A hint, not a lock: the rule of Materi A7 is to leave out the lowest score; if you keep it, say why below.`, ` Das sind ${euro(cost - BUDGET)} zu viel. Ein Hinweis, keine Sperre: Die Regel aus Materi A7 ist, den niedrigsten Wert wegzulassen; wenn Sie ihn behalten, sagen Sie unten, warum.`) : tt(` ${euro(BUDGET - cost)} is left.`, ` ${euro(BUDGET - cost)} bleiben übrig.`)}
          </p>
        </div>
      )}
      {chosen.map((id) => {
        const m = MEASURE_BY_ID[id];
        const aims = l1.aims[id];
        const aF = l1.measureFlags.includes(`${id}.aims`);
        const sF = l1.measureFlags.includes(`${id}.sus`);
        return (
          <div key={id} id={IDS.measure(id)} className={clsx("space-y-3 rounded-lg border border-line bg-paper p-3.5", (aF || sF) && "is-flagged")}>
            <p className="font-semibold text-ink">
              {m.name} <span className="font-normal text-ash">· {euro(m.cost)} · {tt("acts on", "wirkt auf")} {MEASURE_AREA_LABEL[m.area]} · {tt("runs on", "läuft auf")} {RUNS_ON_LABEL[m.runsOn]}</span>
            </p>
            <div>
              <p className="smallcaps">{tt("Which factors does it build? (choose the ones it really builds, or none)", "Welche Faktoren baut sie auf? (wählen Sie die, die sie wirklich aufbaut, oder keinen)")}</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {(["trust", "appreciation", "relevance"] as Factor[]).map((f) => {
                  const on = aims?.includes(f) ?? false;
                  return (
                    <button key={f} type="button" aria-pressed={on} onClick={() => setAims(id, on ? (aims ?? []).filter((x) => x !== f) : [...(aims ?? []), f])} className={clsx("btn btn-sm min-h-[40px] border", on ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash")}>
                      {on ? "☑ " : "☐ "}
                      {FACTOR_LABEL[f]}
                    </button>
                  );
                })}
                <button type="button" aria-pressed={aims !== undefined && aims.length === 0} onClick={() => setAims(id, [])} className={clsx("btn btn-sm min-h-[40px] border", aims !== undefined && aims.length === 0 ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash")}>
                  {tt("None of the three", "Keinen der drei")}
                </button>
              </div>
              {aF && (
                <p className="mt-1 text-caption text-ink">
                  <span className="smallcaps mr-1 text-accent">{tt("Clue", "Hinweis")}</span>
                  {tt("Read what this measure changes for the customer against the three factors in Materi A2. Does it create reliance on a person, the feeling of being valued, or useful advice? A lower price or more messages create none.", "Lesen Sie, was diese Maßnahme für den Kunden ändert, gegen die drei Faktoren in Materi A2. Schafft sie Verlass auf eine Person, das Gefühl, geschätzt zu werden, oder nützlichen Rat? Ein niedrigerer Preis oder mehr Nachrichten schaffen keinen.")}
                </p>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <p className="smallcaps">{tt("Effect", "Wirkung")}</p>
                <ScorePick label={tt(`Effect of ${m.name}`, `Wirkung von ${m.name}`)} value={l1.eff[id] || 0} onChange={(v) => setScore("eff", id, v)} />
              </div>
              <div>
                <p className="smallcaps">{tt("Sustainability (from what it runs on)", "Nachhaltigkeit (aus dem, worauf sie läuft)")}</p>
                <ScorePick label={tt(`Sustainability of ${m.name}`, `Nachhaltigkeit von ${m.name}`)} value={l1.sus[id] || 0} onChange={(v) => setScore("sus", id, v)} flagged={sF} />
                {sF && <p className="mt-1 text-micro normal-case tracking-normal text-ink">{tt(`It runs on ${RUNS_ON_LABEL[m.runsOn]}. Read that against the rule in Materi A7.`, `Sie läuft auf ${RUNS_ON_LABEL[m.runsOn]}. Lesen Sie das gegen die Regel in Materi A7.`)}</p>}
              </div>
              <div>
                <p className="smallcaps">{tt("Feasibility", "Machbarkeit")}</p>
                <ScorePick label={tt(`Feasibility of ${m.name}`, `Machbarkeit von ${m.name}`)} value={l1.fea[id] || 0} onChange={(v) => setScore("fea", id, v)} />
              </div>
            </div>
            <p className="tnum text-caption text-ink" aria-live="polite">
              {tt("Score: ", "Wert: ")}
              {measureScored(l1, id) ? `${l1.eff[id]} × ${l1.sus[id]} × ${l1.fea[id]} = ` : tt("fill all three scores · ", "alle drei Werte ausfüllen · ")}
              <strong>{measureScore(l1, id) || "—"}</strong>
            </p>
            {mentor && <MentorGuide guide={scoreGuide(id)} />}
          </div>
        );
      })}
      {chosen.length > 0 && (
        <div className="space-y-2">
          <p className="smallcaps">{tt("Which factors do your measures build? (from what each really builds)", "Welche Faktoren bauen Ihre Maßnahmen auf? (aus dem, was jede wirklich aufbaut)")}</p>
          <ul className="grid gap-1.5 sm:grid-cols-3">
            {cov.map((c) => (
              <li key={c.factor} className={clsx("rounded-md border px-3 py-1.5 text-caption", c.covered ? "border-signal/40 bg-signalSoft text-ink" : "border-dashed border-ash bg-mist text-ink")}>
                <span aria-hidden>{c.covered ? "● " : "○ "}</span>
                <strong>{FACTOR_LABEL[c.factor]}</strong>: {c.covered ? tt("at least one chosen measure builds it", "mindestens eine gewählte Maßnahme baut ihn auf") : tt("nothing you chose builds it", "nichts Gewähltes baut ihn auf")}
              </li>
            ))}
          </ul>
        </div>
      )}
      <CheckBar onCheck={check} checkLabel={tt("Check my measures", "Meine Maßnahmen prüfen")} checks={l1.checks} />
      {chosen.length > 0 && l1.checks > 0 && (
        <Reading>
          {l1.measureFlags.length > 0
            ? tt(`${nA} measure${nA === 1 ? " names" : "s name"} factors that do not match what ${nA === 1 ? "it builds" : "they build"}, and ${nS} sustainability score${nS === 1 ? " does not" : "s do not"} follow what the measure runs on. They are outlined above.`, `${nA} ${nA === 1 ? "Maßnahme nennt" : "Maßnahmen nennen"} Faktoren, die nicht zu dem passen, was sie aufbauen, und ${nS} ${nS === 1 ? "Nachhaltigkeitswert folgt" : "Nachhaltigkeitswerte folgen"} nicht dem, worauf die Maßnahme läuft. Sie sind oben markiert.`)
            : tt("The factors you named and the sustainability scores match the measures. Effect and feasibility are your judgement.", "Die genannten Faktoren und die Nachhaltigkeitswerte passen zu den Maßnahmen. Wirkung und Machbarkeit sind Ihr Urteil.")}
          {cost > BUDGET ? tt(` The plan is ${euro(cost - BUDGET)} over the budget.`, ` Der Plan liegt ${euro(cost - BUDGET)} über dem Budget.`) : ""}
        </Reading>
      )}
      <AnswerKey block={measureKey()} />
      {chosen.length === CHOOSE && (
        <div id={IDS.order} className="space-y-2 border-t border-line pt-3">
          <p className="font-semibold text-ink">{tt("Put your three measures in priority order", "Bringen Sie Ihre drei Maßnahmen in eine Reihenfolge")}</p>
          <ol className="space-y-1.5">
            {shown.map((id, i) => (
              <li key={id} className="flex items-center gap-2 rounded-lg border border-line bg-paper px-3 py-1.5">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-caption font-bold text-paper">{i + 1}</span>
                <span className="min-w-0 flex-1 text-caption text-ink">
                  {MEASURE_BY_ID[id].name} <span className="tnum text-ash">· {tt("score", "Wert")} {measureScore(l1, id) || "—"}</span>
                </span>
                <button type="button" onClick={() => move(id, -1)} aria-label={tt(`Move ${MEASURE_BY_ID[id].name} up`, `${MEASURE_BY_ID[id].name} nach oben`)} className="btn-ghost btn-sm min-w-[40px]">
                  ↑
                </button>
                <button type="button" onClick={() => move(id, 1)} aria-label={tt(`Move ${MEASURE_BY_ID[id].name} down`, `${MEASURE_BY_ID[id].name} nach unten`)} className="btn-ghost btn-sm min-w-[40px]">
                  ↓
                </button>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => patch({ order: [...shown] })} className={clsx("btn-sm", l1.order.length === CHOOSE ? "btn-ghost" : "btn-primary")}>
              {l1.order.length === CHOOSE && chosen.every((id) => l1.order.includes(id)) ? tt("✓ Order kept", "✓ Reihenfolge übernommen") : tt("Keep this order", "Diese Reihenfolge übernehmen")}
            </button>
            {inv.length > 0 && (
              <span role="status" className="text-caption text-ink">
                <span className="smallcaps mr-1 text-accent">{tt("Check", "Prüfung")}</span>
                {tt(`${inv.length} measure${inv.length === 1 ? " sits" : "s sit"} above one with a higher score. If deliberate, say why below.`, `${inv.length} ${inv.length === 1 ? "Maßnahme steht" : "Maßnahmen stehen"} über einer mit höherem Wert. Ist das Absicht, sagen Sie unten, warum.`)}
              </span>
            )}
          </div>
          <AnswerKey block={orderKey()} />
          <TextBox
            id={IDS.why}
            label={tt("Why does your first priority go first?", "Warum kommt Ihre erste Priorität zuerst?")}
            help={tt("Give the order and what decides it (your score, the reason customers gave in Block 1.1 or the stalled signals in Block 2.1), say what the three cost against the budget, and name one of the six measures you did not choose and why you left it out. At least 60 characters.", "Nennen Sie die Reihenfolge und was sie entscheidet (Ihr Wert, der Grund der Kunden in Block 1.1 oder die stockenden Signale in Block 2.1), was die drei gegen das Budget kosten, und nennen Sie eine der sechs nicht gewählten Maßnahmen und warum Sie sie weggelassen haben. Mindestens 60 Zeichen.")}
            value={l1.why}
            onChange={(v) => patch({ why: v })}
            min={60}
            rows={4}
          >
            <WritingHelp
              id="why-help"
              steps={[
                tt("Say which measure goes first and why: its score, or the reason customers gave (Block 1.1) or the stalled signals (Block 2.1) it answers.", "Sagen Sie, welche Maßnahme zuerst kommt und warum: ihr Wert, oder der Grund der Kunden (Block 1.1) bzw. die stockenden Signale (Block 2.1), die sie beantwortet."),
                tt("Say what the three cost against the €140,000.", "Sagen Sie, was die drei gegen die 140.000 € kosten."),
                tt("“Left out” means the six measures you did not choose, not your second or third priority (those are in your plan). Name the one that tempted you most, for example one with a high score or a low price.", "„Weggelassen“ meint die sechs Maßnahmen, die Sie nicht gewählt haben, nicht Ihre zweite oder dritte Priorität (die sind in Ihrem Plan). Nennen Sie die, die Sie am meisten reizte, zum Beispiel eine mit hohem Wert oder niedrigem Preis."),
                tt("Say why that one stays out: its score, the area it acts on, what it runs on, or that it would take the plan over the budget.", "Sagen Sie, warum sie draußen bleibt: ihr Wert, der Bereich, auf den sie wirkt, worauf sie läuft, oder dass sie den Plan über das Budget brächte."),
              ]}
              refs={[
                { label: tt("Budget", "Budget"), value: euro(BUDGET), target: IDS.measurePick },
                { label: tt("Your three measures cost", "Ihre drei Maßnahmen kosten"), value: euro(cost), target: IDS.measurePick },
                ...MEASURES.filter((m) => !chosen.includes(m.id)).map((m) => ({ label: tt(`Not chosen: ${m.name}`, `Nicht gewählt: ${m.name}`), value: `${euro(m.cost)} · ${tt("acts on", "wirkt auf")} ${MEASURE_AREA_LABEL[m.area]} · ${tt("runs on", "läuft auf")} ${RUNS_ON_LABEL[m.runsOn]}`, target: IDS.measurePick })),
                ...shown.map((id, i) => ({ label: tt(`Priority ${i + 1}: ${MEASURE_BY_ID[id].name}, your score`, `Priorität ${i + 1}: ${MEASURE_BY_ID[id].name}, Ihr Wert`), value: String(measureScore(l1, id) || "—"), target: IDS.measure(id) })),
                { label: tt("Uncertainty signals that stalled (your tags, Block 2.1)", "Unsicherheitssignale, die stockten (Ihre Zuordnung, Block 2.1)"), value: String(tallyOf(l1.tags).stalled.uncertainty), target: "block-2-1" },
                { label: tt("A reason customers gave (Block 1.1)", "Ein Grund der Kunden (Block 1.1)"), value: REASONS[2].quote, target: IDS.reason(REASONS[2].id) },
              ]}
            />
          </TextBox>
          <ExampleAnswer id="why-example" guide={whyGuide()} />
          {mentor && <MentorGuide guide={whyGuide()} />}
        </div>
      )}
      <BlockMissing block="2.3" route={1} />
    </AnswerBlock>
  );
}
