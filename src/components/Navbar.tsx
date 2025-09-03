import { useEffect, useState } from "react";
import { Trophy, Sun, Moon } from "lucide-react";

type League = {
  id: number;
  name: string;
  primary_color: string;
  secondary_color: string;
  hash_image: string;
};

export default function Navbar() {
  const [dark, setDark] = useState(false);
  const [leagues, setLeagues] = useState<League[]>([]);

  useEffect(() => {
    // Replace with your leagues API endpoint
    fetch("/api/leagues")
      .then((res) => res.json())
      .then((data) => setLeagues(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-900/60 bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-3 sm:px-6 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl grid place-items-center bg-emerald-600 text-white shadow-sm">
            <Trophy className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            CricketLive
          </span>
        </div>

        {/* Center: Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm relative">
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

          {/* Leagues Dropdown */}
          <div className="group relative">
            <button className="hover:opacity-80 flex items-center gap-1" >
              Leagues
              <svg
                className="h-3 w-3 transition-transform group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div className="absolute top-full left-0 mt-2 hidden group-hover:block bg-white dark:bg-zinc-800 shadow-lg rounded-lg w-56 z-50">
              <ul className="py-2 max-h-72 overflow-y-auto">
                {leagues.length === 0 && (
                  <li>
                    <span className="px-4 py-2 text-zinc-500 dark:text-zinc-400">
                      No leagues available
                    </span>
                  </li>
                )}
                {leagues.map((league) => (
                  <li key={league.id}>
                    <a
                      href={`/league/${league.id}`}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    >
                      <img
                        src={`https://img.cricket.com/${league.hash_image}`}
                        alt={league.name}
                        className="w-5 h-5 rounded-full"
                      />
                      <span>{league.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        {/* Right: Theme toggle */}
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
  );
}
