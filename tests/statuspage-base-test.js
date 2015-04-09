require('./common');
var StatusPageBase = require("./../lib/statuspage/statuspage-base");

describe('Base: Event emitter', function () {
	it("should generate expected events", function () {
		var events = { expected: function(){} };
		var gently = new Gently();
		var statuspageBase = new StatusPageBase();
		gently.expect(events, "expected");
		statuspageBase.on("test", function() {
			events.expected();
		});
		statuspageBase.emit("test");
	});
});