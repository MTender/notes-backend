const Note = require('./models/note')
const mongoose = require('mongoose').default

const argumentCount = process.argv.length

if (argumentCount < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fsopen:${password}@fso.jw589vh.mongodb.net/testNoteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url).catch(error => {
    console.error('failed to connect to mongodb')
    console.error(error)
})

const closeConnection = () => {
    mongoose.connection.close().catch(error => {
        console.error('error while attempting to close connection', error)
    })
}

if (argumentCount === 3) {
    Note.find({}).then(result => {
        console.log('notes:')
        result.forEach(note => {
            console.log(note.content, note.important)
        })
    }).finally(() => {
        closeConnection()
    })
} else if (argumentCount === 5) {
    const content = process.argv[3]
    const important = process.argv[4] === 'true'

    const note = new Note({
        content: content,
        important: important
    })

    note.save().then(() => {
        console.log('added "', content, '" important', important, 'to notes')
    }).finally(() => {
        closeConnection()
    })
}
