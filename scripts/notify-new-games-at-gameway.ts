// Name: Notify new Games at Gameway
// Schedule: 0 14 * * *

import "@johnlindquist/kit"
import { JSONFilePreset } from 'lowdb/node'
import * as cheerio from 'cheerio';
import { join } from "path";

interface GameList {
    games: string[],
    hashCode: number
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

const gamewayHtml = (await get("https://www.gameway.it/p/arrivi")).data;

const $ = cheerio.load(gamewayHtml)


const games = $("tr > td > div:nth-child(2) > b:nth-child(1) > a").map((i, elem) => $(elem).text().trim()).get()

const hashCode = generateUniqueHashCode(games)

// check if the hash code is different from the last one
const storedGames = db.data

const isAlreadyAdded = storedGames.some(({ hashCode }) => hashCode === hashCode)

if (!isAlreadyAdded) {

    db.data.push({ games, hashCode })
    db.write()

    const message = `🎮 New Games at Gameway 🎮\n\n${games.join('\n')}`
    notify(message)
}