import { NextRequest, NextResponse } from "next/server";

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ProxyOptions {
  method?: string;
  body?: any;
  headers?: HeadersInit;
  token?: string | null;
}

/**
 * Generic proxy utility for forwarding requests to backend server
 */
export async function proxyRequest(
  endpoint: string,
  options: ProxyOptions = {}
): Promise<NextResponse> {
  try {
    const { method = "GET", body, headers = {}, token } = options;

    const requestHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...headers,
    };

    // Add authorization token if provided
    if (token) {
      requestHeaders["Authorization"] = token;
    }

    const fetchOptions: RequestInit = {
      method,
      headers: requestHeaders,
    };

    // Only add body for methods that support it
    if (body && method !== "GET" && method !== "HEAD") {
      fetchOptions.body = typeof body === "string" ? body : JSON.stringify(body);
    }

    const response = await fetch(`${SERVER_URL}${endpoint}`, fetchOptions);

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error(`Proxy error for ${endpoint}:`, error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Extract authorization token from request headers
 */
export function getAuthToken(request: NextRequest): string | null {
  return request.headers.get("authorization");
}

/**
 * Build query string from URL search params
 */
export function buildQueryString(request: NextRequest): string {
  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}
