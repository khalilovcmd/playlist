var unirest = require('unirest');
var async = require('async');
var _ = require('lodash');

function Youtube(key) {
    this.key = key;

}

Youtube.prototype._getMusicVideosOnly = function(videos) {
    return _.reject(videos, function(n) {
        return n.snippet.categoryId != 10;
    })
}

Youtube.prototype._getYoutubeVideoResource = function(data, urls, success, failure) {

    var self = this;

    if (urls && urls.length > 0) {

        var url = _.first(urls);
        urls = _.rest(urls);

        unirest
            .get(url)
            .header('content-type', 'application/json')
            .end(function(response) {

                var result = JSON.parse(response.raw_body);

                if (result && result.items && !result.error) {
                    data = data.concat(result.items);
                    self._getYoutubeVideoResource(data, urls, success, failure);
                }
                else {
                    failure(result.error);
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