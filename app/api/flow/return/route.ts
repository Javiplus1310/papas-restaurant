import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const token = formData.get("token") as string;

        console.log("POST recibido de Flow - Token:", token);

        if (!token) {
            return NextResponse.redirect(
                new URL("/confirmacion?error=no-token", req.url)
            );
        }

        // Redirigir a la página de confirmación con el token
        return NextResponse.redirect(
            new URL(`/confirmacion?token=${token}`, req.url)
        );
    } catch (error) {
        console.error("Error en return endpoint:", error);
        return NextResponse.redirect(
            new URL("/confirmacion?error=server-error", req.url)
        );
    }
}

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get("token");
  
    if (!token) {
        return NextResponse.redirect(
        new URL("/confirmacion?error=no-token", req.url)
        );
    }

    return NextResponse.redirect(
        new URL(`/confirmacion?token=${token}`, req.url)
    );
}