import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schedules = await prisma.userSchedule.findMany({
      where: { userId: session.user.id },
      include: {
        supplement: {
          include: {
            ingredients: {
              include: {
                ingredient: true,
              },
            },
          },
        },
      },
      orderBy: { time: "asc" },
    });

    return NextResponse.json(schedules);
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return NextResponse.json({ error: "Failed to fetch schedule" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { supplementId, time, dose, withFood, daysOfWeek, notes } = body;

    if (!supplementId || !time || !dose) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supplement = await prisma.supplement.findUnique({
      where: { id: supplementId },
    });

    if (!supplement) {
      return NextResponse.json({ error: "Supplement not found" }, { status: 404 });
    }

    const schedule = await prisma.userSchedule.create({
      data: {
        userId: session.user.id,
        supplementId,
        time,
        dose,
        withFood: withFood ?? false,
        daysOfWeek,
        notes,
      },
      include: {
        supplement: true,
      },
    });

    return NextResponse.json(schedule);
  } catch (error) {
    console.error("Error creating schedule:", error);
    return NextResponse.json({ error: "Failed to create schedule" }, { status: 500 });
  }
}
