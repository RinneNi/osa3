const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://niilo:${password}@fscluster.fc1uhbz.mongodb.net/personsApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personsSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personsSchema)

if (!process.argv[3]) {
  console.log('Puhelinluettelo:')

  Person.find({})
    .then(result => {
      result.forEach(person => {
        if (person.name) {
          console.log(person.name, person.number)
        }
        mongoose.connection.close()
      })
    })
} else {

  const person = new Person({
    name: name,
    number: number,
  })


  person.save().then(result => {
    if (result) {
      console.log(`Lisätty ${name} Numero ${number} puhelinluetteloon.`)
    }
    mongoose.connection.close()
  })
}
