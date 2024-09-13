import { structuredBody } from './watsonx/structured.js';
import { chatBody } from './watsonx/chat.js';

export const generate = async (input, using_chat, model_id) => {
	const url = "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29";
	const headers = {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"Authorization": "Bearer " + process.env.ACCESS_TOKEN
	};
	const body = using_chat ? chatBody : structuredBody;
    body.input = input;
    body.model_id = model_id;
    body.project_id = process.env.PROJECT_ID;

	const response = await fetch(url, {
		headers,
		method: "POST",
		body: JSON.stringify(body)
	});

	if (!response.ok) {
		throw new Error("Non-200 response");
	}

	return await response.json();
}