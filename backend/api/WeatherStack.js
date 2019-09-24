const ParamWeatherStack = class {
    constructor(query) {
      this.access_key = '4b1d51f31fa655c77bbbe613fa6cbd94' //chave de acesso à api
      this.query = query;
      //this.language = 'pt' // Somente na versão paga da api consigo usar o parâmetro language...isso me custou algumas horas....
    }    
  }
const getCurrentWeather = 'http://api.weatherstack.com/current'

  module.exports = ParamWeatherStack
  module.exports.getCurrentWeather = getCurrentWeather