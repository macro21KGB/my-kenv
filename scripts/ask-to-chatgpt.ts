// Name: Ask to ChatGPT
// Description: Send a single prompt to ChatGPT
// Shortcut: command shift enter
// Group: AI

import "@johnlindquist/kit";
import { Configuration, CreateChatCompletionResponse, OpenAIApi } from 'openai-edge';

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);
const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: false,
    temperature: 0.7,
    max_tokens: 600,
    messages: [
        {
            role: "system",
            content: "You are an helpful AI, you will try to output concise and helpful answers to the user's questions, use markdown to format your answers"
        },
        {
            role: "user",
            content: await arg("What do you want to say?"),
        }
    ]
});

const data: CreateChatCompletionResponse = await response.json();
await div(md(data.choices[0].message.content));

