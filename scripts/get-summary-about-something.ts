// Name: Get summary about something from wikipedia
// Description: Search something on wikipedia and get a summary about it
// Shortcode: wi

import "@johnlindquist/kit"

const wiki = await import('wikipedia');


try {
    const searchValue = await arg('What do you want to search for? (wikipedia)')
    const summary = await wiki.summary(searchValue);

    if (summary.extract == null || summary.extract.length < 50) {
        await div(md(`No summary found for ${searchValue}`));
    }
    else {
        await div({
            html: md(summary.extract),
            placeholder: md(`Summary for ${searchValue}`)
        });
    }

} catch (error) {
    console.log(error);
    div(md(error.message))
}

