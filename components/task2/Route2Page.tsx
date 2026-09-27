"use client";

import { SectionRail } from "@/components/chrome/SectionRail";
import { PageNav } from "@/components/chrome/PageNav";
import { HashFlash } from "@/components/chrome/HashFlash";
import { SuggestedOrderBanner } from "@/components/ui/Banner";
import { MateriB } from "@/components/materi/Materi";
import { Task2 } from "@/components/task2/Task2";
import { ResetRoute } from "@/components/ui/ResetRoute";
import { Gloss } from "@/lib/glossify";
import { tt } from "@/lib/lang";

export function Route2Page() {
  return (
    <div className="space-y-8 pt-4">
      <HashFlash />
      <header className="space-y-3">
        <div className="space-y-1">
          <p className="smallcaps text-accent">{tt("Route 2 · Level 3 · Management decision", "Route 2 · Level 3 · Managemententscheidung")}</p>
          <h1>{tt("Build a retention system that works whoever is on duty", "Bauen Sie ein Bindungssystem, das wirkt, egal wer Dienst hat")}</h1>
        </div>
        <blockquote className="max-w-prose space-y-2 border-l-4 border-gold bg-accentSoft px-4 py-3 text-body text-ink">
          <p>
            <Gloss>
              {tt(
                "Route 1 found why NetSolutions' satisfied customers feel no tie and designed a first answer to their signals. Level 3 asks a different question: how do you turn that into a system for every customer, with sales, service and marketing working as one, and what do you decide today although the data is incomplete?",
                "Route 1 hat herausgefunden, warum die zufriedenen Kunden von NetSolutions keine Bindung spüren, und eine erste Antwort auf ihre Signale gestaltet. Level 3 stellt eine andere Frage: Wie wird daraus ein System für jeden Kunden, in dem Vertrieb, Service und Marketing zusammenarbeiten, und was entscheiden Sie heute, obwohl die Daten unvollständig sind?",
              )}
            </Gloss>
          </p>
        </blockquote>
      </header>
      <SuggestedOrderBanner
        routeKey="r2"
        text={tt(
          "Route 1 first is recommended, because the situation quotes the weaknesses and measures you named there. Every section stays open, so you can work through this route regardless.",
          "Route 1 zuerst wird empfohlen, weil die Lage die Schwächen und Maßnahmen zitiert, die Sie dort benannt haben. Jeder Abschnitt bleibt offen, Sie können diese Route trotzdem bearbeiten.",
        )}
      />
      <SectionRail route={2} />
      <PageNav route={2} />
      <MateriB />
      <Task2 />
      <ResetRoute route={2} />
    </div>
  );
}
