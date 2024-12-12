import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const username = url.searchParams.get("username") || "";

    if (!username) {
      return NextResponse.json(
        { error: "Username is required." },
        { status: 400 }
      );
    }

    const response = await db.user.findUnique({
      where: {
        username: username,
      },
      select: {
        imageUrl: true, 
      },
    });

    if (!response) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ imageUrl: response.imageUrl }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user image:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the user image." },
      { status: 500 }
    );
  }
}
