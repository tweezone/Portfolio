const path = require("path");
const log4js = require("log4js");
/**
 * 日志配置
 */
exports.configure = function() {
    log4js.configure(path.join(__dirname, "../configure/log4js.json")); //"assets/log/log4js.json"));
}

/**
 * 暴露到应用的日志接口，调用该方法前必须确保已经configure过
 * @param name 指定log4js配置文件中的category。依此找到对应的appender。
 *              如果appender没有写上category，则为默认的category。可以有多个
 * @returns {Logger}
 **/
exports.logger = function(name) {
    var dateFileLog = log4js.getLogger(name);
    //dateFileLog.setLevel(log4js.levels.TRACE);
    return dateFileLog;
}

/**
 * 用于express中间件，调用该方法前必须确保已经configure过
 * @returns {Function|*}
 */
exports.logsInServer = function() {
    return log4js.connectLogger(log4js.getLogger("cheese"), {
        level: 'auto', 
        format: ":method :url HTTP/:http-version :status :content-length :referrer",
        statusRules: [
            { from: 100, to: 199, level: 'trace' },
            { from: 200, to: 299, level: 'info' },
            { from: 300, to: 399, level: 'warn' },
            { from: 400, to: 499, level: 'error' },
            { from: 500, to: 599, level: 'fatal' }
        ]
    });
}
exports.logsToEmail = function() {
    return log4js.connectLogger(log4js.getLogger("mailer"), {
        level: 'auto', 
        format: ":method :url HTTP/:http-version :status :content-length :referrer",
        statusRules: [
            { from: 100, to: 199, level: 'trace' },
            { from: 200, to: 299, level: 'info' },
            { from: 300, to: 399, level: 'warn' },
            { from: 400, to: 499, level: 'error' },
            { from: 500, to: 599, level: 'fatal' }
        ]
    });
}

// When the app closes, make sure that any remaining emails can be sent.
exports.logsShutDown = ()=>{
    console.log("App will be shut down, logs will be sent immediately!")
    log4js.shutdown;
}
