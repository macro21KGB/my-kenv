// Name: Hacker news browser

import "@johnlindquist/kit"

interface Story {
    by: string;
    descendants: number;
    id: number;
    kids: number[];
    score: number;
    time: number;
    title: string;
    type: string;
    url: string;
}

const BASE_URL = "https://hacker-news.firebaseio.com/v0/"

const getTopStories = async (): Promise<number[]> => {
    const response = await fetch(`${BASE_URL}topstories.json`)
    return await response.json()
}

const getStory = async (id: number): Promise<Story> => {
    const response = await fetch(`${BASE_URL}item/${id}.json`)
    return await response.json()
}

const getStories = async (): Promise<Story[]> => {
    div("Loading stories...", "p-2 text-center")
    const ids = await getTopStories()
    const stories = await Promise.all(ids.map(getStory))
    return stories
}

// sort by time and get the top 100 stories
const stories = (await getStories()).sort((a, b) => b.time - a.time).slice(0, 100)

const convertUnixToDate = (unix: number) => {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    return Intl.DateTimeFormat(locale, { dateStyle: "short", timeStyle: "short" }).format(new Date(unix * 1000))

}

const chosenStory = await arg(`Choose a story (${stories.length} stories)`, () => {
    return stories.map(story => {
        return {
            name: story.title,
            description: `by ${story.by} - ${story.url} (${convertUnixToDate(story.time)})`,
            value: story
        }
    })

})

open(chosenStory.url)