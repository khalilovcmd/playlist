var express = require('express');
var unirest = require('unirest');
var async = require('async');

var Facebook = require('../modules/facebook');
var Youtube = require('../modules/youtube');
var Extractor = require('../modules/extractor');
var config = require('../../config');

var router = express.Router();

/* 
GET home page.
*/
router.get('/', function(req, res, next) {

    if (req.query && req.query.code) {
        unirest
            .get('https://graph.facebook.com/v2.5/oauth/access_token?client_id=' + config.facebook.appId + '&redirect_uri=http://playlist.khalilovcmd.c9users.io/&client_secret=' + config.facebook.appSecret + '&code=' + req.query.code)
            .end(function(response) {

                var result = JSON.parse(response.raw_body);

                if (result && result.access_token && !result.error) {
                    
                    res.cookie('token', result.access_token, {
                        maxAge: 900000,
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
            res.render('playlist', {
                title: 'some title'
            })
        }
        else {
            res.render('home', {
                title: 'some title'
            });
        }
    }

    // var facebook = new Facebook(config.facebook.key);
    // var youtube = new Youtube(config.youtube.key);
    // var extractor = new Extractor();

    // async.waterfall([

    //         /**
    //          * 
    //          */
    //         function(next) {
    //             facebook.getUserFeed(
    //                 function(result) {
    //                     next(null, result);
    //                 },
    //                 function(error) {
    //                     next('error', error);
    //                 });
    //         },

    //         /**
    //          * 
    //          */
    //         function(videos, next) {
    //             var result = extractor.extract(videos);

    //             if (result && result.length > 0)
    //                 next(null, result);
    //             else
    //                 next('error', 'no videos could be extracted.');
    //         },

    //         /**
    //          * 
    //          */
    //         function(videos, next) {
    //             youtube.getVideos(videos,
    //                 function(result) {
    //                     next(null, result);
    //                 },
    //                 function(error) {
    //                     next('error', error);
    //                 });
    //         }
    //     ],

    //     /**
    //      * 
    //      */
    //     function(state, result) {
    //         if (state)
    //             res.status(400).send(result);
    //         else
    //             res.status(200).send(result);
    //     });

    //res.send('great!');

});

module.exports = router;