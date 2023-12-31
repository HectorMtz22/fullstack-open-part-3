const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

const generateId = () => {
  return parseInt(Math.random() * 100000000)
}

// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }

// * Morgan logging
// ? Create new token for body requests
// ! it can be dangerous since we may have sensitive data logged
morgan.token('body', (req) => JSON.stringify(req.body))

// ? Tiny string + body
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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

app.get('/', (_, res) => {
  res.send('Hola Mundo')
})

app.get('/api/persons', (_, res) => {
  res.json(data)
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  if (!body.name) return res.status(400).json({ error: 'Name is missing' })
  if (!body.number) return res.status(400).json({ error: 'Number is missing' })
  // console.log(body)

  // Check if there arent any name duplicates
  const matched = data
    .map((val) => val.name)
    .find((name) => name === body.name)

  if (matched) return res.status(409).json({ error: 'The name already exists on the phonebook' })

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

app.get('/info', (_, res) => {
  const date = new Date()
  res.send(`
    <p>Phonebook has info for ${data.length} people</p>
    <p>${date}</p>
  `)
})

const unknownEndpoint = (_, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`)
})
