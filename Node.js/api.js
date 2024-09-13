import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import { generate } from './generate.js'; 

const input = "What is the capital of the United States?";
const using_chat = true;
const model_id = "ibm/granite-13b-chat-v2";

const response = await generate(input, using_chat, model_id);
console.log(response.results[0].generated_text);