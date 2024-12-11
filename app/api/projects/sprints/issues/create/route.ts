// app/api/projects/sprints/issues/create/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { Priority, Status } from "@prisma/client";

export async function POST(request: Request) {
  try {
    // Validate request body exists
    const req = await request.json();
    
    if (!req) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    const { title, description, sprintId, assignee, priority = "MEDIUM", status = "TODO" } = req;

    // Validate required fields
    if (!title || !sprintId || !assignee) {
      return NextResponse.json(
        { error: "Required fields missing: title, sprintId, and assignee are required" },
        { status: 400 }
      );
    }

    // Create the issue
    const newIssue = await db.issue.create({
      data: {
        title,
        description: description || "",
        sprintId: parseInt(sprintId),
        assigneeUsername: assignee,
        priority: priority.toUpperCase() as Priority,
        status: status.toUpperCase() as Status,
      },
    });

    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    console.error("Error creating Issue:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the issue" },
      { status: 500 }
    );
  }
}