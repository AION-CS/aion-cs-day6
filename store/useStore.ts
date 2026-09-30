"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { REASON_IDS } from "@/data/reasons";
import type { AreaTag, ReasonId } from "@/data/reasons";
import { APPROACH_COUNT } from "@/data/approaches";
import type { Factor, MissingId } from "@/data/approaches";
import { OBS_IDS, SIGNAL_IDS } from "@/data/signals";
import type { ObsId, ResponseId, SignalType, TeamId, WeakId } from "@/data/signals";
import type { MeasureId } from "@/data/measures";
import type { FigureId } from "@/data/delight";
import type { ArchId, DecisionId, KpiId, LeverId, OwnerId, PrincipleId, ProcessRow, RaciLetter } from "@/data/route2";
import { KEY_L1, KEY_R2 } from "@/data/mentorKey";
import { FIGURE_BUILDERS, modelParts } from "@/lib/calcBuilder";
import type { RouteNo } from "@/lib/routes";

export const STORAGE_KEY = "cs-d6-v1";
const HISTORY_CAP = 100;

/** 0 means not chosen yet. */
export type Score = 0 | 1 | 2 | 3;

export type SortMap = Record<ReasonId, AreaTag | null>;
export type TagMap = Record<ObsId, SignalType | null>;
export type ApproachRow = { factor: Factor | null; text: string };
export type SystemRow = { response: ResponseId | null; team: TeamId | null };

/** Route 1 · Levels 1 and 2 — the Retention Analysis File. */
export type L1State = {
  sort: SortMap;
  sortHistory: SortMap[];
  sortFuture: SortMap[];
  sortChecks: number;
  sortResult: { holds: number; placed: number } | null;
  sortClue: boolean;
  sortReasoning: boolean;
  extraReason: string;
  fig: Record<FigureId, string>;
  figFlagged: FigureId[];
  figClue: Record<string, boolean>;
  parts: Record<string, string>;
  partFlags: string[];
  worth: string;
  worthFlagged: boolean;
  worthClue: boolean;
  missing: MissingId | null;
  missingFlagged: boolean;
  approaches: ApproachRow[];
  apprFlagged: number[];
  apprChecked: boolean;
  apprClue: boolean;
  reflect: { satisfaction: string; signal: string; manager: string };
  tags: TagMap;
  tagHistory: TagMap[];
  tagFuture: TagMap[];
  tagChecks: number;
  tagResult: { holds: number; placed: number } | null;
  tagClue: boolean;
  tagReasoning: boolean;
  weak: WeakId[];
  weakResult: { holds: number; chosen: number } | null;
  system: Record<SignalType, SystemRow>;
  sysResult: { holds: number; total: number } | null;
  sysClue: boolean;
  misread: string;
  chosen: MeasureId[];
  aims: Record<string, Factor[]>;
  eff: Record<string, Score>;
  sus: Record<string, Score>;
  fea: Record<string, Score>;
  measureFlags: string[];
  order: MeasureId[];
  why: string;
  checks: number;
};

/** Route 2 · Level 3 — the Retention System Memo. */
export type R2State = {
  principles: PrincipleId[];
  principleText: Record<string, string>;
  principleFlagged: boolean;
  principleClue: boolean;
  process: Record<SignalType, ProcessRow>;
  processResult: { holds: number; total: number } | null;
  processClue: boolean;
  levers: LeverId[];
  rate: Record<string, Score>;
  rateFlags: string[];
  leverResult: { systemic: number } | null;
  greatest: LeverId | null;
  greatestWhy: string;
  raci: Record<string, RaciLetter>;
  raciResult: { holds: number; total: number } | null;
  raciFlags: string[];
  raciClue: boolean;
  alloc: Record<string, boolean>;
  start: Record<string, number | null>;
  owner: Record<string, OwnerId | null>;
  trigger: Record<string, string>;
  postponed: string;
  pickup: string;
  seqResult: { holds: number; total: number } | null;
  seqClue: boolean;
  decision: DecisionId | null;
  decisionFlagged: boolean;
  assumptions: string[];
  tripKpi: KpiId | null;
  tripThreshold: string;
  tripMonth: number | null;
  tripAction: "" | "scale" | "adjust" | "stop";
  tripFlags: string[];
  challenge: string;
  /** No longer used (2026-09-30: Route 2 shows its numbers instead of asking for calculations). Kept so saves made before that still load. */
  calc: Record<string, string>;
  /** No longer used, see `calc`. */
  calcFlags: string[];
  checks: number;
};

export type Persisted = {
  participant: { name: string };
  ui: { bannerDismissed: Record<string, boolean>; sectionsRead: Record<string, boolean>; lang: "en" | "de" };
  l1: L1State;
  r2: R2State;
};

type Session = { mentorUnlocked: boolean; resetCount: number };
type Patch<T> = Partial<T> | ((s: T) => Partial<T>);

type Actions = {
  setParticipant: (patch: Partial<Persisted["participant"]>) => void;
  dismissBanner: (routeKey: string) => void;
  toggleRead: (cardId: string, value?: boolean) => void;
  setLang: (l: "en" | "de") => void;
  patchL1: (p: Patch<L1State>) => void;
  patchR2: (p: Patch<R2State>) => void;
  placeReason: (id: ReasonId, tag: AreaTag | null) => void;
  undoSort: () => void;
  redoSort: () => void;
  placeTag: (id: ObsId, s: SignalType | null) => void;
  undoTags: () => void;
  redoTags: () => void;
  setMentorUnlocked: (v: boolean) => void;
  mentorFill: () => void;
  resetRoute: (route: RouteNo | null) => void;
};

const emptySort = (): SortMap => Object.fromEntries(REASON_IDS.map((id) => [id, null])) as SortMap;
const emptyTags = (): TagMap => Object.fromEntries(OBS_IDS.map((id) => [id, null])) as TagMap;

export const emptyL1 = (): L1State => ({
  sort: emptySort(),
  sortHistory: [],
  sortFuture: [],
  sortChecks: 0,
  sortResult: null,
  sortClue: false,
  sortReasoning: false,
  extraReason: "",
  fig: { F1: "", F2: "", F3: "" },
  figFlagged: [],
  figClue: {},
  parts: {},
  partFlags: [],
  worth: "",
  worthFlagged: false,
  worthClue: false,
  missing: null,
  missingFlagged: false,
  approaches: Array.from({ length: APPROACH_COUNT }, () => ({ factor: null, text: "" })),
  apprFlagged: [],
  apprChecked: false,
  apprClue: false,
  reflect: { satisfaction: "", signal: "", manager: "" },
  tags: emptyTags(),
  tagHistory: [],
  tagFuture: [],
  tagChecks: 0,
  tagResult: null,
  tagClue: false,
  tagReasoning: false,
  weak: [],
  weakResult: null,
  system: Object.fromEntries(SIGNAL_IDS.map((s) => [s, { response: null, team: null }])) as Record<SignalType, SystemRow>,
  sysResult: null,
  sysClue: false,
  misread: "",
  chosen: [],
  aims: {},
  eff: {},
  sus: {},
  fea: {},
  measureFlags: [],
  order: [],
  why: "",
  checks: 0,
});

export const emptyR2 = (): R2State => ({
  principles: [],
  principleText: {},
  principleFlagged: false,
  principleClue: false,
  process: Object.fromEntries(SIGNAL_IDS.map((s) => [s, { team: null, time: null, action: null, note: "" }])) as Record<SignalType, ProcessRow>,
  processResult: null,
  processClue: false,
  levers: [],
  rate: {},
  rateFlags: [],
  leverResult: null,
  greatest: null,
  greatestWhy: "",
  raci: {},
  raciResult: null,
  raciFlags: [],
  raciClue: false,
  alloc: {},
  start: {},
  owner: {},
  trigger: {},
  postponed: "",
  pickup: "",
  seqResult: null,
  seqClue: false,
  decision: null,
  decisionFlagged: false,
  assumptions: ["", "", ""],
  tripKpi: null,
  tripThreshold: "",
  tripMonth: null,
  tripAction: "",
  tripFlags: [],
  challenge: "",
  calc: {},
  calcFlags: [],
  checks: 0,
});

const emptyPersisted = (): Persisted => ({
  participant: { name: "" },
  ui: { bannerDismissed: {}, sectionsRead: {}, lang: "en" },
  l1: emptyL1(),
  r2: emptyR2(),
});

const pushCapped = <T,>(list: T[], item: T) => [...list, item].slice(-HISTORY_CAP);
const resolve = <T,>(p: Patch<T>, s: T): Partial<T> => (typeof p === "function" ? (p as (x: T) => Partial<T>)(s) : p);
const isPlain = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * A deep merge of a saved value onto the defaults: every field an older or partial blob lacks comes from the defaults, a value of the
 * wrong type is dropped, and an empty default array or object takes what was saved (a history, a list of chosen ids).
 */
export function mergeDefaults<T>(base: T, saved: unknown): T {
  if (saved === undefined || saved === null) return base;
  if (Array.isArray(base)) {
    if (!Array.isArray(saved)) return base;
    if (base.length === 0) return saved as T;
    return base.map((b, i) => mergeDefaults(b, saved[i])) as T;
  }
  if (isPlain(base)) {
    if (!isPlain(saved)) return base;
    const keys = Object.keys(base);
    if (keys.length === 0) return { ...saved } as T;
    const out: Record<string, unknown> = { ...(saved as Record<string, unknown>) };
    for (const k of keys) out[k] = mergeDefaults((base as Record<string, unknown>)[k], (saved as Record<string, unknown>)[k]);
    return out as T;
  }
  return typeof saved === typeof base || base === null ? (saved as T) : base;
}

export const useStore = create<Persisted & Session & Actions>()(
  persist(
    (set) => ({
      ...emptyPersisted(),
      mentorUnlocked: false,
      resetCount: 0,

      setParticipant: (patch) => set((s) => ({ participant: { ...s.participant, ...patch } })),
      dismissBanner: (routeKey) => set((s) => ({ ui: { ...s.ui, bannerDismissed: { ...s.ui.bannerDismissed, [routeKey]: true } } })),
      toggleRead: (cardId, value) => set((s) => ({ ui: { ...s.ui, sectionsRead: { ...s.ui.sectionsRead, [cardId]: value ?? !s.ui.sectionsRead[cardId] } } })),
      setLang: (l) => set((s) => ({ ui: { ...s.ui, lang: l } })),

      patchL1: (p) => set((s) => ({ l1: { ...s.l1, ...resolve(p, s.l1) } })),
      patchR2: (p) => set((s) => ({ r2: { ...s.r2, ...resolve(p, s.r2) } })),

      placeReason: (id, tag) =>
        set((s) => {
          const before = s.l1.sort;
          if (before[id] === tag) return {};
          return { l1: { ...s.l1, sort: { ...before, [id]: tag }, sortHistory: pushCapped(s.l1.sortHistory, before), sortFuture: [], sortResult: null } };
        }),
      undoSort: () =>
        set((s) => {
          const prev = s.l1.sortHistory[s.l1.sortHistory.length - 1];
          if (!prev) return {};
          return { l1: { ...s.l1, sort: prev, sortHistory: s.l1.sortHistory.slice(0, -1), sortFuture: pushCapped(s.l1.sortFuture, s.l1.sort), sortResult: null } };
        }),
      redoSort: () =>
        set((s) => {
          const next = s.l1.sortFuture[s.l1.sortFuture.length - 1];
          if (!next) return {};
          return { l1: { ...s.l1, sort: next, sortHistory: pushCapped(s.l1.sortHistory, s.l1.sort), sortFuture: s.l1.sortFuture.slice(0, -1), sortResult: null } };
        }),

      placeTag: (id, sig) =>
        set((s) => {
          const before = s.l1.tags;
          if (before[id] === sig) return {};
          return { l1: { ...s.l1, tags: { ...before, [id]: sig }, tagHistory: pushCapped(s.l1.tagHistory, before), tagFuture: [], tagResult: null } };
        }),
      undoTags: () =>
        set((s) => {
          const prev = s.l1.tagHistory[s.l1.tagHistory.length - 1];
          if (!prev) return {};
          return { l1: { ...s.l1, tags: prev, tagHistory: s.l1.tagHistory.slice(0, -1), tagFuture: pushCapped(s.l1.tagFuture, s.l1.tags), tagResult: null } };
        }),
      redoTags: () =>
        set((s) => {
          const next = s.l1.tagFuture[s.l1.tagFuture.length - 1];
          if (!next) return {};
          return { l1: { ...s.l1, tags: next, tagHistory: pushCapped(s.l1.tagHistory, s.l1.tags), tagFuture: s.l1.tagFuture.slice(0, -1), tagResult: null } };
        }),

      setMentorUnlocked: (v) => set({ mentorUnlocked: v }),

      // Mentor autofill: every model answer in Routes 1 and 2, plus the participant name if it is empty, so each document can be exported straight away.
      mentorFill: () =>
        set((s) => {
          const l1: L1State = { ...emptyL1(), ...KEY_L1(), parts: modelParts(FIGURE_BUILDERS) };
          const r2: R2State = { ...emptyR2(), ...KEY_R2() };
          const participant = { name: s.participant.name.trim() ? s.participant.name : "Mentor Check" };
          return { participant, l1, r2, resetCount: s.resetCount + 1 };
        }),

      resetRoute: (route) =>
        set((s) => {
          const prefix = route === 1 ? "A" : route === 2 ? "B" : "";
          const keep = (k: string) => (route === null ? false : !k.startsWith(prefix));
          const sectionsRead = Object.fromEntries(Object.entries(s.ui.sectionsRead).filter(([k]) => keep(k)));
          const bannerDismissed = { ...s.ui.bannerDismissed };
          if (route === null) for (const k of Object.keys(bannerDismissed)) delete bannerDismissed[k];
          else delete bannerDismissed[`r${route}`];
          return {
            l1: route === null || route === 1 ? emptyL1() : s.l1,
            r2: route === null || route === 2 ? emptyR2() : s.r2,
            ui: { bannerDismissed, sectionsRead, lang: s.ui.lang },
            resetCount: s.resetCount + 1,
          };
        }),
    }),
    {
      name: STORAGE_KEY,
      version: 2,
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ participant: s.participant, ui: s.ui, l1: s.l1, r2: s.r2 }),
      // Version 1 is the first shape of Day 6. Version 2 (2026-09-30) adds the Route 2 calculators (r2.calc, r2.calcFlags; `merge`
      // fills them) and counts the delighted tripwire in customers instead of %, so an old percentage threshold is cleared.
      migrate: (persisted, version) => {
        const p = (persisted ?? {}) as Partial<Persisted>;
        if (version < 2 && p.r2 && p.r2.tripKpi === "delighted") p.r2 = { ...p.r2, tripThreshold: "", tripFlags: [] };
        return p as Persisted;
      },
      merge: (persisted, current) => {
        const merged = mergeDefaults(emptyPersisted(), (persisted ?? {}) as Partial<Persisted>);
        merged.ui.lang = merged.ui.lang === "de" ? "de" : "en";
        return { ...current, ...merged };
      },
    },
  ),
);

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const unsub = useStore.persist.onFinishHydration(() => setHydrated(true));
    if (useStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);
  return hydrated;
}

export function rehydrateStore() {
  return useStore.persist.rehydrate();
}
