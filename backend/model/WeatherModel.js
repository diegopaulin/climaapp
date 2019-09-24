const mongoose = require('mongoose')
const Schema = mongoose.Schema //Padrão

const WeatherModel = new Schema({
    city: {
        type: String,
        required: true
    },
    observation: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        required: true,
    },
    temperature:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String
    }
})

mongoose.model('weatherModel', WeatherModel)//chamando a função Model para adicionar a categoria 