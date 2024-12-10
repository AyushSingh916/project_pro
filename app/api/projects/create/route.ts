import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, description, organizationSlug } = await request.json();

    // Check if the organization exists
    const organization = await db.organization.findUnique({
      where: { slug: organizationSlug },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // Create the new project
    const newProject = await db.project.create({
      data: {
        name,
        description,
        organizationSlug,
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the project" },
      { status: 500 }
    );
  }
}
