var request = require('request');
var q = require('q');

var cachedEventData = undefined;

var defaultOptions = {
    method: 'GET',
    url: process.env.skiddle_url,
    qs: {
        api_key: process.env.skiddle_api_key
    }
};

var skiddleAPI = {

	getAllEvents: function (res) {

        // Check to see if we've already cached the event data
        if (!cachedEventData) {

            //Get all events from Skiddle API
            var options = defaultOptions;
            options.url += 'events/';
            options.qs.eventcode = 'FEST';
            options.qs.order = '4';

            console.log("GET " + options.url);

            //Send the request
            apiRequest(options, res);

        // Cached data present
        } else {
            response = cachedEventData;
            response.ok = true;
            res.send(response);
        }

    },
    
    // Returns the details of a given event
    // Takes event id as argument
    getSingleEvent: function (id){
        var deferred = q.defer();
        var event;
        
        // Check against the cache
        if(!cachedEventData){
            // this shouldn't happen because we have to get here from the main page
            // TODO call this against skiddle
            deferred.reject({ok:false, error:"No event data cached"});
        } else{
            for(var i = 0; i < cachedEventData.length; i++){
                if(cachedEventData[i].id === id){
                    event = cachedEventData[i];
                    break;
                }
            }
            
            if(event === undefined){
                deferred.reject({ok:false, error: "Cannot find event in cache"});
            } else {
                deferred.resolve({ok:true, event: event});
            }
        }
        
        return deferred.promise;
    }
};

// Function to call api with given options and endpoint
function apiRequest(options, res) {
    request(options, function (error, reqResponse, body) {
        if (error) throw new Error(error);
        var contents = JSON.parse(body);
        if (contents.error !== 0) {
            console.log('ERROR ' + contents.errorcode + ': ' + contents.errormessage);
        } else {
            cachedEventData = contents.results;
            response = contents.results;
            response.ok = true;
        }
        res.send(response);
    });
}

module.exports = skiddleAPI;