import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
      let { username, projectId } = await request.json();
  
      // Fetch the user by username
      const user = await db.user.findUnique({
        where: { username },
      });
  
      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      projectId = parseInt(projectId)
      // Check if the project exists
      const project = await db.project.findUnique({
        where: { id: projectId },
      });
  
      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }
  
      // Debugging logs
      console.log("Connecting user ID:", user.id, "to project ID:", projectId);
  
      // Add the user as a collaborator to the project
      await db.project.update({
        where: { id: projectId },
        data: {
          collaborators: {
            connect: { id: user.id }, // Use `id` as per schema
          },
        },
      });
  
      return NextResponse.json(
        { username: user.username, email: user.email },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error adding collaborator to project:", error);
      return NextResponse.json(
        { error: "An error occurred while adding the collaborator" },
        { status: 500 }
      );
    }
  }
  