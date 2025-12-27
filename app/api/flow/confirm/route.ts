import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  
  if (!token) {
    return NextResponse.json({ error: "Falta token" }, { status: 400 });
  }

  const apiKey = process.env.FLOW_API_KEY!;
  const secretKey = process.env.FLOW_SECRET_KEY!;
  const apiUrl = process.env.FLOW_API_URL!;

  const paramsToSign: Record<string, string> = { apiKey, token };
  
  const toSign = Object.keys(paramsToSign)
    .sort()
    .map(key => `${key}${paramsToSign[key]}`)
    .join("");
  
  const s = crypto.createHmac("sha256", secretKey).update(toSign).digest("hex");

  const body = new URLSearchParams({ apiKey, token, s });

  const resp = await fetch(`${apiUrl}/payment/getStatus`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await resp.json();

  console.log("Estado del pago:", data);

  return NextResponse.json({ success: true, data });
}