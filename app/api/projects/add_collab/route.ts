import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
      const req = await request.json();

      const username = req.username;
      const projectId = parseInt(req.projectId);
  
      const user = await db.user.findUnique({
        where: { username },
      });
  
      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      const project = await db.project.findUnique({
        where: { id: projectId },
      });
  
      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }
  
      await db.project.update({
        where: { id: projectId },
        data: {
          collaborators: {
            connect: { id: user.id }, 
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
  