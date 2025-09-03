import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Match } from "../../types/match";
import Image from "next/image";

function MatchCard({ match }: { match: Match }) {
  const isLive = match.status === "live";
  const isFinished = match.status === "finished";
  const isUpcoming = match.status === "UPCOMING";

  return (
    <Link href={`/match/${match.id}`}>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="group relative rounded-2xl border p-4 bg-white/70 dark:bg-zinc-900/60 
                  backdrop-blur-sm shadow-sm hover:shadow-md transition-all 
                  border-zinc-200 dark:border-zinc-800 cursor-pointer"
      >
        {/* Top section: Series + Status + Venue */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isLive && (
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-red-500 text-white">
                Live
              </span>
            )}
            {isFinished && (
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-gray-500 text-white">
                Finished
              </span>
            )}
            {isUpcoming && (
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-blue-500 text-white">
                Upcoming
              </span>
            )}

            <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[150px]">
              {match.series}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            <MapPin size={12} />
            <span className="truncate max-w-[120px]">{match.venue}</span>
          </div>
        </div>

        {/* Teams */}
        <div className="mt-3 grid grid-cols-2 gap-4 items-center">
          {/* Home team */}
          <div className="flex items-center gap-2">
            {match.teams.home.flag ? (
              <Image
                src={
                  match.teams.home.flag.startsWith("http")
                    ? match.teams.home.flag
                    : "/default-flag.png"
                }
                alt={`${match.teams.home.name} flag`}
                width={24}
                height={24}
                className="rounded-full object-contain"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                🏳️
              </div>
            )}
            <span className="font-medium">{match.teams.home.short}</span>
            {match.score?.home && (
              <div className="font-bold text-sm">
                {match.score.home.runs}/{match.score.home.wkts} (
                {match.score.home.overs})
              </div>
            )}
          </div>

          {/* Away team */}
          <div className="flex items-center justify-end gap-2">
            {match.teams.away.flag ? (
              <Image
                src={
                  match.teams.away.flag.startsWith("http")
                    ? match.teams.away.flag
                    : "/default-flag.png"
                }
                alt={`${match.teams.away.name} flag`}
                width={24}
                height={24}
                className="rounded-full object-contain"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                🏳️
              </div>
            )}
            <span className="font-medium">{match.teams.away.short}</span>
            {match.score?.away && (
              <div className="font-bold text-sm">
                {match.score.away.runs}/{match.score.away.wkts} (
                {match.score.away.overs})
              </div>
            )}
          </div>
        </div>

        {/* Match info */}
        {match.startTime && (
          <div className="mt-3 text-xs text-zinc-600 dark:text-zinc-300">
            Starts: {match.startTime}
          </div>
        )}
        {match.result && (
          <div className="mt-3 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            {match.result}
          </div>
        )}
        {match.lastEvent && (
          <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">
            {match.lastEvent}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-emerald-600 dark:text-emerald-400 group-hover:underline">
          <span className="text-sm font-medium">View details</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </motion.div>
    </Link>
  );
}

export default MatchCard;
