"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Moon, Sun, Trophy, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MatchCard from "@/components/MatchCard";
import { mapCricApiMatch, getLiveMatches, getFinishedMatches } from "../../services/cricket";
import { Match } from "../../types/match";
import { s } from "framer-motion/client";

// -----------------------
const mockLive = [
  {
    id: "1",
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
  return lines
    .map(
      (m) =>
        `${m.teams.home.short} ${m.score.home.runs}/${m.score.home.wkts} (${m.score.home.overs}) vs ${m.teams.away.short} • ${m.series}`
    )
    .join("  •  ");
}

// -----------------------\n// UI Helpers
// -----------------------
const useDarkMode = () => {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefers =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
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

// function Badge({ children }: { children: React.ReactNode }) {
//   return (
//     <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-emerald-600/10 border-emerald-600/30 text-emerald-700 dark:text-emerald-300 dark:border-emerald-400/30 dark:bg-emerald-400/10">
//       {children}
//     </span>
//   );
// }

// function Pill({ children }: { children: React.ReactNode }) {
//   return (
//     <span className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:text-zinc-300">
//       {children}
//     </span>
//   );
// }

// function Team({
//   flag,
//   name,
//   short,
// }: {
//   flag: string;
//   name: string;
//   short: string;
// }) {
//   return (
//     <div className="flex items-center gap-2">
//       <span className="text-lg leading-none select-none">{flag}</span>
//       <span className="font-semibold tracking-wide">{short}</span>
//       <Pill>{name}</Pill>
//     </div>
//   );
// }

// function Score({
//   runs,
//   wkts,
//   overs,
// }: {
//   runs: number;
//   wkts: number;
//   overs: number;
// }) {
//   return (
//     <div className="text-2xl font-bold tabular-nums">
//       {runs}/{wkts}
//       <span className="ml-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
//         ({overs})
//       </span>
//     </div>
//   );
// }

function Ticker({ text }: { text: string }) {
  // duplicate text to create continuous loop
  const content = useMemo(
    () => `${text}   ✦   ${text}   ✦   ${text}   ✦   ${text}`,
    [text]
  );
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

const Tabs = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
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
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [resultMatches, setResultMatches] = useState<Match[]>([]);
  const [search, setSearch] = useState("");
  const [format, setFormat] = useState("all"); // all | t20 | odi | test
  const [status, setStatus] = useState("all"); // all | live | upcoming | completed

  useEffect(() => {
    async function loadMatches() {
      try {
        const datalive = await getLiveMatches();
        const live = datalive.map(mapCricApiMatch);
        const datafinished = await getFinishedMatches();
        const finished = datafinished.map(mapCricApiMatch);

        setResultMatches(finished);

        const upcomingMapped = mockUpcoming;
        console.log(upcomingMapped);

        console.log(live);

        // Split by status
        setLiveMatches(live);
        setUpcomingMatches(upcomingMapped);
        console.log(liveMatches);
      } catch (err) {
        console.error("Error fetching matches:", err);
      }
    }
    loadMatches();
  }, []);

  const tickerText = buildTicker(mockLive);

  const list =
    tab === "live"
      ? liveMatches
      : tab === "upcoming"
      ? upcomingMatches
      : resultMatches;

  const filteredList = list.filter((m: any) => {
    const query = search.toLowerCase();
    const matchSearch =
      m.series?.toLowerCase().includes(query) ||
      m.venue?.toLowerCase().includes(query) ||
      m.teams?.home?.name?.toLowerCase().includes(query) ||
      m.teams?.away?.name?.toLowerCase().includes(query);

    const matchFormat =
      format === "all" || m.format?.toLowerCase() === format.toLowerCase();

   const matchStatus =
  status === "all" ||
  m.status?.toLowerCase() === status.toLowerCase();
  console.log(m);
  
console.log(m.status?.type?.toLowerCase());
console.log(status.toLowerCase());


    return matchSearch && matchFormat && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100">
      {/* Navbar */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-900/60 bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-3 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl grid place-items-center bg-emerald-600 text-white shadow-sm">
              <Trophy className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              CricketLive
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a className="hover:opacity-80" href="#">
              Home
            </a>
            <a className="hover:opacity-80" href="#live">
              Live
            </a>
            <a className="hover:opacity-80" href="#schedule">
              Schedule
            </a>
            <a className="hover:opacity-80" href="#news">
              News
            </a>
          </nav>
          <button
            onClick={() => setDark(!dark)}
            className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border-zinc-200 dark:border-zinc-700"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="hidden sm:inline">
              {dark ? "Light" : "Dark"} mode
            </span>
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
        <div className="mt-4 space-y-3">
          <input
            type="text"
            placeholder="Search by team, series, or venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 p-2 border rounded-lg"
          />

          <div className="flex gap-4">
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="p-2 border rounded-lg"
            >
              <option value="all">All Formats</option>
              <option value="t20">T20</option>
              <option value="odi">ODI</option>
              <option value="test">Test</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="p-2 border rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="live">Live</option>
              <option value="upcoming">Upcoming</option>
              <option value="finished">Finished</option>
            </select>
          </div>
        </div>

        {/* Grid of match cards */}
        <AnimatePresence mode="popLayout">
          {filteredList.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredList.map((m: Match) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-500 dark:text-zinc-400">
              <Trophy className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-lg font-semibold">
                {tab === "live"
                  ? "No live matches at the moment"
                  : tab === "upcoming"
                  ? "No upcoming matches scheduled"
                  : "No results available"}
              </p>
              <p className="text-sm">Check back later for updates.</p>
            </div>
          )}
        </AnimatePresence>

        {/* Home extras: News & Sidebar placeholders */}
        <div id="news" className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border p-4 bg-white/70 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800">
              <h3 className="text-base font-semibold">Top Stories</h3>
              <ul className="mt-3 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-16 w-24 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
                    <div>
                      <p className="font-medium">
                        Hardik smashes career-best in last-over thriller
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        2 hours ago • Mumbai
                      </p>
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
                <li className="flex justify-between">
                  <span>IND</span>
                  <span>1</span>
                </li>
                <li className="flex justify-between">
                  <span>AUS</span>
                  <span>2</span>
                </li>
                <li className="flex justify-between">
                  <span>ENG</span>
                  <span>3</span>
                </li>
                <li className="flex justify-between">
                  <span>SA</span>
                  <span>4</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border p-4 bg-white/70 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800">
              <h4 className="text-sm font-semibold">Subscribe</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Get match alerts & news in your inbox.
              </p>
              <div className="mt-3 flex gap-2">
                <input
                  className="flex-1 rounded-xl border px-3 py-2 bg-transparent border-zinc-200 dark:border-zinc-700"
                  placeholder="you@email.com"
                />
                <button className="rounded-xl px-3 py-2 text-sm border bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border-zinc-200 dark:border-zinc-700">
                  Notify me
                </button>
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
