const express = require('express')
const app = express()

app.use(express.json())

const generateId = () => {
  return parseInt(Math.random() * 100000000)
}

let data = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
]

app.get('/', (req, res) => {
  res.send('Hola Mundo')
})

app.get('/api/persons', (req, res) => {
  res.json(data)
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  if (!body.name) return res.status(400).end()
  if (!body.number) return res.status(400).end()
  console.log(body)

  const newId = generateId()

  const newPerson = {
    name: body.name,
    number: body.number,
    id: newId
  }
  data = data.concat(newPerson)
  res.send(newPerson)
})

app.get('/api/persons/:id', (req, res) => {
  const id = parseInt(req.params.id)
  console.log('Person id given: ', id)
  console.log('Typeof ', typeof id)
  const person = data.find((x) => x.id === id)
  if (!id) {
    return res.status(400).send('<h1>Bad Request</h1>')
  }
  if (!person) {
    console.log(`Id ${id} not found`)
    return res.status(404).send('<h1>Not Found</h1>')
  }
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = parseInt(req.params.id)
  data = data.filter((x) => x.id !== id)
  res.status(204).end()
})

app.get('/info', (req, res) => {
  const date = new Date()
  res.send(`
    <p>Phonebook has info for ${data.length} people</p>
    <p>${date}</p>
  `)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`)
})
