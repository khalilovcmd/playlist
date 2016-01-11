var expect = require('chai').expect;

var config = require('../config');
var Youtube = require('../backend/modules/youtube');


describe('youtube module test', function() {

    /**
     * to test if it can generate a valid youtube resource url
     */
    it('it should return a list of valid urls', function() {
        var result = new Youtube(config.tests.youtubeKey)._makeYoutubeVideoResourceUrl(['asd', 'sss']);
        expect(result).to.include('https://www.googleapis.com/youtube/v3/videos?part=snippet&id=asd,sss&key=' + config.youtube.key);
    });

    /**
     * to test if it can return three urls for an input of 250 ids
     */
    it('it should return a list of three urls (input is 250 ids)', function() {

        var ids = [];

        for (var i = 0; i < 250; i++)
            ids.push(i.toString());

        var result = new Youtube(config.tests.youtubeKey)._makeYoutubeVideoResourceUrl(ids);
        expect(result.length == 5).to.be.ok;
    });

    /**
     * 
     */
    it('it should return an array of two youtube video objects', function(done) {

        var urls = ['https://www.googleapis.com/youtube/v3/videos?part=snippet&id=lk5iMgG-WJI,agVpq_XXRmU&key=' + config.youtube.key];

        new Youtube(config.tests.youtubeKey)._getYoutubeVideoResource([], urls,
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

    /**
     * 
     */ 
    it('it should return an array of three youtube video objects which are category 10 (music)', function(done) {

        var ids = ['lk5iMgG-WJI', 'agVpq_XXRmU', 'sToOUzFsVLw', 'vqOnUB9gnDM'];

        new Youtube(config.tests.youtubeKey).getVideos(ids,
            function(result) {
                expect(result).not.to.be.null;
                expect(result.length == 3).to.be.ok;
                done();
            },
            function(error) {
                expect(error).to.be.null;
                done();
            });

    });

    /**
     * 
     */
    it('it shouldnt return any videos (because of empty youtube video ids)', function(done) {

        var ids = [];

        new Youtube(config.tests.youtubeKey).getVideos(ids,
            function(result) {
                expect(result).to.be.null;
                done();
            },
            function(error) {
                expect(error).to.not.be.null;
                done();
            });

    });

    /**
     * 
     */
    it('it shouldnt return any videos (because of wrong youtube video ids)', function(done) {

        var ids = ['1', '2', '3', '4'];

        new Youtube(config.tests.youtubeKey).getVideos(ids,
            function(result) {
                expect(result).to.be.null;
                done();
            },
            function(error) {
                expect(error).to.not.be.null;
                done();
            });

    });


});