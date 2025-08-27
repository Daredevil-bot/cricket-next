"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TournamentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [tournament, setTournament] = useState<any>(null);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // fetch tournament info
        const res = await fetch(`/api/tournament/${id}`);
        const data = await res.json();
        setTournament(data);

        // fetch seasons
        const resSeasons = await fetch(`/api/tournament/${id}/seasons`);
        const seasonData = await resSeasons.json();
        setSeasons(seasonData);
      } catch (err) {
        console.error("Error fetching tournament", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchData();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!tournament) return <p className="p-6">Tournament not found</p>;

 return (
    <div className="p-6 space-y-6">
      {/* Tournament Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold">{tournament[0].name}</h1>
        <p className="text-sm opacity-80">{tournament[0].season_name}</p>
      </div>

      {/* League & Country Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* League Card */}
        <div className="rounded-xl bg-white dark:bg-zinc-900 p-4 shadow-sm flex items-center gap-3">
          <img
            src={`https://images.cricket.com/${tournament[0].league_hash_image}`}
            className="h-12 w-12 rounded-full border"
            alt={tournament[0].league_name}
          />
          <div>
            <p className="font-semibold">{tournament[0].league_name}</p>
            <p className="text-xs text-zinc-500">League ID: {tournament[0].league_id}</p>
          </div>
        </div>

        {/* Country / Class Card */}
        <div className="rounded-xl bg-white dark:bg-zinc-900 p-4 shadow-sm flex items-center gap-3">
          <img
            src={`https://images.cricket.com/${tournament[0].class_hash_image}`}
            className="h-12 w-12 rounded-full border"
            alt={tournament[0].class_name}
          />
          <div>
            <p className="font-semibold">{tournament[0].class_name}</p>
            <p className="text-xs text-zinc-500">Class ID: {tournament[0].class_id}</p>
          </div>
        </div>
      </div>

      {/* Seasons */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Seasons</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {seasons.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border p-4 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between"
            >
              <div>
                <p className="font-medium text-blue-600">{s.name}</p>
                <p className="text-xs text-zinc-500 mt-1">
                  {s.start_date} – {s.end_date}
                </p>
              </div>
              <button className="mt-3 text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg self-start">
                View Matches
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
