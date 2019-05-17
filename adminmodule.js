var db = require('./config')
var express = require('express');
var promise = require('bluebird');
var bodyparser = require('body-parser');
var options = {
    promiseLib: promise
};
var pgp = require('pg-promise')(options);

var fs = require('fs');
var path = require('path');

var router = express();

router.use(bodyparser.urlencoded({ limit: '20mb', extended: true }));
router.use(bodyparser.json({ limit: '20mb', extended: true }));

router.get('/package', (req, res, next) => {
    db.any('Select * from  fn_getPackageDetails()').then((data) => {
        res.send(data);
    })
})

router.get('/package/:id', (req, res, next) => {
    id = req.params.id
    db.any('select  * from  fn_getPackageById($1)', id).then((data) => {
        res.send(data);
    })
})
router.get('/package/offer/:id', (req, res, next) => {
    id = req.params.id
    db.any('Select * from  fn_getPkgById($1)', id).then((data) => {
        res.send(data);
    })
})
router.post('/package', (req, res, next) => {
    pkgname = req.body.pckName;
    pdurtn = req.body.pckDuration;
    pprc = req.body.pckPrice;
    pdesc = req.body.pckDescription;

    db.any('select fn_addPackage($1,$2,$3,$4)',
        [pkgname, pdurtn, pprc, pdesc]).then((data) => {
            res.send({ message: "Record Inserted Successs.." });
        })
})

router.delete('/package/:id', (req, res, next) => {
    id = req.params.id
    db.any('select fn_delPackageDetails($1)', id).then((data) => {
        res.send({ "message": "Recorded Deleted...." });
    })
})

router.put('/package/:pckId', (req, res, next) => {
    pid = req.params.pckId;
    pkname = req.body.pckName;
    pdurtn = req.body.pckDuration;
    pprc = req.body.pckPrice;
    pdesc = req.body.pckDescription;

    db.any('select fn_updPackage($1,$2,$3,$4,$5)',
        [pid, pkname, pdurtn, pprc, pdesc]).then((data) => {
            res.send({ "message": "updated sucessfully...." })
        })
})

router.get('/offer', (req, res, next) => {
    db.any('select * from  fn_getPackageOfferDetails()').then((data) => {
        res.send(data)

    })
})



router.post('/offer', (req, res, next) => {
    sts = req.body.status;
    offrname = req.body.offerName;
    discnt = req.body.discount;
    pid = [] = req.body.packages;
    console.log(pid)
    db.any('select fn_addPackageOffer($1,$2,$3,$4)',
        [offrname, discnt, sts, pid]).then((data) => {
            res.send({ 'message': 'insert successsfull' })
        })
})
router.put('/offer', (req, res, next) => {
    console.log(req.body)
    offrid = req.body.offerId;
    offrname = req.body.offerName;
    discnt = req.body.discount;
    sta = req.body.status
    db.any('select fn_updPackageOffer($1,$2,$3,$4)', [offrid, offrname, discnt, sta]).then((data) => {
        res.send({ 'message': 'updated successsfully' })
    })
})
router.delete('/offer/:offerId', (req, res, next) => {
    offrid = req.params.offerId
    db.any('select fn_delPackageOffer($1)', offrid).then((data) => {
        res.send({ 'message': 'deleted successfully' })
    })
})
router.get('/offer/:offerId', (req, res, next) => {
    offrid = req.params.offerId
    db.any('select * from  fn_getPackageOfferById($1)', offrid).then((data) => {
        res.send(data)
    })
})

router.get('/adm/:uname/:pwd', (req, res, next) => {
    var uname = req.params.uname;
    var pwd = req.params.pwd;
    db.any('select * from  fn_adminLogin($1,$2)', [uname, pwd]).then((data) => {
        res.send(data)
    })
})

module.exports = router