var unirest = require('unirest');
var async = require('async');
var _ = require('lodash');

var logger = require('./logger');

function Youtube(key) {
    this.key = key;

}

Youtube.prototype._getMusicVideosOnly = function(videos) {

    logger.trace('_getMusicVideosOnly(): filter music videos only. Videos length: %d', videos ? videos.length : 0)

    var result = [];

    try {
        result =
            _.chain(videos)
            .reject(function(v) {
                return v.snippet.categoryId != 10;
            })
            .map(function(v) {
                return {
                    id: v.id,
                    publishedAt: v.snippet.publishedAt,
                    title: v.snippet.title,
                    description: v.snippet.description
                }
            })
            .value();
    }
    catch (err) {
        logger.fatal(err);
    }

    return result;
}

Youtube.prototype._getYoutubeVideoResource = function(data, urls, success, failure) {


    logger.trace('_getYoutubeVideoResource(): fetching youtube video resource. urls length: %s, data length: %d', url ? url.length : 0, data ? data.length : 0)

    var self = this;

    if (urls && urls.length > 0) {

        var url = _.first(urls);
        urls = _.rest(urls);

        logger.info('_getYoutubeVideoResource(): fetching this url: %s', url)

        unirest
            .get(url)
            .header('content-type', 'application/json')
            .end(function(response) {

                response = JSON.parse(response.raw_body);

                if (response && response.items && !response.error) {
                    logger.info('_getYoutubeVideoResource(): fetched videos response.items.length: %d', response.items.length)
                    data = data.concat(response.items);
                    self._getYoutubeVideoResource(data, urls, success, failure);
                }
                else {
                    logger.warn('_getYoutubeVideoResource(): response.err: %s', response.error)
                    failure(response.error);
                }

            });
    }
    else {
        if (data && data.length > 0)
            success(data);
        else
            failure("couldn't fetch any data.");
    }
}

Youtube.prototype._makeYoutubeVideoResourceUrl = function(ids) {

    var self = this;

    var urls = [];
    var base = 'https://www.googleapis.com/';
    var resource = 'youtube/v3/videos';

    if (ids && ids.length > 0) {
        for (var i = 0; i < ids.length; i += 50) {
            var current = _.slice(ids, i, i + 50).join(",");
            var url = base + resource + '?' + 'part=snippet' + '&' + 'id=' + current + '&' + 'key=' + self.key;
            urls.push(url);
        }
    }

    return urls;
}

Youtube.prototype.getVideos = function(ids, success, failure) {

    var self = this;

    async.waterfall([
        function(next) {

            var result = self._makeYoutubeVideoResourceUrl(ids);

            if (result && result.length > 0)
                next(null, result);
            else
                next('error', 'there is an error during creation of youtube api urls.');
        },
        function(urls, next) {
            self._getYoutubeVideoResource([], urls,
                function(result) {
                    next(null, result);
                },
                function(failure) {
                    next('error', failure);
                });
        },
        function(videos, next) {
            var result = self._getMusicVideosOnly(videos);

            if (result && result.length > 0)
                next(null, result);
            else
                next('error', 'there is an error during filtering of youtube music only videos.');

        }
    ], function(state, result) {
        if (state)
            failure(result);
        else
            success(result);
    });

}

module.exports = Youtube;