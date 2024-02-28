module.exports = (error, request, response, next) => {
  console.error(error)
  if (error.name === 'CastError') {
    response
      .status(400)
      .send({ error: 'La id usada esta en un formato incorrecto' })
  } else {
    response.status(500).end()
  }
}
