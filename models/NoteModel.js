const { Schema, model } = require('mongoose')

// El schema para crear las notas

const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean,
  noteOwner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.NoteId = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// El modelo que usa el schema para crear las notas

const Note = model('Note', noteSchema)

module.exports = Note

// Funcion para buscar las notas de tu coleccion

// Note.find({}).then((result) => {
//   console.log(result)
//   mongoose.connection.close()
// })

// Funcion para crear nuevas notas y guardarlas

// const notaCreada = new Note({
//   content: 'Creando mi primera nota usando el schema de notas xd',
//   date: new Date(),
//   important: true
// })

// notaCreada
//   .save()
//   .then((result) => {
//     console.log(result)
//     mongoose.connection.close()
//   })
//   .catch((err) => console.log(err))
