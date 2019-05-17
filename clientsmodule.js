var db = require('./config')
var fs = require('fs')
var path = require('path')
var express = require('express')

var bodyparser = require('body-parser')
var router = express.Router()

router.use(bodyparser.urlencoded({ limit: '10mb', extended: true }))
router.use(bodyparser.json({ limit: '10mb', extended: true }))

router.get('/cli', (req, res, next) => {
    db.any('select * from  fn_getClientFrim() ').then((data) => {

        res.send(data);
    })
})

router.get('/cli/:cId', (req, res, next) => {
    id = req.params.cId
    db.any('select * from  fn_getClientFrimById($1)', id).then((data) => {
        res.send(data);
    })
})


router.get('/cli/ss/:fId', (req, res, next) => {
    id = req.params.fId
    db.any('select * from  fn_getFrimDetailsByFirmId($1)', id).then((data) => {
        res.send(data);
    })
})


router.put('/cli', (req, res, next) => {

    console.log(req.body)
    cid = req.body[0].clientid;
    fid = req.body[0].firmid;
    frname = req.body[0].firmname;
    descptn = req.body[0].description;
    pfirm = req.body[0].parentfirm;
    adrs = req.body[0].address;
    cty = req.body[0].city;
    stte = req.body[0].state;
    cntry = req.body[0].country;
    zpcode = req.body[0].zipcode;

    db.any('select fn_updateClient($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
        [frname, descptn, pfirm, adrs, cty, stte, cntry, zpcode, cid, fid]).then((data) => {
            res.send({ "message": "updated sucessfully...." })
        })
})
router.post('/user', (req, res, next) => {
    var fname = req.body.firstName;
    var lname = req.body.lastName;
    var eid = req.body.emailId
    var pwd = req.body.password
    var mno = req.body.mobileNo
    var gen = req.body.gender
    var adrs = req.body.address
    var cntry = req.body.country;
    var ste = req.body.state;
    var cty = req.body.city;
    var zcode = req.body.zipCode;
    var typ = req.body.typeOfUser;
    var img = req.body.image;
    var frname = req.body.firmName;
    var estbyear = req.body.establishedYear;
    var descptn = req.body.description;
    var pfirm = req.body.parentFirm;
    var fadrs = req.body.faddress;
    var fcty = req.body.fcity;
    var stte = req.body.fstate;
    var fcntry = req.body.fcountry;
    var zpcode = req.body.fzipCode;
    db.any("select fn_clientAdd($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)",
        [fname, lname, eid, pwd, mno, gen, adrs, cntry, ste, cty, zcode, typ, frname, estbyear, descptn, pfirm,
            fadrs, fcty, stte, fcntry, zpcode]).then((data) => {
                res.send({ "message": "inserted succesfully" })
                const nodeMailer = require('nodeMailer');
                let transporter = nodeMailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    requireTLS: true,
                    auth: {
                        user: "getsurvunic@gmail.com",
                        pass: "getsurv@123"
                    }
                });
                let mailOptions = {
                    from: 'getsurvunic@gmail.com',
                    to: req.body.emailId,
                    subject: 'Test',
                    html: `Greetings of the day....
    <h1 style="font-color:blue">Welcome to GetSurv</h1>
    <p>GetSurv is the online survey application By unicsol India Pvt Ltd.</p>
    <a href="http://localhost:4200/login">click here</a> To Login</br>
    <p>Thanks for using GetSurv</p>
    <p> your user id is : `+ data[0].fn_clientAdd,
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error.message);
                    }
                    console.log('success');
                });
                var userId = data[0].fn_clientadd;
                var fn = userId + '.png';
                fs.writeFile(path.join(__dirname, 'pics/' + fn),
                    img, 'base64', (err) => {
                    });
            })
})
router.get('/cat', (req, res, next) => {
   
    db.any("select * from fn_getallcategories()").then((data) => {
        res.send(data);
    })
})

router.get('/category/:cat', (req, res, next) => {
    ct = req.params.cat;
    db.any("select * from fn_getCategoryName($1)", ct).then((data) => {
        res.send(data);
    })
})
router.get('/details/:eid', (req, res, next) => {
    email = req.params.eid;
    db.any('select * from fn_clientDetails($1)', email).then((data) => {
        res.send(data)
    })
})
router.delete('/cli/:qid', (req, res, next) => {
    var id = req.params.qid;
    db.any('select * from fn_delSurvey_Questions($1)', id).then((data) => {
        res.send({ "message": "deleted sucessfully...." })
    })
})
router.post('/cli/:addFirm', (req, res, next) => {
    console.log(JSON.stringify(req.body))
    cid = req.body.clientId;
    frname = req.body.firmName;
    estbyear = req.body.establishedYear;
    descptn = req.body.description;
    pfirm = req.body.parentFirm;
    cat = req.body.category;
    adrs = req.body.faddress;
    cty = req.body.fcity;
    stte = req.body.fstate;
    cntry = req.body.fcountry;
    zpcode = req.body.fzipCode;
    type= req.body.typeOfUser;

    db.any('select fn_addcfirm($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',
        [cid, frname, estbyear, descptn, pfirm,cat, adrs, cty, stte, cntry, zpcode,type]).then((data) => {
            res.send({ "message": "inserted sucessfully...." })
        })
})
module.exports = router