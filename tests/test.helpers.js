const { app } = require('../index')
const supertest = require('supertest')
const api = supertest(app)
const User = require('../models/UserModel')
const bcrypt = require('bcrypt')

const initialNotes = [
  {
    content: 'nacho no entiende qué está haciendo',
    date: new Date(),
    important: true
  },
  {
    content: 'La nota numero 2 es esta hijo de puta',
    date: new Date(),
    important: false
  }
]

const getAllContent = async () => {
  const response = await api.get('/api/notes')
  return {
    contents: response.body.map((note) => note.content),
    response
  }
}

const getUserContent = async () => {
  const usersDB = await User.find({})
  const jsonUsers = usersDB.map((user) => user.toJSON())
  const usernames = jsonUsers.map((user) => user.username)
  return { usersDB, jsonUsers, usernames }
}

const beforeTest = async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('pswd', 10)
  const usuario = new User({ username: 'bodoi', passwordHash })
  await usuario.save()
}

module.exports = {
  initialNotes,
  app,
  api,
  getAllContent,
  getUserContent,
  beforeTest
}
