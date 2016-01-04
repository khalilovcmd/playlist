var expect = require('chai').expect;

var config = require('../config');
var youtube = require('../backend/modules/youtube');


describe('youtube module test', function() {

    /**
     * to test if it can generate a valid youtube resource url
     */
    it('it should return a list of valid urls', function() {
        var result = youtube._makeYoutubeVideoResourceUrl(['asd', 'sss']);
        expect(result).to.include('https://www.googleapis.com/youtube/v3/videos?part=snippet&id=asd,sss&key=' + config.youtube.key);
    });

    /**
     * to test if it can return three urls for an input of 250 ids
     */
    it('it should return a list of three urls (input is 250 ids)', function() {

        var ids = [];

        for (var i = 0; i < 250; i++)
            ids.push(i.toString());

        var result = youtube._makeYoutubeVideoResourceUrl(ids);
        expect(result.length == 5).to.be.ok;
    });


    it('it should return an array of two youtube video objects', function(done) {

        var urls = ['https://www.googleapis.com/youtube/v3/videos?part=snippet&id=lk5iMgG-WJI,agVpq_XXRmU&key=' + config.youtube.key];

        youtube._getYoutubeVideoResource([], urls,
            function(result) {
                expect(result).not.to.be.null;
                expect(result.length == 2).to.be.ok;
                done();
            },
            function(error) {
                expect(error).to.be.null;
                done();
            });

    });




});