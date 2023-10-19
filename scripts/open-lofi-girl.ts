// Preview: docs
// Name: Open lofi-girl
// Shortcode: li
// Cache: true

import "@johnlindquist/kit"

const LofiGirlStreams = {
    "Lofi-Boy": "https://www.youtube.com/embed/4xDzrJKXOOY",
    "Lofi-Girl": "https://www.youtube.com/embed/jfKfPfyJRdk"
} as const;

const VIDEO_OPTIONS = {
    controls: 1,
    autoplay: 1,
    fs: 0,
} as const;

type LofigirlStream = typeof LofiGirlStreams[keyof typeof LofiGirlStreams] & string

const combinedOptions = Object.entries(VIDEO_OPTIONS).map(([key, value]) => `${key}=${value}`).join("&")
const selectedStream: LofigirlStream = await arg("Select a stream", Object.keys(LofiGirlStreams))

const widgetAPI = await widget(`
<div>
    <iframe id="frame" width="300" height="215" src="${LofiGirlStreams[selectedStream]}?${combinedOptions}" 
        title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; 
        clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        >
    </iframe>
    <div class="flex flex-row justify-start items-center">
        <button id="close" class="hover:text-white text-red-400 rounded px-1 py-0.5 border border-red-500">Close</button>
    </div>
</div>
`, {
    width: 300,
    height: 240,
}
)


widgetAPI.onClick((event) => {
    if (event.targetId === "close") widgetAPI.close()
});