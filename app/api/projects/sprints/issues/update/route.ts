// app/api/projects/sprints/issues/update/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { Priority, Status } from "@prisma/client";

export async function PUT(request: Request) {
  try {
    // Validate request body exists
    const req = await request.json();
    
    if (!req || !req.issueId || !req.status) {
      return NextResponse.json(
        { error: "Issue ID and status are required" },
        { status: 400 }
      );
    }

    // Validate that the status is a valid Status enum
    const validStatuses: Status[] = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];
    if (!validStatuses.includes(req.status)) {
      return NextResponse.json(
        { error: "Invalid status provided" },
        { status: 400 }
      );
    }

    // Update the issue in the database
    const updatedIssue = await db.issue.update({
      where: { id: req.issueId },
      data: { 
        status: req.status,
        // Optionally, you can add updated timestamp or other metadata
        updatedAt: new Date()
      },
      // Include related data if needed
      include: {
        assignee: true,
        sprint: true
      }
    });

    return NextResponse.json(updatedIssue, { status: 200 });
  } catch (error) {
    console.error("Error updating Issue:", error);
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An error occurred while updating the issue" },
      { status: 500 }
    );
  }
}