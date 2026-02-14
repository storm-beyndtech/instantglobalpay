import { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/api/proxyUtils";

export async function GET(request: NextRequest) {
  return proxyRequest("/api/health", {
    method: "GET",
  });
}
