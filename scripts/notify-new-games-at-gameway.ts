// Name: Notify new Games at Gameway
// Schedule: 30 11 * * *

import "@johnlindquist/kit"
import { JSONFilePreset } from 'lowdb/node'
import * as cheerio from 'cheerio';
import { join } from "path";

interface GameList {
    games: string[],
    hashCode: number,
    date: string
}

const DB_NAME = 'gameway-games.json'

const db = await JSONFilePreset<GameList[]>(join(home(), DB_NAME), [])

const generateUniqueHashCode = (array: string[]) => {
    // Concatenate all the "name" properties into a single string
    let combinedString = array.join('');

    // Apply the DJB2 hash function to the combined string
    let hash = 5381;
    for (let i = 0; i < combinedString.length; i++) {
        hash = ((hash << 5) + hash) + combinedString.charCodeAt(i); // hash * 33 + c
    }

    // Convert the hash to a positive 32-bit integer
    return hash >>> 0;
}

const BASE_URL = "https://www.gameway.it/p/uscite"

const gamewayHtml = (await get("https://www.gameway.it/p/uscite")).data;

const $ = cheerio.load(gamewayHtml)


const games = $("tr > td > div:nth-child(2) > b:nth-child(1) > a").map((i, elem) => $(elem).text().trim()).get()

const hashCode = generateUniqueHashCode(games)

// check if the hash code is different from the last one
const storedGames = db.data

const isAlreadyListed = storedGames.some((game) => game.hashCode === hashCode)

if (!isAlreadyListed) {
    db.data.push({
        games,
        hashCode,
        date: Intl.DateTimeFormat('it-IT').format(new Date())
    })

    db.write()

    const message = `🎮 New Games at Gameway 🎮${games.join('\n')}`
    notify({
        //@ts-expect-error
        title: message, actions: ["Open", "Dismiss"], message: games.join('\n')
    },
        (err: Error | null, response: string) => {
            if (!err && response === "open") {
                open(BASE_URL)
            }
        }
    )
}