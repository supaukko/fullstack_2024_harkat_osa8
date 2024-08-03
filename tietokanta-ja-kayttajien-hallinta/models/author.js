const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4
  },
  born: {
    type: Number,
  },
})

authorSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Author', authorSchema)

authorSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Author = mongoose.model('Author', authorSchema)

module.exports = Author