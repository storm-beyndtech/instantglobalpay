import { NextRequest } from "next/server";
import { proxyRequest, getAuthToken, buildQueryString } from "@/lib/api/proxyUtils";

export async function GET(request: NextRequest) {
	const token = getAuthToken(request);
	const queryString = buildQueryString(request);
	return proxyRequest(`/api/admin/email-logs${queryString}`, {
		method: "GET",
		token,
	});
}

