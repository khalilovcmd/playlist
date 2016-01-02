var express = require('express');
var router = express.Router();

var facebook = require('../modules/facebook');

/* 
GET home page.
*/
router.get('/', function(req, res, next) {

    var accessToken = '';

    facebook.getUserFeed(accessToken, function(error, result) {

        if (error)
            res.send(error);

        res.send(result);
    });

});

module.exports = router;