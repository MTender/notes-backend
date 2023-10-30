import express from "express";
import cors from "cors";
import Note from "./models/note.js";

const app = express()

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

const notesPath = '/api/notes'

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get(notesPath, (req, res) => {
    Note.find({})
        .then(notes => {
            res.json(notes)
        })
})

app.get(`${notesPath}/:id`, (req, res, next) => {
    Note.findById(req.params.id)
        .then(note => {
            if (!note) return res.status(404).end()

            res.json(note)
        })
        .catch(error => next(error))
})

app.post(notesPath, (req, res, next) => {
    const body = req.body

    const note = new Note({
        content: body.content,
        important: body.important || false
    })

    note.save()
        .then(savedNote => {
            res.json(savedNote)
        })
        .catch(error => next(error))
})

app.put('/api/notes/:id', (req, res, next) => {
    const {content, important} = req.body

    Note.findByIdAndUpdate(
        req.params.id,
        {content, important},
        {new: true, runValidators: true, context: 'query'}
    )
        .then(updatedNote => {
            res.json(updatedNote)
        })
        .catch(error => next(error))
})

app.delete(`${notesPath}/:id`, (req, res, next) => {
    Note.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).end()
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).json({error: 'malformed id'})
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({error: error.message})
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})