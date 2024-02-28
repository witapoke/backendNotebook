const NotesRouter = require('express').Router()
const Note = require('../models/NoteModel')
const User = require('../models/UserModel')
const jwt = require('jsonwebtoken')
NotesRouter.get('/', (request, response) => {
  response.send('<h1>Hola mundo como vamos aca desde el notes Router</h1>')
})

NotesRouter.get('/api/notes', async (request, response) => {
  const notas = await Note.find({}).populate('noteOwner', {
    username: 1,
    name: 1
  })
  response.json(notas)
})

NotesRouter.get('/api/notes/:id', async (request, response, next) => {
  const id = request.params.id
  try {
    const nota = await Note.findById(id)
    response.json(nota)
  } catch (error) {
    next(error)
  }
})

NotesRouter.delete('/api/notes/:id', async (request, response, next) => {
  const id = request.params.id

  const nota = await Note.findByIdAndDelete(id)
  if (nota === null) return response.sendStatus(404)
  response.status(204).end()
})

NotesRouter.put('/api/notes/:id', async (request, response, next) => {
  const id = request.params.id
  const note = request.body
  const infoParaActualizar = {
    content: note.content,
    important: note.important
  }
  const noteToUpdate = await Note.findByIdAndUpdate(id, infoParaActualizar, {
    new: true
  })
  response.json(noteToUpdate)
})

NotesRouter.post('/api/notes', async (request, response, next) => {
  const { content, important = false } = request.body

  const authorization = request.get('authorization')
  let token = null
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
  }

  let decodedToken = {}

  try {
    decodedToken = jwt.verify(token, '123')
  } catch (e) {
    console.log(e)
  }

  if (!token || !decodedToken.id) {
    response.status(401).json({ error: 'token missing or invalid' })
  }

  const { id: userId } = decodedToken
  const user = await User.findById(userId)

  if (!content || content === '') {
    return response
      .status(400)
      .json({ error: 'note content is missing you fucking bitch' })
  }

  const nuevaNota = new Note({
    content,
    date: new Date(),
    important,
    noteOwner: user._id
  })

  try {
    const savedNote = await nuevaNota.save()
    user.notasDelUsuario = user.notasDelUsuario.concat(savedNote._id)
    await user.save()
    response.json(savedNote)
  } catch (error) {
    next(error)
  }
})

module.exports = NotesRouter
