const mongoose = require('mongoose')
const config = require('./config')
const logger = require('./logger')

mongoose.set('strictQuery', false)

const connect = () => {
  mongoose.connect(config.MONGODB_URI)
    .then(() => {
      logger.info('connected to MongoDB')
    })
    .catch((error) => {
      logger.error('error connection to MongoDB:', error?.message)
      throw error
    })
}

module.exports = {
  connect
}