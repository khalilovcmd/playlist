var queryString = require('querystring');
var express = require('express');
var async = require('async');
var _ = require('lodash');
var url = require('url');

var Facebook = require('../modules/facebook');
var Youtube = require('../modules/youtube');
var Extractor = require('../modules/extractor');
var config = require('../../config');

var router = express.Router();

/* 
GET home page.
*/
router.get('/', function(req, res, next) {

    var facebook = new Facebook(config.facebook.key);
    var youtube = new Youtube(config.youtube.key);
    var extractor = new Extractor();

    async.waterfall([
            function(next) {
                facebook.getUserFeed(
                    function(result) {
                        next(null, result);
                    },
                    function(error) {
                        next('error', error);
                    });
            },
            function(videos, next) {
                var result = extractor.extract(videos);
                
                if(result && result.length > 0)
                    next(null, result);
                else
                    next('error', 'no videos could be extracted.');
            },
            function(videos, next) {
                youtube.getVideos(videos,
                    function(result) {
                        next(null, result);
                    },
                    function(error) {
                        next('error', error);
                    });
            }
        ],
        function(state, result) {
            if (state)
                res.status(400).send(result);
            else
                res.status(200).send(result);
        });

});

module.exports = router;