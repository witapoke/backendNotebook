const bcrypt = require('bcrypt')
const User = require('../models/UserModel')
const { api, getUserContent, beforeTest } = require('../tests/test.helpers')
const { server } = require('../index')
const mongoose = require('mongoose')

describe.only('creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('pswd', 10)
    const usuario = new User({ username: 'bodoi', passwordHash })
    await usuario.save()
  })
  test('works as expected creating a fresh username', async () => {
    const { jsonUsers: usersAtStart } = await getUserContent()

    const newUser = {
      username: 'silk',
      name: 'Jose',
      password: '1234'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const { jsonUsers: usersAtEnd, usernames } = await getUserContent()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper status code and message if username is already taken', async () => {
    const { jsonUsers: usersAtStart } = await getUserContent()

    const newUser = {
      username: 'bodoi',
      name: 'fernando',
      password: '1234'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error.errors.username.message).toContain(
      '`username` to be unique'
    )

    const { jsonUsers: usersAtEnd } = await getUserContent()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  afterAll(() => {
    mongoose.connection.close()
    server.close()
  })
})
