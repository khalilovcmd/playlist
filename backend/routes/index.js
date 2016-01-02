var express = require('express');
var router = express.Router();

var facebook = require('../modules/facebook');
var youtube = require('../modules/youtube');

/* 
GET home page.
*/
router.get('/', function(req, res, next) {

    var accessToken = 'CAAU7Ls8e584BALeCcTTjjZAMvHll7FJse3nDFNm61wudf4layGUjohN6PjtoN5qS4R8nkf4U5OahRYo292jXo9Y0N1ZB7LZAyTmN4OW09yOFZBwtjfjL8grsQmLoSWoDuChksQ18YPk3EgtgaEinTe0NUeCy99AC77U8BK8pXIXBAxx9CeXk6vGiSMYNJqx6OW7MneI9MZC9ZB1PuSc8q3';

    // facebook.getUserFeed(accessToken, function(result) {
    //     res.send(result);
    // }, function(error) {
    //     res.send(error);
    // });
    
    youtube._makeYoutubeResourceUrls(['asdasd', 'sdd']);

});

module.exports = router;