export type Match = {
  id: string;  // make sure it's string
  teams: { home: { short: string; flag?: string }, away: { short: string; flag?: string } };
  score?: {
    home?: { runs: number; wkts: number; overs: string };
    away?: { runs: number; wkts: number; overs: string };
  };
  format?: string;
  series?: string;
  venue?: string;
  status?: string;
  startTime?: string;
  result?: string;
  lastEvent?: string;
};
