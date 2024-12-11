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
        issues: true,
      },
    });

    const collaborators = await db.project.findMany({
      where: {
        id: id,
      },
      include: {
        collaborators: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    const collab = collaborators[0].collaborators;

    return NextResponse.json({ sprints, collab }, { status: 200 });
  } catch (error) {
    console.error("Error fetching sprints and issues:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching sprints and issues" },
      { status: 500 }
    );
  }
}
