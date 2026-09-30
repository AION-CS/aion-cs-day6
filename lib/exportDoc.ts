import { FACTOR_LABEL, MISSING_QUESTION } from "@/data/approaches";
import { FIGURES, FIGURE_IDS, NETSOL } from "@/data/delight";
import { BUDGET, MEASURE_BY_ID, MONTHS } from "@/data/measures";
import { AREA_LABEL, REASONS } from "@/data/reasons";
import { OBSERVATIONS, OUTCOME_LABEL, RESPONSES, SIGNALS, SIGNAL_IDS, TEAMS, WEAK_BY_ID } from "@/data/signals";
import { ACTIVITIES, ACTIVITY_IDS, ARCH, ARCH_BY_ID, ARCH_IDS, CRITERIA, CRIT_IDS, DECISIONS, KPI_BY_ID, LEVER_BY_ID, OWNERS, PRINCIPLES, R2_BUDGET, R2_MONTHS, RACI_ROLES, ROLE_IDS, TIMES } from "@/data/route2";
import { archCost, archLeft, coverage, funded, measureScore, tallyOf, totalCost } from "@/lib/checks";
import { euro, getLang, num, tt } from "@/lib/lang";
import { parseAmount } from "@/lib/parseAmount";
import { COURSE } from "@/lib/routes";
import { esc } from "@/lib/svg";
import type { Persisted } from "@/store/useStore";

/**
 * Each exported document is built here as a self-contained HTML string (inline CSS + inline SVG), in the active language. The
 * on-screen "Preview of your ..." renders this same body, so what the participant reads is what they download. It never prints
 * answer keys, ticks, crosses or scores (a measure's effect × sustainability × feasibility is the learner's own priority
 * score, not a mark).
 */

export const DOC_CSS = `
.doc{font-family:Georgia,Cambria,"Times New Roman",serif;color:#1F2328;background:#FFFEFA;line-height:1.5;font-size:14px}
.doc *{box-sizing:border-box}
.doc h1{font-size:22px;margin:0 0 4px;font-weight:600}
.doc h2{font-size:15px;margin:22px 0 8px;padding-bottom:4px;border-bottom:1px solid #D8D1BF;font-weight:600;letter-spacing:.01em}
.doc h3{font-size:13.5px;margin:14px 0 4px;font-weight:600}
.doc .meta{display:grid;grid-template-columns:auto 1fr;gap:2px 14px;margin:12px 0 4px;font-family:system-ui,sans-serif;font-size:12.5px}
.doc .meta dt{color:#59606A}.doc .meta dd{margin:0}
.doc .kicker{font-family:system-ui,sans-serif;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8A5A0B}
.doc table{width:100%;border-collapse:collapse;font-size:12.5px;font-family:system-ui,sans-serif}
.doc th{text-align:left;font-weight:600;color:#59606A;border-bottom:1px solid #59606A;padding:4px 8px 4px 0;font-size:11px;letter-spacing:.04em;text-transform:uppercase}
.doc td{border-bottom:1px solid #ECE6D6;padding:6px 8px 6px 0;vertical-align:top}
.doc td.num{text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}
.doc td.id{font-weight:700}
.doc table{table-layout:auto}.doc td,.doc th{overflow-wrap:anywhere}
.doc blockquote{margin:6px 0;padding:6px 12px;border-left:3px solid #D99A2B;background:#FBF0D6}
.doc .muted{color:#59606A}
.doc .foot{margin-top:26px;padding-top:8px;border-top:1px solid #59606A;font-family:system-ui,sans-serif;font-size:12px;color:#59606A}
.doc .legend{font-family:system-ui,sans-serif;font-size:11.5px;color:#59606A;margin:4px 0 0}
.doc svg{display:block;margin:8px 0}
@media print{.doc{font-size:12px}.doc h2{break-after:avoid}.doc table,.doc svg,.doc blockquote{break-inside:avoid}}
`;

const dateLabel = () => new Date().toLocaleDateString(getLang() === "de" ? "de-DE" : "en-GB", { day: "numeric", month: "long", year: "numeric" });

function header(title: string, level: string, p: Persisted): string {
  return `
<div class="kicker">${esc(COURSE.course)} · ${esc(COURSE.company)}</div>
<h1>${esc(title)}</h1>
<dl class="meta">
  <dt>${esc(tt("Course", "Kurs"))}</dt><dd>${esc(COURSE.course)} · ${esc(tt(`Day ${COURSE.day}`, `Tag ${COURSE.day}`))}</dd>
  <dt>${esc(tt("Position", "Einordnung"))}</dt><dd>${esc(level)}</dd>
  <dt>${esc(tt("Participant", "Teilnehmer/in"))}</dt><dd>${esc(p.participant.name.trim() || "—")}</dd>
  <dt>${esc(tt("Date", "Datum"))}</dt><dd>${esc(dateLabel())}</dd>
</dl>`;
}

const para = (s: string) => `<blockquote>${esc(s.trim()) || "—"}</blockquote>`;
const cell = (s: string) => esc(s.trim()) || "—";

export function wrapDocument(title: string, body: string): string {
  return `<!doctype html>
<html lang="${getLang()}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<style>body{margin:0;background:#F3EFE4}.sheet{max-width:820px;margin:0 auto;padding:36px 40px;background:#FFFEFA}@media print{body{background:#fff}.sheet{padding:0;max-width:none}@page{margin:16mm}}${DOC_CSS}</style>
</head><body><div class="sheet"><div class="doc">${body}</div></div></body></html>`;
}

export function downloadHtml(filename: string, html: string) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".html") ? filename : `${filename}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Opens the same document in a new window and prints it (no PDF library). Falls back to a hidden frame if pop-ups are blocked. */
export function printDocument(title: string, html: string) {
  const win = window.open("", "_blank");
  if (win) {
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.document.title = title;
    win.focus();
    window.setTimeout(() => win.print(), 250);
    return;
  }
  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden";
  document.body.appendChild(iframe);
  const w = iframe.contentWindow;
  if (!w) return iframe.remove();
  w.document.open();
  w.document.write(html);
  w.document.close();
  window.setTimeout(() => {
    w.focus();
    w.print();
    window.setTimeout(() => iframe.remove(), 1000);
  }, 250);
}

/* ------------------------------------------------------------------ Route 1 · the Retention Analysis File */

/** Bars of the learner's own tally: observations and stalled deals per signal type, as an inline SVG. */
function tallySvg(p: Persisted): string {
  const t = tallyOf(p.l1.tags);
  const W = 560;
  const rowH = 28;
  const rows = SIGNAL_IDS.map((s, i) => {
    const y = 8 + i * rowH;
    const w = (t.count[s] / 6) * 300;
    const ws = (t.stalled[s] / 6) * 300;
    return `<text x="0" y="${y + 13}" font-size="11.5" fill="#1F2328" font-family="system-ui,sans-serif">${esc(SIGNALS[s].label)}</text>
<rect x="140" y="${y}" width="${Math.max(w, 1.5).toFixed(1)}" height="16" fill="#8B9098" stroke="#1F2328"/>
<rect x="140" y="${y}" width="${ws.toFixed(1)}" height="16" fill="#2F5D62" stroke="#1F2328"/>
<text x="${(146 + w).toFixed(1)}" y="${y + 13}" font-size="11.5" fill="#1F2328" font-family="system-ui,sans-serif">${esc(tt(`${t.count[s]} · ${t.stalled[s]} stalled`, `${t.count[s]} · ${t.stalled[s]} stockend`))}</text>`;
  }).join("\n");
  const H = 8 + SIGNAL_IDS.length * rowH;
  const title = tt("Observations per signal type, as you tagged them; the dark part stalled", "Beobachtungen pro Signalart, wie Sie sie zugeordnet haben; der dunkle Teil stockte");
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title>${rows}</svg>`;
}

export function analysisBody(p: Persisted): string {
  const { l1 } = p;
  const sortRows = REASONS.map((r, i) => `<tr><td class="id">${i + 1}</td><td>${esc(r.quote)}</td><td>${l1.sort[r.id] ? esc(AREA_LABEL[l1.sort[r.id]!]) : "—"}</td></tr>`).join("");
  const sortNote = l1.sortReasoning ? `<p class="legend">${esc(tt(`The reasoning for the sort was opened after ${l1.sortChecks} checks.`, `Die Begründung zur Sortierung wurde nach ${l1.sortChecks} Prüfungen geöffnet.`))}</p>` : "";
  const fig = (v: string) => (v.trim() ? esc(v.trim()) : "—");
  const figTable = `<table><thead><tr><th>${esc(tt("Figure", "Wert"))}</th><th class="num">${esc(tt("Your figure (€ per year)", "Ihr Wert (€ pro Jahr)"))}</th></tr></thead><tbody>
${FIGURE_IDS.map((f) => `<tr><td class="id">${esc(FIGURES[f].label)}</td><td class="num">${fig(l1.fig[f])}</td></tr>`).join("")}</tbody></table>
<p class="legend">${esc(tt(`As briefed (customer survey and contract data, Case assumption): satisfied ${NETSOL.satisfied.customers} customers, ${NETSOL.satisfied.churn}% churn; delighted ${NETSOL.delighted.customers} customers, ${NETSOL.delighted.churn}% churn; average contract ${euro(NETSOL.contract)}; margin ${NETSOL.margin}%; ${NETSOL.moved} customers to move from satisfied to delighted.`, `Laut Auftrag (Kundenbefragung und Vertragsdaten, Fallannahme): zufrieden ${NETSOL.satisfied.customers} Kunden, ${NETSOL.satisfied.churn} % Churn; begeistert ${NETSOL.delighted.customers} Kunden, ${NETSOL.delighted.churn} % Churn; Ø Vertrag ${euro(NETSOL.contract)}; Marge ${NETSOL.margin} %; ${NETSOL.moved} Kunden sollen von zufrieden zu begeistert wechseln.`))}</p>`;
  const missLabel = MISSING_QUESTION.options.find((o) => o.id === l1.missing)?.label ?? "—";
  const approaches = l1.approaches.map((a, i) => `<h3>${esc(tt(`Approach ${i + 1}`, `Ansatz ${i + 1}`))} · ${a.factor ? esc(FACTOR_LABEL[a.factor]) : "—"}</h3>${para(a.text)}`).join("");
  const tagRows = OBSERVATIONS.map((o) => `<tr><td class="id">${esc(o.deal)}</td><td>${esc(o.kind)} · ${esc(OUTCOME_LABEL[o.outcome])}</td><td>${esc(o.text)}</td><td>${l1.tags[o.id] ? esc(SIGNALS[l1.tags[o.id]!].label) : "—"}</td></tr>`).join("");
  const tagNote = l1.tagReasoning ? `<p class="legend">${esc(tt(`The reasoning for the tags was opened after ${l1.tagChecks} checks.`, `Die Begründung zur Zuordnung wurde nach ${l1.tagChecks} Prüfungen geöffnet.`))}</p>` : "";
  const weakList = l1.weak.length ? `<ul>${l1.weak.map((w) => `<li>${esc(WEAK_BY_ID[w].label)}</li>`).join("")}</ul>` : `<p class="muted">—</p>`;
  const respLabel = (id: string | null) => RESPONSES.find((r) => r.id === id)?.label ?? "—";
  const sysRows = SIGNAL_IDS.map((s) => `<tr><td class="id">${esc(SIGNALS[s].label)}</td><td>${esc(respLabel(l1.system[s].response))}</td><td>${l1.system[s].team ? esc(TEAMS[l1.system[s].team!]) : "—"}</td></tr>`).join("");
  const chosen = l1.chosen;
  const measureRows = chosen
    .map((id) => {
      const m = MEASURE_BY_ID[id];
      const aims = l1.aims[id];
      return `<tr><td class="id">${esc(m.name)}</td><td>${aims === undefined ? "—" : aims.length ? esc(aims.map((a) => FACTOR_LABEL[a]).join(", ")) : esc(tt("none of the three", "keinen der drei"))}</td><td class="num">${l1.eff[id] || "—"} × ${l1.sus[id] || "—"} × ${l1.fea[id] || "—"} = ${measureScore(l1, id) || "—"}</td><td class="num">${esc(euro(m.cost))}</td></tr>`;
    })
    .join("");
  const cov = coverage(l1);
  const notBuilt = cov.filter((c) => !c.covered).map((c) => FACTOR_LABEL[c.factor]).join(", ");
  const covLine = chosen.length
    ? tt(`Factors at least one chosen measure builds: ${cov.filter((c) => c.covered).length} of 3${notBuilt ? ` (not built: ${notBuilt})` : ""}.`, `Faktoren, die mindestens eine gewählte Maßnahme aufbaut: ${cov.filter((c) => c.covered).length} von 3${notBuilt ? ` (nicht aufgebaut: ${notBuilt})` : ""}.`)
    : "";
  const cost = totalCost(chosen);
  const order = l1.order.filter((id) => chosen.includes(id));

  return `${header("Retention Analysis File", tt("Levels 1 and 2 · Knowledge and application", "Level 1 und 2 · Wissen und Anwendung"), p)}
<h2>${esc(tt("The case", "Der Fall"))}</h2>
<p>${esc(tt(`NetSolutions GmbH, a German provider of managed IT services for the Mittelstand: customers are satisfied but not loyal, repeat purchases are rare, and sales reacts instead of managing. Budget ${euro(BUDGET)}, time ${MONTHS} months. Evidence in the file: nine customer statements, survey and contract data, and twelve observations from current deals.`, `NetSolutions GmbH, ein deutscher Anbieter von Managed IT Services für den Mittelstand: Kunden sind zufrieden, aber nicht treu, Wiederkäufe sind selten, und der Vertrieb reagiert statt zu steuern. Budget ${euro(BUDGET)}, Zeit ${MONTHS} Monate. Evidenz in der Datei: neun Kundenaussagen, Befragungs- und Vertragsdaten und zwölf Beobachtungen aus laufenden Deals.`))}</p>

<h2>${esc(tt("Part 1 · Understand the missing tie", "Teil 1 · Die fehlende Bindung verstehen"))}</h2>
<h3>${esc(tt("1.1 · Why customers feel no tie, sorted by area", "1.1 · Warum Kunden keine Bindung spüren, nach Bereich sortiert"))}</h3>
<table><thead><tr><th>#</th><th>${esc(tt("What the customer said", "Was der Kunde sagte"))}</th><th>${esc(tt("Your area", "Ihr Bereich"))}</th></tr></thead><tbody>${sortRows}</tbody></table>${sortNote}
<h3>${esc(tt("A reason of my own", "Ein eigener Grund"))}</h3>${para(l1.extraReason)}
<h3>${esc(tt("1.2 · What satisfaction and delight are worth", "1.2 · Was Zufriedenheit und Begeisterung wert sind"))}</h3>
${figTable}
${para(l1.worth)}
<h2>${esc(tt("1.3 · What is missing, and three approaches", "1.3 · Was fehlt, und drei Ansätze"))}</h2>
<p><strong>${esc(tt("From the customer's perspective, what is missing:", "Was aus Sicht des Kunden fehlt:"))}</strong> ${esc(missLabel)}</p>
${approaches}
<h2>${esc(tt("1.4 · Coaching reflection", "1.4 · Coaching-Reflexion"))}</h2>
<h3>${esc(tt("Why is satisfaction not enough?", "Warum reicht Zufriedenheit nicht?"))}</h3>${para(l1.reflect.satisfaction)}
<h3>${esc(tt("Where are signals overlooked?", "Wo werden Signale übersehen?"))}</h3>${para(l1.reflect.signal)}
<h3>${esc(tt("How would an experienced sales manager act?", "Wie würde eine erfahrene Vertriebsleitung handeln?"))}</h3>${para(l1.reflect.manager)}

<h2>${esc(tt("Part 2 · Read the signals and act", "Teil 2 · Die Signale lesen und handeln"))}</h2>
<h3>${esc(tt("2.1 · The twelve observations, as you tagged them", "2.1 · Die zwölf Beobachtungen, wie Sie sie zugeordnet haben"))}</h3>
<table><thead><tr><th>${esc(tt("Deal", "Deal"))}</th><th>${esc(tt("Kind · outcome", "Art · Ergebnis"))}</th><th>${esc(tt("Observation", "Beobachtung"))}</th><th>${esc(tt("Signal type", "Signalart"))}</th></tr></thead><tbody>${tagRows}</tbody></table>${tagNote}
${tallySvg(p)}
<h2>${esc(tt("2.2 · Weaknesses and a simple response system", "2.2 · Schwächen und ein einfaches Antwortsystem"))}</h2>
<h3>${esc(tt("Weaknesses in NetSolutions' retention", "Schwächen in der Kundenbindung von NetSolutions"))}</h3>${weakList}
<table><thead><tr><th>${esc(tt("Signal type", "Signalart"))}</th><th>${esc(tt("Response", "Antwort"))}</th><th>${esc(tt("Owner team", "Zuständiges Team"))}</th></tr></thead><tbody>${sysRows}</tbody></table>
<h3>${esc(tt("The risk of misreading a signal", "Das Risiko, ein Signal falsch zu lesen"))}</h3>${para(l1.misread)}
<h2>${esc(tt("2.3 · Three measures, scored and ordered", "2.3 · Drei Maßnahmen, bewertet und geordnet"))}</h2>
<table><thead><tr><th>${esc(tt("Measure", "Maßnahme"))}</th><th>${esc(tt("Builds", "Baut auf"))}</th><th class="num">${esc(tt("Effect × Sustainability × Feasibility", "Wirkung × Nachhaltigkeit × Machbarkeit"))}</th><th class="num">${esc(tt("Cost", "Kosten"))}</th></tr></thead><tbody>${measureRows || `<tr><td colspan="4">—</td></tr>`}</tbody></table>
<p class="legend">${esc(tt(`Total cost ${euro(cost)} of the ${euro(BUDGET)} budget${cost > BUDGET ? ` (${euro(cost - BUDGET)} over)` : ""}.`, `Gesamtkosten ${euro(cost)} vom Budget von ${euro(BUDGET)}${cost > BUDGET ? ` (${euro(cost - BUDGET)} darüber)` : ""}.`))} ${esc(covLine)}</p>
<h3>${esc(tt("Priority order", "Reihenfolge"))}</h3>
<ol>${order.map((id) => `<li>${esc(MEASURE_BY_ID[id].name)}</li>`).join("") || "<li>—</li>"}</ol>
${para(l1.why)}

<div class="foot">${esc(tt(`Checks requested: ${l1.checks}`, `Angeforderte Prüfungen: ${l1.checks}`))}<br/>${esc(tt(`Generated ${dateLabel()}.`, `Erstellt am ${dateLabel()}.`))}</div>`;
}

/* ------------------------------------------------------------------ Route 2 · the Retention System Memo */

/** The Level 3 memo. The on-screen live preview and the exported file are both built by this function. */
export function memoBody(p: Persisted): string {
  const { l1, r2 } = p;
  const name = p.participant.name.trim();
  const t1 = tallyOf(l1.tags);
  // Quotes only Route 1's Core answers (Block 2.1 tags, Block 2.3 measures), CLAUDE.md #40.
  const situation =
    t1.tagged || l1.chosen.length
      ? `<blockquote><strong>${esc(tt("Where Route 1 left off.", "Wo Route 1 aufgehört hat."))}</strong> ${esc(tt(`Uncertainty signals tagged in live deals: ${t1.count.uncertainty}, of which ${t1.stalled.uncertainty} stalled.`, `In laufenden Deals eingeordnete Unsicherheitssignale: ${t1.count.uncertainty}, davon ${t1.stalled.uncertainty} stockend.`))} ${esc(tt("Measures chosen:", "Gewählte Maßnahmen:"))} ${esc(l1.chosen.map((id) => MEASURE_BY_ID[id].name).join(", ") || "—")}.</blockquote>`
      : `<p class="muted">${esc(tt("Route 1 is not finished, so there is nothing to quote yet. Nothing is blocked.", "Route 1 ist nicht fertig, daher gibt es noch nichts zu zitieren. Nichts ist gesperrt."))}</p>`;
  const principleRows = r2.principles.map((c) => `<tr><td class="id">${esc(PRINCIPLES[c].name)}</td><td>${cell(r2.principleText[c] ?? "")}</td></tr>`).join("");
  const timeLabel = (id: string | null) => TIMES.find((x) => x.id === id)?.label ?? "—";
  const respLabel = (id: string | null) => RESPONSES.find((r) => r.id === id)?.label ?? "—";
  const processRows = SIGNAL_IDS.map((s) => {
    const r = r2.process[s];
    return `<tr><td class="id">${esc(SIGNALS[s].label)}</td><td>${r.team ? esc(TEAMS[r.team]) : "—"}</td><td>${esc(timeLabel(r.time))}</td><td>${esc(respLabel(r.action))}</td><td>${cell(r.note)}</td></tr>`;
  }).join("");
  const B = ["—", tt("Low", "Niedrig"), tt("Mid", "Mittel"), tt("High", "Hoch")];
  const leverRows = r2.levers
    .map((id) => `<tr><td class="id">${esc(LEVER_BY_ID[id].name)}${r2.greatest === id ? ` <span class="muted">(${esc(tt("greatest effect", "größte Wirkung"))})</span>` : ""}</td>${CRIT_IDS.map((c) => `<td>${esc(B[r2.rate[`${id}.${c}`] || 0])}</td>`).join("")}</tr>`)
    .join("");
  const letter = (v: string | undefined) => (!v ? "—" : v === "-" ? "–" : esc(v));
  const raciHead = ROLE_IDS.map((r) => `<th>${esc(RACI_ROLES[r].name)}</th>`).join("");
  const raciRows = ACTIVITY_IDS.map((a) => `<tr><td class="id">${esc(ACTIVITIES[a].name)}</td>${ROLE_IDS.map((r) => `<td>${letter(r2.raci[`${a}.${r}`])}</td>`).join("")}</tr>`).join("");
  const fundedIds = funded(r2);
  const archRows = ARCH.map((a) => {
    const on = !!r2.alloc[a.id];
    return `<tr><td class="id">${esc(a.name)}</td><td>${esc(on ? tt("funded", "finanziert") : tt("not funded", "nicht finanziert"))}</td><td class="num">${on ? esc(euro(a.cost)) : "—"}</td><td class="num">${on && r2.start[a.id] != null ? esc(tt(`month ${r2.start[a.id]}`, `Monat ${r2.start[a.id]}`)) : "—"}</td><td>${on && r2.owner[a.id] ? esc(OWNERS[r2.owner[a.id]!].name) : "—"}</td><td>${on ? cell(r2.trigger[a.id] ?? "") : "—"}</td></tr>`;
  }).join("");
  const d = DECISIONS.find((x) => x.id === r2.decision);
  const k = r2.tripKpi ? KPI_BY_ID[r2.tripKpi] : null;
  const thr = parseAmount(r2.tripThreshold);
  const u = (x: typeof k) => (x ? (x.unit === "%" ? tt("%", " %") : ` ${x.unit}`) : "");
  const action = { "": "—", scale: tt("scale up anyway", "trotzdem ausweiten"), adjust: tt("adjust one item and continue", "einen Punkt anpassen und weitermachen"), stop: tt("stop the rollout and reconsider the system", "den Rollout stoppen und das System überdenken") }[r2.tripAction];

  return `${header("Retention System Memo", tt("Level 3 · Management decision", "Level 3 · Managemententscheidung"), p)}
<p class="muted">${esc(tt(`To: the board · From: ${name || "Chief Customer Officer"}, NetSolutions GmbH · Budget ${euro(R2_BUDGET)} over ${R2_MONTHS} months.`, `An: den Vorstand · Von: ${name || "Chief Customer Officer"}, NetSolutions GmbH · Budget ${euro(R2_BUDGET)} über ${R2_MONTHS} Monate.`))}</p>
<h2>${esc(tt("1 · Situation", "1 · Lage"))}</h2>
<p>${esc(tt("Satisfied customers who are not loyal, three teams that do not share what they hear, a limited budget, high time pressure and incomplete data. The board asks for a scalable customer retention system anyway.", "Zufriedene Kunden, die nicht treu sind, drei Teams, die nicht teilen, was sie hören, ein begrenztes Budget, hoher Zeitdruck und unvollständige Daten. Der Vorstand verlangt trotzdem ein skalierbares Kundenbindungssystem."))}</p>
${situation}
<h2>${esc(tt("2 · Target vision: the principles of the system", "2 · Zielbild: die Prinzipien des Systems"))}</h2>
<table><thead><tr><th>${esc(tt("Principle", "Prinzip"))}</th><th>${esc(tt("What it means at NetSolutions", "Was es bei NetSolutions bedeutet"))}</th></tr></thead><tbody>${principleRows || `<tr><td colspan="2">${esc(tt("— (optional block, not answered)", "— (optionaler Block, nicht beantwortet)"))}</td></tr>`}</tbody></table>
<h2>${esc(tt("3 · The central process: from signal to response", "3 · Der zentrale Prozess: vom Signal zur Antwort"))}</h2>
<table><thead><tr><th>${esc(tt("Signal type", "Signalart"))}</th><th>${esc(tt("Owner", "Owner"))}</th><th>${esc(tt("Response time", "Reaktionszeit"))}</th><th>${esc(tt("First action", "Erste Aktion"))}</th><th>${esc(tt("What happens", "Was passiert"))}</th></tr></thead><tbody>${processRows}</tbody></table>
<h2>${esc(tt("4 · Strategic levers", "4 · Strategische Hebel"))}</h2>
<table><thead><tr><th>${esc(tt("Lever", "Hebel"))}</th>${CRITERIA.map((c) => `<th>${esc(c.name)}</th>`).join("")}</tr></thead><tbody>${leverRows || `<tr><td colspan="5">${esc(tt("— (optional block, not answered)", "— (optionaler Block, nicht beantwortet)"))}</td></tr>`}</tbody></table>
<h3>${esc(tt("Why the greatest lever is the greatest", "Warum der größte Hebel der größte ist"))}</h3>${para(r2.greatestWhy)}
<h2>${esc(tt("5 · Sales, service and marketing: who does what", "5 · Vertrieb, Service und Marketing: wer macht was"))}</h2>
<table><thead><tr><th>${esc(tt("Activity", "Aktivität"))}</th>${raciHead}</tr></thead><tbody>${raciRows}</tbody></table>
<p class="legend">${esc(tt("R = does the work · A = answers for the result and decides · C = asked before · I = told after · – = no role.", "R = macht die Arbeit · A = verantwortet das Ergebnis und entscheidet · C = vorher gefragt · I = nachher informiert · – = keine Rolle."))}</p>
<h2>${esc(tt("6 · The implementation architecture", "6 · Die Umsetzungsarchitektur"))}</h2>
<table><thead><tr><th>${esc(tt("Item", "Punkt"))}</th><th>${esc(tt("Status", "Status"))}</th><th class="num">${esc(tt("Cost", "Kosten"))}</th><th class="num">${esc(tt("Start", "Start"))}</th><th>${esc(tt("Owner", "Owner"))}</th><th>${esc(tt("Trigger", "Trigger"))}</th></tr></thead><tbody>${archRows}</tbody></table>
<p class="legend">${esc(archLeft(r2) >= 0
      ? tt(`Funded ${euro(archCost(r2))} of ${euro(R2_BUDGET)} (${euro(archLeft(r2))} left) across ${fundedIds.length} item${fundedIds.length === 1 ? "" : "s"}.`, `Finanziert ${euro(archCost(r2))} von ${euro(R2_BUDGET)} (${euro(archLeft(r2))} übrig) über ${fundedIds.length} ${fundedIds.length === 1 ? "Punkt" : "Punkte"}.`)
      : tt(`Funded ${euro(archCost(r2))} against ${euro(R2_BUDGET)}: ${euro(-archLeft(r2))} over the budget, across ${fundedIds.length} items. The reasons are in the triggers and the text below.`, `Finanziert ${euro(archCost(r2))} gegen ${euro(R2_BUDGET)}: ${euro(-archLeft(r2))} über dem Budget, über ${fundedIds.length} Punkte. Die Gründe stehen in den Triggern und im Text unten.`))}</p>
${ARCH_IDS.every((id) => r2.alloc[id]) ? "" : `<h3>${esc(tt("Left out, and when we look again", "Weggelassen, und wann wir es wieder ansehen"))}</h3>${para(r2.postponed)}<p><strong>${esc(tt("Pickup point:", "Pickup Point:"))}</strong> ${cell(r2.pickup)}</p>`}
<h2>${esc(tt("7 · The decision", "7 · Die Entscheidung"))}</h2>
<p><strong>${d ? esc(d.label) : "—"}</strong>${d ? ` — ${esc(d.detail)}` : ""}</p>
<h3>${esc(tt("What this decision rests on", "Worauf diese Entscheidung beruht"))}</h3>
<ol>${r2.assumptions.map((a) => `<li>${cell(a)}</li>`).join("")}</ol>
<h3>Tripwire</h3>
<p>${esc(tt(`${k ? k.label : "—"} reaches ${thr !== null && k ? `${num(thr)}${u(k)}` : "—"} by month ${r2.tripMonth ?? "—"} (today: ${k ? `${num(k.baseline)}${u(k)}` : "—"}). If it is missed: ${action}.`, `${k ? k.label : "—"} erreicht ${thr !== null && k ? `${num(thr)}${u(k)}` : "—"} bis Monat ${r2.tripMonth ?? "—"} (heute: ${k ? `${num(k.baseline)}${u(k)}` : "—"}). Wenn er verfehlt wird: ${action}.`))}</p>
<h3>${esc(tt("If two satisfied customers leave anyway in month 3", "Wenn in Monat 3 trotzdem zwei zufriedene Kunden gehen"))}</h3>${para(r2.challenge)}

<div class="foot">${esc(tt(`Checks requested: ${r2.checks}`, `Angeforderte Prüfungen: ${r2.checks}`))}<br/>${esc(tt(`Generated ${dateLabel()}.`, `Erstellt am ${dateLabel()}.`))}</div>`;
}

export { ARCH_BY_ID };
