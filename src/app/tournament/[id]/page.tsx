"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar, Trophy } from "lucide-react";

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

interface Match {
  id: number;
  name: string;
  venue?: string;
  status?: string;
  format?: string;
}

export default function TournamentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [matches, setMatches] = useState<Record<number, Match[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Tournament details
        const res = await fetch(`/api/tournament/${id}`);
        const data = await res.json();
        setTournament(Array.isArray(data) ? data[0] : data);

        // Seasons
        const resSeasons = await fetch(`/api/tournament/${id}/seasons`);
        const seasonData: Season[] = await resSeasons.json();
        setSeasons(Array.isArray(seasonData) ? seasonData : []);

        // Matches per season
        const matchesBySeason: Record<number, Match[]> = {};
        for (const s of seasonData) {
          try {
            const resMatches = await fetch(
              `/api/tournament/${id}/season/${s.id}/matches`
            );
            const matchData: Match[] = await resMatches.json();
            matchesBySeason[s.id] = matchData || [];
          } catch (e) {
            matchesBySeason[s.id] = [];
          }
        }
        setMatches(matchesBySeason);
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
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Tournament Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-extrabold mb-1">{tournament.name}</h1>
        {tournament.season_name && (
          <p className="text-sm text-green-100">{tournament.season_name}</p>
        )}
      </div>

      {/* League & Class Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {tournament.league_name && (
          <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4 hover:shadow-xl transition transform hover:-translate-y-1 border">
            {tournament.league_hash_image && (
              <img
                src={`https://images.cricket.com/${tournament.league_hash_image}`}
                className="h-14 w-14 rounded-full border"
                alt={tournament.league_name}
              />
            )}
            <div>
              <p className="font-semibold text-gray-800">
                {tournament.league_name}
              </p>
              <p className="text-xs text-gray-500">
                League ID: {tournament.league_id}
              </p>
            </div>
          </div>
        )}

        {tournament.class_name && (
          <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4 hover:shadow-xl transition transform hover:-translate-y-1 border">
            {tournament.class_hash_image && (
              <img
                src={`https://images.cricket.com/${tournament.class_hash_image}`}
                className="h-14 w-14 rounded-full border"
                alt={tournament.class_name}
              />
            )}
            <div>
              <p className="font-semibold text-gray-800">
                {tournament.class_name}
              </p>
              <p className="text-xs text-gray-500">
                Class ID: {tournament.class_id}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Seasons & Matches */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-5">Seasons</h2>
        {seasons.length === 0 ? (
          <p className="text-sm text-gray-500">No seasons available</p>
        ) : (
          <div className="space-y-8">
            {seasons.map((s) => (
              <div
                key={s.id}
                onClick={() => router.push(`/tournament/${id}/season/${s.id}/matches`)}
                className="bg-white rounded-2xl shadow p-6 cursor-pointer hover:shadow-lg transition"
              >
                {/* Season Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-blue-600" />
                    <h3 className="font-semibold text-lg">{s.name}</h3>
                  </div>
                  {(s.start_date || s.end_date) && (
                    <p className="text-xs text-gray-500">
                      {s.start_date} – {s.end_date}
                    </p>
                  )}
                </div>

                {/* Matches */}
                {matches[s.id] && matches[s.id].length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {matches[s.id].map((m) => (
                      <div
                        key={m.id}
                        className="border rounded-xl p-4 flex flex-col hover:shadow-md transition"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Trophy className="text-green-600" size={16} />
                          <span className="font-medium">{m.name}</span>
                        </div>
                        {m.venue && (
                          <p className="text-xs text-gray-500">{m.venue}</p>
                        )}
                        <p className="text-xs text-gray-400">
                          {m.format} · {m.status}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Matches available</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
