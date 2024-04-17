// Name: Ask to ChatGPT
// Description: Send a single prompt to ChatGPT
// Shortcut: command shift enter
// Group: AI

import "@johnlindquist/kit";


const response = await fetch("https://api.anthropic.com/v1/messages", {
    body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        stream: false,
        system: "You are an helpful AI, you will try to output concise and helpful answers to the user's questions, use markdown to format your answers",
        temperature: 0.7,
        max_tokens: 600,
        messages: [
            {
                role: "user",
                content: await arg("What do you want to ask?"),
            }
        ]
    }),
    method: "POST",
    headers: {
        "x-api-key": process.env["ANTHROPIC_API_KEY"],
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json"
    }
});

const data = (await response.json()).content[0].text;
await div(md(`${data}`));
