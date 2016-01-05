var queryString = require('querystring');
var express = require('express');
var url = require('url');
var _ = require('lodash');

var Facebook = require('../modules/facebook');
var Youtube = require('../modules/youtube');
var config = require('../../config');


var router = express.Router();

/* 
GET home page.
*/
router.get('/', function(req, res, next) {

    var facebook = new Facebook(config.facebook.key);
    var youtube = new Facebook(config.youtube.key);

    facebook.getUserFeed(
        function(result) {
            
            result = 
            _.chain(result)
            .filter(function(r) {
                return (r.link && r.link.indexOf('youtube') > 0) || (r.source && r.source.indexOf('youtube') > 0);
            })
            .pluck('link')
            .value();
            
            //youtube.get

            res.send(result);
        },
        function(error) {
            res.send(error);
        });
});

module.exports = router;