var db = require('./config')

var fs = require('fs')
var path = require('path')
var express = require('express')
var promise = require('bluebird')
var bodyparser = require('body-parser')
var router = express.Router()

router.use(bodyparser.urlencoded({ limit: '10mb', extended: true }))
router.use(bodyparser.json({ limit: '10mb', extended: true }))


router.get('/preDefined', (req, res, next) => {
    db.any('select * from  fn_getAdmQueoptions()').then((data) => {
        res.send(data);
    })
})


router.get('/opt/:qid', (req, res, next) => {
    id = req.params.qid
    db.any('select * from  fn_getQOptById($1)', id).then((data) => {
        res.send(data);
    })
})
router.get('/count/:sid', (req, res, next) => {
    id = req.params.sid
    db.any('select * from  fn_getQueCount($1)', id).then((data) => {
        res.send(data);
    })
})

router.post('/questions', (req, res, next) => {
    var que = req.body.question;
    var cid = req.body.clientId;
    var quetyp = req.body.questionType;
    var qmodel = req.body.modelId;
    var optdesc = [] = req.body.optionDescription;
    var sid = req.body.surveyId;
    db.any('select * from fn_add($1,$2,$3,$4,$5,$6)', [que, cid, quetyp, qmodel, optdesc, sid]).then((data) => {
        res.send(data[0].fn_add)
        console.log("question id : " + data)
    })
})
router.put('/opt/:optId', (req, res, next) => {
    optid = req.params.optId;
    optdesc = req.body.optionDescription;
    db.any('select fn_updQOpt($1,$2)',
        [optid, optdesc]).then((data) => {
            res.send({ "message": "upted sucessfully...." })
        })
})
router.delete('/opt/:optId', (req, res, next) => {
    id = req.params.optId
    db.any('select  fn_DelQOpt($1)', id).then((data) => {
        res.send({ 'message': 'deleted' })
    })
})
router.get('/queoptions/:sid', (req, res, next) => {

    var sid = req.params.sid;
    db.any('select * from fn_getQueoptionsById($1)', [sid]).then((data) => {
        res.send(data);
    })
})

module.exports = router