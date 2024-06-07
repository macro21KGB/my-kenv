// Name: Convert Obsidian Syntax to Anki Syntax
// Author: Mario De Luca
// Description: Converts Obsidian Markdown to Anki HTML

import "@johnlindquist/kit"
import { marked } from "marked"

const copiedText = await clipboard.readText()

const replacedText = copiedText
    .replace(/\$\$([^$]+)\$\$/g, '<anki-mathjax block="true">$1</anki-mathjax>')
    .replace(/\$([^$]+)\$/g, "<anki-mathjax>$1</anki-mathjax>")
    .replace(/\*{2}([^*{2}]+)\*{2}/g, "<b>$1</b>")
    .replaceAll(/(?:\\left)|(?:\\right)/gi, "\\")

const parsedMarkdown = await marked.parse(replacedText);

const editedHtml = parsedMarkdown
    .replaceAll(/blockquote/g,
        'blockquote style="border-left: 2px solid #ccc; padding: 0.5rem;"')

await clipboard.writeText(editedHtml)
notify("Converted Obsidian Syntax to Anki")
