var express = require('express'),
    router = express.Router();
var fs = require('fs');

// API keys to access the skiddle festival database
var contents = fs.readFileSync(__dirname + '/../public/json_dump/smaller_dump_23_2_16.json');
var festivalData = JSON.parse(contents).results;

// Serve requests to the event endpoint
router.get('/event', function(req, res){

    var response = {ok: false};
    res.contentType('json');

    // Check the type variable exists, and return the appropriate data in response
    if(req.query.type !== undefined) {

        // 'All' returns the entire events list
        if(req.query.type === "all") {
            response = festivalData;
            response.ok = true;
        }
    }

    res.send(response);
});

module.exports = router;