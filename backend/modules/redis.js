var redis = require('redis');
var logger = require('./logger');
var config = require('../../config');

var client = redis.createClient({
    host: config.redis.host,
    port: config.redis.port
});

client.on("connect", function() {
    logger.info("Redis Connected.");
});

client.on("error", function(err) {
    logger.fatal(err);
});

module.exports = client;