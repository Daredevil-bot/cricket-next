import './globals.css';
import type { Metadata } from 'next';


export const metadata: Metadata = { title: 'CricketLive', description: 'Scores, schedules & news' };


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en" suppressHydrationWarning>
<head>
<script dangerouslySetInnerHTML={{ __html: `
try {
const saved = localStorage.getItem('theme');
const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
const dark = saved ? saved === 'dark' : prefers;
if (dark) document.documentElement.classList.add('dark');
} catch {}
`}} />
</head>
<body className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100">
{children}
</body>
</html>
);
}