import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const req = await request.json();

    console.log(req)
    

    return NextResponse.json({Ok: true}, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the project" },
      { status: 500 }
    );
  }
}
