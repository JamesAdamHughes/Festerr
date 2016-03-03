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

                    var promises = response.map(function(event) {
	                    // Example query for google image search
						var query = imageSearch.buildImageQuery(event.eventname);
						return imageSearch.makeRequest(query).then(function(res){
						    event.largeimageurl = res[0].link;
					    // Image search fails
						}, function(reason) {
							console.log('ERROR ' + reason.code + ': ' + reason.message);
						});                  	
                    })

	                q.all(promises).then(function(values) {
	                	if (!values[0]) {
	                		console.log('ERROR: Google image search failed, falling back to Skiddle images');
	                		cachedEventData = response;
	                		res.send(response);
	                	} else {
		                	cachedEventData = values;
		                	res.send(values);
		                }
	                }, function(reason) {
	                	console.log(reason);
	                	cachedEventData = response;
	                	res.send(response);
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