/**
 * Re-derives every figure and every rule the day rests on, from the same data files the site uses, and compares them with the
 * results briefed in the README. Run: npm run verify:calc. A failed line prints FAIL and the process exits with code 1.
 *
 * The data files are TypeScript with "@/" imports, so a tiny loader transpiles them on the fly (no test framework, no extra dependency).
 */
const path = require("path");
const fs = require("fs");
const Module = require("module");
const ts = require(path.join(process.cwd(), "node_modules", "typescript"));

const root = process.cwd();
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (request.startsWith("@/")) {
    const base = path.join(root, request.slice(2));
    for (const ext of [".ts", ".tsx", "/index.ts"]) if (fs.existsSync(base + ext)) return base + ext;
  }
  return origResolve.call(this, request, ...rest);
};
for (const ext of [".ts", ".tsx"])
  require.extensions[ext] = function (module, filename) {
    const out = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX },
    });
    module._compile(out.outputText, filename);
  };

let failed = 0;
const ok = (name, cond, detail = "") => {
  console.log(`${cond ? "ok  " : "FAIL"}  ${name}${detail ? "  " + detail : ""}`);
  if (!cond) failed++;
};
const eq = (name, a, b) => ok(name, JSON.stringify(a) === JSON.stringify(b), `got ${JSON.stringify(a)}, want ${JSON.stringify(b)}`);

const lang = require("@/lib/lang");
const del = require("@/data/delight");
const rs = require("@/data/reasons");
const sig = require("@/data/signals");
const meas = require("@/data/measures");
const r2 = require("@/data/route2");
const key = require("@/data/mentorKey");
const checks = require("@/lib/checks");
const calc = require("@/lib/calcBuilder");
const missing = require("@/lib/missing");
const progress = require("@/lib/progress");
const store = require("@/store/useStore");

// --- Block 1.2 --------------------------------------------------------------------
eq("F1 gross profit lost, satisfied", del.DELIGHT.f1, 172800);
eq("F2 gross profit lost, delighted", del.DELIGHT.f2, 19200);
eq("F3 gross profit kept by moving 30", del.DELIGHT.f3, 43200);
eq("customers leaving per year (satisfied, delighted)", [del.DELIGHT.leaveSatisfied, del.DELIGHT.leaveDelighted], [18, 2]);
for (const f of ["F1", "F2", "F3"]) {
  const b = calc.FIGURE_BUILDERS[f];
  const parts = calc.modelParts({ [f]: b });
  eq(`builder ${f} reproduces the answer`, calc.builderResult(b, f, parts), calc.figAnswer(f));
  eq(`builder ${f} flags nothing on model parts`, calc.wrongParts(b, f, parts), []);
}
const wrong1 = { ...calc.modelParts({ F1: calc.FIGURE_BUILDERS.F1 }), "F1.churn": "5" };
eq("builder F1 flags exactly the wrong part", calc.wrongParts(calc.FIGURE_BUILDERS.F1, "F1", wrong1), ["F1.churn"]);
const wrong3 = { ...calc.modelParts({ F3: calc.FIGURE_BUILDERS.F3 }), "F3.to": "20" };
eq("builder F3 flags exactly the wrong part", calc.wrongParts(calc.FIGURE_BUILDERS.F3, "F3", wrong3), ["F3.to"]);
eq("Kontor worked example", [del.KONTOR_RESULT.satisfied, del.KONTOR_RESULT.delighted, del.KONTOR_RESULT.kept], [94500, 12600, 10710]);
ok("worked example uses other numbers than the task", del.KONTOR.contract !== del.NETSOL.contract && del.KONTOR.moved !== del.NETSOL.moved);

// --- Block 1.1 --------------------------------------------------------------------
const areaCount = rs.REASONS.reduce((o, r) => ({ ...o, [r.truth]: (o[r.truth] || 0) + 1 }), {});
eq("statements: three per area", areaCount, { rel: 3, comm: 3, value: 3 });

// --- Block 2.1 / 2.2 ----------------------------------------------------------------
eq("observations per signal type", sig.TRUTH_COUNTS, { interest: 3, comparison: 3, proximity: 3, uncertainty: 3 });
eq("stalled per signal type", sig.TRUTH_STALLED, { interest: 1, comparison: 2, proximity: 1, uncertainty: 3 });
ok("every uncertainty signal stalled", sig.TRUTH_STALLED.uncertainty === sig.TRUTH_COUNTS.uncertainty);
eq("real weaknesses", sig.WEAKNESSES.filter((w) => w.real).map((w) => w.id), ["owner", "invoice", "hesitation", "handover"]);
for (const s of sig.SIGNAL_IDS) ok(`model team for ${s} is accepted`, sig.TEAM_ACCEPT[s].length > 0);

// --- Block 2.3 --------------------------------------------------------------------
const scores = Object.fromEntries(meas.MEASURES.map((m) => [m.id, meas.modelScore(m.id)]));
eq("model scores", scores, { owner: 12, playbook: 18, reviews: 18, moments: 6, healthcheck: 4, discount: 9, newsletter: 9, starvisits: 6, handover: 18 });
eq("model three cost", meas.MODEL_COST, 95000);
ok("model three fit the budget", meas.MODEL_COST <= meas.BUDGET);
eq("model three are the three highest scores", [...meas.MEASURES].sort((a, b) => meas.modelScore(b.id) - meas.modelScore(a.id)).slice(0, 3).map((m) => m.id).sort(), [...meas.MODEL_MEASURES].sort());
ok("owner model on top of the model three breaks the budget", meas.MODEL_COST + meas.MEASURE_BY_ID.owner.cost > meas.BUDGET);
ok("discount and newsletter build no factor", meas.MEASURE_BY_ID.discount.targets.length === 0 && meas.MEASURE_BY_ID.newsletter.targets.length === 0);

// --- Route 2 --------------------------------------------------------------------
const archCost = r2.MODEL_ARCH.reduce((s, id) => s + r2.ARCH_BY_ID[id].cost, 0);
eq("model architecture cost", archCost, 150000);
ok("model architecture inside the budget", archCost <= r2.R2_BUDGET);
ok("owners on top breaks the budget", archCost + r2.ARCH_BY_ID.owners.cost > r2.R2_BUDGET);
for (const id of r2.MODEL_LEVERS) for (const c of r2.CRIT_IDS) ok(`model rating ${id}.${c} within the printed limit`, r2.LEVER_BY_ID[id].model[c] <= r2.maxRating(id, c));
for (const l of r2.LEVERS) for (const c of r2.CRIT_IDS) ok(`every lever's model rating within the limit (${l.id}.${c})`, l.model[c] <= r2.maxRating(l.id, c));
ok("model levers are all systemic", checks.systemicCount(r2.MODEL_LEVERS) === r2.MODEL_LEVERS.length);
for (const a of r2.ACTIVITY_IDS) {
  const first = r2.ROLE_IDS.map((r) => r2.RACI_ACCEPT[a][r][0]);
  ok(`model RACI row ${a} has exactly one A and someone doing the work`, first.filter((x) => x === "A").length === 1 && first.some((x) => x === "R" || x === "A"));
}

// --- the mentor fill, in both languages --------------------------------------------
for (const l of ["en", "de"]) {
  lang.setCurrentLang(l);
  const l1 = { ...store.emptyL1(), ...key.KEY_L1(), parts: calc.modelParts(calc.FIGURE_BUILDERS) };
  const rr = { ...store.emptyR2(), ...key.KEY_R2() };
  const p = { participant: { name: "Mentor Check" }, ui: { bannerDismissed: {}, sectionsRead: {}, lang: l }, l1, r2: rr };
  eq(`[${l}] mentor fill leaves Route 1 missing list empty`, missing.l1Missing(p).map((m) => m.label), []);
  eq(`[${l}] mentor fill leaves Route 2 missing list empty`, missing.r2Missing(p).map((m) => m.label), []);
  const tb = progress.taskBlocks(p);
  eq(`[${l}] every task block complete after the fill`, Object.values(tb).every(Boolean), true);
  eq(`[${l}] model sort all hold`, checks.sortHolds(l1.sort), { holds: 9, placed: 9 });
  eq(`[${l}] model tags all hold`, checks.tagHolds(l1.tags), { holds: 12, placed: 12 });
  eq(`[${l}] model weaknesses all real`, checks.weakHolds(l1.weak), { holds: 3, chosen: 3 });
  eq(`[${l}] model system holds`, [checks.systemHolds(l1).holds, checks.systemHolds(l1).total], [8, 8]);
  ok(`[${l}] model missing choice holds`, checks.missingHolds(l1));
  eq(`[${l}] model approaches pass the floor`, checks.approachFlags(l1), []);
  ok(`[${l}] model sentence cites a figure`, checks.citesDelightFigure(l1.worth));
  for (const id of l1.chosen) ok(`[${l}] model aims and sustainability hold (${id})`, checks.aimsHold(id, l1.aims[id]) && checks.susHolds(id, l1.sus[id]));
  eq(`[${l}] model order has no inversion`, checks.orderInversions(l1), []);
  eq(`[${l}] model principles hold`, checks.principlesHold(rr), { view: true, signals: true });
  eq(`[${l}] model process holds`, checks.processHolds(rr), { holds: 12, total: 12 });
  eq(`[${l}] model ratings flag nothing`, checks.ratingFlags(rr), []);
  eq(`[${l}] model RACI holds`, checks.raciHolds(rr), { holds: 16, total: 16 });
  eq(`[${l}] model RACI rows break no rule`, checks.raciRowFlags(rr), []);
  eq(`[${l}] model architecture holds all rules`, checks.seqRules(rr), { baseline: true, budget: true, system: true, hasBaseline: true });
  eq(`[${l}] model tripwire flags nothing`, checks.tripFlagsOf(rr), []);
}
lang.setCurrentLang("en");

console.log(failed ? `\n${failed} check(s) FAILED` : "\nAll checks passed.");
process.exit(failed ? 1 : 0);
