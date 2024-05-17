// Name: Juck Norris joke
// Description: Tells a random Chuck Norris joke

import "@johnlindquist/kit"

// Fetch a random Chuck Norris joke from the API
const joke = await get("https://api.chucknorris.io/jokes/random").then(
    response => response.data.value // Extract the joke from the response 
)

// Display the joke in a div 
await div(md(`# ${joke}`))

