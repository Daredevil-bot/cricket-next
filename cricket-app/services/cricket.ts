// services/cricket.ts

import { log } from "console";

// services/cricket.ts
// utils/mappers.ts
function buildTeamImage(hash?: string) {
  if (!hash) return null;
  return `https://images.fancode.com/hash/${hash}.png`; // adjust base URL as per API docs
}

export function mapCricApiMatch(m: any) {
  return {
    id: m.id,
    series: m.tournament_name,
    status: m.status?.type || "upcoming",
    venue: m.arena_name,
    format: m.league_name,
    teams: {
      home: {
        name: m.home_team_name,
        short: m.home_team_name.slice(0, 3).toUpperCase(),
        flag: buildTeamImage(m.home_team_hash_image),
      },
      away: {
        name: m.away_team_name,
        short: m.away_team_name.slice(0, 3).toUpperCase(),
        flag: buildTeamImage(m.away_team_hash_image),
      },
    },
    score: {
      home: m.home_team_score
        ? {
            runs: m.home_team_score.display,
            wkts: "-", // not available in your payload
            overs: "-", // not available in your payload
          }
        : null,
      away: m.away_team_score
        ? {
            runs: m.away_team_score.display,
            wkts: "-",
            overs: "-",
          }
        : null,
    },
    startTime: m.start_time,
    result: m.status?.reason || null,
  };
}




export async function getLiveMatches() {
  const apiKey = process.env.NEXT_PUBLIC_CRICAPI_KEY;

  const res = await fetch(
    `https://cricket.sportdevs.com/matches-live`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch matches");
  const data = await res.json();
  console.log(data);

  return data;
}

export async function getFinishedMatches() {
  const apiKey = process.env.NEXT_PUBLIC_CRICAPI_KEY;

  const res = await fetch(
    `https://cricket.sportdevs.com/matches`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch matches");
  const data = await res.json();
  console.log(data);

  return data;
}

// export async function getUpcomingMatches() {
//   const apiKey = process.env.NEXT_PUBLIC_CRICAPI_KEY;

//   const res = await fetch(
//     `https://api.cricapi.com/v1/matches?apikey=${apiKey}&offset=0`,
//     { cache: "no-store" }
//   );

//   if (!res.ok) throw new Error("Failed to fetch matches");

//   return res.json();
// }
