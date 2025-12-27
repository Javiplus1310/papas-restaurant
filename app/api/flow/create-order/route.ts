import { NextResponse } from "next/server";
import crypto from "crypto";

function sign(params: Record<string, string>) {
  const secretKey = process.env.FLOW_SECRET_KEY!;
  
  const toSign = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join("&");

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

    const baseUrl = process.env.BASE_URL!;
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

    const res = await fetch(`${process.env.FLOW_API_URL}/payment/create`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });

    const data = await res.json();

    if (data.code !== 200) {
      return NextResponse.json({ error: data }, { status: 500 });
    }

    const { token, url } = data.data;
    return NextResponse.json({
      success: true,
      redirect: url,
      token,
      flowOrder: data.data.flowOrder
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Error desconocido" },
      { status: 500 }
    );
  }
}