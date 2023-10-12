// Name: Fetch Prompts From Awesome Chatgpt prompts
// Cache: true
// Group: AI

import * as cheerio from "cheerio";
import "@johnlindquist/kit";


interface Prompt {
    title: string;
    content: string;
}

const response = await fetch("https://github.com/f/awesome-chatgpt-prompts", {
    method: "GET",
})

const html = await response.text();

const $ = cheerio.load(html);

const allH2s = $("h2");
const allBlockQuotes = $("blockquote");

const prompts: Prompt[] = [];
const BLOCK_QUOTE_OFFSET = 3;

allH2s.each((index, element) => {
    const title = $(element).text();

    if (!title.includes("Act as"))
        return;

    const content = $(allBlockQuotes[index - BLOCK_QUOTE_OFFSET]).children().text();

    prompts.push({
        title,
        content,
    });
});

const selectedPromptContent = await arg("Choose a prompt", async () => {

    return prompts.map(prompt => {
        return {
            name: prompt.title,
            description: prompt.content,
            value: prompt.content,
        }
    })
});

clipboard.writeText(selectedPromptContent);
