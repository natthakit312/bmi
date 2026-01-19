import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateBMI, classifyBMI } from "@/lib/bmi";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const entries = [];
    const now = Date.now();
    const oneDay = 86400000;

    for (let i = 0; i < 50; i++) {
      const timeOffset = Math.floor(Math.random() * 365 * oneDay);
      const timestamp = new Date(now - timeOffset);
      const height = Math.floor(Math.random() * (190 - 150 + 1)) + 150;
      const weight = Math.floor(Math.random() * (120 - 45 + 1)) + 45;
      const bmi = calculateBMI(weight, height, "metric")!;
      const classification = classifyBMI(bmi);

      entries.push({
        userId: session.user.id,
        bmi,
        weight,
        height,
        unitSystem: "metric",
        category: classification.category,
        timestamp,
      });
    }

    await prisma.bmiLog.createMany({
      data: entries,
    });

    return NextResponse.json({ success: true, count: entries.length });
  } catch (error) {
    console.error("Mock generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
