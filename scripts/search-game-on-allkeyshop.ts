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

const convertToGame = (htmlString: string) => {
    const $ = cheerio.load(htmlString);
    return $(".search-results-row").get().map((row) => {

        const name = $(row).find(".search-results-row-game-title").text().trim()
        const price = $(row).find(".search-results-row-price").text().trim()
        const link = $(row).find(".search-results-row-link").attr("href")

        return { name, price, link }
    })
}

const gameUrl = await arg("What game do you want to search?", async (input) => {

    if (input.trim() === "")
        return []

    const htmlString = await search(input);

    const listOfGames: Game[] = convertToGame(htmlString)
    if (listOfGames.length === 0) {
        return [{ name: "No games found", value: "" }]
    }

    return listOfGames.map(game => {
        return {
            name: game.name,
            value: game.link,
            description: game.price,
        }
    })

})

await browse(gameUrl)