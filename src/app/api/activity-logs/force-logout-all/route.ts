import { NextRequest } from "next/server";
import { proxyRequest, getAuthToken } from "@/lib/api/proxyUtils";

export async function POST(request: NextRequest) {
	const token = getAuthToken(request);
	const body = await request.json().catch(() => ({}));
	return proxyRequest("/api/activity-logs/force-logout-all", {
		method: "POST",
		body,
		token,
	});
}
