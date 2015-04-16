if (global.GENTLY_HIJACK) require = GENTLY_HIJACK.hijack(require);

var StatusPageRequest = require("./statuspage-request");

var StatusPageAPI = exports.StatusPageAPI = function(options) {
    options = options || {};
    this.host = options.host || "api.statuspage.io";
    this.port = options.port || 443;
    this.pageid = options.pageid || "<ADD YOUR OWN PAGE ID>";
    this.apikey = options.apikey;
    this.useragent = options.useragent || "statuspage-node";
    this.debuglevel = options.debuglevel || "warn";
};

StatusPageAPI.prototype.get = function(element, callback) {
    var statuspageRequest = new StatusPageRequest(this);
    return statuspageRequest.sendRequest("GET", element, {}, callback);
};

StatusPageAPI.prototype.post = function(element, args, callback) {
    var statuspageRequest = new StatusPageRequest(this);
    return statuspageRequest.sendRequest("POST", element, args, callback);
};
