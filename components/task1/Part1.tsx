"use client";

import clsx from "clsx";
import { AnswerBlock } from "@/components/ui/AnswerBlock";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { CalcDiagnosis } from "@/components/ui/CalcDiagnosis";
import { Field } from "@/components/ui/Field";
import { FormulaBuilder } from "@/components/ui/FormulaBuilder";
import { CheckBar, OptionList, Reading, TextBox } from "@/components/ui/Inputs";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MentorGuide } from "@/components/ui/MentorGuide";
import { PlacementBoard } from "@/components/ui/PlacementBoard";
import { RevealHint } from "@/components/ui/RevealHint";
import { WritingHelp } from "@/components/ui/WritingHelp";
import { AREA_TAGS, AREA_TESTS, REASONS, REASON_KEY } from "@/data/reasons";
import { ExampleAnswer } from "@/components/ui/ExampleAnswer";
import { BlockMissing } from "@/components/ui/BlockMissing";
import type { AreaTag, ReasonId } from "@/data/reasons";
import { FIGURES, FIGURE_IDS, NETSOL } from "@/data/delight";
import type { FigureId } from "@/data/delight";
import { APPROACH_COUNT, APPROACH_FRAME, APPROACH_MIN, FACTORS, FACTOR_LABEL, MISSING_QUESTION } from "@/data/approaches";
import type { Factor, MissingId } from "@/data/approaches";
import { FIGURE_BUILDERS, figAnswer, figurePartFlags, partKey } from "@/lib/calcBuilder";
import { approachFlags, citesDelightFigure, figMatches, missingHolds, sortHolds } from "@/lib/checks";
import { scrollToAndFlash } from "@/lib/flash";
import { Gloss } from "@/lib/glossify";
import { IDS } from "@/lib/missing";
import { euro, pct, tt } from "@/lib/lang";
import { approachGuide, extraReasonGuide, figureGuide, reflectGuide, worthGuide } from "@/lib/mentorGuide";
import { missingKey, sortKey } from "@/lib/answerKey";
import { MIN_LINE, MIN_SENTENCE } from "@/lib/progress";
import { BLOCK_MINUTES } from "@/lib/routes";
import { useStore } from "@/store/useStore";

/* ------------------------------------------------------------------ Block 1.1 */

export function Block11() {
  const l1 = useStore((s) => s.l1);
  const place = useStore((s) => s.placeReason);
  const undo = useStore((s) => s.undoSort);
  const redo = useStore((s) => s.redoSort);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  return (
    <AnswerBlock
      id="block-1-1"
      title={tt("Block 1.1 · Sort why customers feel no tie", "Block 1.1 · Sortieren, warum Kunden keine Bindung spüren")}
      kind="OBJECTIVE"
      core
      minutes={BLOCK_MINUTES["1.1"]}
      findIt={tt("Route 1 → Task 1 → the nine statements on the sort board below, from NetSolutions' account reviews and exit calls. Answer on the sort board.", "Route 1 → Task 1 → die neun Aussagen auf der Sortiertafel unten, aus Account-Reviews und Abschlussgesprächen von NetSolutions. Antworten Sie auf der Sortiertafel.")}
    >
      <MaterialRefs refs={["A3"]} />
      <PlacementBoard<AreaTag>
        items={REASONS.map((r, i) => ({ id: r.id, meta: tt(`Statement ${i + 1}`, `Aussage ${i + 1}`), text: r.quote }))}
        bins={AREA_TAGS.map((t) => ({ id: t.id, label: t.label, hint: t.hint }))}
        value={l1.sort}
        onPlace={(id, tag) => place(id as ReasonId, tag)}
        onUndo={undo}
        onRedo={redo}
        undoCount={l1.sortHistory.length}
        redoCount={l1.sortFuture.length}
        domId={IDS.reason}
        keyPhrases={REASON_KEY}
        clues={Object.fromEntries(REASONS.map((r) => [r.id, r.clue]))}
        reasons={Object.fromEntries(REASONS.map((r) => [r.id, r.why]))}
        result={l1.sortResult}
        checks={l1.sortChecks}
        onCheck={() => patch((s) => ({ checks: s.checks + 1, sortChecks: s.sortChecks + 1, sortResult: sortHolds(s.sort) }))}
        onClue={() => patch({ sortClue: true })}
        clueShown={l1.sortClue}
        reasoningOpened={l1.sortReasoning}
        onOpenReasoning={() => patch({ sortReasoning: true })}
        noun={tt("statement", "Aussage")}
        intro={tt("Drag a statement into an area, or select it and then select an area. Select a placed one to move it again.", "Ziehen Sie eine Aussage in einen Bereich, oder wählen Sie sie aus und dann einen Bereich. Wählen Sie eine platzierte Aussage, um sie zu verschieben.")}
        tests={
          <RevealHint id="sort-tests" label={tt("Show the test questions", "Testfragen zeigen")} title={tt("Test questions · taught in Materi A3", "Testfragen · aus Materi A3")}>
            <div className="space-y-2 text-caption text-ink">
              <p>{tt("Ask these of every statement. They repeat the tests from Materi A3; they never say which statement goes where.", "Stellen Sie diese Fragen zu jeder Aussage. Sie wiederholen die Tests aus Materi A3; sie sagen nie, welche Aussage wohin gehört.")}</p>
              <ul className="space-y-1.5">
                {AREA_TESTS.map((c) => (
                  <li key={c.name}>
                    <span className="font-semibold">{c.name}. </span>
                    <Gloss>{c.test}</Gloss>
                  </li>
                ))}
              </ul>
              <MaterialRefs refs={["A3"]} lead={tt("Taught in", "Gelehrt in")} />
            </div>
          </RevealHint>
        }
      />
      <TextBox
        id={IDS.extraReason}
        label={tt("One more reason a NetSolutions customer might give, and its area", "Ein weiterer Grund, den ein Kunde von NetSolutions nennen könnte, und sein Bereich")}
        help={tt("Collect one more reason for a missing tie that is not in the list, and say whether it is about the relationship, the communication or the added value. At least 30 characters.", "Sammeln Sie einen weiteren Grund für fehlende Bindung, der nicht in der Liste steht, und sagen Sie, ob er die Beziehung, die Kommunikation oder den Mehrwert betrifft. Mindestens 30 Zeichen.")}
        value={l1.extraReason}
        onChange={(v) => patch({ extraReason: v })}
        min={MIN_LINE}
        rows={2}
      >
        <WritingHelp
          id="extra-reason-kit"
          refs={[
            { label: tt("The nine statements", "Die neun Aussagen"), value: tt("so yours is not one of them", "damit Ihre keine davon ist"), target: IDS.reason(REASONS[0].id) },
            { label: tt("The three test questions (Materi A3)", "Die drei Testfragen (Materi A3)"), value: AREA_TESTS.map((a) => a.name).join(" · "), target: "mat-A3" },
          ]}
          steps={[
            tt("Think of something a satisfied customer could say, not a complaint about the service itself.", "Denken Sie an etwas, das ein zufriedener Kunde sagen könnte, keine Beschwerde über den Service selbst."),
            tt("Name its area and say which test question decides it.", "Nennen Sie den Bereich und sagen Sie, welche Testfrage ihn entscheidet."),
          ]}
        />
      </TextBox>
      <ExampleAnswer id="extra-reason-example" guide={extraReasonGuide()} />
      {mentor && <MentorGuide guide={extraReasonGuide()} />}
      <AnswerKey block={sortKey()} />
      <BlockMissing block="1.1" route={1} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 1.2 */

const row = (id: string, label: string, value: string) => (
  <tr id={id} className="border-t border-line">
    <td className="px-3 py-2">{label}</td>
    <td className="tnum px-3 py-2 text-right font-semibold">{value}</td>
  </tr>
);

export function Block12() {
  const l1 = useStore((s) => s.l1);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  const setFig = (id: FigureId, v: string) => patch((s) => ({ fig: { ...s.fig, [id]: v }, figFlagged: s.figFlagged.filter((f) => f !== id), worthFlagged: false }));
  const check = () =>
    patch((s) => {
      const figFlagged = FIGURE_IDS.filter((id) => s.fig[id].trim() !== "" && !figMatches(s.fig[id], figAnswer(id)));
      const w = s.worth.trim();
      return { checks: s.checks + 1, figFlagged, figClue: {}, partFlags: figurePartFlags(s.parts), worthFlagged: w !== "" && (w.length < MIN_SENTENCE || !citesDelightFigure(w)), worthClue: false };
    });
  return (
    <AnswerBlock
      id="block-1-2"
      title={tt("Block 1.2 · What is delight worth? Three figures", "Block 1.2 · Was ist Begeisterung wert? Drei Werte")}
      kind="OBJECTIVE + JUDGED"
      core
      minutes={BLOCK_MINUTES["1.2"]}
      findIt={tt("Route 1 → Task 1 → the three tables “Customer groups”, “All customers” and “The plan” directly below. Answer in the fields under the tables.", "Route 1 → Task 1 → die drei Tabellen „Kundengruppen“, „Alle Kunden“ und „Der Plan“ direkt darunter. Antworten Sie in den Feldern unter den Tabellen.")}
    >
      <MaterialRefs refs={["A4", "A1"]} />
      <p className="text-body text-ink">
        <Gloss>
          {tt(
            "NetSolutions' last survey sorts its customers into groups by satisfaction, with the share of each that left in the last year. The numbers you need are in the tables below. Look for them first; the buttons “Show where the numbers are” and “Show the formula” are there if you get stuck. The method is taught in",
            "Die letzte Befragung von NetSolutions teilt die Kunden nach Zufriedenheit in Gruppen, mit dem Anteil, der im letzten Jahr ging. Die Zahlen stehen in den Tabellen unten. Suchen Sie sie zuerst selbst; die Schaltflächen „Zeigen, wo die Zahlen stehen“ und „Formel zeigen“ helfen, wenn Sie nicht weiterkommen. Die Methode steht in",
          )}
        </Gloss>{" "}
        <button type="button" onClick={() => scrollToAndFlash("mat-A4", "ref")} className="font-semibold text-accent underline decoration-dotted underline-offset-2">
          Materi A4
        </button>
        {tt(", on other numbers. What you practise is combining them correctly.", ", mit anderen Zahlen. Was Sie üben, ist, sie richtig zu kombinieren.")}
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="relative overflow-x-auto rounded-lg border border-line md:col-span-2">
          <table className="w-full border-collapse text-caption">
            <caption className="bg-mist px-3 py-2 text-left text-micro font-semibold uppercase text-ash">{tt("Customer groups · NetSolutions' survey (Case assumption)", "Kundengruppen · Befragung von NetSolutions (Fallannahme)")}</caption>
            <tbody>
              {row("del-sat-customers", tt("Satisfied (score 4) · customers", "Zufrieden (Wert 4) · Kunden"), String(NETSOL.satisfied.customers))}
              {row("del-sat-churn", tt("Satisfied (score 4) · yearly churn rate", "Zufrieden (Wert 4) · jährliche Churn Rate"), pct(NETSOL.satisfied.churn))}
              {row("del-del-customers", tt("Delighted (score 5 and a personal contact) · customers", "Begeistert (Wert 5 und persönlicher Kontakt) · Kunden"), String(NETSOL.delighted.customers))}
              {row("del-del-churn", tt("Delighted (score 5 and a personal contact) · yearly churn rate", "Begeistert (Wert 5 und persönlicher Kontakt) · jährliche Churn Rate"), pct(NETSOL.delighted.churn))}
              {row("del-dis-customers", tt("Dissatisfied (score 1 to 3) · customers", "Unzufrieden (Wert 1 bis 3) · Kunden"), String(NETSOL.dissatisfied.customers))}
              {row("del-dis-churn", tt("Dissatisfied (score 1 to 3) · yearly churn rate", "Unzufrieden (Wert 1 bis 3) · jährliche Churn Rate"), pct(NETSOL.dissatisfied.churn))}
            </tbody>
          </table>
        </div>
        <div className="space-y-3">
          <div className="relative overflow-x-auto rounded-lg border border-line">
            <table className="w-full border-collapse text-caption">
              <caption className="bg-mist px-3 py-2 text-left text-micro font-semibold uppercase text-ash">{tt("All customers", "Alle Kunden")}</caption>
              <tbody>
                {row("del-contract", tt("Average yearly contract", "Durchschnittlicher Jahresvertrag"), euro(NETSOL.contract))}
                {row("del-margin", tt("Gross margin", "Bruttomarge"), pct(NETSOL.margin))}
              </tbody>
            </table>
          </div>
          <div className="relative overflow-x-auto rounded-lg border border-line">
            <table className="w-full border-collapse text-caption">
              <caption className="bg-mist px-3 py-2 text-left text-micro font-semibold uppercase text-ash">{tt("The plan", "Der Plan")}</caption>
              <tbody>{row("del-moved", tt("Satisfied customers to become delighted", "Zufriedene Kunden, die begeistert werden sollen"), String(NETSOL.moved))}</tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="space-y-5">
        {FIGURE_IDS.map((id) => {
          const f = FIGURES[id];
          const b = FIGURE_BUILDERS[id];
          const flagged = l1.figFlagged.includes(id);
          const partsFlagged = b.parts.some((p) => l1.partFlags.includes(partKey(id, p.id)));
          return (
            <div key={id} className="space-y-2">
              <Field
                id={IDS.figure(id)}
                htmlFor={`fig-${id}-in`}
                label={f.label}
                help={tt(`${f.question} Type the figure in euros, for example 12500.`, `${f.question} Tippen Sie den Wert in Euro, zum Beispiel 12500.`)}
                flagged={flagged}
                clue={f.clue}
                clueShown={!!l1.figClue[id]}
                onShowClue={() => patch((s) => ({ figClue: { ...s.figClue, [id]: true } }))}
              >
                <input id={`fig-${id}-in`} className="field tnum max-w-xs" inputMode="decimal" autoComplete="off" value={l1.fig[id]} onChange={(e) => setFig(id, e.target.value)} aria-invalid={flagged || undefined} />
              </Field>
              {flagged && (
                <CalcDiagnosis
                  builder={b}
                  figure={id}
                  parts={l1.parts}
                  partFlags={l1.partFlags}
                  name={tt(`your ${id}`, `Ihr ${id}`)}
                  mismatch={(r) => tt(`The parts in the formula calculator are right and give ${r}, but the figure you entered differs. Press “Use this result in ${id}” or check the entry.`, `Die Teile im Formelrechner stimmen und ergeben ${r}, aber Ihr eingetragener Wert weicht ab. Drücken Sie „Ergebnis übernehmen in ${id}“ oder prüfen Sie den Eintrag.`)}
                />
              )}
              <div className="flex flex-wrap items-start gap-2">
                <RevealHint id={`fig-${id}-where`} label={tt("Show where the numbers are", "Zeigen, wo die Zahlen stehen")} title={tt("Numbers you need · the printed rows", "Zahlen, die Sie brauchen · die gedruckten Zeilen")}>
                  <ul className="space-y-1 text-caption">
                    {f.sources.map((s) => (
                      <li key={s.label}>
                        <button type="button" onClick={() => scrollToAndFlash(s.target, "ref")} className="flex min-h-[36px] w-full flex-wrap items-baseline gap-x-2 rounded px-2 py-1 text-left hover:bg-accentSoft">
                          <span className="text-ink">{s.label}:</span>
                          <span className="tnum font-semibold text-ink">{s.value}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </RevealHint>
                <RevealHint id={`fig-${id}-formula`} label={tt("Show the formula", "Formel zeigen")} title={tt(`The formula · from Materi ${f.taughtIn}`, `Die Formel · aus Materi ${f.taughtIn}`)} forceOpen={partsFlagged}>
                  <p className="text-caption text-ink">
                    <Gloss>{f.formula}</Gloss>
                  </p>
                  <FormulaBuilder
                    figure={id}
                    builder={b}
                    parts={l1.parts}
                    partFlags={l1.partFlags}
                    onPart={(k, v) => patch((s) => ({ parts: { ...s.parts, [k]: v }, partFlags: s.partFlags.filter((x) => x !== k) }))}
                    onUse={(v) => setFig(id, String(Math.round(v)))}
                    unit="€"
                    label={id}
                    source={tt("the tables above", "den Tabellen oben")}
                  />
                </RevealHint>
              </div>
              {mentor && <MentorGuide guide={figureGuide(id)} />}
            </div>
          );
        })}
      </div>
      <TextBox
        id={IDS.worth}
        label={tt("What does delight add that satisfaction does not?", "Was bringt Begeisterung, was Zufriedenheit nicht bringt?")}
        help={tt("One or two sentences. Use at least one figure from your calculation and compare the two groups.", "Ein oder zwei Sätze. Nutzen Sie mindestens eine Zahl aus Ihrer Rechnung und vergleichen Sie die beiden Gruppen.")}
        value={l1.worth}
        onChange={(v) => patch({ worth: v, worthFlagged: false })}
        min={MIN_SENTENCE}
        rows={4}
        flagged={l1.worthFlagged}
        clue={tt("Which of your figures shows what satisfied customers cost when they leave, and which shows what moving some to delighted would keep? Quote one and say what it means.", "Welche Ihrer Zahlen zeigt, was zufriedene Kunden kosten, wenn sie gehen, und welche, was das Verschieben einiger zu begeisterten hielte? Zitieren Sie eine und sagen Sie, was sie bedeutet.")}
        clueShown={l1.worthClue}
        onShowClue={() => patch({ worthClue: true })}
      >
        <WritingHelp
          id="worth-help"
          steps={[
            tt("Say what the satisfied group costs a year when customers leave, and what the delighted group costs.", "Sagen Sie, was die zufriedene Gruppe pro Jahr kostet, wenn Kunden gehen, und was die begeisterte kostet."),
            tt("Say what moving 30 customers from satisfied to delighted would keep.", "Sagen Sie, was es hielte, 30 Kunden von zufrieden zu begeistert zu bringen."),
            tt("Finish with what that means for where NetSolutions should invest.", "Schließen Sie damit, was das dafür bedeutet, wo NetSolutions investieren sollte."),
          ]}
          refs={[
            { label: tt("Your F1 (satisfied, lost a year)", "Ihr F1 (zufrieden, pro Jahr verloren)"), value: l1.fig.F1 || tt("not filled yet", "noch leer"), target: IDS.figure("F1") },
            { label: tt("Your F2 (delighted, lost a year)", "Ihr F2 (begeistert, pro Jahr verloren)"), value: l1.fig.F2 || tt("not filled yet", "noch leer"), target: IDS.figure("F2") },
            { label: tt("Your F3 (kept by moving customers)", "Ihr F3 (durch Verschieben gehalten)"), value: l1.fig.F3 || tt("not filled yet", "noch leer"), target: IDS.figure("F3") },
            { label: tt("Customers to become delighted", "Kunden, die begeistert werden sollen"), value: String(NETSOL.moved), target: "del-moved" },
            { label: tt("Satisfied against delighted (Materi A1)", "Zufrieden gegen begeistert (Materi A1)"), value: tt("a 4 feels safe and is not", "eine 4 fühlt sich sicher an und ist es nicht"), target: "mat-A1" },
          ]}
        />
      </TextBox>
      <ExampleAnswer id="worth-example" guide={worthGuide()} />
      {mentor && <MentorGuide guide={worthGuide()} />}
      <CheckBar onCheck={check} checkLabel={tt("Check my figures and sentence", "Meine Werte und meinen Satz prüfen")} checks={l1.checks} />
      {l1.checks > 0 && (
        <Reading>
          {l1.figFlagged.length === 0 && !l1.worthFlagged && l1.partFlags.length === 0
            ? tt("Nothing is outlined by the last check.", "Die letzte Prüfung hat nichts markiert.")
            : tt(
                `${l1.figFlagged.length > 0 ? `${l1.figFlagged.length} figure${l1.figFlagged.length === 1 ? " is" : "s are"} outlined above. Each says what to check.` : ""}${l1.worthFlagged ? " The sentence needs at least one of your calculated figures." : ""}${l1.partFlags.length > 0 ? " A part of the formula calculator is outlined." : ""}`,
                `${l1.figFlagged.length > 0 ? `${l1.figFlagged.length} ${l1.figFlagged.length === 1 ? "Wert ist" : "Werte sind"} oben markiert. Jeder sagt, was zu prüfen ist.` : ""}${l1.worthFlagged ? " Der Satz braucht mindestens eine Ihrer berechneten Zahlen." : ""}${l1.partFlags.length > 0 ? " Ein Teil des Formelrechners ist markiert." : ""}`,
              )}
        </Reading>
      )}
      <BlockMissing block="1.2" route={1} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 1.3 */

export function Block13() {
  const l1 = useStore((s) => s.l1);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  const setRow = (i: number, p: Partial<{ factor: Factor | null; text: string }>) => patch((s) => ({ approaches: s.approaches.map((h, j) => (j === i ? { ...h, ...p } : h)), apprFlagged: s.apprFlagged.filter((x) => x !== i) }));
  const check = () => patch((s) => ({ checks: s.checks + 1, apprChecked: true, apprClue: false, apprFlagged: approachFlags(s), missingFlagged: !!s.missing && !missingHolds(s) }));
  return (
    <AnswerBlock
      id="block-1-3"
      title={tt("Block 1.3 · What is missing, and three approaches to delight", "Block 1.3 · Was fehlt, und drei Ansätze für Begeisterung")}
      kind="OBJECTIVE + JUDGED"
      core={false}
      minutes={BLOCK_MINUTES["1.3"]}
      findIt={tt("Route 1 → Task 1 → the review summary below, your sort in Block 1.1 and the three factors in Materi A2. Answer in the fields below.", "Route 1 → Task 1 → die Review-Zusammenfassung unten, Ihre Sortierung in Block 1.1 und die drei Faktoren in Materi A2. Antworten Sie in den Feldern unten.")}
    >
      <MaterialRefs refs={["A1", "A2"]} />
      <div id={IDS.missing} className={clsx("space-y-2 rounded-lg p-1", l1.missingFlagged && "is-flagged")}>
        <p className="font-semibold text-ink">{tt("a · What is missing from the customer's perspective?", "a · Was fehlt aus Sicht des Kunden?")}</p>
        <blockquote className="border-l-4 border-gold bg-accentSoft px-3 py-2 text-body text-ink">
          <Gloss>{MISSING_QUESTION.statement}</Gloss>
        </blockquote>
        <OptionList<MissingId> cols={2} label={tt("What is missing", "Was fehlt")} value={l1.missing} onChange={(v) => patch({ missing: v, missingFlagged: false })} options={MISSING_QUESTION.options} />
        {l1.missingFlagged && (
          <p className="text-caption text-ink">
            <span className="smallcaps mr-1 text-accent">{tt("Clue", "Hinweis")}</span>
            {MISSING_QUESTION.clue}
          </p>
        )}
        <AnswerKey block={missingKey()} />
      </div>
      <div className="space-y-3 border-t border-line pt-3">
        <p className="font-semibold text-ink">{tt("b · Three approaches to increase delight", "b · Drei Ansätze für mehr Begeisterung")}</p>
        <p className="text-body text-ink">
          <Gloss>{tt("Write three approaches NetSolutions could take, each resting on a different factor, so that they can be tried and judged apart.", "Schreiben Sie drei Ansätze, die NetSolutions verfolgen könnte, jeder auf einem anderen Faktor, damit sie getrennt erprobt und beurteilt werden können.")}</Gloss>
        </p>
        <p className="text-caption text-ash">
          {tt("The frame: ", "Der Rahmen: ")}
          {APPROACH_FRAME.v}
        </p>
        {l1.approaches.map((a, i) => (
          <div key={i} className="space-y-1.5">
            <TextBox
              id={IDS.approach(i)}
              label={tt(`Approach ${i + 1}`, `Ansatz ${i + 1}`)}
              help={tt(`Choose the factor, then write the approach in one or two sentences with a reason (“because …”), at least ${APPROACH_MIN} characters.`, `Wählen Sie den Faktor und schreiben Sie dann den Ansatz in ein oder zwei Sätzen mit einer Begründung („weil …“), mindestens ${APPROACH_MIN} Zeichen.`)}
              value={a.text}
              onChange={(v) => setRow(i, { text: v })}
              min={APPROACH_MIN}
              flagged={l1.apprFlagged.includes(i)}
              clue={tt(`Use the frame: ${APPROACH_FRAME.v} Choose a factor no other approach uses, and finish with “because” and the factor.`, `Nutzen Sie den Rahmen: ${APPROACH_FRAME.v} Wählen Sie einen Faktor, den kein anderer Ansatz nutzt, und schließen Sie mit „weil“ und dem Faktor.`)}
              clueShown={l1.apprClue}
              onShowClue={() => patch({ apprClue: true })}
            >
              <div>
                <label htmlFor={`approach-${i}-factor`} className="smallcaps block">
                  {tt("Factor", "Faktor")}
                </label>
                <select id={`approach-${i}-factor`} className="field mt-1 max-w-md" value={a.factor ?? ""} onChange={(e) => setRow(i, { factor: (e.target.value || null) as Factor | null })}>
                  <option value="">{tt("Choose a factor…", "Faktor wählen…")}</option>
                  {FACTORS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label} (Materi {m.from})
                    </option>
                  ))}
                </select>
                {a.factor && <p className="mt-1 text-micro normal-case tracking-normal text-ash">{tt("Chosen: ", "Gewählt: ")}{FACTOR_LABEL[a.factor]}</p>}
              </div>
              <WritingHelp
                id={`approach-kit-${i}`}
                refs={[
                  { label: tt("The frame", "Der Rahmen"), value: APPROACH_FRAME.v, target: IDS.approach(i) },
                  { label: tt("The three factors (Materi A2)", "Die drei Faktoren (Materi A2)"), value: FACTORS.map((f) => f.label).join(" · "), target: "mat-A2" },
                  { label: tt("Factors your other approaches use", "Faktoren Ihrer anderen Ansätze"), value: l1.approaches.filter((_, j) => j !== i && l1.approaches[j].factor).map((b) => FACTOR_LABEL[b.factor!]).join(", ") || tt("none yet", "noch keine"), target: IDS.approach(i === 0 ? 1 : 0) },
                ]}
                steps={[
                  tt("Choose a factor no other approach uses.", "Wählen Sie einen Faktor, den kein anderer Ansatz nutzt."),
                  tt("Say what NetSolutions does and for whom, and what the customer feels or does as a result.", "Sagen Sie, was NetSolutions tut und für wen, und was der Kunde dadurch fühlt oder tut."),
                  tt("Finish with “because …” and the factor it builds.", "Schließen Sie mit „weil …“ und dem Faktor, den es aufbaut."),
                ]}
              />
            </TextBox>
            <ExampleAnswer id={`approach-example-${i}`} guide={approachGuide(i)} />
            {mentor && <MentorGuide guide={approachGuide(i)} />}
          </div>
        ))}
      </div>
      <CheckBar onCheck={check} checkLabel={tt("Check a and my approaches", "a und meine Ansätze prüfen")} checks={l1.checks} />
      {l1.apprChecked && (
        <Reading>
          {l1.apprFlagged.length === 0 && !l1.missingFlagged
            ? tt(`Nothing is outlined. All ${APPROACH_COUNT} approaches have a distinct factor and a reason; whether they are good is for you and your facilitator to judge.`, `Nichts ist markiert. Alle ${APPROACH_COUNT} Ansätze haben einen eigenen Faktor und eine Begründung; ob sie gut sind, beurteilen Sie und Ihre Moderation.`)
            : tt(`${l1.missingFlagged ? "Answer a is outlined, with a clue. " : ""}${l1.apprFlagged.length ? `${l1.apprFlagged.length} approach${l1.apprFlagged.length === 1 ? " is" : "es are"} outlined: a factor is missing or repeated, the text is short, or it gives no reason.` : ""}`, `${l1.missingFlagged ? "Antwort a ist markiert, mit Hinweis. " : ""}${l1.apprFlagged.length ? `${l1.apprFlagged.length} ${l1.apprFlagged.length === 1 ? "Ansatz ist" : "Ansätze sind"} markiert: Ein Faktor fehlt oder wiederholt sich, der Text ist kurz, oder er nennt keinen Grund.` : ""}`)}
        </Reading>
      )}
      <BlockMissing block="1.3" route={1} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 1.4 */

export function Block14() {
  const l1 = useStore((s) => s.l1);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  const fields: { k: "satisfaction" | "signal" | "manager"; label: string; help: string }[] = [
    { k: "satisfaction", label: tt("Why is satisfaction not enough at NetSolutions?", "Warum reicht Zufriedenheit bei NetSolutions nicht?"), help: tt("One or two sentences, using something you found in Blocks 1.1 to 1.3.", "Ein oder zwei Sätze, mit etwas, das Sie in den Blöcken 1.1 bis 1.3 gefunden haben.") },
    { k: "signal", label: tt("Where are signals overlooked, or answered too late?", "Wo werden Signale übersehen oder zu spät beantwortet?"), help: tt("Think of a moment in a deal where a customer's question could be read two ways. What happens when nobody owns the answer?", "Denken Sie an einen Moment im Deal, in dem die Frage eines Kunden zwei Deutungen zulässt. Was passiert, wenn niemand die Antwort verantwortet?") },
    { k: "manager", label: tt("How would an experienced sales manager act?", "Wie würde eine erfahrene Vertriebsleitung handeln?"), help: tt("What would they ask first, and what would they change in how the team works? Be concrete.", "Was würde sie zuerst fragen, und was würde sie an der Arbeitsweise des Teams ändern? Seien Sie konkret.") },
  ];
  return (
    <AnswerBlock
      id="block-1-4"
      title={tt("Block 1.4 · Coaching reflection: from Level 1 to Level 2", "Block 1.4 · Coaching-Reflexion: von Level 1 zu Level 2")}
      kind="JUDGED"
      core={false}
      minutes={BLOCK_MINUTES["1.4"]}
      findIt={tt("Route 1 → Task 1 → your own answers in Blocks 1.1 to 1.3, and the system callout in Materi A6. Answer in the three fields below.", "Route 1 → Task 1 → Ihre eigenen Antworten in den Blöcken 1.1 bis 1.3 und der Systemhinweis in Materi A6. Antworten Sie in den drei Feldern unten.")}
    >
      <MaterialRefs refs={["A1", "A6"]} />
      <p className="text-body text-ink">
        <Gloss>{tt("Before you read the signals in live deals: why is satisfaction not enough, how does real attachment arise, and what is the difference between recognising a signal and answering it well?", "Bevor Sie die Signale in laufenden Deals lesen: Warum reicht Zufriedenheit nicht, wie entsteht echte Bindung, und was ist der Unterschied zwischen ein Signal erkennen und es gut beantworten?")}</Gloss>
      </p>
      {fields.map((f) => (
        <div key={f.k} className="space-y-1.5">
          <TextBox id={IDS.reflect(f.k)} label={f.label} help={f.help} value={l1.reflect[f.k]} onChange={(v) => patch((s) => ({ reflect: { ...s.reflect, [f.k]: v } }))} min={MIN_LINE} rows={3}>
            <WritingHelp
              id={`reflect-kit-${f.k}`}
              refs={
                f.k === "satisfaction"
                  ? [
                      { label: tt("Your F1 and F2", "Ihr F1 und F2"), value: `${l1.fig.F1 || "—"} · ${l1.fig.F2 || "—"}`, target: IDS.figure("F1") },
                      { label: tt("The curve in Materi A1", "Die Kurve in Materi A1"), value: tt("retention jumps only at 5 of 5", "Bindung springt erst bei 5 von 5"), target: "mat-A1" },
                    ]
                  : f.k === "signal"
                    ? [
                        { label: tt("The four signal types (Materi A5)", "Die vier Signalarten (Materi A5)"), value: tt("interest, comparison, decision proximity, uncertainty", "Interesse, Vergleich, Entscheidungsnähe, Unsicherheit"), target: "mat-A5" },
                        { label: tt("Reading a signal right or wrong (Materi A6)", "Ein Signal richtig oder falsch lesen (Materi A6)"), value: tt("what happens next", "was dann passiert"), target: "mat-A6" },
                      ]
                    : [{ label: tt("System instead of individual action (Materi A6)", "System statt Einzelaktion (Materi A6)"), value: tt("reacting against managing", "Reagieren gegen Steuern"), target: "mat-A6" }]
              }
              steps={[tt("Name one concrete thing you found or saw.", "Nennen Sie eine konkrete Sache, die Sie gefunden oder gesehen haben."), tt("Say what it means for how NetSolutions works.", "Sagen Sie, was sie für die Arbeitsweise von NetSolutions bedeutet.")]}
            />
          </TextBox>
          <ExampleAnswer id={`reflect-example-${f.k}`} guide={reflectGuide(f.k)} />
          {mentor && <MentorGuide guide={reflectGuide(f.k)} />}
        </div>
      ))}
      <BlockMissing block="1.4" route={1} />
    </AnswerBlock>
  );
}
