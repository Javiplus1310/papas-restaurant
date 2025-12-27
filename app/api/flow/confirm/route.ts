import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get("token");
    console.log("🔍 Verificando pago");
    console.log("Token recibido:", token);
    
    if (!token) {
        return NextResponse.json({ 
            success: false,
            error: "Falta token" 
        }, { status: 400 });
    }

    const apiKey = process.env.FLOW_API_KEY;
    const secretKey = process.env.FLOW_SECRET_KEY;
    const apiUrl = process.env.FLOW_API_URL;

    console.log("Configuración:");
    console.log("- API Key presente:", !!apiKey);
    console.log("- Secret Key presente:", !!secretKey);
    console.log("- API URL:", apiUrl);

    if (!apiKey || !secretKey || !apiUrl) {
        return NextResponse.json({
            success: false,
            error: "Configuración incompleta"
        }, { status: 500 });
    }

    const paramsToSign: Record<string, string> = { apiKey, token };
    
    const toSign = Object.keys(paramsToSign)
        .sort()
        .map(key => `${key}${paramsToSign[key]}`)
        .join("");
    
    console.log("String a firmar (primeros 50 chars):", toSign.substring(0, 50) + "...");
    
    const s = crypto.createHmac("sha256", secretKey).update(toSign).digest("hex");

    console.log("Firma generada (primeros 10 chars):", s.substring(0, 10) + "...");

    const body = new URLSearchParams({ apiKey, token, s });

    console.log("Consultando a Flow:", `${apiUrl}/payment/getStatus`);

    try {
        const resp = await fetch(`${apiUrl}/payment/getStatus`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body,
        });

        const data = await resp.json();

        console.log("📦 Status de respuesta:", resp.status);
        console.log("📦 Respuesta completa de Flow:", JSON.stringify(data, null, 2));

        if (!resp.ok || data.code) {
            return NextResponse.json({
                success: false,
                error: "Error al consultar Flow",
                details: data,
                statusCode: resp.status
            }, { status: resp.status });
        }

        return NextResponse.json({
            success: true,
            status: data.status,
            commerceOrder: data.commerceOrder,
            amount: data.amount,
            paymentData: data.paymentData,
        });

    } catch (error: any) {
        console.error("❌ Error al llamar a Flow:", error);
        return NextResponse.json({
            success: false,
            error: "Error de conexión con Flow",
            message: error.message
        }, { status: 500 });
    }
}