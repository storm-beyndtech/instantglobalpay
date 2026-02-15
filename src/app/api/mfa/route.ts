import { NextRequest } from "next/server";
import { proxyRequest, getAuthToken } from "@/lib/api/proxyUtils";

export async function GET(request: NextRequest) {
  const token = getAuthToken(request);
  const url = new URL(request.url);
  const action = url.searchParams.get("action") || "status";

  return proxyRequest(`/api/mfa/${action}`, {
    method: "GET",
    token,
  });
}

export async function POST(request: NextRequest) {
  const token = getAuthToken(request);
  const body = await request.json();
  const { action, ...rest } = body;

  return proxyRequest(`/api/mfa/${action || "verify"}`, {
    method: "POST",
    body: rest,
    token,
  });
}
