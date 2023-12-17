// Name: Plus Game Explorer
// Cache: true

import "@johnlindquist/kit"
import { readFile } from "fs/promises"

interface Game {
    name: string
    url: string
    old?: boolean
}

const selectedGame: Game = await arg("Select a game", async () => {
    const data = JSON.parse(await readFile("C:\\Users\\blood\\.kenv\\kenvs\\my-kenv\\json\\tuttiGiochiPlus.json", "utf8")) as { games: Game[], length: number }

    return data.games.map((game: Game) => ({
        name: game.name,
        value: game
    }))
})

const game = selectedGame

open(game.url)