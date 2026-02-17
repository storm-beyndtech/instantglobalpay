import { NextRequest } from "next/server";
import { proxyRequest, getAuthToken, buildQueryString } from "@/lib/api/proxyUtils";

export async function GET(request: NextRequest) {
	const token = getAuthToken(request);
	const queryString = buildQueryString(request);
	return proxyRequest(`/api/activity-logs${queryString}`, {
		method: "GET",
		token,
	});
}

export async function POST(request: NextRequest) {
	const token = getAuthToken(request);
	const body = await request.json().catch(() => ({}));
	return proxyRequest("/api/activity-logs", {
		method: "POST",
		body,
		token,
	});
}
