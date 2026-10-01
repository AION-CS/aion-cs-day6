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

// A tiny in-memory localStorage, so the store's persist API (migrate, merge) can be exercised outside a browser.
const mem = new Map();
global.localStorage = { getItem: (k) => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => mem.set(k, String(v)), removeItem: (k) => mem.delete(k), clear: () => mem.clear(), key: () => null, length: 0 };
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
// The "Acts on" label printed after the weeks (CLAUDE.md #45)
ok("every measure has a valid area", meas.MEASURES.every((m) => ["rel", "comm", "value", "price"].includes(m.area)));
eq("only the discount acts on price", meas.MEASURES.filter((m) => m.area === "price").map((m) => m.id), ["discount"]);
eq("the model three act on the three areas customers named, one each", meas.MODEL_MEASURES.map((id) => meas.MEASURE_BY_ID[id].area).sort(), ["comm", "rel", "value"]);
ok("a measure that acts on price builds no factor", meas.MEASURES.every((m) => m.area !== "price" || m.targets.length === 0));

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


// --- Route 2 · every number comes from a method on printed figures (CLAUDE.md #43) ---------------------------------
const cr2 = require("@/lib/calcR2");
const mg = require("@/lib/mentorGuide");
eq("kept per customer moved a year", r2.KEPT_PER_MOVE, 1440);
eq("gross profit per customer a year", r2.GP_PER_CUSTOMER, 9600);
eq("trigger numbers by method", Object.fromEntries(r2.MODEL_ARCH.map((id) => [id, r2.triggerNumber(id)])), { view: 80, playbook: 6, handover: 5, reviews: 10, moments: 6 });
eq("trigger months from the model start months", Object.fromEntries(r2.MODEL_ARCH.map((id) => [id, r2.modelTriggerMonth(id)])), { view: 2, playbook: 4, handover: 5, reviews: 6, moments: 6 });
ok("every model trigger month inside the plan", r2.MODEL_ARCH.every((id) => r2.modelTriggerMonth(id) <= r2.R2_MONTHS));
eq("tripwire = 40 + payback of the customer items, month of the last one", r2.MODEL_TRIPWIRE, { kpi: "delighted", threshold: 60, month: 6 });
eq("pickup point by the cost of waiting", r2.MODEL_PICKUP, { item: "owners", count: 5, month: 6 });
eq("delighted group: expected leavers and the count that proves it wrong", [r2.DELIGHTED_EXPECTED, r2.DELIGHTED_WRONG_AT], [1, 2]);
for (const l of ["en", "de"]) {
  lang.setCurrentLang(l);
  const k2 = key.KEY_R2();
  for (const id of r2.MODEL_ARCH) {
    const t = k2.trigger[id];
    ok(`[${l}] model trigger ${id} states its method number and month`, t.includes(String(r2.triggerNumber(id))) && t.includes(String(r2.modelTriggerMonth(id))));
  }
  ok(`[${l}] pickup states 5 and month 6`, k2.pickup.includes("5") && k2.pickup.includes("6"));
  ok(`[${l}] assumption 1 uses the tripwire number (same thing, same month)`, k2.assumptions[0].includes("60") && k2.assumptions[0].includes(String(r2.MODEL_TRIPWIRE.month)));
  ok(`[${l}] assumption 2 uses the playbook trigger number and month`, k2.assumptions[1].includes(`${r2.triggerNumber("playbook")} `) && k2.assumptions[1].includes(String(r2.modelTriggerMonth("playbook"))));
  ok(`[${l}] assumption 3 uses the count that proves it wrong`, k2.assumptions[2].includes(String(r2.DELIGHTED_WRONG_AT)));
  ok(`[${l}] challenge states the cost of the two losses`, k2.challenge.includes(lang.euro(2 * r2.GP_PER_CUSTOMER)));
  // the learner-facing example never equals the model answer on a graded or calculated field (CLAUDE.md #23)
  for (const [name, g] of [["worth", mg.worthGuide()], ["why", mg.whyGuide()], ["greatest", mg.greatestGuide()], ["pickup", mg.pickupGuide()], ["postponed", mg.postponedGuide()], ["trip", mg.challengeGuide()], ...r2.MODEL_ARCH.map((id) => [`trigger ${id}`, mg.triggerGuide(id)]), ...[0, 1, 2].map((i) => [`assumption ${i + 1}`, mg.assumptionGuide(i)])])
    ok(`[${l}] ${name}: learner example exists and differs from the model answer`, !!g.example && g.example !== g.answer);
}
lang.setCurrentLang("en");

// the numbers Route 2 shows ("Show the numbers you can use") equal the model numbers, and every input links to a printed element
{
  const rr0 = { ...store.emptyR2(), ...key.KEY_R2() };
  const b = cr2.r2Builders(rr0);
  const res = (k) => calc.builderResult(b[k], k, calc.modelParts({ [k]: b[k] }));
  for (const id of r2.MODEL_ARCH) {
    eq(`shown number trig-${id} = trigger number`, res(`trig-${id}`), r2.triggerNumber(id));
    eq(`shown month month-${id} = trigger month`, res(`month-${id}`), r2.modelTriggerMonth(id));
  }
  eq("shown pickup number for the left-out item = 5", res(`pickup-${r2.MODEL_PICKUP.item}`), 5);
  eq("shown tripwire = 60", res("trip"), 60);
  eq("shown stay sign = 2", res("stay"), 2);
  eq("shown loss = 19200", res("loss"), 19200);
  for (const [k, bb] of Object.entries(b)) ok(`every input of ${k} links to an element`, bb.parts.every((p) => typeof p.target === "string" && p.target.length > 0));
  ok("every number has a why and is ready with the model plan", Object.keys(b).every((k) => { const i = cr2.numberInfo(k, rr0); return i.why.length > 40 && (i.ready === null || k.startsWith("month-")); }));
  // a learner who starts the reviews in month 2 sees their own month
  const own = { ...rr0, start: { ...rr0.start, reviews: 2 } };
  const bo = cr2.r2Builders(own);
  eq("own start month: the shown month follows the learner's own month", calc.builderResult(bo["month-reviews"], "month-reviews", calc.modelParts({ "month-reviews": bo["month-reviews"] })), 5);
  // nothing is shown before the learner has chosen what it depends on
  const empty = store.emptyR2();
  ok("month is not shown before a start month is chosen", cr2.numberInfo("month-reviews", empty).ready !== null);
  ok("tripwire is not shown before a customer item is funded", cr2.numberInfo("trip", empty).ready !== null);
}

// the trigger kits (Block 3.5): every item has a metric, its reason and three actions with reasons; the model items' own action is the first one
{
  const tk = require("@/data/triggerKit");
  for (const l of ["en", "de"]) {
    lang.setCurrentLang(l);
    for (const a of r2.ARCH) {
      const k = tk.TRIGGER_KIT[a.id];
      ok(`[${l}] kit ${a.id}: metric, reason and 3 actions, each with a why`, !!k && k.metric.length > 10 && k.metricWhy.length > 40 && k.reason.length > 3 && k.actions.length === 3 && k.actions.every((x) => x.text.length > 10 && x.why.length > 30));
      ok(`[${l}] kit ${a.id}: no reference to an Optional card`, !/Materi B[1-4]/.test(JSON.stringify(k)));
    }
    for (const id of r2.MODEL_ARCH) ok(`[${l}] kit ${id}: the model trigger's own action is offered`, r2.MODEL_TRIGGER[id] === undefined || r2.MODEL_TRIGGER[id].includes(tk.TRIGGER_KIT[id].actions[0].text));
  }
  lang.setCurrentLang("en");
}

// the facts on every item card (Block 3.5): what it rests on matches the one-person flag, and the payback bar is the trigger number
{
  const af = require("@/data/archFacts");
  ok("every item has a restsOn fact", r2.ARCH.every((a) => ["process", "role", "person"].includes(af.RESTS_ON[a.id])));
  ok("restsOn person matches the one-person flag", r2.ARCH.every((a) => (af.RESTS_ON[a.id] === "person") === a.onePerson));
  ok("the shared view is the baseline item and needs nothing first", r2.BASELINE_ITEM === "view");
}

// Elbe's worked numbers (Materi B5/B6) differ from the case and agree with B5's triggers
{
  const dB = require("@/components/materi/diagramsB");
  eq("Elbe method results", dB.ELBE_RESULT, { coverage: 75, dealPayback: 5, customerPayback: 8, waiting: 4, step: 18, month: 5 });
  ok("Elbe numbers differ from NetSolutions'", dB.ELBE_RESULT.coverage !== 80 && dB.ELBE_RESULT.dealPayback !== 6 && dB.ELBE.contract !== r2.R2_FIG.contract);
}

// --- Core / Optional (CLAUDE.md #35, #40) --------------------------------------------------------------------------
for (const l of ["en", "de"]) {
  lang.setCurrentLang(l);
  const full1 = key.KEY_L1();
  const full2 = key.KEY_R2();
  const l1 = { ...store.emptyL1(), sort: full1.sort, extraReason: full1.extraReason, fig: full1.fig, worth: full1.worth, tags: full1.tags, chosen: full1.chosen, aims: full1.aims, eff: full1.eff, sus: full1.sus, fea: full1.fea, order: full1.order, why: full1.why };
  const rr = { ...store.emptyR2(), process: full2.process, alloc: full2.alloc, start: full2.start, owner: full2.owner, trigger: full2.trigger, postponed: full2.postponed, pickup: full2.pickup, decision: full2.decision, assumptions: full2.assumptions, tripKpi: full2.tripKpi, tripThreshold: full2.tripThreshold, tripMonth: full2.tripMonth, tripAction: full2.tripAction, challenge: full2.challenge };
  const p = { participant: { name: "Core Only" }, ui: { bannerDismissed: {}, sectionsRead: {}, lang: l }, l1, r2: rr };
  eq(`[${l}] Core-only fill empties the Route 1 missing list`, missing.l1Missing(p).map((m) => m.label), []);
  eq(`[${l}] Core-only fill empties the Route 2 missing list`, missing.r2Missing(p).map((m) => m.label), []);
  // decisions are free (#38): an over-budget plan with reasons is not missing anything
  const over = { ...p, r2: { ...rr, alloc: { ...rr.alloc, owners: true }, start: { ...rr.start, owners: 2 }, owner: { ...rr.owner, owners: "saleslead" }, trigger: { ...rr.trigger, owners: "If fewer than 12 customers with an owner rate us 5 of 5 by month 6, then …" } } };
  ok(`[${l}] over budget: Block 3.5 still complete`, progress.taskBlocks(over).b35);
  ok(`[${l}] over budget: no budget entry in the missing list`, !missing.r2Missing(over).some((m) => /budget|Budget/.test(m.label)));
}
lang.setCurrentLang("en");
eq("Optional blocks", progress.OPTIONAL_BLOCKS, ["b13", "b14", "b22", "b31", "b32", "b33", "b34"]);
const mi = require("@/data/materialIndex");
eq("Optional cards", mi.MATERIALS.filter((m) => m.optional).map((m) => m.id), ["A6", "B1", "B2", "B3", "B4"]);
eq("Materi minutes", ["A", "B"].map((b) => mi.MATERIALS.filter((m) => m.block === b).reduce((s, m) => s + m.minutes, 0)), [60, 60]);

// --- key phrases are exact substrings of the item text, in both languages ------------------------------------------
for (const l of ["en", "de"]) {
  lang.setCurrentLang(l);
  for (const r of rs.REASONS) ok(`[${l}] key phrase inside statement ${r.id}`, r.quote.includes(rs.REASON_KEY[r.id]));
  for (const o of sig.OBSERVATIONS) ok(`[${l}] key phrase inside observation ${o.id}`, o.text.includes(sig.OBS_KEY[o.id]));
  for (const r of rs.REASONS) ok(`[${l}] statement ${r.id} does not mention price`, !/price|preis|rabatt|discount|teuer|expensive|cheap|günstig/i.test(r.quote));
}
lang.setCurrentLang("en");

// --- an old-shape blob (version 1) migrates and merges -----------------------------------------------------------
{
  const opts = store.useStore.persist.getOptions();
  const old = { participant: { name: "Old" }, ui: { bannerDismissed: {}, sectionsRead: { A1: true }, lang: "de" }, l1: { worth: "old" }, r2: { tripKpi: "delighted", tripThreshold: "33", challenge: "kept" } };
  const migrated = opts.migrate(JSON.parse(JSON.stringify(old)), 1);
  const merged = opts.merge(migrated, store.useStore.getState());
  eq("v1 → v2: the % threshold of the delighted tripwire is cleared", merged.r2.tripThreshold, "");
  eq("v1 → v2: calculators filled from the defaults", [merged.r2.calc, merged.r2.calcFlags], [{}, []]);
  eq("v1 → v2: other answers kept", [merged.participant.name, merged.l1.worth, merged.r2.challenge, merged.ui.lang, merged.ui.sectionsRead.A1], ["Old", "old", "kept", "de", true]);
}

console.log(failed ? `\n${failed} check(s) FAILED` : "\nAll checks passed.");
process.exit(failed ? 1 : 0);
