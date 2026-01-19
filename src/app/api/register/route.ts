import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

    // Mock registration for demo - just return success
    return NextResponse.json({
      user: {
        id: "mock-id",
        name,
        email,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
