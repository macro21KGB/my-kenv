// Name: chtsh

import "@johnlindquist/kit"
import * as cheerio from 'cheerio';

const listOfLanguages = [
    "bash",
    "c",
    "cpp",
    "c#",
    "clojure",
    "python",
    "ruby",
    "rust",
    "scala",
    "javascript",
    "typescript",
    "java",
    "go",
    "kotlin",
    "linux",
    "lua"
] as const

type Language = typeof listOfLanguages[number]

const selectedLanguage: Language = await arg("What language do you want to search for?", listOfLanguages as any)

const querySearch = (await arg("What do you want to search for?")).replace(/ /g, "+")

const response = await fetch(`https://cheat.sh/${selectedLanguage}/${querySearch}`)

const text = await response.text()

const $ = cheerio.load(text);

const code = $("pre").text()
await div(md(`\`\`\`${selectedLanguage}\n${code}\n\`\`\``))