/* eslint-disable no-console */
import type { IWeatherResult } from '@/types'

import { OPENWEATHER_API_KEY } from './secrets'

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
const OPENWEATHER_ICON_URL = 'https://openweathermap.org/img/wn'
const WEATHER_UNITS = 'metric'

const createDefaultWeatherResult = (city: string): IWeatherResult => ({
   temp: 0,
   icon: '',
   city,
   main: '',
   description: '',
})

export const fetchWeatherWithCity = async (
   city: string,
): Promise<IWeatherResult> => {
   const defaultResult = createDefaultWeatherResult(city)

   if (OPENWEATHER_API_KEY === '') {
      console.warn(
         `OPENWEATHER_API_KEY is not set; returning default weather for ${city}`,
      )
      return defaultResult
   }

   try {
      const url = `${OPENWEATHER_BASE_URL}?q=${encodeURIComponent(city)}&appid=${encodeURIComponent(OPENWEATHER_API_KEY)}&units=${WEATHER_UNITS}`

      const response = await fetch(url)

      if (!response.ok) {
         const text = await response.text().catch(() => '')
         console.error(
            `OpenWeather API error: ${response.status} ${response.statusText}`,
            text,
         )
         return defaultResult
      }

      const data = await response.json()

      if (
         data?.main === undefined ||
         !Array.isArray(data.weather) ||
         data.weather[0] === undefined
      ) {
         return defaultResult
      }

      const tempRaw = Number(data.main.temp)
      const temp = Number.isFinite(tempRaw) ? Math.round(tempRaw) : 0
      const iconCode = data.weather[0].icon as string
      const icon =
         iconCode !== '' ? `${OPENWEATHER_ICON_URL}/${iconCode}.png` : ''
      const cityName = data.name as string
      const main = data.weather[0].main as string
      const description = data.weather[0].description as string

      return {
         temp,
         icon,
         city: cityName !== '' ? cityName : city,
         main: main !== '' ? main : '',
         description: description !== '' ? description : '',
      }
   } catch (error) {
      const message =
         error instanceof Error ? error.message : 'Unknown error occurred'
      console.error(`Error fetching weather data: ${message}`)
      return defaultResult
   }
}
