import { NextRequest } from "next/server";
import { proxyRequest, getAuthToken, buildQueryString } from "@/lib/api/proxyUtils";

export async function GET(request: NextRequest) {
  const token = getAuthToken(request);
  const queryString = buildQueryString(request);

  return proxyRequest(`/api/withdrawals${queryString}`, {
    method: "GET",
    token,
  });
}

export async function POST(request: NextRequest) {
  const token = getAuthToken(request);
  const body = await request.json();

  return proxyRequest("/api/withdrawals", {
    method: "POST",
    body,
    token,
  });
}
