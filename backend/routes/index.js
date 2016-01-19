var express = require('express');
var unirest = require('unirest');
var async = require('async');

var Facebook = require('../modules/facebook');
var Worker = require('../modules/worker');
var redis = require('../modules/redis');
var mongo = require('../modules/mongo');

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

    if (req.query && req.query.error) {

        /**
         * render 'home' view with error
         */
        res.render('home', {
            title: 'error!',
            content: req.query.error + ' - ' + req.query.error_description + ' - ' + req.query.error_reason
        });

    }
    else if (req.query && req.query.code) {



        async.waterfall([function(next) {

                    /**
                     * get facebook accessToken
                     */

                    var opts = {
                        appId: config.facebook.appId,
                        redirect_uri: config.facebook.redirect_uri,
                        appSecret: config.facebook.appSecret,
                        code: req.query.code
                    }

                    new Facebook().getAccessToken(opts,
                        function(result) {
                            next(null, result)
                        },
                        function(error) {
                            next('error', error)
                        })

                },
                function(token, next) {

                    /**
                     * get user's facebook id
                     */

                    new Facebook(token).getUserMe(
                        function(result) {
                            next(null, {
                                id: result,
                                token: token
                            })
                        },
                        function(error) {
                            next('error', error)
                        })

                },
                function(user, next) {
                    /**
                     * start worker to 
                     */
                    new Worker({
                        
                        facebook: user.token,
                        youtube: config.youtube.key
                    }).work()
                },
                function(token, next) {



                }
            ],
            function(state, result) {
                //if (state == 'error')
            })

    }
    else {

        if (req.cookies && req.cookies.token) {

            /**
             * 
             */
            res.render('playlist', {
                title: 'some title'
            })
        }
        else {

            /**
             * 
             */
            res.render('home', {
                title: 'new!',
                content: 'no cookies, no errors, no code, it is a new brave world!'
            });
        }
    }

});

module.exports = router;