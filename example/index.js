var StatusPageAPI = require('../../statuspage-api');

/*
 * Initialize object
 */
var statuspage = new StatusPageAPI({
	pageid: "<ADD YOUR OWN PAGE ID>",
	apikey: "<ADD YOUR OWN API KEY>",
	host: "api.statuspage.io",			// Override the default host	
	port: 443,				  			// Override the default port
	// useragent: "statuspage-node",	// Override the default useragent
	debuglevel: "warn"			// Set debug levele: debug, info, warn, error
});

/*
 * Define callback to print API result
 */
var printAll = function(result) {
	console.log("Status: ", result.status);
	if (result.error != null) {
		console.log("Error: ", result.error);		
	}
	if (result.status == "success"){
		console.log("Data: ", result.data);
	}
}

/*
 * GET page contents using printAll callback
 */
 statuspage.get("pages", printAll);

/*
 * GET all incidents, and print all details using printAll
 */
 statuspage.get("incidents", printAll);

/*
 * Define callback to print summary of incidents
 */
var printIncidentSummary = function(result) {
	console.log("Status: ", result.status);
	if (result.error != null) {
		console.log("Error: ", result.error);		
	}
	if (result.status == "success"){
		incidentSummary = result.data.forEach(function(item){
			var summary = {}
			summary.name = item.name;
			summary.status = item.status;
			summary.id = item.id;
			summary.shortlink = item.shortlink;
			console.log("Incident:\n", summary);
		});
	}
}

/*
 * GET all incidents, and print summary
 */
statuspage.get("incidents", printIncidentSummary);


var printComponentSummary = function(result) {
	console.log("Status: ", result.status);
	if (result.error != null) {
		console.log("Error: ", result.error);		
	}
	if (result.status == "success"){
		componentSummary = result.data.forEach(function(item){
			var summary = {}
			summary.name = item.name;
			summary.id = item.id;
			console.log("Component:\n", summary);
		});
	}
}

/*
 * GET all icomponents, and print all details using printAll
 */
 statuspage.get("components", printComponentSummary);

/*
 * POST a scheduled incident and print the result
 */
var args = { 
		"incident[name]": "Testing API components",
		"incident[status]": "scheduled",
		"incident[scheduled_for]":	"2015-05-03T18:30:05+00:00",
		"incident[scheduled_until]": "2015-05-03T18:35:05+00:00",
		"incident[message]": "This is only a test. Submitted around 2015-04-16T13:30:05+00:00\n-Ethan",
		"incident[scheduled_remind_prior]": "t",
		"incident[scheduled_auto_in_progress]": "t",
		"incident[scheduled_auto_completed]": "t",
		"incident[impact_override]": "minor",
		"incident[component_ids]": ["tblsw29xd923","tvb8cjnr022n"]
}

//statuspage.post("incidents", args, printAll);

