global.Gently = require("gently");
global.GENTLY_HIJACK = new Gently();
global.assert = require("assert");
StatusPageAPI = require('./../lib/statuspage').StatusPageAPI;
if (process.setMaxListeners) {
    process.setMaxListeners(900);
}
global.emptyFn = function () {};
