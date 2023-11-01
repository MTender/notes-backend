const Note = require('../models/note')
const notesRouter = require('express').Router()

notesRouter.get('/', async (req, res) => {
    res.json(await Note.find({}))
})

notesRouter.get('/:id', async (req, res) => {
    const note = await Note.findById(req.params.id)

    if (!note) return res.status(404).end()

    res.json(note)
})

notesRouter.post('/', async (req, res) => {
    const body = req.body

    const note = new Note({
        content: body.content,
        important: body.important || false
    })

    const savedNote = await note.save()
    res.status(201).json(savedNote)
})

notesRouter.put('/:id', (req, res, next) => {
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

notesRouter.delete('/:id', async (req, res) => {
    await Note.findByIdAndDelete(req.params.id)
    res.status(204).end()
})

module.exports = notesRouter