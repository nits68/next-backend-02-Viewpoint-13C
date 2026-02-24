import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export type ViewpointItems = {
  viewpointName?: string;
  mountain?: string;
  location_id?: number;
  height?: number;
  description?: string;
  built?: string;
  imageUrl?: string;
};

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const idSzám: number = Number(id);
    if (!idSzám) {
      return NextResponse.json({ message: "Nem megfelelő az ID értéke!" }, { status: 400 });
    }

    if (idSzám !== Math.floor(idSzám)) {
      return NextResponse.json({ message: "Az azonosító csak egész szám lehet!" }, { status: 400 });
    }

    // A megadott id-vel létezik kilátó?
    const existingViewpoint = await prisma.viewpoint.findUnique({
      where: { id: idSzám },
    });

    if (!existingViewpoint) {
      return NextResponse.json(
        { message: `Ezzel az azonosítóval (${idSzám}) nem létezik kilátó!` },
        { status: 400 },
      );
    }

    const changedData: ViewpointItems = await request.json();

    if (changedData.built) {
      const newDate = new Date(changedData.built);
      if (newDate.toString() === "Invalid Date") {
        return NextResponse.json(
          { message: "A dátum hibás!" },
          { status: 400 },
        );
      }
      if (newDate > new Date()) {
        return NextResponse.json(
          { message: "Az aktuális dátumnál nem adhat meg későbbi dátumot a built mezőben!" },
          { status: 400 },
        );
      }
    }

    if (changedData.height !== undefined && changedData.height < 1) {
      return NextResponse.json(
        { message: "Egy kilátónak legalább 1 méter magasnak kell lennie!" },
        { status: 400 },
      );
    }

    const updatedViewpoint = await prisma.viewpoint.update({
      where: { id: idSzám },
      data: changedData,
    });

    return NextResponse.json(updatedViewpoint);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Ismeretlen hiba!" },
      { status: 500 },
    );
  }
}
