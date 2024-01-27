require('dotenv').config()
require('./mongo')
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/NoteModel')
app.use(cors())
app.use(express.json())

let notes = []

app.get('/', (request, response) => {
  response.send('<h1>Hola Mundo. Acá practicando backend por tercera vez</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then((notes) => response.json(notes))
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find((note) => note.id === id)
  if (note) {
    response.json(note).end()
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter((note) => note.id !== id)
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const ids = notes.map((note) => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }

  notes = notes.concat(newNote)
  response.json(newNote)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not Found'
  })
})

const PORT = 3001

app.listen(PORT, () => {
  console.log('server running on port 3001')
})
