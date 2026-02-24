import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// 1. megoldás: 2 lekérdezés használatával
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locationName: string }> },
) {
  try {
    const { locationName } = await params;

    // 1. lekérdezés: Névhez tartozó id "kinyerése"
    const location = await prisma.location.findUnique({
      where: { locationName: locationName },
    });

    if (!location) {
      return NextResponse.json(
        { message: "Nincs ilyen hegység az adatbázisban!" },
        { status: 404 },
      );
    }

    // 2. lekérdezés:
    const viewpoints = await prisma.viewpoint.findMany({
      where: { location_id: location.id },
      omit: { id: true },
    });

    if (viewpoints.length === 0) {
      return NextResponse.json(
        { message: "Ebben a hegységben nem találtam kilátót!" },
        { status: 404 },
      );
    }
    return NextResponse.json(viewpoints);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Ismeretlen hiba!" },
      { status: 500 },
    );
  }
}

// 2. megoldás: 1 oldali lekérdezéssel
// export async function GET(
//   request: NextRequest,
//   { params }: { params: Promise<{ locationName: string }> },
// ) {
//   try {
//     const { locationName } = await params;

//     const data = await prisma.location.findUnique({
//       where: { locationName: locationName },
//       select: {
//         viewpoints: {
//           omit: { id: true },
//         },
//       },
//     });

//     if (!data) {
//       return NextResponse.json(
//         { message: "Nincs ilyen hegység az adatbázisban!" },
//         { status: 404 },
//       );
//     }

//     if (data.viewpoints.length === 0) {
//       return NextResponse.json(
//         { message: "Ebben a hegységben nem találtam kilátót!" },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json(data?.viewpoints);
//   } catch (error) {
//     return NextResponse.json(
//       { message: error instanceof Error ? error.message : "Ismeretlen hiba!" },
//       { status: 500 },
//     );
//   }
// }

// 3. megoldás: N-oldali lekérdezéssel
// export async function GET(
//   request: NextRequest,
//   { params }: { params: Promise<{ locationName: string }> },
// ) {
//   try {
//     const { locationName } = await params;

//     const viewpoints = await prisma.viewpoint.findMany({
//       where: { location: { locationName: locationName } },
//       // include: { location: true },
//       omit: { id: true },
//     });

//     if (viewpoints.length === 0) {
//       return NextResponse.json(
//         { message: "Ebben a hegységben nem találtam kilátót!" },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json(viewpoints);
//   } catch (error) {
//     return NextResponse.json(
//       { message: error instanceof Error ? error.message : "Ismeretlen hiba!" },
//       { status: 500 },
//     );
//   }
// }
