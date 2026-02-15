import { NextRequest } from "next/server";
import { proxyRequest, getAuthToken, buildQueryString } from "@/lib/api/proxyUtils";

export async function GET(request: NextRequest) {
  const token = getAuthToken(request);
  const queryString = buildQueryString(request);

  return proxyRequest(`/api/cards${queryString}`, {
    method: "GET",
    token,
  });
}

export async function POST(request: NextRequest) {
  const token = getAuthToken(request);
  const body = await request.json();
  const url = new URL(request.url);
  const action = url.pathname.split("/").pop();

  // Handle /api/cards/issue
  if (action === "issue") {
    return proxyRequest("/api/cards/issue", {
      method: "POST",
      body,
      token,
    });
  }

  return proxyRequest("/api/cards", {
    method: "POST",
    body,
    token,
  });
}
