import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function DELETE(request: Request) {
  try {
    const { slug } = await request.json();

    // Delete the organization from the database using the slug
    const deletedOrg = await db.organization.delete({
      where: {
        slug: slug,
      },
    });

    // If the deletion is successful, return a success response
    return NextResponse.json({ ok: true, message: "Organization deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting organization:", error);
    return NextResponse.json({ ok: false, message: "Error deleting organization" }, { status: 500 });
  }
}
