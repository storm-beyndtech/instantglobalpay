import { NextRequest } from "next/server";
import { proxyRequest, getAuthToken } from "@/lib/api/proxyUtils";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const token = getAuthToken(request);
	const { id } = await params;
	const body = await request.json().catch(() => ({}));
	return proxyRequest(`/api/activity-logs/${id}/report-suspicious`, {
		method: "POST",
		body,
		token,
	});
}
