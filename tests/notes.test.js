const mongoose = require('mongoose')
const { server } = require('../index')
const Note = require('../models/NoteModel')
const { initialNotes, app, api, getAllContent } = require('./test.helpers')

beforeEach(async () => {
  await Note.deleteMany({})
  for (const note of initialNotes) {
    const noteObject = new Note(note)
    await noteObject.save()
  }
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are as many notes as initialNotes length', async () => {
  const { response } = await getAllContent()
  expect(response.body).toHaveLength(initialNotes.length)
})

test('some note is about nacho', async () => {
  const { contents, response } = await getAllContent()
  expect(contents).toContain('nacho no entiende qué está haciendo')
})

test('a new note can be added', async () => {
  const newNote = {
    content: 'Esta seria la nueva nota añadida',
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const { contents, response } = await getAllContent()
  expect(response.body).toHaveLength(initialNotes.length + 1)
  expect(contents).toContain(newNote.content)
})

test('a note without content cant be added', async () => {
  const newNote = {
    important: true
  }

  await api.post('/api/notes').send(newNote).expect(400)

  const { response } = await getAllContent()
  expect(response.body).toHaveLength(initialNotes.length)
})

test('a note can be deleted', async () => {
  const { response: primerRespuesta } = await getAllContent()
  const { body: notes } = primerRespuesta
  const noteToDelete = notes[0]

  await api.delete(`/api/notes/${noteToDelete.id}`).expect(204)

  const { contents, response: segundaRespuesta } = await getAllContent()
  expect(segundaRespuesta.body).toHaveLength(initialNotes.length - 1)
  expect(contents).not.toContain(noteToDelete.content)
})

test('a note that does not existe cant be deleted', async () => {
  await api.delete('/api/notes').expect(404)

  const { response } = await getAllContent()
  expect(response.body).toHaveLength(initialNotes.length)
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
