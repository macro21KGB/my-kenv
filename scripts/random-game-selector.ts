// Name: Random game selector
// Group: Games

import "@johnlindquist/kit"

const gamesDb = await db<Game[]>("games")

interface Game {
    extensions: Extension[];
    hasExtensions: boolean;
    imageUrl?: any;
    isExtension: boolean;
    key: string;
    name: string;
    playTime: ValueRange;
    players: ValueRange;
    score: number;
    slug: string;
}

interface ValueRange {
    max: number;
    min: number;
}

interface Extension {
    key: string;
    name: string;
}


const games: Game[] = await gamesDb.data;
const howManyGameString = await arg("Quanti giochi vuoi portare?")
const howManyGames = parseInt(howManyGameString)

const howManyPlayersString = await arg("Quanti giocatori siete?")
const howManyPlayers = parseInt(howManyPlayersString)
const gamesFiltered: Game[] = games.filter(game => game.players.min <= howManyPlayers && game.players.max >= howManyPlayers && !game.isExtension)

const gamesRandom: Game[] = gamesFiltered.sort(() => Math.random() - Math.random()).slice(0, howManyGames)

const gamesRandomString = gamesRandom.map(game => game.name).join("\n\n")

await div(await highlight(`# Ecco i giochi che dovresti portare:
${gamesRandomString}`))
