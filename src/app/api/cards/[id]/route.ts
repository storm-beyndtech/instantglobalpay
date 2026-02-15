import { NextRequest, NextResponse } from "next/server";
import { proxyRequest, getAuthToken } from "@/lib/api/proxyUtils";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const token = getAuthToken(request);

  return proxyRequest(`/api/cards/${id}`, {
    method: "GET",
    token,
  });
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const token = getAuthToken(request);
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/");
  const action = pathParts[pathParts.length - 1];

  // Handle specific actions like /api/cards/:id/freeze, /api/cards/:id/fund, etc.
  let endpoint = `/api/cards/${id}`;

  if (action === "freeze" || action === "fund" || action === "cancel") {
    endpoint = `/api/cards/${id}/${action}`;
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    // No body for some actions
  }

  return proxyRequest(endpoint, {
    method: "POST",
    body,
    token,
  });
}
