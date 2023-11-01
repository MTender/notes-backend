const morgan = require('morgan')
const logger = require('./logger')


morgan.token('body', (req,) => JSON.stringify(req.body))
const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms :body')

const unknownEndpoint = (req, res) => res.status(404).end()

const errorHandler = (error, req, res, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).json({error: 'InvalidIdError', message: 'Invalid id'})
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({error: error.name, message: error.message})
    }

    next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}