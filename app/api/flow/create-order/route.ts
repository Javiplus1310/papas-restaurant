import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, orderId, subject, email } = body;

    if (!amount || !orderId || !subject) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 });
    }

    const apiKey = process.env.FLOW_API_KEY!;
    const secretKey = process.env.FLOW_SECRET_KEY!;
    const apiUrl = process.env.FLOW_API_URL!;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

    const urlConfirmation = `${baseUrl}/api/flow/confirm`;
    const urlReturn = `${baseUrl}/confirmacion`;

    const paramsToSign = {
      apiKey,
      commerceOrder: orderId,
      subject,
      amount: amount.toString(),
      urlConfirmation,
      urlReturn
    } as Record<string, string>;

    const params = {
      ...paramsToSign,
      email: email || "cliente@correo.com" // este no se firma
    };

    const paramsString = Object.keys(paramsToSign)
      .sort()
      .map((key) => `${key}=${paramsToSign[key]}`)
      .join("&");

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(paramsString)
      .digest("hex");

    const form = new URLSearchParams({ ...params, s: signature });

    const response = await fetch(`${apiUrl}/payment/create`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });

    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data }, { status: 400 });

    return NextResponse.json({
      success: true,
      redirect: data.url,
      token: data.token,
      flowOrder: data.flowOrder,
    });

  } catch (err) {
    return NextResponse.json({ error: "Error interno", details: err }, { status: 500 });
  }
}