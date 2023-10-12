// Name: Manage Prompts for ChatGPT

import "@johnlindquist/kit"

import { readFile, readdir, writeFile } from "fs/promises"
import { join } from "path"

const PROMPTS_DIRECTORY = "C:/Users/blood/Desktop/Progetti/prompts"

const isSelectingPrompt = await arg("What do you want to do?", [
    { name: "Select Prompt from list", value: true },
    { name: "Save prompt to file", value: false }
]
)

const selectPromptFromList = async () => {
    const promptsList = await readdir(PROMPTS_DIRECTORY)

    const promptFilePath = await arg("Which prompt?", [...promptsList.map((prompt) => {
        const filePath = join(PROMPTS_DIRECTORY, prompt)

        return {
            name: prompt,
            description: filePath,
            preview: async () => `<div>${await readFile(filePath)}</div>`,
            value: filePath
        }
    })])

    const prompt = await readFile(promptFilePath)

    await clipboard.writeText(prompt.toString())
    notify("Prompt copied to clipboard")

}

const savePromptToFile = async () => {
    const clipboardText = await clipboard.readText()

    const promptText = await editor(clipboardText)

    if (!promptText) {
        notify("No prompt selected")
        return
    }

    if (promptText.length > 1024 || promptText.length < 10) {
        notify("Prompt must be between 10 and 1024 characters")
        return
    }

    const promptName = await arg("Prompt name")

    const promptFilePath = join(PROMPTS_DIRECTORY, `${promptName.replace(/ /g, "-")}.txt`)

    writeFile(promptFilePath, promptText)
}


if (isSelectingPrompt) {
    await selectPromptFromList()
} else {
    await savePromptToFile()
}