/* eslint-disable @typescript-eslint/no-explicit-any */
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
        setMatch(data.data);
       
        
      } catch (err) {
        console.error("Error fetching match:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMatch();
  }, [id]);
  console.log(match);

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
          <img src={match.teams[0].flag} className="w-16 h-16 mx-auto mb-2" />
          <p className="font-semibold">{match.teams[0]}</p>
          <p className="text-gray-500">{match.score[0].score}</p>
        </div>
        <span className="text-lg font-bold">VS</span>
        <div className="text-center">
          <img src={match.teamInfo[0].img} className="w-16 h-16 mx-auto mb-2" />
          <p className="font-semibold">{match.teams[1].name}</p>
          <p className="text-gray-500">{match.score[1].score}</p>
        </div>
      </div>

      {/* Extra Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3 bg-gray-100 rounded-xl">
          <p><b>Match Type:</b> {match.match}</p>
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
