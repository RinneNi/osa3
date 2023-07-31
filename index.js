const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())

app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-lenght'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
    ].join(' ')
}))
//Midlewaret ennen reittejä
app.use(express.json())

let persons = [
  {
    id: 1,
    name: "Henna Luoto",
    number: "020-23452345"
  },
  {
    id: 2,
    name: "Timo Tammisto",
    number: "12-52345"
  },
  {
    id: 3,
    name: "Mikko Vuori",
    number: "234-23452345"
  }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
    })

app.get('/info', (req, res) => {
    const m = Math.max(...persons.map(n => n.id));
    const p = Date();
    const payload = `Puhelinluettelo sisältää ${m} henkilön tiedot.<br>${p}`;
    res.send(payload);
    });
    
    
  
app.get('/persons', (req, res) => {
    res.json(persons)
    })

app.get('/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = persons.find(note => note.id === id)

    if (note) {
        response.json(note)
        } else {
        response.status(404).end()
        }
    })

app.delete('/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)
    
    response.status(204).end()
    })


app.post('/persons', (request, response) => {
const body = request.body


if (!body.name || !body.number) {
    return response.status(400).json({ 
    error: 'Nimi tai numero puuttuu!' 
    })
}

const nimiTarkastus = persons.map(person => {
    return person.name === body.name
    })

if ( nimiTarkastus.includes(true) ) {
    return response.status(400).json({
        error: 'Nimi löytyy jo luettelosta!'
    })
}

const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 5000)
}

persons = persons.concat(person)

response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})