/**
 * expiration of session cookie
 */
export const SESSION_COOKIE_EXPIRES = Number(process.env.SESSION_COOKIE_EXPIRES) || 8*60*60*1000 // 8h
/**
 * make sure secret key is present when running
 */
export const SECRET_KEY = process.env.SECRET_KEY ? process.env.SECRET_KEY : 'SECRET'
export const DATABASE_URL = process.env.DATABASE_URL
export const BUCKET_NAME = process.env.BUCKET_NAME || "audio"
export const MAX_FILE_UPLOAD = Number(process.env.MAX_FILE_UPLOAD) || 104857600 //100MB
export const MINIO_ADDRESS = process.env.MINIO_EXTERNAL_ADDRESS 