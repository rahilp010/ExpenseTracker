import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env' })

console.log('PORT from process.env:', process.env.PORT);

const _config = {
    port: process.env.PORT || 3000,
    mongoURL: process.env.MONGO_CONNECTION_STRING || '',
    env: process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUDNAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET
}

export const config = Object.freeze(_config)