// Name: Ask to ChatGPT
// Description: Send a single prompt to ChatGPT
// Shortcut: command shift enter
// Group: AI

import "@johnlindquist/kit";
import { Configuration, OpenAIApi } from 'openai-edge';

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);
const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo-1106',
    stream: false,
    temperature: 0.5,
    messages: [
        {
            role: "system",
            content: "You are an helpful AI, you will try to output concise and helpful answers to the user's questions, use markdown to format your answers"
        },
        {
            role: "user",
            content: await arg("What do you want to ask?"),
        }
    ]
});

const responseText: string = (await response.json()).choices[0].message.content;

await div(md(responseText))
