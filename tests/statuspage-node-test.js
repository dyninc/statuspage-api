require("./common.js");

describe('StatusPage Host', function () {
	it("should default when not provided", function () {
	    var statuspage = new StatusPageAPI();
	    assert.equal("api.statuspage.io", statuspage.host);
    });
});

describe('StatusPage apikey', function () {
    it("should be stored correctly", function () {
	    var statuspage = new StatusPageAPI({
		    apikey: "abcdef12345"
	    });
	    assert.equal("abcdef12345", statuspage.apikey);
	});
});

describe('StatusPage pageid', function () {
    it("should default to testing ID, if not specified", function () {
	    var statuspage = new StatusPageAPI();
	    assert.equal(statuspage.pageid, "<ADD YOUR OWN PAGE ID>");
	});
});