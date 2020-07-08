[![npm version](https://badge.fury.io/js/statuspage-api.svg)](http://badge.fury.io/js/statuspage-api)
[![license badge](https://img.shields.io/badge/license-MIT-blue.svg)](http://choosealicense.com/licenses/mit/)
# statuspage-api

GET and POST for select StatusPage.io API elements.

## Installation
```bash
npm install statuspage-api
```

## Usage
```JavaScript
var StatusPageAPI = require('statuspage-api');
// Or for local example:
// var StatusPageAPI = require('../../statuspage-api');

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

For more information see [example](example/index.js)

## Supported calls:

Accepts a subset of StatusPage.io collections or elements, not ALL.

* GET
  * `pages`
  * `components`
  * `incidents`, `incidents/unresolved`, `incidents/scheduled`
  * `subscribers`
  * `metrics_providers`

* POST:
  * `incidents`
  * `subscribers`
  * `metrics/data`
  * `page_access_users`

* PATCH:
    * `pages`
    * `components`
    * `incidents`
    * `page_access_users`

* PUT:
  * `components-groups`

Read more about the statuspage.io API [here](http://doers.statuspage.io/api/v1/)

## Influences

Heavily drawn from jammus's lastfm-node and DynectEmail-Node
* http://github.com/jammus/lastfm-node (see LICENSE-lastfm-node)
* https://github.com/dyninc/DynectEmail-Node (see LICENSE-DynectEmail-Node)
