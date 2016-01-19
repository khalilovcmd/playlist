var _ = require('lodash')
var assert = require('assert')
var mongoose = require('mongoose')

var logger = require('./logger')
var config = require('../../config')

/**
 * 
 */
mongoose.connection.on('error', function(err) {
    logger.fatal('mongo connection error: ', err)
})

/**
 * 
 */
mongoose.connection.once('open', function() {
    logger.info('mongo connected.')
})

/**
 *
 */
mongoose.connect(config.mongo.connection);

/**
 * 
 */ 
var taskSchema = mongoose.Schema({
    userToken: String,
    userId: Number,
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    status: String
})

/**
 * 
 */ 
var playlistSchema = mongoose.Schema({
    userToken: String,
    userId: Number,
    created: {
        type: Date,
        default: Date.now
    },
    playlist: Object
})

var Task = mongoose.model('task', taskSchema)
var Playlist = mongoose.model('playlist', playlistSchema)

/**
 * 
 */ 
function Db() {}

/**
 * 
 */
Db.prototype.addTask = function(task, success, failure) {
    
    var t = new Task({
        userToken: task.userToken,
        userId: task.userId,
        status: 'started'
    })

    t.save(function(err) {

        if (err) {
            logger.fatal('addTask(): error: ', err)
            failure(err)
            return
        }

        logger.info('updateTask(): success.')
        success(t)

    });
}

/**
 * 
 */ 
Db.prototype.updateTask = function(task, success, failure) {
    
    assert.ok(_.some(['started', 'finished', 'failed', 'pending'], function(e) { return e == task.status }), 'status value is wrong')

    Task.update({
        userId: task.userId
    }, {
        status: task.status
    }, function(err, raw) {

        if (err) {
            logger.fatal('updateTask(): error: ', err)
            failure(err)
            return
        }

        logger.info('updateTask(): raw result: ', raw)
        success(raw)
    });
}

/**
 * 
 */ 
Db.prototype.addPlaylist = function() {}

/**
 * 
 */ 
Db.prototype.findPlaylist = function() {}

module.exports = {
    Db: Db,
    Task: Task,
    Playlist: Playlist
}
