// Name: Syncronize obsidian
// Description: Syncronize obsidian vault with git

import "@johnlindquist/kit"
import { simpleGit, SimpleGit, CleanOptions } from 'simple-git';
const OBSIDIAN_VAULT_PATH = "C:/Users/blood/Desktop/Progetti/ObsidianNotes"
const git: SimpleGit = simpleGit(OBSIDIAN_VAULT_PATH).clean(CleanOptions.FORCE);

const gitpullResponse = await git.pull()
await div(md(`${gitpullResponse.summary.insertions.toString()} insertions, ${gitpullResponse.summary.deletions.toString()} deletions.`))
const gitStatus = await git.status();

if (gitStatus.files.length > 0) {
    const commitMessage = await arg("Enter commit message:");
    await git.add(".");
    await git.commit(commitMessage);
    await git.push();
    await div(md("Changes committed and pushed to remote repository."));
} else {
    await div(md("No changes to commit."));
}
