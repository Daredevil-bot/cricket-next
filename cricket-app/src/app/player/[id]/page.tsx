/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PlayerProfilePage() {
  const { id } = useParams(); // dynamic route param
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchPlayer() {
      try {
        const res = await fetch(`/api/player/${id}`); // proxy to backend or direct Cricbuzz API
        const data = await res.json();
        setPlayer(data);
      } catch (err) {
        console.error("Error fetching player:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPlayer();
  }, [id]);

  if (loading) return <p className="p-5">Loading player profile...</p>;
  if (!player) return <p className="p-5">Player not found</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold mb-4">{player.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Player Info */}
        <div>
          <p><b>Role:</b> {player.role}</p>
          <p><b>Batting Style:</b> {player.battingStyle}</p>
          <p><b>Bowling Style:</b> {player.bowlingStyle}</p>
          <p><b>Nationality:</b> {player.country}</p>
        </div>

        {/* Image */}
        <div className="flex justify-center">
          <img
            src={player.image || "/default-player.png"}
            alt={player.name}
            className="rounded-xl shadow-lg w-40 h-40 object-cover"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Career Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-gray-100 rounded-xl">
            <p className="text-lg font-bold">{player.stats?.matches}</p>
            <p className="text-gray-600 text-sm">Matches</p>
          </div>
          <div className="p-3 bg-gray-100 rounded-xl">
            <p className="text-lg font-bold">{player.stats?.runs}</p>
            <p className="text-gray-600 text-sm">Runs</p>
          </div>
          <div className="p-3 bg-gray-100 rounded-xl">
            <p className="text-lg font-bold">{player.stats?.wickets}</p>
            <p className="text-gray-600 text-sm">Wickets</p>
          </div>
          <div className="p-3 bg-gray-100 rounded-xl">
            <p className="text-lg font-bold">{player.stats?.avg}</p>
            <p className="text-gray-600 text-sm">Batting Avg</p>
          </div>
        </div>
      </div>
    </div>
  );
}
