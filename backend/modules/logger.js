var winston = require('winston');
var fs = require('fs');

var config = require('../../config')

if (!fs.existsSync(config.logger.directory)) {
    fs.mkdirSync(config.logger.directory);
}

winston.addColors({
    trace: 'white',
    debug: 'green',
    info: 'green',
    warn: 'yellow',
    crit: 'red',
    fatal: 'red'
});

var logger = new(winston.Logger)({
    colors: {
        trace: 'white',
        debug: 'green',
        info: 'green',
        warn: 'yellow',
        crit: 'red',
        fatal: 'red'
    },
    levels: {
        trace: 0,
        debug: 1,
        info: 2,
        warn: 3,
        crit: 4,
        fatal: 5
    },
    transports: [
        new(winston.transports.Console)({
            name: 'consoleLogger',
            level: config.logger.level,
            colorize: true,
            timestamp: true
        }),
        new(winston.transports.File)({
            name: 'fileLogger',
            level: config.logger.level,
            filename: 'logs/playlist.log',
            maxsize: 104857600 // 100 mb
        })
    ]
});

var origLog = logger.log;

logger.log = function (level, msg) {
  if (msg instanceof Error) {
    var args = Array.prototype.slice.call(arguments);
    args[1] = msg.stack;
    origLog.apply(logger, args);
  } else {
    origLog.apply(logger, arguments);
  }
};

module.exports = logger;