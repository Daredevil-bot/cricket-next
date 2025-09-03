import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  console.log('seasons in backend');

  const id = await context.params;
  console.log(id.id);

  try {

    console.log('trying');
    
    // Example: calling Cricbuzz API (replace with real one)
    const res = await fetch(`https://cricket.sportdevs.com/seasons-by-tournament?tournament_id=eq.${id.id}`,{
        headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_CRICAPI_KEY}`
        }
    });
    const data = await res.json();
    console.log(data[0].seasons);
    

    return NextResponse.json(data[0].seasons);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tournament" }, { status: 500 });
  }
}

