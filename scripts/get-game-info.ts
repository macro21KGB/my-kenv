// Name: Get game info

import "@johnlindquist/kit"
import axios from "axios"


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

// get auth token from twitch API
const getAuthToken = async (): Promise<TokenInfo> => {
    div("Getting auth token...", "p-2 text-center")
    const queryParams = `?client_id=rpsnd6yd3fvxlmmza66tbt9o22wdz1&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`
    const tokenInfo = await axios.post<TokenInfo>("https://id.twitch.tv/oauth2/token" + queryParams);
    return tokenInfo.data
}


// generate query for IGDB API
const generateQuery = (gameName: string) => {
    return `search "${gameName}";
    fields name, aggregated_rating, aggregated_rating_count, first_release_date, rating, summary, cover;
    where category = 0;`
}

// get matched games from IGDB API
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

const selectedGameName = await arg("Select a game: ", matchedGames.data.map(game => game.name))

const selectedGame = matchedGames.data.find(game => game.name === selectedGameName)


await div(
    `
    <div style="padding:1rem;">
        <h2>${selectedGame.name}</h2>
        <small style="font-style:italic;">${selectedGame.summary}</small>

            <p>${selectedGame.rating ? `Rating: ${selectedGame.rating.toFixed(2)}` : ""}</p>
            
            <p>${selectedGame.aggregated_rating ? `Aggregated rating: ${selectedGame.aggregated_rating.toFixed(2)}` : ""}</p>
        <a style="color=blue;" href="https://www.igdb.com/games/${selectedGame.id}">
            Go to IGDB page    
        </a>
    </div>
    `
)