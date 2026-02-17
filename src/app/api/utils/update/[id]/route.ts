import { NextRequest } from "next/server";
import { proxyRequest, getAuthToken } from "@/lib/api/proxyUtils";

interface RouteContext {
	params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
	const { id } = await context.params;
	const token = getAuthToken(request);
	const body = await request.json();
	return proxyRequest(`/api/utils/update/${id}`, {
		method: "PUT",
		body,
		token,
	});
}

