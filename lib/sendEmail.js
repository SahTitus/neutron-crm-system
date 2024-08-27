import { logger } from "@utils/helpers/log";
import { endpoints } from "./api/endpoints";

export const sendEmail = async (data) => {
	console.log(data,'sendemail');
	try {
		const response = await fetch(endpoints.email, {
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