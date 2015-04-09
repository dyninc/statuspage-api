require("./common");
var _ = require("underscore"),
	querystring = require("querystring"),
	StatusPageRequest = require("./../lib/statuspage/statuspage-request"),
	fakes = require("./fakes");

(function() {
	describe('Request (GET:pages)', function () {
		var statuspage, connection, url, gently, request, statuspageRequest;
		
		before(function() {
			statuspage = new StatusPageAPI();
			connection = new fakes.Client(statuspage.port, statuspage.host);
			request = new fakes.ClientRequest();
			gently = new Gently();
		});
		
		it("should use the correct Method and Element", function () {
			before();
			var element = "pages",
			correctPath = "/v1/" + element + "/" + statuspage["pageid"] + ".json";
			gently.expect(GENTLY_HIJACK.hijacked.https, "request", function(options) {
				assert.equal(options["method"], "GET");
				assert.equal(options["path"], correctPath);
				return request;
			});

			var statuspageRequest = new StatusPageRequest(statuspage);
			statuspageRequest.sendRequest("GET", "pages");
		});
		
		it("should have the correct user-agent header", function () {
			before();
			gently.expect(GENTLY_HIJACK.hijacked.https, "request", function(options) {
			assert.equal(options["headers"]["User-Agent"], "statuspage-node" );
				return request;
			});
			var statuspageRequest = new StatusPageRequest(statuspage);
			statuspageRequest.sendRequest("GET", "pages");
		});
		
		it("should allow user-agent overrides", function () {
			before();
			var useragent = "custom-user-agent";
			gently.expect(GENTLY_HIJACK.hijacked.https, "request", function(options) {
				assert.equal(options["headers"]["User-Agent"], useragent);
				return request;
			});
			statuspage = new StatusPageAPI({ useragent: useragent });
			var statuspageRequest = new StatusPageRequest(statuspage);
			statuspageRequest.sendRequest("GET", "pages");
		});

		it("should have the correct authorization header", function () {
			before();
			statuspage.apikey = "1111111111111";
			gently.expect(GENTLY_HIJACK.hijacked.https, "request", function(options) {
			assert.equal(options["headers"]["Authorization"], statuspage.apikey);
				return request;
			});
			var statuspageRequest = new StatusPageRequest(statuspage);
			statuspageRequest.sendRequest("GET", "pages");
		});

		it("should end", function () {
			before();
			gently.expect(GENTLY_HIJACK.hijacked.https, "request", function(options) {
				gently.expect(request, "end");
				return request;
			});
			var statuspageRequest = new StatusPageRequest(statuspage);
			statuspageRequest.sendRequest("GET", "pages");
		});
	});
})();

describe('Request (POST:incidents)', function () {

	var statuspage, connection, url, gently, request, params, statuspageRequest;

	var before = function() {
		statuspage = new StatusPageAPI();
		connection = new fakes.Client(80, statuspage.host);
		request = new fakes.ClientRequest();
		gently = new Gently();
		var params = { foo:"bar" };
		statuspageRequest = new StatusPageRequest(statuspage);
	};
	
	it("should create the correct default options", function () {
		before();
		var element = "incidents",
		correctPath = "/v1/pages/" + statuspage["pageid"] + "/" + element + ".json";
		gently.expect(GENTLY_HIJACK.hijacked.https, "request", function(options) {
			assert.equal(options["method"], "POST");
			assert.equal(options["path"], correctPath);
			assert.equal(options["host"], "api.statuspage.io");
			assert.equal(options["port"], 443);
			assert.equal(options["headers"]["Content-Type"], 'application/x-www-form-urlencoded');
			return request;
		});
		statuspageRequest.sendRequest("POST", element);
	});

	it("should have the correct Content-Length", function () {
		before();
		var args = { key: "value" },
		dataLength = Buffer.byteLength(querystring.stringify(args));
		gently.expect(GENTLY_HIJACK.hijacked.https, "request", function(options) {
			assert.equal(options["headers"]["Content-Type"], 'application/x-www-form-urlencoded');
			assert.equal(options["headers"]["Content-Length"], dataLength);
			return request;
		});
		statuspageRequest.sendRequest("POST", "incidents", args);
	});

	it("should emit warning with invalid Element", function () {
		before();
		gently.expect(statuspageRequest, "emit", function(event) {
			assert.equal(event, "warning");
		});
 		statuspageRequest.sendRequest("POST", "bad-element");
	});
});

describe('Request Events', function () {
	var statuspage, connection, url, gently, request, receivedData, statuspageRequest;

	var before = function () {
		statuspage = new StatusPageAPI();
		connection = new fakes.Client(80, statuspage.host);
		request = new fakes.ClientRequest();
		gently = new Gently();
		statuspageRequest = new StatusPageRequest(statuspage);
	};

	it("should emit success with valid data", function () {
		before();
		// Configure mock data of response
		whenReceiving("{\"testdata\":\"received\"}");
		// Callback to verify response
		expectRequestToEmit(function(event, json) {
			assert.equal(event, "success");
			assert.equal(json.data.testdata, "received");
		});
	});

	it("should emit error when receiving incomplete data", function () {
		before();
		// Configure mock bad-data of response
		whenReceiving("{\"testdata\"");
		// Callback to verify error is raised for bad response data
		expectRequestToEmit(function(event, error) {
			assert.equal(event, "error");
			assert.ok(error);
		});
	});

	function whenReceiving(data) {
		if (data.constructor.name !== 'Array') {
			data = [data];
		}
		receivedData = data;
	}

	function expectRequestToEmit(expectation) {
		var response = new fakes.ClientResponse();
		// Override http.srequest
		gently.expect(GENTLY_HIJACK.hijacked.https, "request", function(options, cb) {
			cb(response);
			return request;
		});
		// Configure listen to verify event via callback
		gently.expect(statuspageRequest, "emit", expectation);
		// Trigger request to be sent, which will hit hijacked request
		statuspageRequest.sendRequest("POST", "incidents");
		// Mock Response based on data from when Receiving
		_(receivedData).each(function(data) {
			response.emit("data", data);
		});
		response.emit("end");
	}
});