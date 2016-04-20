var request = require('request');
var q = require('q');
var models = require('../models');
var cachedEventData = undefined;

var defaultOptions = {
    method: 'GET',
    url: process.env.skiddle_url,
    qs: {
        api_key: process.env.skiddle_api_key
    }
};

var skiddleAPI = {

    getAllEvents: function() {
        var deferred = q.defer();
        var response;

        // Check to see if we've already cached the event data
        if (!cachedEventData) {

            //Get all events from Skiddle API
            var options = defaultOptions;
            options.url += 'events/';
            options.qs.eventcode = 'FEST';
            options.qs.order = '4';

            console.log("GET " + options.url);
            
            // We get all the festival data from skiddle, and insert it into our database
            // If the event is already stored don't add it
            // Return the cached data
            apiRequest(options).then(function(data) {
                // save the cached data
                cachedEventData = data;
                
                return models.sequelize.transaction(function(t) {
                    return models.Sequelize.Promise.map(data, function(event) {
                        return models.Event.findOne({ where: { skiddleID: event.id } }, { transaction: t }).then(function(e) {
                            if (!e) {
                                // Event was not in the DB, so add it
                                return models.Event.create({ skiddleID: event.id, name: "event " + event.id });
                            } else {
                                // Event was in the DB, no need to add it
                                console.log("EVENT " + e.id + "already in db");
                            }
                        }).catch(function(err){
                            console.log(err);
                        });
                    });
                });
            }).then(function() {                
                // return the cached data                
                deferred.resolve(cachedEventData);
            }).catch(function(err) {
                // an error occured 
                console.log(err);
                deferred.reject("an error occured");
            });

            // Cached data present
        } else {
            response = cachedEventData;
            response.ok = true;
            deferred.resolve(response);
        }

        return deferred.promise;
    },

    // Returns the details of a given event
    // Takes event id as argument
    getSingleEvent: function(id) {
        var deferred = q.defer();
        var event;

        // Check against the cache
        if (!cachedEventData) {
            // this shouldn't happen because we have to get here from the main page
            // TODO call this against skiddle
            deferred.reject({ ok: false, error: "No event data cached" });
        } else {
            for (var i = 0; i < cachedEventData.length; i++) {
                if (cachedEventData[i].id === id) {
                    event = cachedEventData[i];
                    break;
                }
            }

            if (event === undefined) {
                deferred.reject({ ok: false, error: "Cannot find event in cache" });
            } else {
                deferred.resolve({ ok: true, event: event });
            }
        }

        return deferred.promise;
    }
};

// Function to call api with given options and endpoint
function apiRequest(options) {
    var deferred = q.defer();

    request(options, function(error, reqResponse, body) {
        if (error) {
            console.log('ERROR ' + contents.errorcode + ': ' + contents.errormessage);
            deferred.reject(error);
        } else {
            var contents = JSON.parse(body);
            var response;

            response = contents.results;
            response.ok = true;
            deferred.resolve(response);
        }
    });

    return deferred.promise;
}

module.exports = skiddleAPI;