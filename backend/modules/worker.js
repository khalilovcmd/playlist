var unirest = require('unirest');
var async = require('async');

var Facebook = require('./facebook');
var Youtube = require('./youtube');
var Extractor = require('./extractor');
var redis = require('./redis');
var logger = require('./logger');

function Worker(credentials) {

    var credentials = credentials || {}

    this.facebook = credentials.facebook;
    this.youtube = credentials.youtube;
}

Worker.prototype.work = function() {

    logger.trace('work(): start the worker.')

    var self = this;

    var facebook = new Facebook(self.facebook);
    var youtube = new Youtube(self.youtube);
    var extractor = new Extractor();

    async.waterfall([

            /**
             * 
             */
            function(next) {

                logger.info('work() async phase 1 to facebook.getUserFeed()')

                facebook.getUserFeed(
                    function(result) {
                        next(null, result);
                    },
                    function(error) {
                        next('error', error);
                    });
            },

            /**
             * 
             */
            function(result, next) {

                logger.info('work() async phase 2 to extractor.extract(). user name is: %s facebook posts length: %d', result.user.name, result.videos ? result.videos.length : 0)

                var result = extractor.extract(result.videos)

                if (result && result.length > 0)
                    next(null, {
                        user: result.user,
                        videos: result
                    })
                else
                    next('error', 'no videos could be extracted.')
            },

            /**
             * 
             */
            function(result, next) {

                logger.info('work() async phase 3 to youtube.getVideos(). Videos length: %d', result.videos ? result.videos.length : 0)

                youtube.getVideos(result.videos,
                    function(result) {
                        next(null, {
                            user: result.user,
                            videos: result
                        });
                    },
                    function(error) {
                        next('error', error)
                    });
            },

            function(result, next) {
                redis.setex(self.facebook, 10000, JSON.stringify(result),
                    function(err, response) {
                        if (err) {
                            logger.warn('work() async phase 4 to redis.setex() error is: %j, response is: %j', err, response)
                            next('error', err)
                        }

                        logger.info('work() async phase 4 to redis.setex() response is: %j', response)
                        next(null, response)
                    })
            }
        ],

        /**
         * 
         */
        function(state, result) {
            if (state && state == 'error') {
                logger.warn('work() async result error. Videos length: %j', result)
            }
            else {
                logger.info('work() async result success. response: %j', result)
            }
        });
}


module.exports = Worker;