import { NextRequest } from "next/server";
import { proxyRequest, getAuthToken } from "@/lib/api/proxyUtils";

export async function GET(request: NextRequest) {
	const token = getAuthToken(request);
	return proxyRequest("/api/activity-logs/admin/active-sessions", {
		method: "GET",
		token,
	});
}
