# statuspage-api

GET and POST for select StatusPage.io API elements.

## Installation

    npm install statuspage-api

## Usage
```JavaScript
var StatusPageAPI = require('./../lib/statuspage/index').StatusPageAPI;

/*
 * Initialize object
 */
var statuspage = new StatusPageAPI({
  pageid: "<ADD YOUR OWN PAGE ID>",
  apikey: "<ADD YOUR OWN API KEY>",
  host: "api.statuspage.io",      // Override the default host  
  port: 443,                // Override the default port
  // useragent: "statuspage-node",  // Override the default useragent
  debuglevel: "warn"      // Set debug levele: debug, info, warn, error
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
 * POST a scheduled incident and print the result
 */
var args = { 
    "incident[name]": "Testing API components",
    "incident[status]": "scheduled",
    "incident[scheduled_for]":  "2015-04-03T18:30:05+00:00",
    "incident[scheduled_until]": "2015-04-03T18:35:05+00:00",
    "incident[message]": "This is only a test.\n Really, it's only a test.",
    "incident[scheduled_remind_prior]": "t",
    "incident[scheduled_auto_in_progress]": "t",
    "incident[scheduled_auto_completed]": "t",
    "incident[impact_override]": "minor",
    "incident[component_ids]": ["tblsw29xd923","tvb8cjnr022n"]
}
statuspage.post("incidents", args, printAll);
```
For more information see [example](blob/dev/example/index.js)

## Supported calls:

Accepts a subset of StatusPage.io collections or elements. 

* GET
  * `pages`
  * `components`
  * `incidents`, `incidents/unresolved`, `incidents/scheduled`
  * `subscribers`

* POST:
  * `incidents`
  * `subscribers`

Read more about the statuspage.io API [here](http://doers.statuspage.io/api/v1/)

## Influences

Heavily drawn from jammus's lastfm-node and DynectEmail-Node
* http://github.com/jammus/lastfm-node
* https://github.com/dyninc/DynectEmail-Node
