require('dotenv').config() // make variables in .env file available globally
const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/note')

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only Javascript',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true
  }
]

//let the app use static html from dist folder
app.use(express.static('dist'))

//allow requests from all origin
app.use(cors())

//activate the json-parser of express
app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1><p>Testing4</p>')
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then((result) => res.json(result))
})

app.get('/api/notes/:id', (req, res) => {
  Note.findById(req.params.id).then((note) => res.json(note))
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter((n) => n.id !== id)

  res.status(204).end()
})

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0
  return maxId + 1
}

app.post('/api/notes', (req, res) => {
  const body = req.body
  if (!body.content) {
    return res.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  note.save().then((savedNote) => {
    res.json(savedNote)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
