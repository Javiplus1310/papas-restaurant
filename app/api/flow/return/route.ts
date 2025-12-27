import { NextRequest, NextResponse } from "next/server";

// Manejar POST de Flow (cuando redirige después del pago)
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type");
    let token: string | null = null;

    // Flow puede enviar como form-data o query params
    if (contentType?.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      token = formData.get("token") as string;
    } else {
      // Intentar obtener del body como JSON
      try {
        const body = await req.json();
        token = body.token;
      } catch {
        // Si falla, intentar query params
        token = req.nextUrl.searchParams.get("token");
      }
    }

    console.log("POST a /return - Token:", token);

    if (!token) {
      console.error("No se recibió token en POST");
      return NextResponse.redirect(
        new URL("/confirmacion?error=no-token", req.url)
      );
    }

    // Redirigir a la página de confirmación con el token
    return NextResponse.redirect(
      new URL(`/confirmacion?token=${token}`, req.url),
      { status: 303 } // 303 = See Other, fuerza GET
    );
  } catch (error) {
    console.error("Error en POST /return:", error);
    return NextResponse.redirect(
      new URL("/confirmacion?error=server-error", req.url)
    );
  }
}

// También manejar GET
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  
  console.log("GET a /return - Token:", token);
  
  if (!token) {
    return NextResponse.redirect(
      new URL("/confirmacion?error=no-token", req.url)
    );
  }

  return NextResponse.redirect(
    new URL(`/confirmacion?token=${token}`, req.url)
  );
}