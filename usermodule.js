
var db = require('./config')
var fs = require('fs')
var path = require('path')
var express = require('express')

var bodyparser = require('body-parser')
var router = express.Router()

router.use(bodyparser.urlencoded({limit:'20mb',extended: true }))
router.use(bodyparser.json({limit:'20mb',extended: true }))


router.get('/user', (req, res, next) => {
    db.any('select * from  fn_getAll()').then((data) => {
        res.send(data)
    })
})

router.get('/user/:emailId', (req, res, next) => {
    var id = req.params.emailId
    db.any('select * from fn_getDetails($1)', id).then((data) => {
        res.send(data)
    })
})
router.get('/user/login/:emailId/:ip', (req, res, next) => {
    var id = req.params.emailId;
    var ip = req.params.ip;
    db.any('select * from fn_loginCheck($1,$2)', [id, ip]).then((data) => {
        res.send(data)
    })
})
router.get('/user/forgot/:emailid/:userid', (req, res, next) =>  {
    var id = req.params.emailid; 
    var ip = req.params.userid; 
   db.any('select * from fn_forgotPwd($1,$2)', [id, ip]).then((data) =>  {
        res.send(data)
        var pass = data[0].pwd
        console.log(pass)
    const nodemailer = require('nodemailer'); 
    let transporter = nodemailer.createTransport( {
        host:'smtp.gmail.com', 
        port:587, 
        secure:false, 
        requireTLS:true, 
        auth: {
            user:"getsurvunic@gmail.com", 
            pass:"getsurv@123"
        }
    }); 
    let mailOptions =  {
        from:'getsurvunic@gmail.com', 
        to:id, 
        subject:'user id of get surv', 
        text:pass
    }; 
    transporter.sendMail(mailOptions, (error, info) =>  {
        if (error) {
            return console.log(error.message); 
        }
        console.log('success'); 
        }); 
    })   
})


router.put('/user/:emailid', (req, res, next) => {
    var eid = req.params.emailid
    var opwd = req.body.password
    var npwd = req.body.newPassword
    db.any("select fn_changePwd($1,$2,$3)", [opwd, eid, npwd]).then((data) => {
        res.send(data)
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
    var stte = req.body.state;
    var cty = req.body.city;
    var zpcode = req.body.zipCode;
    var usrtyp = req.body.typeOfUser;
    var img = req.body.image;
    console.log(img)
    db.any("select fn_userAdd($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)", [fname, lname, eid, pwd, mno, gen, adrs, cntry, stte, cty, zpcode, usrtyp]).then((data) => {
        if(data[0].fn_useradd==='0'){
            console.log(data)
            res.send([{"message":"data insertion failure"}])
        }
        else{
        res.send([{ "message": "inserted succesfully" }])
         console.log(data)
        const nodeMailer = require('nodemailer');
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
            subject: 'User id of get surv',
            html: `Greetings of the day....
    <h1 style="font-color:blue">Welcome to GetSurv</h1>
    <p>GetSurv is the online survey application By unicsol India Pvt Ltd.</p>
    <a href="http://localhost:4200/login">click here</a> To Login</br>
    <p>Thanks for using GetSurv</p>
    <p> your user id is : `+data[0].fn_useradd ,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error.message);
            }
            console.log('success');
        });
        var userId=data[0].fn_useradd;
           var fn = userId+'.png';
           fs.writeFile(path.join(__dirname, 'pics/' + fn),
               img,'base64',(err) => {
               });
            }
            })
})
router.put('/user/update/:userId',(req,res,next)=>{
    var uid=req.params.userId;
    var eid=req.body.emailId;
    var cntry=req.body.country;
    var stte=req.body.state;
    var cty=req.body.city;
    var adrs=req.body.address;
    var mbno=req.body.mobileNo;
    var zpcode=req.body.zipCode;
    db.any("select fn_userUpdate($1,$2,$3,$4,$5,$6,$7,$8)",[eid,cntry,stte,cty,adrs,mbno,zpcode,uid]).then((data)=>{
        res.send({ "message": "updated succesfully" })
    })
    
    })
router.get('/r/w/e/rewards/:userId', (req, res, next) => {
    var id = req.params.userId;
    db.any('select * from  fn_getRewards($1)', id).then((data) => {
        res.send(data);
    })
})
router.get('/r/w/e/survey/count/:userId',(req,res,next)=>{
    var id=req.params.userId;
    db.any('select * from fn_getSurveyCount($1)',id).then((data)=>{
        res.send(data);
    })
})

router.get('/feedbackDetails',(req,res,next)=>{
    db.any('select * from fn_getFeedBack()').then((data)=>{
        res.send(data)
    })
})
router.post('/feed',(req,res,next)=>{
    var uid=req.body.userid;
    var ratng=req.body.rating;
    var revew=req.body.review;
   db.any("select fn_insertFeedback($1,$2,$3)",[uid,ratng,revew]).then((data)=>{
       res.send({"message":"inserted succesfully"})
   })
})

//---------------user surveys API-----------------------//


router.get('/trend',(req,res,next)=>{
    db.any('select * from fn_trendingSurveys()').then((data)=>{
        res.send(data)
    })
})

router.get('/usurvey',(req,res,next)=>{
    db.any('select * from fn_upcomingSurveys()').then((data)=>{
        res.send(data)
    })
})

router.get('/ongoing',(req,res,next)=>{
    db.any('select * from fn_ongoingSurveys()').then((data)=>{
        res.send(data)
    })
})

router.get('/completed',(req,res,next)=>{
    db.any('select * from fn_completedSurveys()').then((data)=>{
        res.send((data))
    })
})

//---------------------------update image----------------------//

router.put('/user/u/update', (req, res, next) => {
    console.log(JSON.stringify(req.body))

    var img = req.body.image;
    var userid = req.body.uid;
    var fn = userid + '.png';
    fs.writeFile(path.join(__dirname, 'pics/' + fn),
    img, 'base64', (err) => {
    });
})
// to get names'
router.get('/names/:cid/:sid/:ciid',(req,res,next)=>{
    var coid = parseInt(req.params.cid);
    var stid = parseInt(req.params.sid);
    var citid = parseInt(req.params.ciid);
    db.any('select * from fn_getNames($1,$2,$3)',[coid,stid,citid]).then((data)=>{
        res.send(data)
    })
})


module.exports = router 