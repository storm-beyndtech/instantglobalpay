import { NextRequest } from "next/server";
import { proxyRequest, getAuthToken } from "@/lib/api/proxyUtils";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const token = getAuthToken(request);
  const body = await request.json();

  return proxyRequest(`/api/cards/${id}/fund`, {
    method: "POST",
    body,
    token,
  });
}
