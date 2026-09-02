const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())

app.use(morgan('tiny'))

morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let phoneBookList =  [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(phoneBookList)
})

app.get('/info', (request, response) => {
  const currentTime = new Date()

  response.send(`
    <p>Phone has info for ${phoneBookList.length} people</p>
    <p>${currentTime}</p>
    `
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const phoneBook = phoneBookList.find((list) => list.id === id)

  if (phoneBook) {
    response.json(phoneBook)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  phoneBookList = phoneBookList.filter((list) => list.id !== id)

  response.status(204).end()
})


const generateId = () => {
  const maxId = phoneBookList.length > 0
    ? Math.max(...phoneBookList.map((p) => Number(p.id)))
    : 0

  return String(maxId + 1)
}

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body
  
  if (!name) {
    return response.status(400).json({
      error: 'name is missing'
    })
  }

  if (!number) {
    return response.status(400).json({
      error: 'number is missing'
    })
  }

  const nameExists = phoneBookList.some(
    (person) => person.name === name
  )

  if (nameExists) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const newPerson = {
    id: generateId(),
    name,
    number
  }

  phoneBookList = phoneBookList.concat(newPerson)

  response.status(201).json(newPerson)

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
