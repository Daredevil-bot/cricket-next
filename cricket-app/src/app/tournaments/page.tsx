"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { getTournaments } from "../../../services/cricket";

// Mock Tournament Data (you can replace with API call later)
const mockTournaments = await getTournaments();

export default function TournamentsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">All Tournaments</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockTournaments.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl border p-4 bg-white/70 dark:bg-zinc-900/60 
                       border-zinc-200 dark:border-zinc-800 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-semibold text-base">{t.name}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {t.startDate} – {t.endDate}
              </p>
            </div>
            <button
              className="mt-3 inline-flex items-center text-sm font-medium text-emerald-600"
              onClick={() => (window.location.href = `/tournament/${t.id}`)}
            >
              View details <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
