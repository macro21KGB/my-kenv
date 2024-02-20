// Name: Search board games on BoardGameGeek

import "@johnlindquist/kit"
import { parseStringPromise } from "xml2js"

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


const getBoardGames = async (query: string): Promise<GameInfo[]> => {
    if (!query) return [];

    const xmlString = (await get<string>(`https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(query)}&type=boardgame`)).data

    const result = await parseStringPromise(xmlString, { trim: true }).catch(async error => {
        await div(`Error parsing XML: ${error.message}`, "text-red-500")
    })

    const convertedGames = result['items']['item'].map(convertToGameInfo)

    return convertedGames;
};

const convertToGameInfo = (item: any) => {
    return {
        id: item.$.id,
        name: item.name[0].$.value,
        yearpublished: item.yearpublished[0].$.value
    }

}



const selectedGame = await arg("Search for a board game on BoardGameGeek", async (query) => {
    const games = await getBoardGames(query) || [];
    return games.map(game => ({
        name: game.name,
        value: game
    }));
});

await div(`
    <div>
        <h1>${selectedGame.name} <span class="italic text-slate-500">(${selectedGame.yearpublished})</span></h1>
    </div>
`, "p-2")