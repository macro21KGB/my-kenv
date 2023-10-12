// Name: Search game on AllKeyShop
// Shortcode: gs
// Group: Games

import "@johnlindquist/kit"
import * as cheerio from 'cheerio';

interface Game {
    name: string;
    price: string;
    link: string;
}

const API_URL = 'https://www.allkeyshop.com/blog/catalogue/search-'

const search = async (game: string) => {
    const url = `${API_URL}${game.replace(/ /g, "+")}/`

    const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow'
    })
    const data = await response.text()
    return data
}

const gameName = await arg("What game do you want to search?")
const htmlString = await search(gameName);
const $ = cheerio.load(htmlString);


const listOfGames: Game[] = $(".search-results-row").get().map((row) => {

    const name = $(row).find(".search-results-row-game-title").text().trim()
    const price = $(row).find(".search-results-row-price").text().trim()
    const link = $(row).find(".search-results-row-link").attr("href")

    return { name, price, link }
})


if (listOfGames.length === 0) {
    div(md(`No games found for the search term: **${gameName}**`))
}

const selectedGameUrl = await arg("Search results", listOfGames.map(game => {
    return {
        name: game.name,
        description: game.price,
        value: game.link
    }
}))

await browse(selectedGameUrl)