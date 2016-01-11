var express = require('express');
var unirest = require('unirest');
var url = require('url');

var Facebook = require('../modules/facebook');
var Worker = require('../modules/worker');
var redis = require('../modules/redis');

var config = require('../../config');

var router = express.Router();

router.get('/progress/', function(req, res, next) {

    if (req.cookies && req.cookies.token) {
        redis.get(req.cookies.token, function(err, response) {
            res.json(response);
        });
    }
    else {
        res.status(404).end();
    }

})

router.get('/playlist', function(req, res, next) {})

/* 
GET home page.

*/
router.get('/', function(req, res, next) {

    if (req.query && req.query.code) {

        unirest
            .get('https://graph.facebook.com/v2.5/oauth/access_token?' +
                'client_id=' + config.facebook.appId +
                '&redirect_uri=' + config.facebook.redirect_uri +
                '&client_secret=' + config.facebook.appSecret +
                '&code=' + req.query.code)
            .end(function(response) {

                var result = JSON.parse(response.raw_body);

                if (result && result.access_token && !result.error) {

                    new Worker({
                            facebook: result.access_token,
                            youtube: config.youtube.key
                        })
                        .work();


                    res.cookie('token', result.access_token, {
                        maxAge: 2592000000,
                        httpOnly: true
                    });

                    res.render('waiting', {
                        title: 'some title'
                    });


                }
                else {
                    res.status(400).send('no token received.');
                }

            });
    }
    else {

        if (req.cookies && req.cookies.token) {
            res.render('waiting', {
                title: 'some title'
            })
        }
        else {
            res.render('home', {
                title: 'some title'
            });
        }
    }


});

module.exports = router;