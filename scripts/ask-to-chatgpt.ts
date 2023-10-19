// Name: Ask to ChatGPT
// Description: Send a single prompt to ChatGPT
// Shortcut: command shift enter
// Group: AI

import "@johnlindquist/kit";
import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    temperature: 0.6,
    messages: [
        {
            role: "system",
            content: "You are an helpful AI, you will try to output concise and helpful answers to the user's questions, use markdown to format your answers."
        },
        {
            role: "user",
            content: await arg("What do you want to say?"),
        }
    ]
});

// Convert the response into a friendly text-stream
const stream = OpenAIStream(response);
// Respond with the stream

const responseText = new StreamingTextResponse(stream);

div(md(await responseText.text()))
