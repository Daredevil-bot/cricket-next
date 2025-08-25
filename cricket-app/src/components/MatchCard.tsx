import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Match } from "../../types/match";

function MatchCard({ match }: { match: Match }) {
  const isLive = match.status === "LIVE";

  return (
    <Link href={`/match/${match.id}`}>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="group relative rounded-2xl border p-4 bg-white/70 dark:bg-zinc-900/60 
                   backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow 
                   border-zinc-200 dark:border-zinc-800 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isLive ? (
              <span className="text-xs font-bold text-red-500">LIVE</span>
            ) : (
              <span className="text-xs text-gray-500">{match.format}</span>
            )}
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{match.series}</span>
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">{match.venue}</span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-4 items-center">
          <div>
            {match.teams.home.flag} {match.teams.home.short}
            {match.score?.home && (
              <div className="font-bold">{match.score.home.runs}/{match.score.home.wkts} ({match.score.home.overs})</div>
            )}
          </div>
          <div className="text-right">
            {match.teams.away.flag} {match.teams.away.short}
            {match.score?.away && (
              <div className="font-bold">{match.score.away.runs}/{match.score.away.wkts} ({match.score.away.overs})</div>
            )}
          </div>
        </div>

        {match.startTime && (
          <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
            Starts: {match.startTime}
          </div>
        )}
        {match.result && (
          <div className="mt-3 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            {match.result}
          </div>
        )}
        {match.lastEvent && (
          <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">{match.lastEvent}</div>
        )}

        <div className="mt-4 flex items-center justify-between text-emerald-600 dark:text-emerald-400">
          <span className="text-sm font-medium">View details</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </motion.div>
    </Link>
  );
}

export default MatchCard;
