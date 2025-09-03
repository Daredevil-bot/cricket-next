"use client";

import React from "react";
import TournamentCard from "@/components/TournamentCard";

interface Tournament {
  id: number | string;
  name: string;
  seasonList?: { id: number; name: string }[];
  hash_image?: string;
}

interface TournamentListProps {
  tournaments: Tournament[];
}

const TournamentList: React.FC<TournamentListProps> = ({ tournaments }) => {
  if (!tournaments || tournaments.length === 0) {
    return <p className="p-5">No tournaments available.</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Tournaments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tournaments.map((tournament) => (
          <TournamentCard
            key={tournament.id}
            id={typeof tournament.id === "string" ? parseInt(tournament.id) : tournament.id}
            name={tournament.name}
            hash_image={tournament.hash_image}
            seasonCount={tournament.seasonList ? tournament.seasonList.length : 0}
          />
        ))}
      </div>
    </div>
  );
};

export default TournamentList;