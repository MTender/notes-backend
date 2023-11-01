const {ENV} = require('./config')

const info = (...params) => {
    if (ENV === 'test') return

    console.log(...params)
}

const error = (...params) => {
    if (ENV === 'test') return

    console.error(...params)
}

module.exports = {info, error}