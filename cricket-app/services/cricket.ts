// services/cricket.ts

export function mapCricApiMatch(m: any) {
  return {
    id: m.id ?? m.unique_id ?? crypto.randomUUID(), // fallback if missing
    series: m.name || m.title || "Unknown Series",
    status: m.status || (m.matchStarted ? "Live" : "Upcoming"),
    venue: m.venue || "TBD",
    format: m.matchType || m.type || "TBD",
    date: m.dateTimeGMT || m.date || null, // useful for upcoming matches

    teams: {
      home: {
        name: m.teams?.[0] || m["team-1"] || "TBD",
        short: m.teams?.[0]
          ? m.teams[0].slice(0, 3).toUpperCase()
          : (m["team-1"]?.slice(0, 3).toUpperCase() ?? ""),
        flag: "",
      },
      away: {
        name: m.teams?.[1] || m["team-2"] || "TBD",
        short: m.teams?.[1]
          ? m.teams[1].slice(0, 3).toUpperCase()
          : (m["team-2"]?.slice(0, 3).toUpperCase() ?? ""),
        flag: "",
      },
    },

    score: m.score
      ? {
          home: m.score[0]
            ? { runs: m.score[0].r, wkts: m.score[0].w, overs: m.score[0].o }
            : { runs: 0, wkts: 0, overs: 0 },
          away: m.score[1]
            ? { runs: m.score[1].r, wkts: m.score[1].w, overs: m.score[1].o }
            : { runs: 0, wkts: 0, overs: 0 },
          batting: m.score[0] ? "home" : "away",
        }
      : {
          home: { runs: 0, wkts: 0, overs: 0 },
          away: { runs: 0, wkts: 0, overs: 0 },
          batting: "none",
        },

    lastEvent: m.score?.[0]?.inning || m.description || "No update",
  };
}

export async function getLiveMatches() {
  const apiKey = process.env.NEXT_PUBLIC_CRICAPI_KEY;

  const res = await fetch(
    `https://api.cricapi.com/v1/currentMatches?apikey=${apiKey}&offset=0`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch matches");

  return res.json();
}

export async function getUpcomingMatches() {
  const apiKey = process.env.NEXT_PUBLIC_CRICAPI_KEY;

  const res = await fetch(
    `https://api.cricapi.com/v1/matches?apikey=${apiKey}&offset=0`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch matches");

  return res.json();
}
