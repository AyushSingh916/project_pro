// app/api/projects/sprints/[sprintId]/issues/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(
  request: Request
) {
  try {
    const url = new URL(request.url);
    const Id = url.searchParams.get('sprintId') || "";
    const sprintId = parseInt(Id)

    if (isNaN(sprintId)) {
      return NextResponse.json({ error: "Invalid sprint ID" }, { status: 400 });
    }

    const issues = await db.issue.findMany({
      where: {
        sprintId: sprintId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (issues.length === 0) {
      return NextResponse.json(
        { message: "No issues found for this sprint." },
        { status: 404 }
      );
    }

    return NextResponse.json({ issues }, { status: 200 });
  } catch (error) {
    console.error("Error fetching issues:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the issues." },
      { status: 500 }
    );
  }
}
