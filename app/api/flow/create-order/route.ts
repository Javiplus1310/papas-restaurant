import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, orderId, subject, email } = body;

    if (!amount || !orderId || !subject) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    const apiKey = process.env.FLOW_API_KEY;
    const secretKey = process.env.FLOW_SECRET_KEY;
    const apiUrl = process.env.FLOW_API_URL;

    if (!apiKey || !secretKey || !apiUrl) {
      return NextResponse.json(
        { error: 'Configuración de Flow incompleta' },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const urlConfirmation = `${baseUrl}/api/flow/confirm`; 
    const urlReturn = `${baseUrl}/confirmacion`; 

    const params: Record<string, string> = {
      apiKey,
      commerceOrder: orderId,
      subject,
      amount: amount.toString(),
      email: email || 'javidx_13@hotmail.cl',
      urlConfirmation,
      urlReturn,
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

    const formBody = new URLSearchParams(params);
    const response = await fetch(`${apiUrl}/payment/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error de Flow create:', data);
      return NextResponse.json(
        { error: 'Error al crear orden en Flow', details: data },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      redirect: data.url,
      token: data.token,
      flowOrder: data.flowOrder,
    });

  } catch (error) {
    console.error('❌ Error en create-order:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}