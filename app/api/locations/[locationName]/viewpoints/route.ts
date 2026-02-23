import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locationName: string }> },
) {
  const { locationName } = await params;

  // 1. megoldás: 2 lekérdezés használata
  const location = await prisma.location.findFirst({
    where: { locationName: locationName },
  });

  if (!location) {
    return NextResponse.json({ message: "Nincs ilyen hegység az adatbázisban!" }, { status: 404 });
  }

  return NextResponse.json({ message: `Hello ${slug}!` });
}
