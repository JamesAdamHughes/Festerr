var express = require('express'),
    router = express.Router();
var request = require('request');
var fs = require('fs');
var skiddleAPI = require(__dirname + '/../utils/skiddleAPI');

// Serve requests to the event endpoint
router.get('/event', function(req, res){

    var response = {ok: false};
    res.contentType('json');

    // Check the type variable exists, and return the appropriate data in response
    if(req.query.type !== undefined) {

        // 'All' returns the entire events list
        if(req.query.type === "all") {

            skiddleAPI.getAllEvents(res);

        // Unknown query type
        } else {
            res.send(response);
        }
        
    // Undefined query type
    } else {
        res.send(response);
    }

});

module.exports = router;