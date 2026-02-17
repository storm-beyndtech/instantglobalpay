import { NextRequest } from "next/server";
import { proxyRequest, getAuthToken } from "@/lib/api/proxyUtils";

export async function POST(request: NextRequest) {
	const token = getAuthToken(request);
	return proxyRequest("/api/auth/logout", {
		method: "POST",
		token,
	});
}
