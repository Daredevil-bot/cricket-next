import { NextResponse } from "next/server";

export async function GET() {
  console.log('in backend');

 


  try {
      const apiKey = process.env.NEXT_PUBLIC_CRICAPI_KEY;

    // Example API (replace with real Cricbuzz API)
    const res = await fetch(`https://cricket.sportdevs.com/leagues`, {
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
