require('dotenv').config()// Tuodaan ympäristömuuttujat (.env)
const express = require('express')
const cors = require('cors')
const Person = require('./models/person')
const errorHandler = require('./customMW/errorHandler')// Tuodaan custom errorHandler
const morganLogger = require('./customMW/morganLogger')// Tuodaan custom morganLogger
const app = express()

app.use(cors())// MW Sallii HTTP pyynnöt eri alkuperästä (front&back eri Domain)
app.use(express.static('build'))// Front käyttöön
app.use(express.json()) // MW parsii HTTP pyynnön JSON bodyn JS objektiksi
app.use(morganLogger) // Morgankirjasto EventLogger (Custom MW)


app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(result => {
      const p = Date()
      const payload = `Puhelinluettelo sisältää ${result} henkilön tiedot.<br>${p}`
      res.send(payload)
    })
    .catch(error => next(error))
})


app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(result => {
      const personsArray = result.map(person => ({
        name: person.name,
        number: person.number,
        id: person.id
      }))

      res.json(personsArray)
    })
    .catch(error => next(error))
})


app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      console.log(`${result.name} poistettu.`)
      res.status(204).end()
    })
    .catch(error => next(error))
})

// findUpdatelle annetaan NORMAALI javascript olio
app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(req.params.id, person, { new: true , runValidators: true, contex: 'query' })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})


app.post('/api/persons', (req, res, next) => {
  const body = req.body
  // Tarkastetaan löytyykö kannasta jo sama nimi | Myös front tekee tämän
  Person.find({ name: body.name })
    .then(result => {
      if (result.length > 0) {
        return res.status(400).json({ error: 'Nimi on jo luettelossa!' })
      }

      const person = new Person({
        name: body.name,
        number: body.number
      })

      person.save()
        .then(savedPerson => {
          res.json(savedPerson)
        })
        .catch(error => next(error))
    })
})

app.use(errorHandler)// Viimeinen MW jotta ylempänä liikkeelle lähtenyt err päätyy lopulta tänne

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})