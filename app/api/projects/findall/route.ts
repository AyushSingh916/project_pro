import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { projectId } = await request.json();

    const id = parseInt(projectId)

    // Query to fetch sprints and related issues for the given project ID
    const sprints = await db.sprint.findMany({
      where: {
        projectId: id,
      },
      include: {
        issues: true, // Include related issues
      },
    });

    return NextResponse.json({ sprints }, { status: 200 });
  } catch (error) {
    console.error("Error fetching sprints and issues:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching sprints and issues" },
      { status: 500 }
    );
  }
}
