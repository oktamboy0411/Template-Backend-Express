import { OPENWEATHER_API_KEY } from './secrets'

export interface WeatherResult {
   temp: number
   icon: string
   city: string
   main: string
   description: string
}

export const fetchWeatherWithCity = async (
   cityW: string,
): Promise<WeatherResult> => {
   const defaultResult: WeatherResult = {
      temp: 0,
      icon: '',
      city: cityW,
      main: '',
      description: '',
   }

   const apiKey =
      OPENWEATHER_API_KEY || (process.env.OPENWEATHER_API_KEY as string) || ''
   if (!apiKey) {
      // API key not configured — don't attempt the request
      console.warn(
         'OPENWEATHER_API_KEY is not set; returning default weather for',
         cityW,
      )
      return defaultResult
   }

   try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
         cityW,
      )}&appid=${encodeURIComponent(apiKey)}&units=metric`

      const response = await fetch(url)

      if (!response.ok) {
         // log status and return default
         const text = await response.text().catch(() => '')
         console.error(
            'OpenWeather API error:',
            response.status,
            response.statusText,
            text,
         )
         return defaultResult
      }

      const data = await response.json()

      if (!data?.main || !Array.isArray(data.weather) || !data.weather[0]) {
         return defaultResult
      }

      const tempRaw = Number(data.main.temp)
      const temp = Number.isFinite(tempRaw) ? Math.round(tempRaw) : 0
      const iconCode = (data.weather[0].icon as string) || ''
      const icon = iconCode
         ? `https://openweathermap.org/img/wn/${iconCode}.png`
         : ''
      const city = (data.name as string) || cityW
      const main = (data.weather[0].main as string) || ''
      const description = (data.weather[0].description as string) || ''

      return { temp, icon, city, main, description }
   } catch (error) {
      console.error('Error fetching weather data:', error)
      return defaultResult
   }
}
