import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const token = formData.get("token") as string;

    console.log("POST a /confirmacion - Token:", token);

    if (!token) {
      return NextResponse.redirect(
        new URL("/confirmacion?error=no-token", req.url)
      );
    }

    return NextResponse.redirect(
      new URL(`/confirmacion?token=${token}`, req.url),
      { status: 303 }
    );
  } catch (error) {
    console.error("Error en POST /confirmacion:", error);
    return NextResponse.redirect(
      new URL("/confirmacion?error=server-error", req.url)
    );
  }
}