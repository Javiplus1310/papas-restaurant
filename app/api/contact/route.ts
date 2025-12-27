import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, telefono, mensaje } = body;

    if (!nombre || !telefono || !mensaje) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Papa\'s Restaurant <onboarding@resend.dev>',
      to: ['javidx_13@hotmail.cl'],
      subject: `Nuevo mensaje de contacto - ${nombre}`,
      html: `
        <h2>Nuevo mensaje desde el formulario de contacto</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Teléfono/WhatsApp:</strong> ${telefono}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje.replace(/\n/g, '<br>')}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Este mensaje fue enviado desde el formulario de contacto de Papa's Restaurant
        </p>
      `,
    });

    if (error) {
      console.error('Error de Resend:', error);
      return NextResponse.json(
        { error: 'Error al enviar el mensaje', details: error },
        { status: 500 }
      );
    }

    console.log('Email enviado exitosamente:', data);

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado correctamente',
      emailId: data?.id,
    });

  } catch (error: any) {
    console.error('Error en contact endpoint:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', message: error.message },
      { status: 500 }
    );
  }
}