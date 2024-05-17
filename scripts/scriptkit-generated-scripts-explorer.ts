// Name: Scriptkit generated scripts explorer
// Description: Explore and copy scripts generated by AI for scriptkit
// Author: Mario De Luca
// Cache: true
import "@johnlindquist/kit"

const getScripts = async (text: string): Promise<{ title: string, code: string }[]> => {
    const result = [];

    const sections = text.split("## ").filter(section => section.trim());

    sections.forEach(section => {
        const lines = section.split("\n");
        const title = lines.shift()?.trim();
        let codeBlock = '';

        let inCodeBlock = false;

        lines.forEach(line => {
            if (line.trim().startsWith("```typescript")) {
                inCodeBlock = true;
                codeBlock += line + '\n';
            } else if (line.trim() === "```") {
                inCodeBlock = false;
                codeBlock += line + '\n';
            } else if (inCodeBlock) {
                codeBlock += line.replaceAll("\`", "`") + '\n';
            }
        });

        if (title && codeBlock) {
            if (codeBlock.length > 20)
                result.push({ title, code: codeBlock });
        }
    });


    return result;
}

const removeCodeBlock = (text: string): string => {
    return text.replace(/```typescript/g, '').replace(/```/g, '');
}

const rawGist = await get("https://gist.githubusercontent.com/johnlindquist/e9b9a800ec54b1f2ebc3911d86225ea7/raw/b7e0d43c352b8b23001a8e6819cc18d41b72932a/Script%2520Kit%2520Generated%2520Examples.md")
const scripts = await getScripts(rawGist.data)

const script = await arg("Select a script", scripts.map(script => {
    return {
        name: script.title,
        value: script.code,
        preview: () => {
            return md(script.code)
        }
    }
}))

await clipboard.writeText(removeCodeBlock(script))