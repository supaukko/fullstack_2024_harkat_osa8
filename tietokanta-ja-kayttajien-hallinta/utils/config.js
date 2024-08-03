require('dotenv').config()

const SECRET = process.env.SECRET
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN
const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
  SECRET,
  TOKEN_EXPIRES_IN,
  PORT,
  MONGODB_URI
}