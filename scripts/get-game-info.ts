// Name: Get game info

import "@johnlindquist/kit"
import axios from "axios"

const tokenDb = await db<{ token: TokenInfo | null }>({ token: null })

type GameInfo = {
    id: number;
    aggregated_rating?: number;
    aggregated_rating_count?: number;
    cover: number;
    first_release_date: number;
    name: string;
    rating?: number;
    summary: string;
}

type TokenInfo = {
    "access_token": string,
    "expires_in": number,
    "token_type": string
}

const JSONWrapper = (string: string) => `
\`\`\`json
${string}
\`\`\`
`

const getAuthToken = async (): Promise<TokenInfo> => {

    const queryParams = `?client_id=rpsnd6yd3fvxlmmza66tbt9o22wdz1&client_secret=5ldl937t1sjt2e9osua53pfyye9bin&grant_type=client_credentials`
    const tokenInfo = await axios.post<TokenInfo>("https://id.twitch.tv/oauth2/token" + queryParams);
    return tokenInfo.data
}


const generateQuery = (gameName: string) => {
    return `search "${gameName}";
    fields name, aggregated_rating, aggregated_rating_count, first_release_date, rating, summary, cover;
    where category = 0;`
}

const getMatchedGames = async (gameName: string, token: string) => {
    return await axios.post<GameInfo[]>("https://api.igdb.com/v4/games", generateQuery(gameName), {
        headers: {
            "Client-ID": "rpsnd6yd3fvxlmmza66tbt9o22wdz1",
            "Content-Type": "text/plain",
            "Authorization": `Bearer ${token}`
        },
    })
}


const gameName = await arg("Enter game name: ")
const tokenInfo = await getAuthToken()

const matchedGames = await getMatchedGames(gameName, tokenInfo.access_token)
dev(matchedGames.data)

const selectedGameName = await arg("Select a game: ", matchedGames.data.map(game => game.name))

const selectedGame = matchedGames.data.find(game => game.name === selectedGameName)

div(md(JSONWrapper(JSON.stringify(selectedGame, null, 2))))

