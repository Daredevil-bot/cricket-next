"use client";

import { Trophy } from "lucide-react";
import TournamentCard from "./TournamentCard";

interface Tournament {
  id: number;
  name: string;
  seasonList: { id: number; name: string }[];
  hash_image?: string;
}

interface TournamentListProps {
  tournaments: Tournament[];
}

export default function TournamentList({ tournaments }: TournamentListProps) {
  if (tournaments.length === 0) {
    return <div className="text-gray-500">No tournaments available for this league.</div>;
  }

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-emerald-600" />
        Tournaments
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tournaments.map((t) => (
          <TournamentCard
            key={t.id}
            id={t.id}
            name={t.name}
            hash_image={t.hash_image}
            seasonCount={t.seasonList?.length || 0}
          />
        ))}
      </div>
    </>
  );
}
