// Name: Hacker news browser

import "@johnlindquist/kit"
import { html } from "cheerio";

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
    const ids = await getTopStories()
    const stories = await Promise.all(ids.slice(0, 10).map(getStory))
    return stories
}

const stories = await getStories()

const chooseStory = await arg("Choose a story", stories.map(story => story.title))

const story = stories.find(story => story.title === chooseStory)

open(story.url)