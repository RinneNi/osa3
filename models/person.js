const mongoose = require('mongoose')

// Tämä sallii tietokantakyselyt eri muodoissa kun skeemassa määritelty
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI // Haetaan url .env tiedostosta

console.log('connecting to', url)

mongoose.connect(url)// Yhdistetään Tietokantaan

  .then(result => {
    if (result) {
      console.log('connected to MongoDB')
    }
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// Luodaan skeema eli malli jossa tieto tallennetaan tietokantaan
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    minlength: 8,
    required: true,
    validate: {
      validator: function(number) {
        return number[2] === '-' || number[3] === '-'
      },
      message: props => `${props.value} ei ole sallittu numero!`
    }
  }
})

// Asetetaan skeemaan JSON muuntaja jotta tietokantaan tallentuu JSON muotoista dataa
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)