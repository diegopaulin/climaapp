//Carregando módulos
    //Pacotes
        const express = require('express')
        const app = express()
        const handlebars = require('express-handlebars') //carregando o motor de view.
        const bodyparser = require('body-parser') //carregando o interpretador do body do HTML que permite resgatar dados no formato JSON.Instalado pacote body-parser
        const mongoose = require('mongoose') // carregando o motor do banco de dados
        const path = require('path') //carregando o pacote do express para manipulação dos caminhos da aplicação 
        const session = require('express-session')//Manipulando sessões. Instalado múdulo express-session
        const flash = require('connect-flash') //Instalado pacote connect-flash. Usado para tratamento de mensagens 

    //Módulos locais
        const mainRoute = require('./routes/mainRoute') //rota principal da aplicação    

//Configurações de Middleware
    //Sessões
        app.use(session({ //app.use é para usar o middleware
            secret: 'climaapp',
            resave: true,
            saveUninitialized: true
        })) 

    //Sessões temporárias 
        app.use(flash())
        app.use((req, res, next)=>{
            //variáveis globais        
            res.locals.success_msg = req.flash('success_msg'); //msg de sucesso padrão
            res.locals.error_msg = req.flash('error_msg') //msg de erro padrão
            next()
        })
    
    //Body Parser - comunicação view/backend
        app.use(bodyparser.urlencoded({extended:true})) //Configurando o bodyparser
        app.use(bodyparser.json()) //retorno será usando JSON

    //Handle-Bars (View Engine)
        app.engine('handlebars', handlebars({defaultLayout:'main'})) //Configurando a view da aplicação para usar o handlebars
        app.set('view engine', 'handlebars') //setando a view

    //Banco de dados Mongo: mongoose    
        const uri = 'mongodb://localhost/climaapp'
        const mongoconfig = {useNewUrlParser:true, useUnifiedTopology: true}
        mongoose.Promise = global.Promise //padrão
        mongoose.connect(uri,mongoconfig).then((req,res)=>{
            console.log(`Conectado ao mongodb`)
        }).catch((err)=>{
            console.log(`Erro ao conectar no mongodb: ${err}.`)
        })

    //Public - configuração dos arquivos estáticos da aplicação
        app.use(express.static(path.join(__dirname,'public')))//configura o diretório padrão com o caminho absoluto

//Configurações de APIs
   
//Configurando as rotas da aplicação

    //Rota principal
    app.use('/', mainRoute)


//Configurações da aplicação    
    const port = 8089

    app.get('/', (req, res) => res.send('Hello World!'))
    app.listen(port, () => console.log(`Climaapp está sendo executada na porta: ${port}`))