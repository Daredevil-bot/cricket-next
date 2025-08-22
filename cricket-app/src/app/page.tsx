'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

interface Match {
  id: string;
  teams: string;
  score: string;
  overs: string;
  status: 'live' | 'upcoming' | 'result';
}

const matches: Match[] = [
  { id: '1', teams: 'India vs Australia', score: '120/2', overs: '15.3', status: 'live' },
  { id: '2', teams: 'England vs Pakistan', score: 'Starts at 7PM', overs: '-', status: 'upcoming' },
  { id: '3', teams: 'South Africa vs NZ', score: 'SA won by 5 wickets', overs: '-', status: 'result' },
];

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [tab, setTab] = useState<'live' | 'upcoming' | 'result'>('live');

  const filtered = matches.filter((m) => m.status === tab);

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen`}> 
      {/* Header */}
      <header className="flex justify-between items-center p-4 shadow-md">
        <h1 className="text-2xl font-bold">Cricket Live</h1>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </header>

      {/* Score Ticker */}
      <motion.div className="bg-green-600 text-white py-2 px-4 overflow-hidden whitespace-nowrap">
        <motion.div
          animate={{ x: ['100%', '-100%'] }}
          transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
        >
          {matches.map((m) => (
            <span key={m.id} className="mr-10">
              {m.teams}: {m.score}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Tabs */}
      <div className="flex justify-center space-x-6 my-4">
        {['live', 'upcoming', 'result'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`px-4 py-2 rounded-full font-medium ${
              tab === t ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-800'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Match Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {filtered.map((m) => (
          <motion.div
            key={m.id}
            whileHover={{ scale: 1.03 }}
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow rounded-2xl p-4`}
          >
            <h2 className="text-lg font-semibold mb-2">{m.teams}</h2>
            <p className="text-md">{m.score}</p>
            <p className="text-sm text-gray-500">{m.overs !== '-' ? `${m.overs} overs` : ''}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
