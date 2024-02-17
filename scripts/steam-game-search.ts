import "@johnlindquist/kit"

// Name: Steam Game Search

import axios from 'axios'
import { load } from 'cheerio'

// Language-dependent configuration
const cc = 'US'
const l = 'english'

function buildResult(value: string, image: string, title: string) {
    return {
        name: 'abc',
        value: value,
        html: `
            <div class="flex flex-row h-full w-full">
                <img class="h-full" src="${image}"/>        
                <h2 class="flex-1 flex flex-row items-center justify-center">${title}</h2>
                <div class="flex flex-row text-xxs items-center justify-right">open</div>
            </div>
        `,
    }
}

let url = await arg('Keyword ...', async keyword => {
    if (keyword.trim() == '') return []
    let { data } = await axios.get(
        'https://store.steampowered.com/search/suggest?term=' + keyword +
        '&f=games&cc=' + cc + '&realm=1&l=s' + l + '&v=19040599&excluded_content_descriptors%5B%5D=3' +
        '&excluded_content_descriptors%5B%5D=4&use_store_query=1&use_search_spellcheck=1&search_creators_and_tags=1'
    );
    let $ = load(data);
    let games = $('a').get().map(aTag => {
        if ($(aTag).hasClass('match_app')) {
            let name = $(aTag).find('.match_name').text();
            let price = $(aTag).find('.match_subtitle').text();
            let cover = $(aTag).find('.match_img img').attr('src');
            let url = $(aTag).attr('href');
            return buildResult(url, cover, `${name} - ${price}`)
        }
        if ($(aTag).hasClass('match_tag')) {
            let name = $(aTag).find('.match_name span').text();
            let count = $(aTag).find('.match_subtitle').text();
            let url = $(aTag).attr('href');
            return buildResult(url, 'https://pbs.twimg.com/profile_images/861662902780018688/SFie8jER_x96.jpg', `${name} - ${count}`)
        }
        if ($(aTag).hasClass('match_creator')) {
            let name = $(aTag).find('.match_name').text();
            let count = $(aTag).find('.match_subtitle').text();
            let cover = $(aTag).find('.match_img img').attr('src');
            let url = $(aTag).attr('href');
            return buildResult(url, cover, `${name} - ${count}`)
        }
    });
    return games.filter(x => x);
});

// open url in browser
open(url)
