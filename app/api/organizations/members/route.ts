// app/api/projects/[projectId]/members/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const Id = url.searchParams.get("projectId") || "";
    const projectId = parseInt(Id);

    if (isNaN(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    // Fetch the organizationSlug from the project
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { organizationSlug: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Use the organizationSlug to fetch the members
    const organization = await db.organization.findUnique({
      where: { slug: project.organizationSlug },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    if (organization.users.length === 0) {
      return NextResponse.json(
        { message: "No members found for this organization." },
        { status: 404 }
      );
    }

    return NextResponse.json({ members: organization.users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the members." },
      { status: 500 }
    );
  }
}
