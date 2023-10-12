// Name: Open project

import { join } from 'path';
import "@johnlindquist/kit"


const BASE_PATH = home(join("desktop", "Progetti"))
const projectsFolder: string[] = await readdir(BASE_PATH)

const selectedProjectPath = await arg("Select project", projectsFolder.map(
    p => {
        return {
            name: p,
            description: join(BASE_PATH, p),
            value: p
        }
    }
))

const projectPath = join(BASE_PATH, selectedProjectPath)

await exec(`code ${projectPath} -r`)