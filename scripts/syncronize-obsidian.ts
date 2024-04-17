// Name: Syncronize obsidian
// Description: Syncronize obsidian vault with git

import "@johnlindquist/kit"
import { simpleGit, SimpleGit } from 'simple-git';
const OBSIDIAN_VAULT_PATH = "C:/Users/blood/Desktop/Progetti/ObsidianNotes"
const git: SimpleGit = simpleGit(OBSIDIAN_VAULT_PATH);

const listChangedFiles = (fileName: string) => {
    return `<p>${fileName} changes</p>`;

}

div("Syncronizing Obsidian vault with git...", "p-2 text-center")
const gitpullResponse = await git.pull()
await div(md(`${gitpullResponse.summary.insertions.toString()} insertions, ${gitpullResponse.summary.deletions.toString()} deletions.

${gitpullResponse.files.map(listChangedFiles)}
`))

const gitStatus = await git.status();
if (gitStatus.files.length > 0) {

    await div(`
    <p>Changes to commit:</p>
    <ul class="p-2">
        ${gitStatus.files.map(file => `<li>${file.path}</li>`).join("")}
    </ul>
    `)
    const commitMessage = await arg("Enter commit message:");
    await git.add(".");
    await git.commit(commitMessage);
    await git.push();
    await div(md("Changes committed and pushed to remote repository."));
} else {
    await div(md("No changes to commit."));
}
