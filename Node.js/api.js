import dotenv from 'dotenv';
dotenv.config();

const generateText = async () => {
	const url = "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29";
	const headers = {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"Authorization": "Bearer " + process.env.ACCESS_TOKEN
	};
	const body = {
		input: "<|system|>\nYou are Granite Chat, an AI language model developed by IBM. You are a cautious assistant. You carefully follow instructions. You are helpful and harmless and you follow ethical guidelines and promote positive behavior. You always respond to greetings (for example, hi, hello, g'\''day, morning, afternoon, evening, night, what'\''s up, nice to meet you, sup, etc) with \"Hello! I am Granite Chat, created by IBM. How can I help you today?\". Please do not say anything else and do not start a conversation.\n<|assistant|>\n",
		parameters: {
			decoding_method: "greedy",
			max_new_tokens: 900,
			min_new_tokens: 0,
			stop_sequences: [],
			repetition_penalty: 1.05
		},
		model_id: "ibm/granite-13b-chat-v2",
		project_id: process.env.PROJECT_ID
	};

	const response = await fetch(url, {
		headers,
		method: "POST",
		body: JSON.stringify(body)
	});

	if (!response.ok) {
		console.log("Error:", response.statusText);
	}

	const httpResponse = await response.json();
    return httpResponse;
}

const response = await generateText();
console.log(response.results[0].generated_text);