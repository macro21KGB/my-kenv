// Name: JSON to TS-Interfaces
// Description: Quickly get an Interface from JSON
// Author: Ambushfall
// Snippet:
// Inspired by:


import '@johnlindquist/kit';
import { EditorConfig } from '@johnlindquist/kit/types/kitapp';

import JsonToTS from 'json-to-ts';

const TSWrapper = (string: string) => `
\`\`\`ts
${string}
\`\`\`
`

const JSONWrapper = (string: string) => `
\`\`\`json
${string}
\`\`\`
`

const editorConfig: EditorConfig = {
  hint: "Write then submit to obtain results",
  description: 'JSON Values to Interface',
  onInputSubmit: async (input: string) => submit(input)
}

// Initialize editor and Parse JSON
const json = await editor(editorConfig)
const obj = JSON.parse(json);
const types = `${JsonToTS(obj).join('\n\n')}\n`;

// Place text into ClipBoard and show results
clipboard.writeText(types);
await div(await highlight(`# Success! Result Copied to Clipboard!
## Input:${JSONWrapper(json)} 
## Output:${TSWrapper(types)}`));
