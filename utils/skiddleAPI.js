var request = require('request');

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
                    cachedEventData = contents.results;
                    response = contents.results;
                    response.ok = true;
                }
                res.send(response);
            });
        // Cached data present
        } else {
            response = cachedEventData;
            response.ok = true;
            res.send(response);
        }

    }
};

module.exports = skiddleAPI;