import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        // Parse the incoming request body
        const req = await request.json();
        console.log(req); // Check the incoming data

        const { name, slug, description, username } = req;

        // Check if the organization already exists
        const existingOrganization = await db.organization.findUnique({
            where: { slug },
        });

        if (existingOrganization) {
            return NextResponse.json(
                { message: "Organization with this slug already exists." },
                { status: 400 }
            );
        }

        // Create the new organization and associate the admin user
        const newOrganization = await db.organization.create({
            data: {
                name,
                slug,
                description,
                adminUsername: username, // Admin is associated by username
                users: {
                    connect: { username }, // Connect the admin user to the organization
                },
            },
        });

        // Return the response
        return NextResponse.json(
            { message: "Organization created successfully", organization: newOrganization },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating organization:", error);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}
