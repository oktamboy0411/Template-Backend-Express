import dotenv from 'dotenv'
import fs from 'fs'

if (fs.existsSync('.env')) {
   dotenv.config({ path: '.env' })
} else {
   console.error('.env file not found!')
}

const MONGO_URI = process.env.MONGO_URI as string
const IP = (process.env.IP as string) || ''
const PORT = parseInt(process.env.PORT as string, 10) || 8080
const REG_KEY = process.env.REG_KEY as string
const JWT_SECRET = process.env.JWT_SECRET as string
const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH as string
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME as string
const AWS_S3_BUCKET_FOLDER = process.env.AWS_S3_BUCKET_FOLDER as string
const AWS_S3_REGION = process.env.AWS_S3_REGION as string
const AWS_S3_ACCESS_KEY_ID = process.env.AWS_S3_ACCESS_KEY_ID as string
const AWS_S3_SECRET_ACCESS_KEY = process.env.AWS_S3_SECRET_ACCESS_KEY as string
const AWS_S3_URL = process.env.AWS_S3_URL as string
const OPENWEATHER_API_KEY = (process.env.OPENWEATHER_API_KEY as string) || ''

export {
   MONGO_URI,
   IP,
   PORT,
   REG_KEY,
   JWT_SECRET,
   JWT_SECRET_REFRESH,
   AWS_S3_BUCKET_NAME,
   AWS_S3_BUCKET_FOLDER,
   AWS_S3_REGION,
   AWS_S3_ACCESS_KEY_ID,
   AWS_S3_SECRET_ACCESS_KEY,
   AWS_S3_URL,
   OPENWEATHER_API_KEY,
}
