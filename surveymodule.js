var db = require('./config')
var fs = require('fs')
var path = require('path')
var express = require('express')
var promise = require('bluebird')
var bodyparser = require('body-parser')
var router = express.Router()


router.use(bodyparser.urlencoded({ limit: '20mb', extended: true }))
router.use(bodyparser.json({ limit: '20mb', extended: true }))



router.get('/questions', (req, res, next) => {
    db.any('select * from  fn_getQuestions()').then((data) => {
        res.send(data)
    })
})
router.get('/predefinedquestions', (req, res, next) => {
    db.any(" select * from fn_getQuestionAdmin()").then((data) => {
        res.send(data)
    })
})


router.get('/questions/:qId', (req, res, next) => {
    var id = req.params.qId;
    db.any('select * from  fn_getById_Questions($1)', id).then((data) => {
        res.send(data);
    })
})

router.get('/questions/sta/:type', (req, res, next) => {
    var typ = req.params.type;
    db.any('select * from  fn_getByStatus_Questions($1)', typ).then((data) => {
        res.send(data);
    })
})
router.get('/preDefined', (req, res, next) => {
    db.any('select * from  fn_getAdmQueoptions()').then((data) => {
        res.send(data);
    })
})

router.put('/survey/update', (req, res, next) => {
    console.log(JSON.stringify(req.body))
    var img = req.body.image;
    var surveyId = req.body.surveyId;
    var fn = surveyId + '.png';
    fs.writeFile(path.join(__dirname, 'pics/' + fn),
        img, 'base64', (err) => {
        });
})

router.put('/questions/:questionId', (req, res, next) => {
    var qid = req.params.questionId;
    var que = req.body.question;
    db.any('select fn_updQuestions($1,$2)', [que, qid]).then((data) => {
        res.send({ message: "updated succesfully...." })
    })
})
router.delete('/cli/:qid', (req, res, next) => {
    var id = req.params.qid;
    db.any('select * from fn_delSurvey_Questions($1)', id).then((data) => {
        res.send({ "message": "deleted sucessfully...." })
    })
})

router.get('/survey', (req, res, next) => {
    db.any('select * from fn_getSurveyDetails()').then((data) => {
        console.log(data)
        for (var j = 0; j < data.length; j++) {
            var i = data[j].surveyId + '.png'
            data[j].image = "http://localhost:4500/" + i
            console.log(i)
            console.log("http://localhost:4500/" + i)
        }
        res.send(data);
    })
})
router.get('/survey/:id', (req, res, next) => {
    id = req.params.id
    db.any('select * from fn_getSurveyDetailsById($1)', id).then((data) => {
        var i = data[0].surveyId + '.png'
        data[0].image = "http://localhost:4500/" + i
        console.log(i)
        console.log("http://localhost:4500/" + i)
        res.send(data);
    })
})
router.get('/survey/client/:id', (req, res, next) => {
    id = req.params.id
    db.any('select * from fn_getSurveyDetailsByClientId($1)', id).then((data) => {
        for (var j = 0; j < data.length; j++) {
            var i = data[j].surveyId + '.png'
            data[j].image = "http://localhost:4500/" + i
            console.log(i)
            console.log("http://localhost:4500/" + i)
        }
        res.send(data);
    })
})
router.get('/survey/client/count/:cid', (req, res, next) => {
    id = req.params.cid
    db.any('select * from fn_getuserscount($1)', id).then((data) => {
        res.send(data);
    })
})

router.post('/survey', (req, res, next) => {
    var sname = req.body.surveyName;
    var cid = req.body.clientId;
    var sta = req.body.status;
    var rwd = req.body.rewards;
    var img = req.body.image;
    var oferid = req.body.offerId;
    db.any('select * from fn_addSurvey($1,$2,$3,$4,$5)',
        [sname, cid, sta, rwd, oferid]).then((data) => {
            res.send(data);
            console.log(data[0].fn_addsurvey)
            let survid = data[0].fn_addsurvey;
            var fn = survid + '.png';
            console.log(fn)
            fs.writeFile(path.join(__dirname, 'pics/' + fn),
                img, 'base64', (err) => {
                });
        })
})

router.delete('/survey/:id', (req, res, next) => {
    id = req.params.id
    db.any('select fn_delSurveyDetails($1)', id).then((data) => {
        res.send({ "message": "Recorded Deleted...." });
    })
})

router.put('/survey/:surveyId', (req, res, next) => {

    sid = req.params.surveyId;
    sname = req.body.surveyName;
    cid = req.body.clientId;
    sdate = req.body.startingDate;
    edate = req.body.endingDate;
    sta = req.body.status;
    rwd = req.body.rewards;
    oferid = req.body.offerId;

    db.any('select fn_updateSurveyDetails($1,$2,$3,$4,$5,$6,$7,$8)',
        [sid, sname, cid, sdate, edate, sta, rwd, oferid]).then((data) => {
            res.send({ "message": "upted sucessfully...." })
        })
})


router.put('/survey/update/ss', (req, res, next) => {
    console.log(JSON.stringify(req.body))

    var img = req.body.image;
    var surid = req.body.surveyId;
    var fn = surid + '.png';
    fs.writeFile(path.join(__dirname, 'pics/' + fn),
        img, 'base64', (err) => {
        });
})


router.get('/answer', (req, res, next) => {
    db.any("select * from  fn_getAllAnswers()").then((data) => {
        res.send(data)
    })
})

router.post('/answer', (req, res, next) => {
    console.log(req.body)
    uid = req.body.userId;
    sid = req.body.surveyId;
    qid = req.body.questionId;
    ans = req.body.answer;
    opt = req.body.option;
    db.any('select fn_addSurvey_answers($1,$2,$3,$4,$5)', [uid, sid, qid, ans, opt]).then((data) => {
        res.send({ 'message': 'insert successsfull' })
    })
})
router.put('/answer/:questionId', (req, res, next) => {
    ans = req.body.answer;
    qid = req.params.questionId;
    db.any('select fn_updSurvey_answers($1,$2)', [qid, ans]).then((data) => {
        res.send({ 'message': 'updated successsfull' })
    })
})
router.delete('/answer/:questionId', (req, res, next) => {
    id = req.params.questionId
    db.any('select  fn_delSurvey_answers($1)', id).then((data) => {
        res.send({ 'message': 'deleted' })
    })
})
router.get('/answer/:questionId', (req, res, next) => {
    id = req.params.questionId
    db.any('select * from  fn_getAllAnswersBy_qId($1)', id).then((data) => {
        res.send(data)
    })
})
router.get('/answer/g/:surveyId', (req, res, next) => {
    sid = req.params.surveyId
    db.any('select * from  fn_getAllAnswersBy_sId($1)', sid).then((data) => {
        res.send(data)
    })
})
router.get('/questionsMapping', (req, res, next) => {
    db.any('select * from  fn_selectMapping()').then((data) => {
        res.send(data)
    })
})

router.get('/product', (req, res, next) => {
    db.any("select * from  fn_getAllProducts()").then((data) => {
        res.send(data)
    })
})
router.post('/product', (req, res, next) => {
    console.log(req.body)
    pid = req.body.productId;
    pname = req.body.productName;
    mfdate = req.body.manufacturingDate;
    expdate = req.body.expiryDate;
    prc = req.body.price;
    qcode = req.body.qrCode;
    sid = req.body.surveyId;
    cid = req.body.clientId;
    pdesc = req.body.productDesc;
    brcode = req.body.barCode;
    db.any('select fn_addProduct($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
        [pid, pname, mfdate, expdate, prc, qcode, sid, cid, pdesc, brcode]).then((data) => {
            res.send({ 'message': 'insert successsfull' })
        })
})
router.put('/product/:productId', (req, res, next) => {
    pid = req.params.productId;
    mfdate = req.body.manufacturingDate;
    expdate = req.body.expiryDate;
    prc = req.body.price;
    pdesc = req.body.productDesc;
    db.any('select fn_updProduct($1,$2,$3,$4,$5)', [pid, mfdate, expdate, prc, pdesc]).then((data) => {
        res.send({ 'message': 'updated successsfully' })
    })
})
router.delete('/product/:productId', (req, res, next) => {
    id = req.params.productId
    db.any('select fn_delProduct($1)', id).then((data) => {
        res.send({ 'message': 'deleted successfully' })
    })
})
router.get('/product/:productId', (req, res, next) => {
    id = req.params.productId
    db.any('select * from  fn_getProductDtlsBy_pid($1)', id).then((data) => {
        res.send(data)
    })
})
router.post('/ratings', (req, res, next) => {
    var uid = req.body.userId;
    var sid = req.body.surveyId;
    var rate = req.body.rating;
    db.any("select fn_addRating($1,$2,$3)", [uid, sid, rate]).then((data) => {
        res.send({ "message": "inserted succesfully" })
    })
})

router.get('/ratings/:surveyId', (req, res, next) => {
    var sid = req.params.surveyId;
    db.any('select * from  fn_getRatings($1)', sid).then((data) => {
        res.send(data);
    })
})

router.get('/packageMapping', (req, res, next) => {
    db.any('select * from  fn_packageMapping()').then((data) => {
        res.send(data)
    })
})

router.post('/packageMapping', (req, res, next) => {
    var sid = req.body.surveyId;
    var pkid = req.body.pckId;
    var sta = req.body.status;
    var sdate = req.body.startingDate;
    var edate = req.body.endingDate;
    var off = req.body.offerId
    db.any('select fn_insertMapping($1,$2,$3,$4,$5,$6)', [sid, pkid, sta, sdate, edate, off]).then((data) => {
        res.send({ message: "data inserted succesfully...." })
    })
})

router.get('/sub/:qid', (req, res, next) => {
    var id = req.params.qid;
    db.any('select * from fn_getById_subQuestions($1)', id).then((data) => {
        res.send(data);
    })
})
router.post('/sub', (req, res, next) => {
    var sq = req.body.subQuestion;
    var qid = req.body.questionId;
    db.any('select * from fn_addSubQuestionnairs($1,$2)', [sq, qid]).then((data) => {
        res.send({ message: "data inserted succesfully...." })
    })
})
router.get('/questionModel', (req, res, next) => {
    db.any('select * from fn_getQuestionModel()').then((data) => {
        res.send(data)
    })
})
router.get('/questionModel/:sqId', (req, res, next) => {
    var id = req.params.sqId;
    db.any('select * from fn_getById_SubQuestionModel($1)', id).then((data) => {
        res.send(data);
    })
})
router.post('/questionModel', (req, res, next) => {
    var mt = req.body.modelType;
    db.any('select * from fn_addSubQuestionModel($1)', mt).then((data) => {
        res.send({ message: "data inserted succesfully...." })
    })
})
router.get('/queOpt', (req, res, next) => {
    db.any('select * from fn_getQueOpt()').then((data) => {
        res.send(data)
    })
})
router.get('/queoptions/:mid/:sid', (req, res, next) => {
    var mid = req.params.mid;
    var sid = req.params.sid;
    db.any('select * from fn_getQueoptionsById($1,$2)', [mid, sid]).then((data) => {
        res.send(data);
    })
})
router.get('/survey/category/:cid', (req, res, next) => {
    var catid = req.params.cid;
    db.any('select * from fn_getSurveyByCategory($1)', catid).then((data) => {
        res.send(data);
    })
})
module.exports = router