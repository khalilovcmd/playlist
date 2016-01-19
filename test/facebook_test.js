var assert = require('assert')
var expect = require('chai').expect
var validator = require('validator')

var config = require('../config')
var Facebook = require('../backend/modules/facebook')


describe('facebook module test', function() {

    describe('Token', function() {

        it('it should fail because of wrong token',
            function(done) {
                var facebook = new Facebook('weird_token_is_weird')
                facebook.getUserMe(
                    function(res) {
                        expect(res).to.be.null
                        done()
                    },
                    function(err) {
                        expect(err).to.be.ok
                        done()
                    })
            })
    })

    describe('_makeFacebookResourceUrl()', function() {

        it('it should throw an exception because of null argument',
            function() {
                var facebook = new Facebook(config.tests.facebookAccessToken)

                expect(facebook._makeFacebookResourceUrl.bind(null)).to.throw(assert.AssertionError)
            })

        it('it should throw an exception because of missing "base" parameter',
            function() {
                var facebook = new Facebook(config.tests.facebookAccessToken)

                expect(facebook._makeFacebookResourceUrl.bind(null, {
                    resource: 'me/',
                    fields: 'id,name'
                })).to.throw(assert.AssertionError)
            })

        it('it should return a facebook resource url (for fetching /me resource)',
            function() {
                var facebook = new Facebook(config.tests.facebookAccessToken)
                var result = facebook._makeFacebookResourceUrl({
                    base: 'https://graph.facebook.com/v2.5/',
                    resource: 'me/',
                    fields: 'id,name'
                })

                expect(validator.isURL(result)).to.be.ok
            })
    })

    describe('getUserMe()', function() {

        it('it should return user\'s { id : "", name : "" } properties',
            function(done) {
                var facebook = new Facebook(config.tests.facebookAccessToken)
                facebook.getUserMe(
                    function(res) {
                        expect(res).to.be.ok
                        expect(res.id).to.be.ok
                        expect(res.name).to.be.ok
                        done()
                    },
                    function(err) {
                        expect(err).to.be.null
                        done()
                    })

            })

        it('it should return error because of invalid token',
            function(done) {
                var facebook = new Facebook('weird_token_is_weird')
                facebook.getUserMe(
                    function(res) {
                        expect(res).to.be.null
                        done()
                    },
                    function(err) {
                        expect(err).to.be.ok
                        done()
                    })
            })
    })

    describe('getUserFeed()', function() {

        it('it should return 13 feed posts',
            function(done) {
                var facebook = new Facebook(config.tests.facebookAccessToken)
                facebook.getUserFeed(
                    function(res) {
                        expect(res).to.be.ok
                        expect(res.videos).to.be.ok
                        expect(res.videos.length).to.be.equal(13)
                        done()
                    },
                    function(err) {
                        expect(err).to.be.null
                        done()
                    })
            })

        it('it should return error because of invalid token',
            function(done) {
                var facebook = new Facebook('weird_token_is_weird')
                facebook.getUserFeed(
                    function(res) {
                        expect(res).to.be.null
                        done()
                    },
                    function(err) {
                        expect(err).to.be.ok
                        done()
                    })
            })
    })


    describe('getAccessToken()', function() {

        it('it should return error because "code" is invalid',
            function(done) {
                var facebook = new Facebook(config.tests.facebookAccessToken)
                facebook.getUserFeed(
                    function(res) {
                        expect(res).to.be.null
                        done()
                    },
                    function(err) {
                        expect(err).to.be.ok
                        done()
                    })
            })

    })

})