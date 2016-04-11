var express = require('express'),
    router = express.Router();
var request = require('request');
var fs = require('fs');
var skiddleAPI = require(__dirname + '/../utils/skiddleAPI');

// Serve requests to the event endpoint
router.get('/event', function(req, res) {

    var response = { ok: false };
    res.contentType('json');

    // Check the type variable exists, and return the appropriate data in response
    if (req.query.type !== undefined) {

        // 'All' returns the entire events list
        if (req.query.type === "all") {
            skiddleAPI.getAllEvents(res);
        }
        // just return a single events detail
        else if (req.query.type = "single") {
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