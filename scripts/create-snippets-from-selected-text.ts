// Name: Create snippets from selected text
// Shortcut: alt shift s
// Cache: true

import "@johnlindquist/kit"

interface MagikaResponse {
    path: string;
    dl: Dl;
    output: Dl;
}

interface Dl {
    ct_label: ProgrammingLanguage;
    score: number;
    group: string;
    mime_type: string;
    magic: string;
    description: string;
}

const PROGRAMMING_LANGUAGES = {
    "javascript": "ts",
    "typescript": "ts",
    "python": "py",
    "html": "html",
    "css": "css",
    "markdown": "md",
    "json": "json",
    "yaml": "yaml",
    "xml": "xml",
    "plaintext": "txt",
    "rust": "rs",
    "go": "go",
    "java": "java",
    "c": "c",
    "cpp": "cpp",
    "csharp": "cs",
    "shell": "sh",
    "bash": "sh",
    "powershell": "ps1",
    "ruby": "rb",
    "perl": "pl",
    "text": "txt",
} as const;


const detectLanguage = async (text: string, snippetFilePath: string): Promise<ProgrammingLanguage> => {

    await writeFile(snippetFilePath, text);
    const { stdout } = await exec(`magika --json ${snippetFilePath}`);

    const { output } = (JSON.parse(stdout))[0] as MagikaResponse;
    await remove(snippetFilePath)

    return output.ct_label as ProgrammingLanguage;
}

// Get the selected text 
let selectedText = await getSelectedText()

type ProgrammingLanguage = keyof typeof PROGRAMMING_LANGUAGES;

// Prompt for the snippet name
let snippetName = await arg("Enter snippet name:")

let snippetFilePath = kenvPath("snippets", `new_snippet.text`)
let detectedLanguage = await detectLanguage(selectedText, snippetFilePath);


const nameWithLanguage = `${snippetName}(${detectedLanguage})`
const newLocation = kenvPath("snippets", `${nameWithLanguage}.txt`)
await writeFile(newLocation, `\/\/Name: ${nameWithLanguage} \n\n` + selectedText)