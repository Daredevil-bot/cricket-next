"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, MapPin, Clock } from "lucide-react";

interface Match {
  id: number;
  name: string;
  start_time: string;
  day: string;
  arena_name: string;
  localTime: string;
  home_team_name: string;
  away_team_name: string;
  venue: string;
}

export default function SeasonMatchesPage() {
  const params = useParams();
  const seasonId = params?.seasonid;

  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [seasonName, setSeasonName] = useState<string>("");

  // filters
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedVenue, setSelectedVenue] = useState<string>("");

  useEffect(() => {
    if (!seasonId) return;

    async function fetchMatches() {
      try {
        const teamsResponse = await fetch(`/api/seasons/${seasonId}/teams`);
        const teamsData = await teamsResponse.json();
        setTeams(teamsData[0].teams || []);
        setSeasonName(teamsData[0].season_name || "");

        const res = await fetch(`/api/seasons/${seasonId}/matches`);
        const data = await res.json();
        setMatches(data);
      } catch (err) {
        console.error("Error fetching matches", err);
      }
    }

    fetchMatches();
  }, [seasonId]);

  // derive unique venues
  const venues = Array.from(new Set(matches.map((m) => m.arena_name)));

  // apply filters
  const filteredMatches = matches.filter((m) => {
    const teamMatch =
      !selectedTeam ||
      m.home_team_name === selectedTeam ||
      m.away_team_name === selectedTeam;
    const venueMatch = !selectedVenue || m.arena_name === selectedVenue;
    return teamMatch && venueMatch;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-green-700">
        {seasonName || "Season"} Matches
      </h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400"
        >
          <option value="">Team</option>
          {teams.map((team: any) => (
            <option key={team.team_id} value={team.team_name}>
              {team.team_name}
            </option>
          ))}
        </select>

        <select
          value={selectedVenue}
          onChange={(e) => setSelectedVenue(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400"
        >
          <option value="">Venues</option>
          {venues.map((venue) => (
            <option key={venue} value={venue}>
              {venue}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setSelectedTeam("");
            setSelectedVenue("");
          }}
          className="px-4 py-2 rounded-lg bg-red-100 text-red-600 font-medium hover:bg-red-200 transition"
        >
          Clear Filter
        </button>
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match) => (
            <div
              key={match.id}
              className="bg-white rounded-xl shadow-md border hover:shadow-lg transition p-4"
            >
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Calendar size={16} className="text-green-600" />
                <span className="font-medium">
                  {match.start_time}, {match.day}
                </span>
              </div>

              <div className="text-lg font-semibold text-gray-800 mb-1">
                {match.name}
              </div>

              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <MapPin size={16} className="text-gray-400" />
                <span>{match.arena_name}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Clock size={16} className="text-orange-500" />
                <span className="font-medium">{match.localTime}</span>
                <span className="text-xs text-gray-500">
                  ({match.start_time})
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No matches found for selected filters.</p>
        )}
      </div>
    </div>
  );
}
