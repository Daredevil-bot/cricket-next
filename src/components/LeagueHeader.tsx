"use client";

interface LeagueHeaderProps {
  name: string;
  id: number;
  hash_image?: string;
}

export default function LeagueHeader({ name, id, hash_image }: LeagueHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-8 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-2xl shadow p-6">
      {hash_image && (
        <img
          src={`https://img.cricket.com/${hash_image}`}
          alt={name}
          className="w-20 h-20 rounded-xl shadow-md object-cover"
        />
      )}
      <div>
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="text-sm opacity-80">League ID: {id}</p>
      </div>
    </div>
  );
}
