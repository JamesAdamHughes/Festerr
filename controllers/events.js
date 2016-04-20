var express = require('express'),
    router = express.Router();
var skiddleAPI = require(__dirname + '/../utils/skiddleAPI');
var models = require('../models');
var q = require('q');
/*
    Given a user (in session) and an event, lets user add an event to their likes
*/
router.get('/event/:eventid/like', function(req, res) {
    // get the user if they exist in the db
    var user;
    var event;
    console.log("POST /event/id/like");
    
    // Get the user and event, join together
    if (req.session.userID && req.params.eventid) {
        models.User.findOne(
            { where: { spotifyID: req.session.userID } 
        }).then(function(u) {
            user = u;
            return models.Event.findOne({ where: { skiddleID: req.params.eventid }}); 
        }).then(function(e) {
            event = e;           
        
            if (user && event) {               
                // Add the user to the event in the UserEvent table
                return user.addEvent(event);    
            } else {
                var error = "";
                if (user) {
                    error = "Could not find event  " + req.params.eventid;
                } else if(event){
                    error = "Could not find user " + req.session.userID;
                } else {
                    error = "Could not find event or user";
                }     
                console.error(error); 
                res.send(error);          
            }
        }).then(function(){
           console.log("Added event " + req.params.eventid +" to user " + req.session.userID);
        }).catch(function(err){
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
router.get('/event/', function(req, res) {

    var response = { ok: false };
    res.contentType('json');

    // Check the type variable exists, and return the appropriate data in response
    if (req.query.type !== undefined) {

        // 'All' returns the entire events list
        if (req.query.type === "all") {
            skiddleAPI.getAllEvents().then(function(response) {
                res.send(response);
            });
        }
        // just return a single events detail
        else if (req.query.type = "single") {

            // We can now access the user session if it exists
            // console.log(req.session.userID);

            // Use event id from the query string
            if (req.query.id !== undefined) {
                skiddleAPI.getSingleEvent(req.query.id).then(function(response) {
                    res.send(response);
                }).catch(function(err) {
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


module.exports = router;