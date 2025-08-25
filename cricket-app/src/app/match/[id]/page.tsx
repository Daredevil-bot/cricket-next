"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function MatchDetailsPage() {
  const { id } = useParams();
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchMatch() {
      try {
        const res = await fetch(`/api/match/${id}`);
        const data = await res.json();
        setMatch(data);
      } catch (err) {
        console.error("Error fetching match:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMatch();
  }, [id]);

  if (loading) return <p className="p-5">Loading match details...</p>;
  if (!match) return <p className="p-5">Match not found</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold mb-2">{match.series}</h1>
      <p className="text-gray-600 mb-4">{match.venue}</p>
      <p className="mb-4 text-blue-600 font-medium">{match.status}</p>

      {/* Teams */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-center">
          <img src={match.teams.home.flag} className="w-16 h-16 mx-auto mb-2" />
          <p className="font-semibold">{match.teams.home.name}</p>
          <p className="text-gray-500">{match.teams.home.score}</p>
        </div>
        <span className="text-lg font-bold">VS</span>
        <div className="text-center">
          <img src={match.teams.away.flag} className="w-16 h-16 mx-auto mb-2" />
          <p className="font-semibold">{match.teams.away.name}</p>
          <p className="text-gray-500">{match.teams.away.score}</p>
        </div>
      </div>

      {/* Extra Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3 bg-gray-100 rounded-xl">
          <p><b>Match Type:</b> {match.format}</p>
        </div>
        <div className="p-3 bg-gray-100 rounded-xl">
          <p><b>Toss:</b> {match.toss}</p>
        </div>
        <div className="p-3 bg-gray-100 rounded-xl">
          <p><b>Umpires:</b> {match.umpires}</p>
        </div>
        <div className="p-3 bg-gray-100 rounded-xl">
          <p><b>Referee:</b> {match.referee}</p>
        </div>
      </div>
    </div>
  );
}
