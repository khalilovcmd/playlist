var unirest = require('unirest');
var async = require('async');
var assert = require('assert');
var validator = require('validator');

var logger = require('./logger');

/**
 * 
 */
function Facebook(token) {

    assert.ok(token, "data member 'token' must not be null")

    this.token = token;
}

/**
 * method: getAccessToken()
 * description: call facebook api to exchange 'code' with 'access_token'
 * parameters: 
 * resourceType: object {
                    appId: 'string',
                    redirect_uri: 'string (url)',
                    appSecret: 'string',
                    code : 'string'
                }
 */
Facebook.prototype.getAccessToken = function(configs, success, failure) {

    assert.notEqual(success, null, "argument 'success' must not be null")
    assert.notEqual(failure, null, "argument 'failure' must not be null")

    assert.ok(configs, "argument 'configs' must not be null")
    assert.ok(configs.appId, "argument 'configs' must not be null")
    assert.ok(configs.redirect_uri, "argument 'configs' must not be null")
    assert.ok(configs.appSecret, "argument 'configs' must not be null")
    assert.ok(configs.code, "argument 'configs' must not be null")

    unirest
        .get('https://graph.facebook.com/v2.5/oauth/access_token?' +
            'client_id=' + configs.appId +
            '&redirect_uri=' + configs.redirect_uri +
            '&client_secret=' + configs.appSecret +
            '&code=' + configs.code)
        .end(function(response) {

            var result = JSON.parse(response.raw_body);

            if (result && result.access_token && !result.error) {
                logger.info('getAccessToken(): access_token %s', result.access_token)
                success(result.access_token)
            }
            else {
                logger.warn('getAccessToken(): response.error: %s', result.error)
                failure(result.error)
            }

        });

}


/**
 * 
 */
Facebook.prototype.getUserMe = function(success, failure) {

    assert.notEqual(success, null, "argument 'success' must not be null")
    assert.notEqual(failure, null, "argument 'failure' must not be null")

    var self = this

    var meUrl = self._makeFacebookResourceUrl({
        base: 'https://graph.facebook.com/v2.5/',
        resource: 'me/',
        fields: 'id,name'
    })

    self._getFacebookMe(meUrl,
        function(result) {
            success(result)
        },
        function(error) {
            failure(error)
        });
}

/**
 * 
 */
Facebook.prototype.getUserFeed = function(success, failure) {

    assert.notEqual(success, null, "argument 'success' must not be null")
    assert.notEqual(failure, null, "argument 'failure' must not be null")

    var self = this;

    async.waterfall([
            function(next) {

                var meUrl = self._makeFacebookResourceUrl({
                    base: 'https://graph.facebook.com/v2.5/',
                    resource: 'me/',
                    fields: 'id,name'
                });

                self._getFacebookMe(meUrl,
                    function(result) {
                        next(null, result);
                    },
                    function(error) {
                        logger.warn(error);
                        next('error', error);
                    });

            },
            function(user, next) {

                var feedUrl = self._makeFacebookResourceUrl({
                    base: 'https://graph.facebook.com/v2.5/',
                    resource: 'me/feed/',
                    fields: 'id,admin_creator,application,call_to_action,caption,created_time,description,feed_targeting,from,icon,is_hidden,is_published,link,message,message_tags,name,object_id,picture,place,privacy,properties,shares,source,status_type,story,story_tags,targeting,to,type,updated_time,with_tags'
                });

                self._getFacebookFeed([], feedUrl,
                    function(result) {
                        next(null, {
                            user: user,
                            videos: result
                        });
                    },
                    function(error) {
                        logger.warn(error);
                        next('error', error);
                    });

            }
        ],
        function(state, result) {
            if (state == 'error')
                failure(result);
            else
                success(result);
        })

}

/**
 * method: makeFacebookResourceUrl()
 * description: form a url to request the requested resource from facebook api
 * parameters: 
 * resourceType: object {
                    base: 'https://graph.facebook.com/v2.5/',
                    resource: 'me/',
                    fields: 'id,name'
                }
 */

Facebook.prototype._makeFacebookResourceUrl = function(resourceType) {

    assert.ok(resourceType, "argument 'resourceType' must contain a value")
    assert.ok(resourceType.base, "argument 'resourceType.base' must contain a value")
    assert.ok(resourceType.fields, "argument 'resourceType.fields' must contain a value")
    assert.ok(resourceType.resource, "argument 'resourceType.resource' must contain a value")
    assert.ok(validator.isURL(resourceType.base), "argument 'resourceType.base' must be url")

    logger.trace('_makeFacebookResourceUrl(): creating facebook resource url. resource: %j', resourceType)

    var self = this;

    var accessTokenParam = 'access_token=' + self.token;
    var fieldsParam = resourceType.fields ? 'fields=' + resourceType.fields : '';

    return resourceType.base + resourceType.resource + '?' + accessTokenParam + '&' + fieldsParam;
}


/**
 * method: _getFacebookFeed()
 * description: recursively get "data" from facebook api, calls itself to pass the "paging.next" as a url for fetching the next request 
 * parameters: 
 * resource: an array contains all "data" fetched so far
 * url: url to be called for fetching "data" from facebook api
 * done: callback to call when request is finished
 */

Facebook.prototype._getFacebookFeed = function(data, url, success, failure) {

    assert.notEqual(success, null, "argument 'success' must contain a value")
    assert.notEqual(failure, null, "argument 'failure' must contain a value")

    logger.trace('_getFacebookFeed(): fetching facebook resource. url: %s, data length: %d', url, data ? data.length : 0)

    var self = this;

    unirest
        .get(url)
        .end(function(response) {

            logger.info('_getFacebookFeed(): response.body size: %d', response.raw_body.length)

            try {

                response = JSON.parse(response.raw_body);

                if (response && response.data && !response.error) {

                    data = data.concat(response.data);

                    if (response.paging && response.paging.next) {
                        logger.info('_getFacebookFeed(): response.paging.next: %s', response.paging.next)
                        self._getFacebookFeed(data, response.paging.next, success, failure)
                    }
                    else {
                        success(data);
                    }
                }
                else {
                    logger.warn('_getFacebookFeed(): response.error: %s', response.error)
                    failure(response.error);
                }
            }
            catch (error) {
                logger.warn('_getFacebookFeed(): error: %j', error)
                failure(error);
            }
        });
}

/**
 * 
 */
Facebook.prototype._getFacebookMe = function(url, success, failure) {

    assert.ok(url, "argument 'url' must contain a value")
    assert.notEqual(success, null, "argument 'success' must contain a value")
    assert.notEqual(failure, null, "argument 'failure' must contain a value")

    logger.trace('_getFacebookMe(): fetching facebook resource. url: %s', url)

    unirest
        .get(url)
        .end(function(response) {

            logger.info('_getFacebookMe(): response.body size: %d', response.raw_body.length)

            try {
                response = JSON.parse(response.raw_body);

                if (response && !response.error) {
                    logger.info('_getFacebookMe(): me.id: %s', response.id)

                    success(response);
                }
                else {
                    logger.warn('_getFacebookMe(): response.error: %s', response.error)
                    failure(response.error);
                }
            }
            catch (error) {
                logger.warn('_getFacebookMe(): error: %j', error)
                failure(error);
            }
        });
}

module.exports = Facebook;
