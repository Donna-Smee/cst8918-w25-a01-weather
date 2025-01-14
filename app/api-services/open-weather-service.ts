const API_KEY = process.env.WEATHER_API_KEY
const TEN_MINUTES = 1000 * 60 * 10 // in milliseconds

const resultsCache: Record<string, {lastFetch: number; data: unknown}> = {}
function getCacheEntry(key: string) {
  return resultsCache[key]
}
function setCacheEntry(key: string, data: unknown) {
  resultsCache[key] = {lastFetch: Date.now(), data}
}
function isDataStale(lastFetch: number) {
  return Date.now() - lastFetch > TEN_MINUTES
}

interface FetchWeatherDataParams {
  lat: number
  lon: number
  units: string
}
/*export async function fetchWeatherData({
  lat,
  lon,
  units
}: FetchWeatherDataParams) {

   // Debugging: print the API_KEY to the console
   console.log("API Key inside fetchWeatherData:", API_KEY);

  const baseURL = 'https://api.openweathermap.org/data/2.5/weather'
  const queryString = `lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
  const cacheEntry = getCacheEntry(queryString)
  if (cacheEntry && !isDataStale(cacheEntry.lastFetch)) {
    return cacheEntry.data
  }
  const response = await fetch(`${baseURL}?${queryString}`)
  const data = await response.json()
  setCacheEntry(queryString, data)

  // Debugging: print the API_KEY to the console
  console.log("API data inside fetchWeatherData:", data);
  return data
}
*/


// FROM ChatGPT
export async function fetchWeatherData({
  lat,
  lon,
  units
}: FetchWeatherDataParams) {

  const baseURL = 'https://api.openweathermap.org/data/2.5/weather'
  const queryString = `lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
  const cacheEntry = getCacheEntry(queryString)
  if (cacheEntry && !isDataStale(cacheEntry.lastFetch)) {
    return cacheEntry.data
  }

  const response = await fetch(`${baseURL}?${queryString}`)
  const data: WeatherResponse = await response.json()

  

  // Transform the data to match your application's needs (with a 'current' property)
  const transformedData = {
    current: {
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      temp_min: data.main.temp_min,
      temp_max: data.main.temp_max,
      weather: data.weather,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      wind_direction: data.wind.deg,
      clouds: data.clouds.all,
      visibility: data.visibility,
      dt: data.dt,
      timezone_offset: data.timezone,
      name: data.name,
      country: data.sys.country
    }
  }

  // Cache the transformed data, not the raw data
  setCacheEntry(queryString, transformedData)

  // Debugging: print the transformed data
  console.log("Transformed Weather Data:", transformedData);

  return transformedData
}


export async function getGeoCoordsForPostalCode(
  postalCode: string,
  countryCode: string
) {
  const url = `http://api.openweathermap.org/geo/1.0/zip?zip=${postalCode},${countryCode}&appid=${API_KEY}`
  const response = await fetch(url)
  const data = response.json()
  return data
}
