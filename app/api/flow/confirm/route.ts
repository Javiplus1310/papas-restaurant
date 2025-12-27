import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ success: false, error: "Falta token" }, { status: 400 });
  }

  const apiKey = process.env.FLOW_API_KEY!;
  const secretKey = process.env.FLOW_SECRET_KEY!;
  const apiUrl = process.env.FLOW_API_URL!;

  const params = { apiKey, token };

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(`apiKey${apiKey}token${token}`)
    .digest("hex");

  const body = new URLSearchParams({ ...params, s: signature });

  const resp = await fetch(`${apiUrl}/payment/getStatus`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await resp.json();
  console.log("📩 Respuesta Flow:", data);

  if (!resp.ok || !data?.status) {
    return NextResponse.json(
      { success: false, error: "No se pudo validar pago", details: data },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    status: data.status,
    commerceOrder: data.commerceOrder,
    amount: data.amount,
    flowData: data,
  });
}
