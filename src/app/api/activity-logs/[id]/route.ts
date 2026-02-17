import { NextRequest } from "next/server";
import { proxyRequest, getAuthToken } from "@/lib/api/proxyUtils";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const token = getAuthToken(request);
	const { id } = await params;
	return proxyRequest(`/api/activity-logs/${id}`, {
		method: "GET",
		token,
	});
}
