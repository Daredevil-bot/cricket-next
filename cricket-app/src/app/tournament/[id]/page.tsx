"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Tournament {
  id: number;
  name: string;
  season_name?: string;
  league_hash_image?: string;
  league_name?: string;
  league_id?: number;
  class_hash_image?: string;
  class_name?: string;
  class_id?: number;
}

interface Season {
  id: number;
  name: string;
  start_date?: string;
  end_date?: string;
}

export default function TournamentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/tournament/${id}`);
        const data = await res.json();

        // ✅ handle case if API returns [] instead of object
        setTournament(Array.isArray(data) ? data[0] : data);

        const resSeasons = await fetch(`/api/tournament/${id}/seasons`);
        const seasonData = await resSeasons.json();
        setSeasons(Array.isArray(seasonData) ? seasonData : []);
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

  function handleViewMatches(seasonId: number): void {
    router.push(`/tournament/${tournament.id}/season/${seasonId}/matches`);
  }

  return (
    <div className="p-6 space-y-6">
      {/* Tournament Header */}
      <div className="bg-white dark:bg-zinc-900 border rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
          {tournament.name}
        </h1>
        {tournament.season_name && (
          <p className="text-sm text-zinc-500">{tournament.season_name}</p>
        )}
      </div>

      {/* League & Country Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* League Card */}
        {tournament.league_name && (
          <div className="rounded-xl bg-white dark:bg-zinc-900 p-4 border shadow-sm flex items-center gap-3">
            {tournament.league_hash_image && (
              <img
                src={`https://images.cricket.com/${tournament.league_hash_image}`}
                className="h-12 w-12 rounded-full border"
                alt={tournament.league_name}
              />
            )}
            <div>
              <p className="font-semibold text-zinc-800 dark:text-zinc-100">
                {tournament.league_name}
              </p>
              <p className="text-xs text-zinc-500">
                League ID: {tournament.league_id}
              </p>
            </div>
          </div>
        )}

        {/* Country / Class Card */}
        {tournament.class_name && (
          <div className="rounded-xl bg-white dark:bg-zinc-900 p-4 border shadow-sm flex items-center gap-3">
            {tournament.class_hash_image && (
              <img
                src={`https://images.cricket.com/${tournament.class_hash_image}`}
                className="h-12 w-12 rounded-full border"
                alt={tournament.class_name}
              />
            )}
            <div>
              <p className="font-semibold text-zinc-800 dark:text-zinc-100">
                {tournament.class_name}
              </p>
              <p className="text-xs text-zinc-500">
                Class ID: {tournament.class_id}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Seasons */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-3">
          Seasons
        </h2>
        {seasons.length === 0 ? (
          <p className="text-sm text-zinc-500">No seasons available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {seasons.map((s) => (
              <div
                key={s.id}
                className="rounded-xl border p-4 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <p className="font-medium text-zinc-800 dark:text-zinc-100">
                    {s.name}
                  </p>
                  {(s.start_date || s.end_date) && (
                    <p className="text-xs text-zinc-500 mt-1">
                      {s.start_date} – {s.end_date}
                    </p>
                  )}
                </div>
                <button
                  className="mt-3 text-sm text-white bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-300 px-3 py-1 rounded-lg self-start transition"
                  onClick={() => handleViewMatches(s.id)}
                >
                  View Matches
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
