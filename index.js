const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(express.static('build'))
app.use(cors())
morgan.token('person', (request) => {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

let persons = [
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 1
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 2
  },
  {
    name: 'jorge',
    number: '123',
    id: 3
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  const personsInPhonebook = persons.length
  const date = new Date()
  response.send(
    `<p>Phonebook has info for ${personsInPhonebook} people</p>
         <p>${date}</p>`
  )
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }
  const personExists = () => {
    persons.find(person => person.name === body.name || person.number === body.number)
  }
  if (!personExists) {
    response.status(400).json({
      error: 'person already exists'
    })
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 10000)

  }

  persons = [...persons, newPerson]
  response.json(newPerson)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
