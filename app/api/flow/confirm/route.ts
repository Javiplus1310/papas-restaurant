import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = body.token;

    console.log("Confirmación recibida - Body completo:", body);
    console.log("Token recibido:", token);

    if (!token) {
      console.error("Token no proporcionado");
      return NextResponse.json(
        { error: 'Token no proporcionado' },
        { status: 400 }
      );
    }

    const apiKey = process.env.FLOW_API_KEY;
    const secretKey = process.env.FLOW_SECRET_KEY;
    const apiUrl = process.env.FLOW_API_URL;

    if (!apiKey || !secretKey || !apiUrl) {
      console.error("Configuración de Flow incompleta");
      return NextResponse.json(
        { error: 'Configuración de Flow incompleta' },
        { status: 500 }
      );
    }

    const params: Record<string, string> = {
      apiKey,
      token,
    };

    const paramsString = Object.keys(params)
      .sort()
      .map(key => `${key}${params[key]}`)
      .join('');
    
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(paramsString)
      .digest('hex');

    params.s = signature;

    console.log("Consultando estado del pago a Flow...");

    const formBody = new URLSearchParams(params);
    
    const response = await fetch(`${apiUrl}/payment/getStatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody.toString(),
    });

    const data = await response.json();

    console.log("Respuesta de Flow getStatus:", data);

    if (!response.ok) {
      console.error('Error al confirmar pago:', data);
      return NextResponse.json(
        { error: 'Error al confirmar pago', details: data },
        { status: response.status }
      );
    }

    console.log('✅ Pago confirmado:', {
      status: data.status,
      order: data.commerceOrder,
      amount: data.amount
    });

    return NextResponse.json({
      success: true,
      status: data.status,
      commerceOrder: data.commerceOrder,
      amount: data.amount,
      paymentData: data.paymentData,
    });

  } catch (error: any) {
    console.error('Error en confirm:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');

  console.log("GET request - Token:", token);

  if (!token) {
    return NextResponse.json(
      { error: 'Token no proporcionado' },
      { status: 400 }
    );
  }

  try {
    const apiKey = process.env.FLOW_API_KEY;
    const secretKey = process.env.FLOW_SECRET_KEY;
    const apiUrl = process.env.FLOW_API_URL;

    if (!apiKey || !secretKey || !apiUrl) {
      console.error("Configuración de Flow incompleta");
      return NextResponse.json(
        { error: 'Configuración de Flow incompleta' },
        { status: 500 }
      );
    }

    const params: Record<string, string> = {
      apiKey,
      token,
    };

    const paramsString = Object.keys(params)
      .sort()
      .map(key => `${key}${params[key]}`)
      .join('');
    
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(paramsString)
      .digest('hex');

    params.s = signature;

    console.log("Consultando estado del pago a Flow (GET)...");

    const formBody = new URLSearchParams(params);
    
    const response = await fetch(`${apiUrl}/payment/getStatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody.toString(),
    });

    const data = await response.json();

    console.log("Respuesta de Flow getStatus (GET):", data);

    if (!response.ok) {
      console.error('Error al confirmar pago (GET):', data);
      return NextResponse.json(
        { error: 'Error al confirmar pago', details: data },
        { status: response.status }
      );
    }

    console.log('✅ Pago confirmado (GET):', {
      status: data.status,
      order: data.commerceOrder,
      amount: data.amount
    });

    return NextResponse.json({
      success: true,
      status: data.status,
      commerceOrder: data.commerceOrder,
      amount: data.amount,
    });

  } catch (error: any) {
    console.error('Error en GET confirm:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', message: error.message },
      { status: 500 }
    );
  }
}