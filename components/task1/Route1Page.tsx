"use client";

import { SectionRail } from "@/components/chrome/SectionRail";
import { PageNav } from "@/components/chrome/PageNav";
import { HashFlash } from "@/components/chrome/HashFlash";
import { SuggestedOrderBanner } from "@/components/ui/Banner";
import { MateriA } from "@/components/materi/Materi";
import { Task1 } from "@/components/task1/Task1";
import { ResetRoute } from "@/components/ui/ResetRoute";
import { tt } from "@/lib/lang";

export function Route1Page() {
  return (
    <div className="space-y-8 pt-4">
      <HashFlash />
      <header className="space-y-1">
        <p className="smallcaps text-accent">{tt("Route 1 · Levels 1 and 2 · Knowledge and application", "Route 1 · Level 1 und 2 · Wissen und Anwendung")}</p>
        <h1>{tt("Satisfied, but not attached: why customers leave and how to read their signals", "Zufrieden, aber nicht gebunden: warum Kunden gehen und wie man ihre Signale liest")}</h1>
      </header>
      <SuggestedOrderBanner
        routeKey="r1"
        text={tt(
          "Materi A → the Retention Analysis task, one case in two parts (Understand the missing tie, Read the signals and act). Every section stays open, so you can start anywhere.",
          "Materi A → die Aufgabe Retention Analysis, ein Fall in zwei Teilen (Die fehlende Bindung verstehen, Die Signale lesen und handeln). Jeder Abschnitt bleibt offen, Sie können überall beginnen.",
        )}
      />
      <SectionRail route={1} />
      <PageNav route={1} />
      <MateriA />
      <Task1 />
      <ResetRoute route={1} />
    </div>
  );
}
