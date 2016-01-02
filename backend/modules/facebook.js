var unirest = require('unirest');

module.exports = (function() {

    var self = this;

    self.getUserFeed = function(accessToken, success, failure) {

        var url = self._makeFacebookResourceUrl({
            base: 'https://graph.facebook.com/v2.5/',
            resource: 'me/feed/',
            fields: 'id,admin_creator,application,call_to_action,caption,created_time,description,feed_targeting,from,icon,is_hidden,is_published,link,message,message_tags,name,object_id,picture,place,privacy,properties,shares,source,status_type,story,story_tags,targeting,to,type,updated_time,with_tags'
        }, accessToken);

        self._getFacebookResource([], url, success, failure);
    }

    /**
     * method: makeFacebookResourceUrl()
     * description: form a url to request the requested resource from facebook api
     * parameters: 
     * resourceType -> object contains "base", "resource" and "fields"
     * accessToken -> facebook accessToken
     */

    self._makeFacebookResourceUrl = function(resourceType, accessToken) {

        var accessTokenParam = 'access_token=' + accessToken;
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

    self._getFacebookResource = function(data, url, success, failure) {

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

    return self;
    
})();
