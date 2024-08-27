import { logger } from "@utils/helpers/log";
import { endpoints } from "./api/endpoints";

export const getSearchResults = async (query, filters, companyId) => {
	const data = {
		...filters,
		companyId
	}
	
	try {
		const response = await fetch(`${endpoints.query}?q=${query}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				data: data,
			}),
			mode: 'cors',
		});

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const results = await response.json()
		return results;
	} catch (error) {
		logger(error);
	}
};