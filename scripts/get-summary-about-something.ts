// Name: Get summary about something from wikipedia
// Description: Search something on wikipedia and get a summary about it
// Keycode: wi

import "@johnlindquist/kit"

import wiki from 'wikipedia';



await arg('What do you want to search for? (wikipedia)', async (input) => {
    if (input.length < 3) {
        return "<p class='p-2 text-slate-500'>Search value must be at least 3 characters</p>";
    }
    try {
        const pageSummary = await wiki.summary(input);
        if (pageSummary.extract == null || pageSummary.extract == "") {
            return (md(`No summary found for ${input}`));
        }
        else {
            return (md(pageSummary.extract));
        }

    } catch {
        return (md(`No summary found for ${input}`));
    }
})


