require('dotenv').config()

const PORT = process.env.PORT
const ENV = process.env.NODE_ENV

const MONGODB_URI = process.env.NODE_ENV === 'test' ?
    process.env.TEST_MONGODB_URI :
    process.env.MONGODB_URI

const config = {
    PORT,
    MONGODB_URI,
    ENV
}

module.exports = config