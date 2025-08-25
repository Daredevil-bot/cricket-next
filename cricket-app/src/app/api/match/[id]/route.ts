import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Example API (replace with real Cricbuzz API)
    const res = await fetch(`https://cricbuzz-api.example.com/match/${id}`);
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch match" }, { status: 500 });
  }
}
