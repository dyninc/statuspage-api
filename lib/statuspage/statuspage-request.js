/*jslint node: true, nomen: false, sloppy: true, vars: true, indent: 4, todo: true */

if (global.GENTLY_HIJACK) {
    require = GENTLY_HIJACK.hijack(require);
}

var https = require('https'),
    _ = require('underscore'),
    qs = require('qs'),
    StatusPageBase = require('./statuspage-base'),
    logger = require('../logger');

// Array of valid API elements that can be used for POST requests
var ELEMENTS_POST = [
    'incidents',
    'subscribers'
];
// Array of valid API elements that can be used for GET requests
var ELEMENTS_GET = [
    'pages',
    'components',
    'incidents', 'incidents/unresolved', 'incidents/scheduled',
    'subscribers'
];

var ELEMENTS_PATCH = [
    'components',
    'incidents'
];

// var ELEMENTS_DELETE = [
//     'incidents',
//     'subscribers'
// ]

var isValidOperation = function (method, element) {
    // Validate Request method and element.
    var validity = false;
    switch (method) {
    case 'GET':
        validity = element && _(ELEMENTS_GET).include(element.toLowerCase());
        break;
    case 'POST':
        validity = element && _(ELEMENTS_POST).include(element.toLowerCase());
        break;
    case 'PATCH':
         validity = true || element && _(ELEMENTS_POST).include(element.split('/')[0].toLowerCase());
         break;
    // TODO: Not implemented
    // case 'PUT':
    //     validity = method && _(ELEMENTS_PUT).include(method.toLowerCase());
    //     break;
    // case 'DELETE':
    //     validity = method && _(ELEMENTS_DELETE).include(method.toLowerCase());
    //     break;
    }
    logger.log('debug', 'Validity(' + method + ', ' + element + '): ' + validity);
    return validity;
};

var isWriteOperation = function (httpVerb) {
    return httpVerb === 'POST' || httpVerb === 'PATCH' || httpVerb === 'PUT';
};

var requestHeaders = function (httpVerb, data, statuspage) {
    var headers = {
        'User-Agent': statuspage.useragent,
        'Authorization': statuspage.apikey
    };

    if (isWriteOperation(httpVerb)) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        headers['Content-Length'] = Buffer.byteLength(data);
    }
    return headers;
};

var makeUrl = function (pageId, element) {
    // Combine page ID and element to form request URI
    // TODO: This function will need to be updated to support
    // additional elements and operations
    var url = '/v1/pages/' + pageId;
    if (element === 'pages') {
        url += '.json';
    } else {
        url += '/' + element + '.json';
    }
    return url;
};

var StatusPageRequest = function (statuspage) {
    StatusPageBase.call(this);
    this.statuspage = statuspage;
    logger.debugLevel = statuspage.debuglevel;
    // Register handlers with base
    // TODO: This has been replaced with callbacks, but could fairly easily
    // be re-implemented if needed
    // this.registerHandlers(handlers);
};

StatusPageRequest.prototype = Object.create(StatusPageBase.prototype);

StatusPageRequest.prototype.chunkedResponse = function (res, callback, callbackArgs) {
    var self = this,
        data = '',
        result = {};

    res.on('data', function (chunk) {
        data += chunk.toString('utf8');
    });
    res.on('end', function () {
        // Package response data
        var json = {
            data: {},
            response: {
                statusCode: res.statusCode,
                statusMessage: res.statusMessage,
                headers: res.headers
            }
        };

        try {
            logger.log('debug', ['Raw Response data: ', data]);
            json.data = JSON.parse(data);
            // Error parsing JSON response
            if (json.error) {
                result.status = 'error';
                result.data = data;
                result.error = json;
                self.emit('error', json);
            }
            // Status OK, so return success
            if (res.statusCode === 200 ||  res.statusCode === 201) {
                result.status = 'success';
                result.error = null;
                result.data = json.data;
            // Something went wrong
            } else {
                var message = 'Unexpected response: ' +
                    json.response.statusCode + ' ' +
                    json.response.statusMessage;
                result.status = 'failure';
                result.data = data;
                result.error = message;
            }
            self.emit('success', json);
        } catch (e) {
            result.status = 'error';
            result.error = e;
            self.emit('error', e);
        }
        if (typeof callback === 'function') {
            callback(result, callbackArgs);
        } else {
            return result;
        }
    });
};

StatusPageRequest.prototype.sendRequest = function (method, element, args, callback, callbackArgs) {
    var self = this,
        statuspage = this.statuspage;

    args = args || {};
    if (isValidOperation(method, element)) {
        // Prepare data to be sent to API
        var host = statuspage.host,
            port = statuspage.port,
            url = makeUrl(statuspage.pageid, element),
            httpVerb = method,
            data = qs.stringify(args, {arrayFormat: 'brackets'}),
            options = {
                host: host,
                port: port,
                path: url,
                method: httpVerb,
                headers: requestHeaders(httpVerb, data, statuspage)
            };
        logger.log('debug', ['Query String: ', data]);
        logger.log('debug', ['Request options: ', options]);
        // Send API request
        var req = https.request(options, function (res) {
            self.chunkedResponse(res, callback, callbackArgs);
        });
        req.on('error', function (error) {
            self.emit('error', error);
        });
        if (isWriteOperation(httpVerb)) {
            req.write(data, 'utf8');
        }
        req.end();
    } else {
        // Emit warning
        var warningMessage = 'Request is not supported. ' + method + ': ' + element;
        this.on('warning', function () {
            logger.log('warn', warningMessage);
        });
        this.emit('warning', warningMessage);
    }
};

// Export
module.exports = StatusPageRequest;
