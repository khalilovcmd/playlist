var assert = require('assert')
var expect = require('chai').expect
var validator = require('validator')

var config = require('../config')

var Db = require('../backend/modules/mongo').Db
var Task = require('../backend/modules/mongo').Task
var Playlist = require('../backend/modules/mongo').Playlist

describe('mongo module test', function() {

    describe('Tasks', function() {

        before(function() {

        });

        after(function() {

            Task.remove({
                userId: 0
            }, function(err) {});

        });

        it('it should save a task',
            function(done) {
                new Db().addTask({
                        userToken: 'test_token',
                        userId: 0
                    },
                    function(result) {
                        expect(result).to.be.ok
                        done()
                    },
                    function(error) {
                        expect(error).to.be.null
                        done()
                    })
            })

        it('it should update a task',
            function(done) {
                new Db().updateTask({
                        userId: 0,
                        status: 'finished'
                    },
                    function(result) {
                        expect(result).to.be.ok
                        done()
                    },
                    function(error) {
                        expect(error).to.be.null
                        done()
                    })
            })

        it('it should throw an exception because of wrong "status"',
            function() {

                expect(new Db().updateTask.bind(null, {
                        userId: 0,
                        status: 'new status'
                    },
                    function(result) {},
                    function(error) {})).to.throw(assert.AssertionError)
            })

        it('it should in zero number-of-modified (nModified) objects',
            function(done) {

                new Db().updateTask({
                        userId: -1,
                        status: 'finished'
                    },
                    function(result) {
                        expect(result).to.be.ok
                        expect(result.nModified === 0).to.be.ok
                        done()
                    },
                    function(error) {
                        expect(error).to.be.null
                        done()
                    })
            })
    })

})