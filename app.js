const express = require('express')
require('express-async-errors')
const mongoose = require('mongoose').default
const config = require('./utils/config')
const logger = require('./utils/logger')
const cors = require('cors')
const middleware = require('./utils/middleware')
const notesRouter = require('./controllers/notes')


const app = express()

mongoose.set('strictQuery', false)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to mongodb')
    })
    .catch(error => {
        logger.error('error connecting to MongoDB:', error.message)
    })

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app