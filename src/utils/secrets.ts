import dotenv from 'dotenv'
import * as fs from 'node:fs'

if (fs.existsSync('.env')) {
   dotenv.config({ path: '.env' })
} else {
   throw new Error(
      '.env file not found! Please create a .env file in the root directory.',
   )
}

const getEnvVariable = (key: string, defaultValue?: string): string => {
   const value = process.env[key]
   if (value === undefined || value === '') {
      if (defaultValue !== undefined) {
         return defaultValue
      }
      throw new Error(`Environment variable ${key} is not defined`)
   }
   return value
}

const getEnvNumber = (key: string, defaultValue: number): number => {
   const value = process.env[key]
   if (value === undefined || value === '') {
      return defaultValue
   }
   const parsed = parseInt(value, 10)
   if (Number.isNaN(parsed)) {
      throw new Error(`Environment variable ${key} must be a valid number`)
   }
   return parsed
}

const DEFAULT_PORT = 8080

const MONGO_URI = getEnvVariable('MONGO_URI')
const IP = getEnvVariable('IP', '')
const PORT = getEnvNumber('PORT', DEFAULT_PORT)
const REG_KEY = getEnvVariable('REG_KEY')
const JWT_SECRET = getEnvVariable('JWT_SECRET')
const JWT_SECRET_REFRESH = getEnvVariable('JWT_SECRET_REFRESH')
const AWS_S3_BUCKET_NAME = getEnvVariable('AWS_S3_BUCKET_NAME')
const AWS_S3_BUCKET_FOLDER = getEnvVariable('AWS_S3_BUCKET_FOLDER')
const AWS_S3_REGION = getEnvVariable('AWS_S3_REGION')
const AWS_S3_ACCESS_KEY_ID = getEnvVariable('AWS_S3_ACCESS_KEY_ID')
const AWS_S3_SECRET_ACCESS_KEY = getEnvVariable('AWS_S3_SECRET_ACCESS_KEY')
const AWS_S3_URL = getEnvVariable('AWS_S3_URL')
const OPENWEATHER_API_KEY = getEnvVariable('OPENWEATHER_API_KEY', '')

export {
   AWS_S3_ACCESS_KEY_ID,
   AWS_S3_BUCKET_FOLDER,
   AWS_S3_BUCKET_NAME,
   AWS_S3_REGION,
   AWS_S3_SECRET_ACCESS_KEY,
   AWS_S3_URL,
   IP,
   JWT_SECRET,
   JWT_SECRET_REFRESH,
   MONGO_URI,
   OPENWEATHER_API_KEY,
   PORT,
   REG_KEY,
}
