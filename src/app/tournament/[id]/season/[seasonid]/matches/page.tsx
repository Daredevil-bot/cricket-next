"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Team } from "@/interface/interfaces";
import Link from "next/link";

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

export default function MatchesPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const params = useParams();
  const seasonId = params?.seasonid;

  const [matches, setMatches] = useState<Match[]>([]);
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

  const venues = Array.from(new Set(matches.map((m) => m.arena_name)));

  const filteredMatches = matches.filter((m) => {
    const teamMatch =
      !selectedTeam ||
      m.home_team_name === selectedTeam ||
      m.away_team_name === selectedTeam;
    const venueMatch = !selectedVenue || m.arena_name === selectedVenue;
    return teamMatch && venueMatch;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-green-700 tracking-tight">
        {seasonName || "Season"} Matches
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 items-center">
        {/* team filter */}
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 transition"
        >
          <option value="">Filter by Team</option>
          {teams.map((team: Team) => (
            <option key={team.team_id} value={team.team_name}>
              {team.team_name}
            </option>
          ))}
        </select>

        {/* venue filter */}
        <select
          value={selectedVenue}
          onChange={(e) => setSelectedVenue(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 transition"
        >
          <option value="">Filter by Venue</option>
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
          className="px-5 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition"
        >
          Clear Filters
        </button>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match) => (
            <Link key={match.id} href={`/match/${match.id}`}>
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 cursor-pointer overflow-hidden border">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 flex items-center gap-2">
                  <Calendar size={16} />
                  <span className="text-sm font-medium">
                    {match.start_time}, {match.day}
                  </span>
                </div>

                {/* Match Content */}
                <div className="p-4">
                  <div className="text-lg font-bold text-gray-800 mb-3">
                    {match.name}
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex-1 text-center">
                      <div className="text-base font-semibold text-gray-700">
                        {match.home_team_name}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">vs</span>
                    <div className="flex-1 text-center">
                      <div className="text-base font-semibold text-gray-700">
                        {match.away_team_name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="text-sm">{match.arena_name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock size={16} className="text-orange-500" />
                    <span className="font-medium">{match.localTime}</span>
                    <span className="text-xs text-gray-500">
                      ({match.start_time})
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center text-lg">
            No matches found for selected filters.
          </p>
        )}
      </div>
    </div>
  );
}
