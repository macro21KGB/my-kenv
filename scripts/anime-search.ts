import "@johnlindquist/kit"

// Menu: Search Anime
// Description: Anime search with jikan.moe API
// Keyword: anime
// Author: Mario De Luca

let anime = await arg("Anime:")



interface MalApiResponse {
  data: Anime[];
}

interface Anime {
  mal_id: number;
  url: string;
  titles: Title[];
  images: {
    jpg: {
      image_url: string;
    }
  };
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  synopsis: string;
  background?: string;
  season?: string;
  year?: number;
  genres: Producer[];
  explicit_genres: any[];
  themes: Producer[];
  demographics: any[];
}

interface Producer {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}


interface Title {
  type: string;
  title: string;
}

const { data } = await get<MalApiResponse>(
  `https://api.jikan.moe/v4/anime?q=${anime}`
)

const selectedAnime = await arg("Select anime:", data.data.map((anime) => {
  return {
    name: `${anime.titles[0].title} / ${anime.titles[1].title}`,
    value: anime
  }
}))

const html = `
<div id="info" class="flex flex-col justify-between">
  <div>
    <h2 class="mb-0">${selectedAnime.titles[0].title} (${selectedAnime.year ?? ""})</h2>
    <small class="mt-0">${selectedAnime.titles[1].title}</small>
    <p class="text-blue font-bold">Score: ${selectedAnime.score} / 10</p>
    <p class="text-blue font-bold">Type: ${selectedAnime.type}</p>
  </div> 
  
  <div id="tags">
    ${selectedAnime.genres.map((genre) => {
  return `<span class="text-xs bg-blue-100 text-blue-600 rounded p-1">${genre.name}</span>`
})}
  <br />
  <br />
    <a href="${selectedAnime.url}" target="_blank" class="bg-blue-500 text-white no-underline rounded p-1">MyAnimeList</a>
  </div>
</div>
<img src=${selectedAnime.images.jpg.image_url} class="h-full rounded-lg shadow-lg">
`;

await div(html, "p-2 flex flex-row gap-2 justify-between")
