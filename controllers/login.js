const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/UserModel')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    response.status(401).json({ error: 'Invalid user or password' })
  }

  const userForToken = {
    id: user._id,
    username: user.username
  }

  const token = jwt.sign(userForToken, '123')

  response.send({
    name: user.name,
    username: user.username,
    token
  })
})

module.exports = loginRouter
