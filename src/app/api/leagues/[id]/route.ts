import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  console.log('in backend');

  const id = await context.params;
  console.log(id.id);

  try {
    // Example: calling Cricbuzz API (replace with real one)
    const res = await fetch(`https://cricket.sportdevs.com/leagues?id=eq.${id.id}`,{
        headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_CRICAPI_KEY}`
        }
    });
    const data = await res.json();
    console.log(data);
    

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tournament" }, { status: 500 });
  }
}
