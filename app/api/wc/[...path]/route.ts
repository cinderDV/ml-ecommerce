import { NextRequest, NextResponse } from 'next/server';

const WC_BASE = `${process.env.NEXT_PUBLIC_WC_URL}/wp-json/wc/store/v1`;

async function proxyToWc(req: NextRequest, pathSegments: string[]) {
  const wcUrl = `${WC_BASE}/${pathSegments.join('/')}`;

  // Armar headers para WC
  const wcHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const cartToken = req.headers.get('x-cart-token');
  const nonce = req.headers.get('x-nonce');
  if (cartToken) wcHeaders['Cart-Token'] = cartToken;
  if (nonce) wcHeaders['Nonce'] = nonce;

  // Forward request a WC
  const body = req.method !== 'GET' ? await req.text() : undefined;
  const wcRes = await fetch(wcUrl, {
    method: req.method,
    headers: wcHeaders,
    body,
  });

  // Leer tokens de la respuesta de WC
  const newCartToken = wcRes.headers.get('cart-token');
  const newNonce = wcRes.headers.get('nonce');

  // Pasar el body de WC tal cual
  const responseBody = await wcRes.text();

  // Construir respuesta con tokens en headers custom
  const response = new NextResponse(responseBody, {
    status: wcRes.status,
    headers: { 'Content-Type': 'application/json' },
  });
  if (newCartToken) response.headers.set('x-cart-token', newCartToken);
  if (newNonce) response.headers.set('x-nonce', newNonce);

  return response;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyToWc(req, path);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyToWc(req, path);
}
