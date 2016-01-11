var url = require('url');
var _ = require('lodash');
var querystring = require('querystring');

var logger = require('./logger');

function Extractor() {

}

Extractor.prototype.extract = function(videos) {

    logger.trace('extract(): extracting youtube ids from videos. Videos length: %d', videos ? videos.length : 0)

    var videos =
        _.chain(videos)
        .filter(function(v) {
            return (v.link && (v.link.indexOf('youtube') > 0 || v.link.indexOf('youtu.be') > 0)) || (v.source && (v.source.indexOf('youtube') > 0 || v.source.indexOf('youtu.be') > 0));
        })
        .pluck('link')
        .map(function(v) {
            var l = url.parse(v);

            if (l.query) {
                var q = querystring.parse(l.query);

                if (q)
                    return q.v;
                else
                    return '';

            }
            else {
                return l.href.substr(l.href.lastIndexOf('/') + 1);
            }
        })
        .value();

    return videos;
}

module.exports = Extractor;