// Name: Juck Norris joke
// Description: Tells a random Chuck Norris joke

import "@johnlindquist/kit"

// Fetch a random Chuck Norris joke from the API
const joke = (await get<{ value: string }>("https://api.chucknorris.io/jokes/random")).data.value

// Display the joke in a div 
await div(md(`# ${joke}`))

