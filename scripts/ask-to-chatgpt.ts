// Name: Ask to ChatGPT
// Description: Send a single prompt to ChatGPT
// Shortcut: command shift enter
// Group: AI

import "@johnlindquist/kit";
import { Configuration, CreateChatCompletionResponse, OpenAIApi } from 'openai-edge';

type Model = {
    name: string;
    promptCost: number;
    resultCost: number;
}

const models: Model[] = [
    {
        name: 'gpt-3.5-turbo-0125' as const,
        promptCost: 0.0005,
        resultCost: 0.0015
    },
    {
        name: 'gpt-4-0125-preview' as const,
        promptCost: 0.01,
        resultCost: 0.03
    }
] as const;

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const selectedModel = models[0]
const openai = new OpenAIApi(config);
const response = await openai.createChatCompletion({
    model: selectedModel.name,
    stream: false,
    temperature: 1,
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
await div(md(`${data.choices[0].message.content}`));