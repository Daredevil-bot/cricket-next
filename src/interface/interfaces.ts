export interface Team {
  team_id: number;
  team_name: string;
}

export interface Tournament {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
}

export interface CricApiMatch {
  id: string;
  tournament_name: string;
  status?: {
    type?: string;
    reason?: string;
  };
  arena_name: string;
  league_name: string;
  home_team_name: string;
  home_team_hash_image?: string;
  away_team_name: string;
  away_team_hash_image?: string;
  home_team_score?: {
    display: string;
  };
  away_team_score?: {
    display: string;
  };
  start_time: string;
}