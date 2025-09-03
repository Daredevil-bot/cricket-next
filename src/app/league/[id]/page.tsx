"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LeagueHeader from "@/components/LeagueHeader";
import TournamentList from "@/components/TournamentList";
import LoadingSkeleton from "@/components/LoadingSkeleton";

interface League {
  id: number;
  name: string;
  hash_image?: string;
}

interface Tournament {
  id: number;
  name: string;
  seasonList: { id: number; name: string }[];
  hash_image?: string;
}

export default function LeaguePage() {
  const { id } = useParams();
  const [league, setLeague] = useState<League | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeagueData() {
      try {
        const res = await fetch(`/api/leagues/${id}`);
        const data = await res.json();
        setLeague(data[0]);
        console.log(data);

        const tournRes = await fetch(`/api/tournaments-by-league/${id}`);
        const tournData = await tournRes.json();
        setTournaments(tournData[0].tournaments);
      } catch (err) {
        console.error("Error fetching league/tournaments:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeagueData();
  }, [id]);

  if (loading) return <LoadingSkeleton />;
  if (!league) return <div className="text-center py-10">League not found.</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <LeagueHeader name={league.name} id={league.id} hash_image={league.hash_image} />
      <TournamentList tournaments={tournaments} />
    </div>
  );
}
