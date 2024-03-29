// Name: Convert Obsidian Math to Anki

import "@johnlindquist/kit"
import { marked } from "marked"

const copiedText = await clipboard.readText()

const replacedText = copiedText
    .replace(/\$\$([^$]+)\$\$/g, '<anki-mathjax block="true">$1</anki-mathjax>')
    .replace(/\$([^$]+)\$/g, "<anki-mathjax>$1</anki-mathjax>")
    .replace(/\*{2}([^*{2}]+)\*{2}/g, "<b>$1</b>")

await clipboard.writeText(await marked.parse(replacedText))
notify("Converted Obsidian Math to Anki")