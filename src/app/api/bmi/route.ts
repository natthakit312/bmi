import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Using LocalStorage mode" });
}

export async function POST() {
  return NextResponse.json({ message: "Using LocalStorage mode" });
}
