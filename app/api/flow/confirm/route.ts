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

    // Parámetros para obtener el estado del pago
    const params: Record<string, string> = {
      apiKey,
      token,
    };

    // Generar firma
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

    // Consultar estado del pago a Flow
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

    // Aquí puedes guardar el pago en tu base de datos
    console.log('✅ Pago confirmado:', {
      status: data.status,
      order: data.commerceOrder,
      amount: data.amount
    });

    // Flow espera un response exitoso para confirmar
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

// Flow también puede enviar confirmación por GET
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

  // Crear un request simulado con el token en el body
  const mockRequest = {
    json: async () => ({ token })
  } as NextRequest;

  return POST(mockRequest);
}