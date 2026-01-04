import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supplements = await prisma.supplement.findMany({
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(supplements);
  } catch (error) {
    console.error("Error fetching supplements:", error);
    return NextResponse.json({ error: "Failed to fetch supplements" }, { status: 500 });
  }
}
