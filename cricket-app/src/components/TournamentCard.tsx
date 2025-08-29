"use client";

import { Calendar } from "lucide-react";
import Link from "next/link";

interface TournamentCardProps {
  id: number;
  name: string;
  hash_image?: string;
  seasonCount: number;
}

export default function TournamentCard({ id, name, hash_image, seasonCount }: TournamentCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition bg-white dark:bg-zinc-900 p-4 flex flex-col justify-between">
      <div className="flex items-center gap-3 mb-3">
        {hash_image && (
          <img
            src={`https://img.cricket.com/${hash_image}`}
            alt={name}
            className="w-10 h-10 rounded-lg object-cover"
          />
        )}
        <h3 className="font-semibold text-lg">{name}</h3>
      </div>

      <div className="space-y-1 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="h-4 w-4" />
          <span>{seasonCount} seasons</span>
        </div>
      </div>

      <Link
        href={`/tournament/${id}`}
        className="inline-flex justify-center items-center w-full px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 transition"
      >
        View Tournament
      </Link>
    </div>
  );
}
