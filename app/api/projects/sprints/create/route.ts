import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const req = await request.json();
    const { name, projectId, startDate, endDate } = req;

    // Validate required fields
    if (!name || !projectId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newSprint = await db.sprint.create({
      data: {
        name,
        projectId: parseInt(projectId),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    return NextResponse.json(newSprint, { status: 201 });
  } catch (error) {
    console.error("Error creating Sprint:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the sprint" },
      { status: 500 }
    );
  }
}