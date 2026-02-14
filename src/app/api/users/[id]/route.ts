import { NextRequest } from "next/server";
import { proxyRequest, getAuthToken, buildQueryString } from "@/lib/api/proxyUtils";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const token = getAuthToken(request);
  const queryString = buildQueryString(request);

  return proxyRequest(`/api/users/${id}${queryString}`, {
    method: "GET",
    token,
  });
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const token = getAuthToken(request);
  const body = await request.json();

  return proxyRequest(`/api/users/${id}`, {
    method: "PUT",
    body,
    token,
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const token = getAuthToken(request);
  const body = await request.json();

  return proxyRequest(`/api/users/${id}`, {
    method: "PATCH",
    body,
    token,
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const token = getAuthToken(request);

  return proxyRequest(`/api/users/${id}`, {
    method: "DELETE",
    token,
  });
}
