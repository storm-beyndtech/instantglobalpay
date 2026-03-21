import { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/api/proxyUtils";

export async function POST(request: NextRequest) {
  const body = await request.json();

  return proxyRequest("/api/users/password-reset/request", {
    method: "POST",
    body,
  });
}
