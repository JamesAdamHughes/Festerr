var express = require('express');
var app = express();
var request = require('request');

// API keys to access the skiddle festival database
var SKIDDLE_URL = "https://www.skiddle.com/api/v1/";
var SKIDDLE_API_KEY = "/?api_key=4746dc555db14c2c5b8f52295ef28c08";

// All static filss are in the public folder
app.use(express.static(__dirname + '/public'));

//used to display the html files
app.engine('.html', require('ejs').renderFile);

// Serve requests to the / url and respond with the file 'test.html'
app.get('/', function (req, res) {
  res.render('festivalMap.html');
});

// Serve requests to 'event' 
// Returns a given events data from the Skiddle database using event_id
app.get('/event', function (req, res) {
	
	var event_id = req.query.event_id;
	var response;

	res.contentType('json');

    // Call skiddle api and return the response
	request(SKIDDLE_URL + "events/" + event_id + SKIDDLE_API_KEY, function (error, request, body) {
		if(!error && request.statusCode == 200){
			response = body;
			res.send(response)
		}
		else{
			response ={"error": "couldnt get data"};
			res.send(response);
		}
	});

})

// Start the server listening on port 3000
var server = app.listen(process.env.PORT || 3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Fester app listening at http://%s:%s', host, port);

});
