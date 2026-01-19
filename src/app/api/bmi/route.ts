import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bmi, weight, height, unitSystem, category } = await req.json();

    if (!bmi || !weight || !height || !unitSystem || !category) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const log = await prisma.bmiLog.create({
      data: {
        userId: session.user.id,
        bmi: parseFloat(bmi),
        weight: parseFloat(weight),
        height: parseFloat(height),
        unitSystem,
        category,
      },
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("BMI log error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const logs = await prisma.bmiLog.findMany({
      where: { userId: session.user.id },
      orderBy: { timestamp: "desc" },
    });

    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
