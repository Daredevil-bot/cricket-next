'use client';

import React, { useEffect, useMemo, useState } from "react";
import { Moon, Sun, Trophy , ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Single-file React UI (Next.js friendly) for a Cricbuzz-like homepage:
 * - Top live score ticker (scrolling)
 * - Tabs: Live Matches | Upcoming | Results
 * - Match cards (teams, score, overs)
 * - Dark mode toggle (persisted)
 * - Clean Tailwind CSS styling
 *
 * Drop this into a Next.js app under `app/page.tsx` or any route as default export.
 * All data is mocked – wire it to your API later.
 */

// -----------------------\n// Mock Data
// -----------------------
const mockLive = [
  {
    id: "ind-aus-1",
    series: "Border-Gavaskar Trophy",
    status: "LIVE",
    venue: "Nagpur",
    format: "Test",
    teams: {
      home: { name: "India", short: "IND", flag: "🇮🇳" },
      away: { name: "Australia", short: "AUS", flag: "🇦🇺" },
    },
    score: {
      home: { runs: 353, wkts: 6, overs: 91.2 },
      away: { runs: 0, wkts: 0, overs: 0 },
      batting: "home",
    },
    lastEvent: "FOUR! Kohli drives through covers",
  },
  {
    id: "pak-eng-1",
    series: "ENG tour of PAK",
    status: "LIVE",
    venue: "Lahore",
    format: "T20I",
    teams: {
      home: { name: "Pakistan", short: "PAK", flag: "🇵🇰" },
      away: { name: "England", short: "ENG", flag: "🏴" },
    },
    score: {
      home: { runs: 178, wkts: 4, overs: 18.3 },
      away: { runs: 0, wkts: 0, overs: 0 },
      batting: "home",
    },
    lastEvent: "SIX! pulled behind square",
  },
];

const mockUpcoming = [
  {
    id: "sl-sa-odi",
    series: "Bilateral ODI Series",
    status: "UPCOMING",
    venue: "Colombo",
    format: "ODI",
    startTime: "Aug 25, 18:00 IST",
    teams: {
      home: { name: "Sri Lanka", short: "SL", flag: "🇱🇰" },
      away: { name: "South Africa", short: "SA", flag: "🇿🇦" },
    },
  },
  {
    id: "wi-nz-t20",
    series: "Tri-Series",
    status: "UPCOMING",
    venue: "Kingston",
    format: "T20I",
    startTime: "Aug 26, 05:30 IST",
    teams: {
      home: { name: "West Indies", short: "WI", flag: "🇯🇲" },
      away: { name: "New Zealand", short: "NZ", flag: "🇳🇿" },
    },
  },
];

const mockResults = [
  {
    id: "ban-afg-test",
    series: "Test Series",
    status: "RESULT",
    venue: "Dhaka",
    format: "Test",
    teams: {
      home: { name: "Bangladesh", short: "BAN", flag: "🇧🇩" },
      away: { name: "Afghanistan", short: "AFG", flag: "🇦🇫" },
    },
    result: "BAN won by 143 runs",
  },
  {
    id: "ire-ned-odi",
    series: "ODI League",
    status: "RESULT",
    venue: "Dublin",
    format: "ODI",
    teams: {
      home: { name: "Ireland", short: "IRE", flag: "🇮🇪" },
      away: { name: "Netherlands", short: "NED", flag: "🇳🇱" },
    },
    result: "IRE won by 4 wkts",
  },
];

// Flatten a small ticker line from live matches
function buildTicker(lines: typeof mockLive) {
  return lines.map(m => `${m.teams.home.short} ${m.score.home.runs}/${m.score.home.wkts} (${m.score.home.overs}) vs ${m.teams.away.short} • ${m.series}`).join("  •  ");
}

// -----------------------\n// UI Helpers
// -----------------------
const useDarkMode = () => {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const init = saved ? saved === "dark" : prefers;
    setDark(init);
    document.documentElement.classList.toggle("dark", init);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);
  return { dark, setDark } as const;
};

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-emerald-600/10 border-emerald-600/30 text-emerald-700 dark:text-emerald-300 dark:border-emerald-400/30 dark:bg-emerald-400/10">
      {children}
    </span>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:text-zinc-300">
      {children}
    </span>
  );
}

function Team({ flag, name, short }: { flag: string; name: string; short: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg leading-none select-none">{flag}</span>
      <span className="font-semibold tracking-wide">{short}</span>
      <Pill>{name}</Pill>
    </div>
  );
}

function Score({ runs, wkts, overs }: { runs: number; wkts: number; overs: number }) {
  return (
    <div className="text-2xl font-bold tabular-nums">
      {runs}/{wkts}
      <span className="ml-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">({overs})</span>
    </div>
  );
}

function MatchCard({
  match,
  cta = "Details",
  footer,
}: {
  match: any;
  cta?: string;
  footer?: React.ReactNode;
}) {
  console.log(match.startTime);
  
  const isLive = match.status === "LIVE";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="group relative rounded-2xl border p-4 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow border-zinc-200 dark:border-zinc-800"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isLive ? <Badge>LIVE</Badge> : <Pill>{match.format}</Pill>}
          <span className="text-xs text-zinc-500 dark:text-zinc-400">{match.series}</span>
        </div>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{match.venue}</span>
      </div>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div className="space-y-2">
          <Team {...match.teams.home} />
          {match.score?.home ? <Score {...match.score.home} /> : null}
        </div>
        <div className="space-y-2 sm:text-right">
          <Team {...match.teams.away} />
          {match.score?.away ? <Score {...match.score.away} /> : null}
        </div>
      </div>
      {match.startTime ? (
        <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">Starts: {match.startTime}</div>
      ) : null}
      {match.result ? (
        <div className="mt-3 text-sm font-medium text-zinc-700 dark:text-zinc-200">{match.result}</div>
      ) : null}
      {match.lastEvent ? (
        <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">{match.lastEvent}</div>
      ) : null}

      <div className="mt-4 flex items-center justify-between">
        <button className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm border bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border-zinc-200 dark:border-zinc-700">
          {cta}
          <ChevronRight className="h-4 w-4" />
        </button>
        {footer}
      </div>
    </motion.div>
  );
}

function Ticker({ text }: { text: string }) {
  // duplicate text to create continuous loop
  const content = useMemo(() => `${text}   ✦   ${text}   ✦   ${text}   ✦   ${text}`, [text]);
  return (
    <div className="relative overflow-hidden rounded-xl border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
      <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-white dark:from-zinc-900 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white dark:from-zinc-900 to-transparent pointer-events-none" />
      <div className="whitespace-nowrap py-2 will-change-transform animate-[ticker_20s_linear_infinite]">
        <span className="mx-4 text-sm font-medium tracking-wide text-emerald-700 dark:text-emerald-300">
          {content}
        </span>
      </div>
      {/* keyframes in tailwind via arbitrary; ensure global style below */}
      <style>{`
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}

const Tabs = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <div className="inline-flex rounded-2xl border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-1">
    {[
      { key: "live", label: "Live Matches" },
      { key: "upcoming", label: "Upcoming" },
      { key: "results", label: "Results" },
    ].map((t) => (
      <button
        key={t.key}
        onClick={() => onChange(t.key)}
        className={`px-4 py-2 text-sm rounded-xl transition ${
          value === t.key
            ? "bg-zinc-100 dark:bg-zinc-800 font-semibold"
            : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
        }`}
      >
        {t.label}
      </button>
    ))}
  </div>
);

export default function CricketHome() {
  const { dark, setDark } = useDarkMode();
  const [tab, setTab] = useState<string>("live");

  const tickerText = buildTicker(mockLive);

  const list = tab === "live" ? mockLive : tab === "upcoming" ? mockUpcoming : mockResults;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100">
      {/* Navbar */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-900/60 bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-3 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl grid place-items-center bg-emerald-600 text-white shadow-sm"><Trophy  className="h-5 w-5"/></div>
            <span className="text-xl font-bold tracking-tight">CricketLive</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a className="hover:opacity-80" href="#">Home</a>
            <a className="hover:opacity-80" href="#live">Live</a>
            <a className="hover:opacity-80" href="#schedule">Schedule</a>
            <a className="hover:opacity-80" href="#news">News</a>
          </nav>
          <button
            onClick={() => setDark(!dark)}
            className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border-zinc-200 dark:border-zinc-700"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="hidden sm:inline">{dark ? "Light" : "Dark"} mode</span>
          </button>
        </div>
      </header>

      {/* Ticker */}
      <section className="mx-auto max-w-6xl px-3 sm:px-6 mt-4">
        <Ticker text={tickerText} />
      </section>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-3 sm:px-6 py-6 space-y-6 ">
        {/* Tabs */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold">Matches</h2>
          <Tabs value={tab} onChange={setTab} />
        </div>

        {/* Grid of match cards */}
        <AnimatePresence mode="popLayout">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((m: any) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </AnimatePresence>

        {/* Home extras: News & Sidebar placeholders */}
        <div id="news" className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border p-4 bg-white/70 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800">
              <h3 className="text-base font-semibold">Top Stories</h3>
              <ul className="mt-3 space-y-3">
                {[1,2,3,4].map(i => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-16 w-24 rounded-xl bg-zinc-100 dark:bg-zinc-800"/>
                    <div>
                      <p className="font-medium">Hardik smashes career-best in last-over thriller</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">2 hours ago • Mumbai</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <aside className="space-y-4">
            <div className="rounded-2xl border p-4 bg-white/70 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800">
              <h4 className="text-sm font-semibold">Standings (placeholder)</h4>
              <ul className="mt-2 space-y-2 text-sm">
                <li className="flex justify-between"><span>IND</span><span>1</span></li>
                <li className="flex justify-between"><span>AUS</span><span>2</span></li>
                <li className="flex justify-between"><span>ENG</span><span>3</span></li>
                <li className="flex justify-between"><span>SA</span><span>4</span></li>
              </ul>
            </div>
            <div className="rounded-2xl border p-4 bg-white/70 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800">
              <h4 className="text-sm font-semibold">Subscribe</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Get match alerts & news in your inbox.</p>
              <div className="mt-3 flex gap-2">
                <input className="flex-1 rounded-xl border px-3 py-2 bg-transparent border-zinc-200 dark:border-zinc-700" placeholder="you@email.com"/>
                <button className="rounded-xl px-3 py-2 text-sm border bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border-zinc-200 dark:border-zinc-700">Notify me</button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 mt-8">
        <div className="mx-auto max-w-6xl px-3 sm:px-6 text-sm text-zinc-500 dark:text-zinc-400">
          © {new Date().getFullYear()} CricketLive • Built for fans, by fans.
        </div>
      </footer>

      {/* Page padding at bottom for safe area */}
      <div className="h-6" />
    </div>
  );
}
