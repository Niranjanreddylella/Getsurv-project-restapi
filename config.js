var promise = require('bluebird')
var option = {
    promiseLib: promise
};
var pgp = require('pg-promise')(option)
var conString ="postgres://postgres:root@192.168.143.129/getsurv"
var db = pgp(conString);
module.exports = db