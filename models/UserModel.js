const uniqueValidator = require('mongoose-unique-validator')
const { Schema, model } = require('mongoose')

// las notas del usuario estan referenciadas al modelo de note
const userSchema = new Schema({
  username: { type: String, unique: true },
  name: String,
  passwordHash: String,
  notasDelUsuario: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Note'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.userId = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

userSchema.plugin(uniqueValidator)

const User = model('User', userSchema)

module.exports = User
