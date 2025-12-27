import { NextResponse } from "next/server";
import crypto from "crypto";

function sign(params: Record<string, string>) {
  const secretKey = process.env.FLOW_SECRET_KEY!;
  
  const toSign = Object.keys(params)
    .sort()
    .map(key => `${key}${params[key]}`)
    .join("");
  
  return crypto
    .createHmac("sha256", secretKey)
    .update(toSign)
    .digest("hex");
}

export async function POST(req: Request) {
  try {
    const { amount, orderId, subject, email } = await req.json();
    
    if (!amount || !orderId || !subject || !email) {
      return NextResponse.json(
        { error: "Faltan parámetros (amount, orderId, subject, email)" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://papas-restaurant.vercel.app";
    
    const params = {
      apiKey: process.env.FLOW_API_KEY!,
      amount: amount.toString(),
      commerceOrder: orderId,
      subject,
      email,
      urlConfirmation: `${baseUrl}/api/flow/confirm`,
      urlReturn: `${baseUrl}/confirmacion`
    };

    const s = sign(params);
    const body = new URLSearchParams({ ...params, s });

    // Corregido: paréntesis en lugar de backticks
    const res = await fetch(`${process.env.FLOW_API_URL}/payment/create`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });

    const data = await res.json();

    if (!res.ok || data.code) {
      console.error("Error de Flow:", data);
      return NextResponse.json({ error: data.message || "Error en Flow" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      url: data.url,
      token: data.token,
      flowOrder: data.flowOrder
    });

  } catch (err: any) {
    console.error("Error en create-order:", err);
    return NextResponse.json(
      { error: err.message || "Error desconocido" },
      { status: 500 }
    );
  }
}