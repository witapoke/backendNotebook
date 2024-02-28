require('dotenv').config()
require('./mongo')
const express = require('express')
const app = express()
const cors = require('cors')
const notFound = require('./middlewares/notFound')
const handleCastError = require('./middlewares/handleCastError')
app.use(cors())
app.use(express.json())
const usersRouter = require('./controllers/users')
const NotesRouter = require('./controllers/notes')
const loginRouter = require('./controllers/login')

app.use('/', NotesRouter)

app.use('/api/users', usersRouter)

app.use('/api/login', loginRouter)

app.use(notFound)

app.use(handleCastError)

const PORT = process.env.PORT

const server = app.listen(PORT, () => {
  console.log('server running on port 3001')
})

module.exports = { app, server }
