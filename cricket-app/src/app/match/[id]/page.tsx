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

        // since API returns an array, take first object
        setMatch(Array.isArray(data) ? data[0] : data);
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
      <h1 className="text-2xl font-bold mb-2">{match.name}</h1>
      <p className="text-gray-600 mb-2">{match.tournament_name}</p>
      <p className="text-gray-600 mb-4">{match.arena_name}</p>
      <p className="mb-4 text-blue-600 font-medium">
        {match.status?.type?.toUpperCase()} - {match.status?.reason}
      </p>

      {/* Teams */}
      <div className="flex justify-between items-center mb-6">
        {/* Home */}
        <div className="text-center">
          <img
            src={`https://cricbuzz-xx.imgix.net/${match.home_team_hash_image}.png`}
            alt={match.home_team_name}
            className="w-16 h-16 mx-auto mb-2"
          />
          <p className="font-semibold">{match.home_team_name}</p>
          <p className="text-gray-500">{match.home_team_score?.display}</p>
        </div>

        <span className="text-lg font-bold">VS</span>

        {/* Away */}
        <div className="text-center">
          <img
            src={`https://cricbuzz-xx.imgix.net/${match.away_team_hash_image}.png`}
            alt={match.away_team_name}
            className="w-16 h-16 mx-auto mb-2"
          />
          <p className="font-semibold">{match.away_team_name}</p>
          <p className="text-gray-500">{match.away_team_score?.display}</p>
        </div>
      </div>

      {/* Extra Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3 bg-gray-100 rounded-xl">
          <p>
            <b>League:</b> {match.league_name}
          </p>
        </div>
        <div className="p-3 bg-gray-100 rounded-xl">
          <p>
            <b>Start Time:</b>{" "}
            {new Date(match.start_time).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
        <div className="p-3 bg-gray-100 rounded-xl">
          <p>
            <b>End Time:</b>{" "}
            {match.end_time &&
              new Date(match.end_time).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
          </p>
        </div>
        <div className="p-3 bg-gray-100 rounded-xl">
          <p>
            <b>Duration:</b>{" "}
            {match.duration ? `${match.duration / 3600} hours` : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
