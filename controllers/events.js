var express = require('express'),
    router = express.Router();
var skiddleAPI = require(__dirname + '/../utils/skiddleAPI');
var googleImageSearch = require(__dirname + '/../utils/googleImageSearch');
var models = require('../models');
var q = require('q');

/*
    Given a user (in session) and an event, lets user add an event to their likes
*/
router.get('/event/:eventid/like', function (req, res) {
    // get the user if they exist in the db
    var user;
    var event;
    console.log("POST /event/id/like");

    // Get the user and event, join together
    if (req.session.userID && req.params.eventid) {
        models.User.findOne(
            {
                where: { spotifyID: req.session.userID }
            }).then(function (u) {
                user = u;
                return models.Event.findOne({ where: { skiddleID: req.params.eventid } });
            }).then(function (e) {
                event = e;

                if (user && event) {
                    // Add the user to the event in the UserEvent table
                    return user.addEvent(event);
                } else {
                    var error = "";
                    if (user) {
                        error = "Could not find event  " + req.params.eventid;
                    } else if (event) {
                        error = "Could not find user " + req.session.userID;
                    } else {
                        error = "Could not find event or user";
                    }
                    console.error(error);
                    res.send(error);
                    throw new Error(error);
                }
            }).then(function () {
                console.log("Added event " + req.params.eventid + " to user " + req.session.userID);
            }).catch(function (err) {
                console.error(err);
            });

    } else {
        console.error("Error occured");
        console.log(req.session.userID);
        console.log(req.params.eventid);
        res.send("Error occured");
    }
});

// Serve requests to the event endpoint
router.get('/event/', function (req, res) {

    var response = { ok: false };
    res.contentType('json');

    // Check the type variable exists, and return the appropriate data in response
    if (req.query.type !== undefined) {

        // 'All' returns the entire events list
        if (req.query.type === "all") {
            skiddleAPI.getAllEvents().then(function (response) {
                res.send(response);
            });
        }
        // just return a single events detail
        else if (req.query.type = "single") {

            // Get the event data, and see if the user has liked it already
            if (req.query.id !== undefined) {
                skiddleAPI.getSingleEvent(req.query.id).then(function (data) {
                    // If a logged in user requests this, see if they have liked this event
                    if (data.ok) {
                        response = data;
                        // Build google search query (with extra terms "crowd" & "stage" to get better images)
                        var query = googleImageSearch.buildImageQuery(response.event.eventname + " festival crowd stage");
                        // Make google search
                        return googleImageSearch.makeRequest(query).then( function(imageResponse) {
                            return imageResponse[0].link;
                        }).catch(function (err) {
                            console.log("ERROR " + err.message);
                            return response.event.largeimageurl;
                        }); 
                    }
                }).then(function (imageResponse){
                    response.event.headerimageurl = imageResponse;
                    return models.User.findOne({ where: { spotifyID: req.session.userID } });
                }).then(function (user) {
                    if (!user) {
                        // If not logged in, just send normal data with no like info
                        res.send(response);
                    } else {

                        // if logged in, check if they have liked this one
                        user.getEvents({
                            where: { skiddleID: response.event.id }
                        }).then(function (userEvents) {
                            if (userEvents.length !== 0) {
                                // The user has liked this previously!
                                response.liked = true;
                            }
                            res.send(response);
                        });
                    }
                }).catch(function (err) {
                    console.log("ERROR " + err);
                    res.send(err);
                });
            } else {
                response.error = "No id in query string";
                res.send(response);
            }
        } else {
            response.error = "Unknown query type";
            res.send(response);
        }
    } else {
        response.error = "Undefined query type";
        res.send(response);
    }

});

/*
    Returns all of a user's liked events otherwise return empty json
*/
router.get('/event/likes', function (req, res) {
    console.log("GET /event/likes");

    var response = { ok: false };

    if (req.session.userID) {
        models.User.findOne({
            where: { spotifyID: req.session.userID }
        }).then(function (user) {
            if (user) {
                return user.getEvents();
            }
            else {
                throw new Error("No user found with id " + req.session.userID);
            }
        }).then(function (events) {
            // Get the event information
            var promises = [];

            for (var i = 0; i < events.length; i++) {
                var p = skiddleAPI.getSingleEvent(events[i].dataValues.skiddleID).then(function (eventData) {
                    console.log(eventData.event.eventname);
                    return eventData;
                }).catch(function (err) {
                    // couldn't find the festival, return nothing
                });
                promises.push(p);
            }
            // Collect all the events data 
            return q.all(promises);
        }).then(function (userLikedEvents) {
            var finalEvents = [];
            userLikedEvents.forEach(function (e) {
                if (e) {
                    // event may be indefined if not found
                    finalEvents.push(e.event);
                }
            });
            response.events = finalEvents;
            response.ok = true;
            res.send(response);
        }).catch(function (err) {
            console.log(err);
            response.error = err;
            res.send(response);
        });
    } else {
        res.send(response);
    }

});


module.exports = router;