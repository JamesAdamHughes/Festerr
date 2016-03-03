var request = require('request');
var q = require('q');
var imageSearch = require(__dirname + '/../utils/googleImageSearch');

var cachedEventData = null;

var skiddleAPI = {

	getAllEvents: function (res) {

        // Check to see if we've already cached the event data
        if (!cachedEventData) {

            //Get all events from Skiddle API
            var options = { method: 'GET',
                url: process.env.skiddle_url  + 'events/',
                qs: 
                    { eventcode: 'FEST',
                        order: '4',
                        api_key: process.env.skiddle_api_key } };

            console.log("GET " + options.url);

            //Send the request
            request(options, function (error, reqResponse, body) {
                if (error) throw new Error(error);
                var contents = JSON.parse(body);
                if (contents.error !== 0) {
                    console.log('ERROR ' + contents.errorcode + ': ' + contents.errormessage);
                } else {
                    response = contents.results;
                    response.ok = true;

                    // Attempt to replace skiddle images with ones from google search
                    var promises = response.map(function(event) {

	                    // Make google image search query
						var query = imageSearch.buildImageQuery(event.eventname);
						return imageSearch.makeRequest(query).then(function(res){
						    event.largeimageurl = res[0].link;

					    // Image search fails
						}, function(reason) {
							console.log('ERROR ' + reason.code + ': ' + reason.message);
						});                  	
                    });

	                q.all(promises).then(function(values) {
	                	// If first value failed, then assuming they all did
	                	if (!values[0]) {
	                		console.log('ERROR: Google image search failed, falling back to Skiddle images');
	                		// Return unaltered response
	                		cachedEventData = response;
	                		res.send(response);
	                	} else {
	                		// Success, return google image response
		                	cachedEventData = values;
		                	res.send(values);
		                }
	                });
                }
            });
        // Cached data present
        } else {
            response = cachedEventData;
            res.send(response);
        }

    }
};

module.exports = skiddleAPI;