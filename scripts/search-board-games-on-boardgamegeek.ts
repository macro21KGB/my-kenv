// Name: Search board games on BoardGameGeek

import "@johnlindquist/kit"
import * as cheerio from 'cheerio';

const getBoardGames = async (query: string): Promise<GameInfo[]> => {
    return (await get(`https://boardgamegeek.com/geeksearch.php?action=search&q=${encodeURIComponent(query)}&objecttype=boardgame`)).data.items as GameInfo[];
};

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


const selectedGame = await arg("Search for a board game on BoardGameGeek", async (query) => {
    const games = await getBoardGames(query) || [];
    return games.map(game => ({
        name: game.name,
        value: game
    }));
});

await div(`
    
    <h1>${selectedGame.name} <span class="italic text-slate-500">(${selectedGame.yearpublished})</span></h1>
    <a href="${selectedGame.href}">Click here for BoardGameGeek</a>

`, "p-2")