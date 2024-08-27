import { NextResponse } from "next/server";
import { logger } from "@utils/helpers/log";
import { fetchBySearch } from "@server_actions/search.action";

export async function POST(req) {
	try {
		const { searchParams } = new URL(req.url);
		const query = searchParams.get('q');

		const filtersBody = await req.json();
		const filters = filtersBody.data;

		const { companyId } = filters;

		if (!companyId) {
			throw new Error("Unauthorized access");
		}

		if (!query) {
			return NextResponse.json({ error: "Query is required." }, { status: 200 });
		}


		const result = await fetchBySearch(query, filters, companyId);

		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		logger(error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
