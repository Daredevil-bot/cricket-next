import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  console.log('in backend');

  const id = await context.params;
  console.log(id.id);


  try {
      const apiKey = process.env.NEXT_PUBLIC_CRICAPI_KEY;

    // Example API (replace with real Cricbuzz API)
    const res = await fetch(`https://cricket.sportdevs.com/agg-news-matches?match_id=eq.${id.id}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    const data = await res.json();
    console.log(data);


    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch match" }, { status: 500 });
  }
}
