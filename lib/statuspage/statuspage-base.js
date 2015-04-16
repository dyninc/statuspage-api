var util = require('util'),
    events = require('events'),
     _ = require("underscore");

var StatusPageBase = function() {};

StatusPageBase.prototype = new events.EventEmitter;

// StatusPageBase.prototype.registerHandlers = function(handlers) {
//   if (typeof handlers !== "object") {
//     return;
//   }
  
//   var that = this;
//   _(handlers).each(function(value, key) {
//     that.on(key, value);
//   });
// };

StatusPageBase.prototype.scheduleCallback = function(callback, delay) {
  return setTimeout(callback, delay);
};

StatusPageBase.prototype.cancelCallback = function(identifier) {
  clearTimeout(identifier);
};

module.exports = StatusPageBase;
