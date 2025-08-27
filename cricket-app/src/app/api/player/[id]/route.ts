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
    const res = await fetch(`https://cricbuzz-api.example.com/player/${id.id}`);
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch player" }, { status: 500 });
  }
}
