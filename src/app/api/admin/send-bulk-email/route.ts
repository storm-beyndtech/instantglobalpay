import { NextRequest } from "next/server";
import { proxyRequest, getAuthToken } from "@/lib/api/proxyUtils";

export async function POST(request: NextRequest) {
	const token = getAuthToken(request);
	const body = await request.json();
	return proxyRequest("/api/admin/send-bulk-email", {
		method: "POST",
		body,
		token,
	});
}

