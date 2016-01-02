var unirest = require('unirest');

module.exports = {
    getUserFeed: function(accessToken, done) {

        var url = makeFacebookResourceUrl({
            base: 'https://graph.facebook.com/v2.5/',
            resource: 'me/feed/',
            fields: 'id,admin_creator,application,call_to_action,caption,created_time,description,feed_targeting,from,icon,is_hidden,is_published,link,message,message_tags,name,object_id,picture,place,privacy,properties,shares,source,status_type,story,story_tags,targeting,to,type,updated_time,with_tags'
        }, accessToken);

        getFacebookResource([], url, done);
    },
    getUserPages: function(accessToken, done) {
        var url = makeFacebookResourceUrl({
            base: 'https://graph.facebook.com/v2.5/',
            resource: 'me/pages/',
            fields: 'id'
        }, accessToken);

        getFacebookResource([], url, done);
    }
}

function makeFacebookResourceUrl(resourceType, accessToken) {

    var accessTokenParam = 'access_token=' + accessToken;
    var fieldsParam = 'fields=' + resourceType.fields;

    return resourceType.base + resourceType.resource + '?' + accessTokenParam + '&' + fieldsParam;
}

function getFacebookResource(resource, url, done) {

    unirest
        .get(url)
        .end(function(response) {

            response = JSON.parse(response.body);

            if (response && response.data && !response.error) {

                resource = resource.concat(response.data);

                if (response.paging && response.paging.next) {
                    console.log(resource.length);
                    getFacebookResource(resource, response.paging.next, done);
                }
                else {
                    done(null, resource);
                }

            }
            else {
                done(response.error, resource);
            }

        });
}
