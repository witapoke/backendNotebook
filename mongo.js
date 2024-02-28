require('dotenv').config()
const mongoose = require('mongoose')
const { NODE_ENV, DATABASE_PRODUCTION, DATABASE_TESTING } = process.env
const connectionString =
  NODE_ENV === 'test' ? DATABASE_TESTING : DATABASE_PRODUCTION
// conexion a mongodb

mongoose
  .connect(connectionString)
  .then(() => {
    console.log('Database connected')
  })
  .catch((err) => {
    console.log(err)
  })


  // configuracion del eslint por las dudas que se rompa algo por sacarla
// "eslintConfig": {
//   "extends": "./node_modules/standard/eslintrc.json"
// },
