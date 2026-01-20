import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
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
    console.error("Fetch BMI logs error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { weight, height, bmi, category, unitSystem } = await req.json();

    const log = await prisma.bmiLog.create({
      data: {
        userId: session.user.id,
        weight: Number(weight),
        height: Number(height),
        bmi: Number(bmi),
        category,
        unitSystem,
      },
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("Save BMI log error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
