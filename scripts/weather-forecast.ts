// Name: Weather Forecast

import "@johnlindquist/kit"
import { write } from "promise-fs"

type Country = {
    latitude: number
    longitude: number
    name: string
    timezone: string
    admin1: string
}

type CoordsRequest = {
    results: Country[]
}

type Weather = {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    current_units: Currentunits;
    current: Current;
    daily_units: Dailyunits;
    daily: Daily;
}

interface Daily {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_max: number[];
    apparent_temperature_min: number[];
    rain_sum: number[];
}

interface Dailyunits {
    time: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    apparent_temperature_max: string;
    apparent_temperature_min: string;
}

interface Current {
    time: string;
    interval: number;
    temperature_2m: number;
    apparent_temperature: number;
    precipitation: number;
    rain: number;
}

interface Currentunits {
    time: string;
    interval: string;
    temperature_2m: string;
    apparent_temperature: string;
    precipitation: string;
    rain: string;
}

const saveCountrySettingToDisk = async (country: Country) => {
    const settings = {
        country
    }
    try {
        await writeFile(path.join(home(), "country_settings.json"), JSON.stringify(settings))
    }
    catch (e) {
        await div(`Error saving settings: ${e}`, "bg-red-500")
    }
}

const readCountrySettingFromDisk = async () => {
    try {
        return await readFile(path.join(home(), "country_settings.json"), "utf-8")
    } catch (e) {
        return null
    }
}

const formatDateBasedOnTimezone = (date: string, timezone: string) => {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    return new Date(date).toLocaleString(locale, { timeZone: timezone, day: "numeric", month: "2-digit", year: "2-digit" })

}

const settingsSaved = await readCountrySettingFromDisk()
const countryInfo = settingsSaved === null ?
    await arg("Enter country", async (input) => {
        if (!input) return []

        const result = await get<CoordsRequest>(`https://geocoding-api.open-meteo.com/v1/search?name=${input}`)
        const countries = result.data?.results || []

        return countries.map(({ name, latitude, longitude, admin1, timezone }) => ({
            name: `${name}, ${admin1}`,
            value: { latitude, longitude, timezone, name }
        }))
    })
    :
    JSON.parse(settingsSaved).country

if (settingsSaved === null) {
    await saveCountrySettingToDisk(countryInfo)
}

const { latitude, longitude, name, timezone } = countryInfo
const weather = (await get<Weather>(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,precipitation,rain&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,rain_sum&timezone=auto`)).data
await div(`
  <div class="container mx-auto py-8">
    <h1 class="text-3xl font-semibold text-center mb-6">Daily Forecast (${name})</h1>
    <div class="grid grid-cols-2 gap-8">
      <!-- Forecast Card -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-semibold mb-2">Current</h1>
        <p class="text-gray-700">Temperature: <strong>${weather.current.temperature_2m}°C</strong> (${weather.current.apparent_temperature}°C)</p>
        <p class="text-slate-500 italic">${weather.current.rain == 0 ? "No rain" : "Rain: " + weather.current.rain}</p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6 flex flex-row flex-wrap">
        ${weather.daily.time.map((day, index) => {
    return `
        <div class="bg-gray-300 rounded p-2 h-dvh">
            <h2>${formatDateBasedOnTimezone(day, timezone).replace(/,.*/g, "")}</h2>
            <p>Max: ${weather.daily.temperature_2m_max[index]}°C (${weather.daily.apparent_temperature_max[index]}°C)</p>
            <p>Min: ${weather.daily.temperature_2m_min[index]}°C (${weather.daily.apparent_temperature_min[index]}°C)</p>
            <p class="text-slate-500 italic">${weather.daily.rain_sum[index] == 0 ? "No rain" : "Rain: " + weather.daily.rain_sum[index] + "mm"}</p>
        
        </div>
    `
}).join("")}
      </div>
    </div>
  </div>
`, "bg-gray-100")