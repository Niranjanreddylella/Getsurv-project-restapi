var db = require('./config')
var path=require('path')
var fs=require('fs')
var express=require('express');
var sm=require('./surveymodule');
var um=require('./usermodule');
var am=require('./adminmodule');
var cm=require('./clientsmodule');
var om=require('./optmodule');
var promise = require('bluebird')
var bodyparser = require('body-parser')
var router = express.Router()
router.use(bodyparser.urlencoded({limit:'20mb',extended: true }))
router.use(bodyparser.json({limit:'20mb',extended: true }))
 var app=express()
 app.use(express.static(path.join(__dirname,"pics")))
 
 app.all('*', function (req, res, next) {

    res.header("Access-Control-Allow-Origin", '*');

    res.header("Access-Control-Allow-Headers", "Cache-Control,Pragma, Origin, Authorization, Content-Type, X-Requested-With");

    res.header("Access-Control-Allow-Methods", "*");

    return next();
});
 app.set('port',process.env.PORT||4500)

 app.use('/',sm);
 app.use('/us',um);
 app.use('/as',am);
 app.use('/cs',cm);
 app.use('/os',om);
 
 app.get('/countries', (req, res, next) => {
    db.any('select * from fn_getCountries()').then((data) => {
        res.send(data)
    })
})
app.get('/states', (req, res, next) => {
    db.any('select * from fn_getStates()').then((data) => {
        res.send(data)
    })
})
app.get('/cities', (req, res, next) => {
    db.any('select * from fn_getCities()').then((data) => {
        res.send(data)
    })
})
app.get('/countries/:id', (req, res, next) => {
    i=req.params.id
    db.any('select * from fn_getCountriesById($1)',[i]).then((data) => {
        res.send(data)
    })
})
app.get('/countries/:id/:i', (req, res, next) => {
    i=req.params.id
    j=req.params.i
    db.any('select  * from fn_getStatesById($1,$2)',[i,j]).then((data) => {
        res.send(data)
    })
})

 app.listen(app.get('port'),(err)=>{
    if(err){
        console.log("server error..")
    }
    else{
        console.log("server is started...  http://localhost:"+app.get('port'))
    }
})