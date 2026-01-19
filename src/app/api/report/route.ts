import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "daily";

    // Fetch all logs for the user (for simplicity in aggregation)
    // Production note: For millions of records, use SQL grouping functions
    const logs = await prisma.bmiLog.findMany({
      where: { userId: session.user.id },
      orderBy: { timestamp: "asc" },
    });

    const groups: Record<string, { label: string; count: number; sumBmi: number; key: string }> = {};

    logs.forEach((log: any) => {
      const date = new Date(log.timestamp);
      let key = "";
      let label = "";

      if (period === "daily") {
        key = date.toISOString().split("T")[0];
        label = new Date(key).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      } else if (period === "weekly") {
        // Simple week calculation
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        key = `${date.getFullYear()}-W${weekNum.toString().padStart(2, '0')}`;
        label = `Week ${weekNum}, ${date.getFullYear()}`;
      } else if (period === "monthly") {
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      } else if (period === "yearly") {
        key = `${date.getFullYear()}`;
        label = key;
      }

      if (!groups[key]) {
        groups[key] = { label, count: 0, sumBmi: 0, key };
      }
      groups[key].count++;
      groups[key].sumBmi += log.bmi;
    });

    const result = Object.values(groups).sort((a, b) => b.key.localeCompare(a.key));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Report error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
