// Name: Quick search npmjs
// Description: Search npmjs.com for a package

import "@johnlindquist/kit"

const search = await arg("Search npmjs.com for a package")
open(`https://www.npmjs.com/search?q=${encodeURIComponent(search)}`)