// Name: Search board games on BoardGameGeek

import "@johnlindquist/kit"
import { parseStringPromise } from "xml2js"

const BASE_URL = "https://boardgamegeek.com"

type GameInfo = {
    href: string;
    id: string;
    name: string;
    nameid: string;
    objectid: string;
    objecttype: string;
    ordtitle: string;
    rep_imageid: number;
    sortindex: string;
    type: string;
    yearpublished: number;
};
// 


const getBoardGames = async (query: string): Promise<GameInfo[]> => {
    if (!query) return [];

    const xmlString = (await get<string>(`${BASE_URL}/xmlapi2/search?query=${encodeURIComponent(query)}&type=boardgame`)).data

    const result = await parseStringPromise(xmlString, { trim: true }).catch(async error => {
        await div(`Error parsing XML: ${error.message}`, "text-red-500")
    })

    if (!result) return [];

    const convertedGames = result['items']['item'].map(convertToGameInfo) || [];
    return convertedGames;
};

const convertToGameInfo = (item: any) => {


    try {
        return {
            id: item.$.id,
            name: item.name[0].$.value,
            yearpublished: item.yearpublished[0].$.value
        }
    } catch (error) {
        return {
            id: "",
            name: "Error parsing game",
            yearpublished: 0

        }
    }
}



const selectedGame = await arg("Search for a board game on BoardGameGeek", async (query) => {
    const games = await getBoardGames(query);
    return games.map(game => ({
        name: game.name,
        value: game
    }));
});

const getInfoOfGameWithId = async (id: string) => {
    const result = await get<string>(`${BASE_URL}/xmlapi2/thing?id=${id}&videos=0&comments=0&marketplace=0&stats=1`).catch(async error => {
        await div(`Error parsing XML: ${error.message}`, "text-red-500")
    })

    if (!result) return;

    const parsed = await parseStringPromise(result.data, { trim: true }).catch(async error => {
        await div(`Error parsing XML: ${error.message}`, "text-red-500")
    })


    const item = parsed.items.item[0]

    const gameInfo = {
        minPLayers: item.minplayers[0].$.value,
        maxPlayers: item.maxplayers[0].$.value,
        averageRating: item.statistics[0].ratings[0].average[0].$.value,
        image: item.image[0],
    }

    return gameInfo;
}

const gameInfo = await getInfoOfGameWithId(selectedGame.id)

await div(`
    <div class="flex flex-row justify-between">
        <div class="flex flex-col flex-1">
            <h1>${selectedGame.name} <span class="italic text-slate-500">(${selectedGame.yearpublished})</span></h1>
            <p class="text-slate-600 italic">${gameInfo.minPLayers} - ${gameInfo.maxPlayers} players</p> 
            <p>Average rating: <span class="font-bold">${gameInfo.averageRating}</span></p>
        </div>
        <img class="w-24" src="${gameInfo.image}" alt="${selectedGame.name}">
    </div>
`, "p-2")