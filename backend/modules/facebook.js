var unirest = require('unirest');

function Facebook(token) {
    this.token = token;
}

Facebook.prototype.getUserFeed = function(success, failure) {

    var self = this;

    var url = self._makeFacebookResourceUrl({
        base: 'https://graph.facebook.com/v2.5/',
        resource: 'me/feed/',
        fields: 'id,admin_creator,application,call_to_action,caption,created_time,description,feed_targeting,from,icon,is_hidden,is_published,link,message,message_tags,name,object_id,picture,place,privacy,properties,shares,source,status_type,story,story_tags,targeting,to,type,updated_time,with_tags'
    });

    self._getFacebookResource([], url, success, failure);
}

/**
 * method: makeFacebookResourceUrl()
 * description: form a url to request the requested resource from facebook api
 * parameters: 
 * resourceType -> object contains "base", "resource" and "fields"
 * token -> facebook accessToken
 */

Facebook.prototype._makeFacebookResourceUrl = function(resourceType) {
    var self = this;

    var accessTokenParam = 'access_token=' + self.token;
    var fieldsParam = 'fields=' + resourceType.fields;

    return resourceType.base + resourceType.resource + '?' + accessTokenParam + '&' + fieldsParam;
}


/**
 * method: getFacebookResource()
 * description: recursively get "data" from facebook api, calls itself to pass the "paging.next" as a url for fetching the next request 
 * parameters: 
 * resource -> an array contains all "data" fetched so far
 * url -> url to be called for fetching "data" from facebook api
 * done -> callback to call when request is finished
 */

Facebook.prototype._getFacebookResource = function(data, url, success, failure) {

    var self = this;

    unirest
        .get(url)
        .end(function(response) {

            response = JSON.parse(response.body);

            if (response && response.data && !response.error) {

                data = data.concat(response.data);

                if (response.paging && response.paging.next) {
                    self._getFacebookResource(data, response.paging.next, success, failure);
                }
                else {
                    success(data);
                }
            }
            else {
                failure(response.error);
            }

        });
}

module.exports = Facebook;
