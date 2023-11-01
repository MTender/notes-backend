const app = require('../app')
const supertest = require('supertest')
const Note = require('../models/note')
const {initialNotes, notesInDb, nonExistingId} = require('./test_helper')
const mongoose = require('mongoose').default

const api = supertest(app)

beforeEach(async () => {
    await Note.deleteMany({})
    for (const note of initialNotes) {
        await new Note(note).save()
    }
})

describe('GET /api/notes', () => {

    test('succeeds', async () => {
        const response = await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toHaveLength(initialNotes.length)

        const contents = response.body.map(r => r.content)
        initialNotes.forEach(note => {
            expect(contents).toContain(note.content)
        })
    })



})

describe('GET /api/notes/:id', () => {

    test('succeeds with valid id', async () => {
        const notesAtStart = await notesInDb()

        const noteToView = notesAtStart[0]

        const resultNote = await api
            .get(`/api/notes/${noteToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(resultNote.body).toEqual(noteToView)
    })

    test('fails with 404 if note does not exist', async () => {
        const validNonexistentId = await nonExistingId()

        await api
            .get(`/api/notes/${validNonexistentId}`)
            .expect(404)
    })

    test('fails with 400 if id is invalid', async () => {
        const invalidId = '5a3d5da59070081a82a3445'

        await api
            .get(`/api/notes/${invalidId}`)
            .expect(400)
    })

})

describe('POST /api/notes', () => {

    test('succeeds with valid note', async () => {
        const newNote = {
            content: 'async/await simplifies making async calls',
            important: true,
        }

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const notesAtEnd = await notesInDb()
        const contents = notesAtEnd.map(r => r.content)

        expect(contents).toHaveLength(initialNotes.length + 1)
        expect(contents).toContain(
            'async/await simplifies making async calls'
        )
    })

    test('fails with 400 if content is missing', async () => {
        const newNote = {
            important: true
        }

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(400)

        const notesAtEnd = await notesInDb()
        expect(notesAtEnd).toHaveLength(initialNotes.length)
    })

})

describe('DELETE /api/notes/:id', () => {

    test('succeeds with valid id', async () => {
        const notesAtStart = await notesInDb()
        const noteToDelete = notesAtStart[0]

        await api
            .delete(`/api/notes/${noteToDelete.id}`)
            .expect(204)

        const notesAtEnd = await notesInDb()

        expect(notesAtEnd).toHaveLength(
            initialNotes.length - 1
        )

        const contents = notesAtEnd.map(r => r.content)

        expect(contents).not.toContain(noteToDelete.content)
    })

})

afterAll(async () => {
    await mongoose.connection.close()
})