const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

let persons = [
  {
    id: 1,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 2,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 3,
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan('tiny'))
app.use(cors())

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  const yhteensa = persons.length;
  const currentDate = new Date();
  response.send(`<p>Phonebook has info for ${yhteensa} people</p>
    <p>${currentDate}</p>`)

})
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

const generateId = () => {
  return Math.floor(Math.random() * 10000);
};

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    })
  }

  if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
    
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } 
  else {
    console.log('x')
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})