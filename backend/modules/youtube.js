var unirest = require('unirest');
var _ = require('lodash');

var config = require('../../config');


module.exports = (function() {

    var self = this;

    /**
     * 
     */
    self.getVideos = function(key, ids, success, failure) {
        var urls = self._makeYoutubeVideoResourceUrl(ids);
        self._getYoutubeVideoResource([], urls, success, failure);
    }

    /**
     * 
     */
    self._makeYoutubeVideoResourceUrl = function(ids) {

        var urls = [];
        var base = 'https://www.googleapis.com/';
        var resource = 'youtube/v3/videos';


        if (ids && ids.length > 0) {
            for (var i = 0; i < ids.length; i += 120) {
                var current = _.slice(ids, i, i + 100).join(",");
                var url = base + resource + '?' + 'part=snippet' + '&' + 'id=' + current + '&' + 'key=' + config.youtube.key;
                urls.push(url);
            }
        }

        return urls;
    }

    /**
     * 
     */
    self._getYoutubeVideoResource = function(data, urls, success, failure) {

        if (urls && urls.length > 0) {
            
            var url = _.first(urls);
            urls = _.rest(urls);
            
            unirest
            .get(url)
            .end(function(response) {

                response = JSON.parse(response.body);

                if (response && response.data && !response.error) {
                }
                else {
                    failure(response.error);
                }

            });
            
        }
        else {
            if (data && data.length > 0)
                success(data);
            else
                failure("no data.");
        }
    }


    return self;
})();