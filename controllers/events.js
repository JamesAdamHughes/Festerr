var express = require('express'),
    router = express.Router();
var request = require('request');
var fs = require('fs');

// API keys to access the skiddle festival database
var contents = fs.readFileSync(__dirname + '/../config/api_keys.json');
var api_keys = JSON.parse(contents);

// Serve requests to the event endpoint
router.get('/event', function(req, res){

    var response = {ok: false};
    res.contentType('json');

    // Check the type variable exists, and return the appropriate data in response
    if(req.query.type !== undefined) {

        // 'All' returns the entire events list
        if(req.query.type === "all") {

            //Get all events from Skiddle API
            var options = { method: 'GET',
              url: api_keys.skiddle.url + 'events/',
              qs: 
               { eventcode: 'FEST',
                 order: '4',
                 api_key: api_keys.skiddle.key } };

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
              }
              res.send(response);
            });

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