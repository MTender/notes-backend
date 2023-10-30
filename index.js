import express from "express";
import cors from "cors";

const app = express()

app.use(cors())
app.use(express.json())

const notesPath = '/api/notes'

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    }, {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    }, {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get(notesPath, (req, res) => {
    res.json(notes)
})

app.get(`${notesPath}/:id`, (req, res) => {
    const id = Number(req.params.id)
    const note = notes.find(note => note.id === id)

    if (!note) {
        return res.status(404).end()
    }

    res.json(note)
})

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0

    return maxId + 1;
}

app.post(notesPath, (req, res) => {
    const body = req.body

    if (!body.content) {
        return res.status(400).json({
            error: 'content field missing'
        })
    }

    const note = {
        id: generateId(),
        content: body.content,
        important: body.important || false
    }

    notes = notes.concat(note)

    res.json(note)
})

app.delete(`${notesPath}/:id`, (req, res) => {
    const id = Number(req.params.id)
    notes = notes.filter(note => note.id !== id)
    res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})