
// Load all the required NodeJS modules
var express = require('express'), http = require('http'), _ = require("underscore");

// Create a new ExpressJS web server
var app = express.createServer(express.logger());

// Set the NodeJS to serve all static content from the public folder
app.use(express.static(__dirname + '/public'))

// Re-direct all requests to the /sap/ path to the SAP demonstration web service
app.get('/sap/*', function(request, response) {
    var username = 'GW@ESW';
    var password = 'ESW4GW';
    var options = {
	'host' : 'gw.esworkplace.sap.com',
	'path' : request.url,
	headers: {
	    'Accept': 'application/json',
	    'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
	}  
    };
    http.get(options, function (odata_response) {
        response.header('Content-Type', 'application/json');
        odata_response.pipe(response);
    });
});

// Start the web server, write to console when available
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
