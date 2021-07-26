import config from './../config/config'
import app from './express'
import mongoose from 'mongoose'
import ensemblechat from './controllers/ensemblechat.controller'

//connect to database
mongoose.Promise = global.Promise
mongoose.connect(config.mongoUri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.mongoUri}`)
})

//start up server
const server = app.listen(config.port, (err) => {
  if (err) {
    console.log(err)
  }
  console.info('Server started on port %s.', config.port)
})

//use server to enable web socket
ensemblechat(server) 