import { NextRequest } from "next/server";
import { proxyRequest, getAuthToken, buildQueryString } from "@/lib/api/proxyUtils";

export async function GET(request: NextRequest) {
  const token = getAuthToken(request);
  const queryString = buildQueryString(request);

  return proxyRequest(`/api/users${queryString}`, {
    method: "GET",
    token,
  });
}

export async function POST(request: NextRequest) {
  const token = getAuthToken(request);
  const body = await request.json();

  return proxyRequest("/api/users", {
    method: "POST",
    body,
    token,
  });
}

export async function PUT(request: NextRequest) {
  const token = getAuthToken(request);
  const body = await request.json();

  return proxyRequest("/api/users", {
    method: "PUT",
    body,
    token,
  });
}

export async function DELETE(request: NextRequest) {
  const token = getAuthToken(request);

  return proxyRequest("/api/users", {
    method: "DELETE",
    token,
  });
}
