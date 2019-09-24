const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../backend/model/WeatherModel')
const WeatherModel = mongoose.model('weatherModel')
const WeatherStack = require('../backend/api/WeatherStack')
const axios = require('axios')
var moment = require('moment');


router.get('/', (req, res) => { //caminho principaol da rota Admin            
    res.render('index')
})

router.post('/search', (req, res)=>{        
    params = new WeatherStack(req.body.query)          
    axios.get(WeatherStack.getCurrentWeather, {params})
    .then(response => {
        const result = response.data;      
        console.log(result)                   
        res.render('weather/weatherResult', {result:result})        
    }).catch(error => {
        console.log(error);
    });        
})

//rota para teste
// router.post('/search', (req, res) => {
//     const result = {
//         request:
//         {
//             type: 'City',
//             query: 'Gaspar, Brazil',
//             language: 'en',
//             unit: 'm'
//         },
//         location:
//         {
//             name: 'Gaspar',
//             country: 'Brazil',
//             region: 'Santa Catarina',
//             lat: '-26.933',
//             lon: '-49.050',
//             timezone_id: 'America/Sao_Paulo',
//             localtime: '2019-09-23 11:11',
//             localtime_epoch: 1568842020,
//             utc_offset: '-3.0'
//         },
//         current:
//         {
//             observation_time: '12:27 AM',
//             temperature: 18,
//             weather_code: 389,
//             weather_icons:
//                 ['https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0040_thunderstorms_night.png'],
//             weather_descriptions: ['Light Rain With Thunderstorm'],
//             wind_speed: 19,
//             wind_degree: 130,
//             wind_dir: 'SE',
//             pressure: 1011,
//             precip: 3.6,
//             humidity: 94,
//             cloudcover: 75,
//             feelslike: 18,
//             uv_index: 0,
//             visibility: 10,
//             is_day: 'no'
//         }
//     }
//     res.render('weather/weatherResult', { result: result })
// })

router.post('/weather/weatherResult/save', (req, res) => {

    var errors = []
    if (!req.body.temperature || typeof req.body.temperature == undefined || req.body.temperature == null) {
        errors.push({ text: 'Não foi possível carregar a temperatura' })
    }

    if (!req.body.city || typeof req.body.city == undefined || req.body.city == null) {
        errors.push({ text: 'Não foi possível carregar a cidade' })
    }

    if (!req.body.date || typeof req.body.date == undefined || req.body.date == null) {

        errors.push({ text: 'Não foi possível carregar a data da consulta' })
    }
    if (!req.body.observation || typeof req.body.observation == undefined || req.body.observation == null) {
        errors.push({ text: 'Não foi possível carregar a data da consulta' })
    }
    if (errors.length > 0) {
        console.log(errors.length)
        res.render('weather/weatherResult', { errors: errors })
    } else {
        console.log(moment(req.body.date).format('YYYY/MM/DD'))
        const newWeather = new WeatherModel({
            city: req.body.city,
            temperature: req.body.temperature,
            date: moment(req.body.date).format('YYYY/MM/DD'),
            observation: req.body.observation,
            imageUrl: req.body.imgUrl
        })
        newWeather.save().then(() => {
            req.flash('success_msg', 'Consulta climática registrada com sucesso!')
            res.redirect('/')
        }).catch((err) => {
            req.flash('error_msg', `Ocorreu erro ao registrar a consulta: ${err}`)
            res.redirect('/')
        })
    }
})

//Lista os climas salvos
router.get('/history', (req, res) => {
    WeatherModel.find().then((weathers) => {
        res.render('weather/history', { weathers: weathers })
    }).catch((err) => {
        req.flash('error_msg', `Não foi possível carregar a página de histórico: ${err}`)
    })
})


//Abre formulário para edição do clima
router.get('/history/edit/:id', ((req, res) => {
    WeatherModel.findOne({ _id: req.params.id }).then((result) => {
        res.render('weather/editWeather', { result: result })
    }).catch((err) => {
        req.flash('error_msg', `Errou! ${err}`)
    })
}))

//Registra alteração na observação de um clima
router.post('/history/edit', ((req, res) => {
    WeatherModel.findOne({ _id: req.body.id }).then((weather) => {
        console.log(weather)
        console.log(req.body.observation)
        weather.observation = req.body.observation
        weather.save().then(() => {
            req.flash('success_msg', 'Observação atualizada com sucesso')
            res.redirect('/history')
        })
    }).catch((err) => {
        req.flash('error_msg', `Falha ao editar os dados do clima: ${err}`)
        res.redirect('/history')
    })
}))

//Remove um registro de clima salvo
router.get('/history/delete/:id', (req, res) => {
    WeatherModel.deleteOne({ _id: req.params.id }).then(() => {
        req.flash('success_msg', 'Registro removido com sucesso!')
        res.redirect('/history')
    }).catch((err) => {
        req.flash('error_msg', `Falha ao remover registro do clima: ${err}`)
    })
})

router.post('/history/filter', (req, res) => {
    const errors = []
    if (!req.body.srcCity || req.body.srcCity == undefined || req.body.srcCity == null) {
        errors.push({ text: 'Favor informar a cidade' })
    }
    if (!req.body.srcDate || req.body.srcDate == undefined || req.body.srcDate == null) {
        errors.push({ text: 'Informar uma data para início da pesquisa' })
    }
    if (!req.body.srcEnd || req.body.srcEnd == undefined || req.body.srcEnd == null) {
        errors.push({ text: 'Informar uma data fim da pesquisa' })
    }
    if (errors.length > 0) {
        console.log(errors.length)
        res.render('weather/history', { errors: errors })
    } else {
        WeatherModel.find({ city: req.body.srcCity, date: { $gt: req.body.srcDate, $lt:req.body.srcEnd } }).then((weathers) => {
            res.render('weather/history', { weathers: weathers })
        }).catch((err) => {
            req.flash('error_msg', `Não foi possível carregar a página de histórico: ${err}`)
        })
    }
})


module.exports = router 
