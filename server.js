var express = require('express');
var request = require('request');
var fs = require('fs');
// var User = require('./utils/databaseManager.js');
var app = express();

var models = require("./models");

// API keys to access the skiddle festival database
var contents = fs.readFileSync(__dirname + '/config/api_keys.json');
var api_keys = JSON.parse(contents);

// All static filss are in the public folder
app.use(express.static(__dirname + '/public'));

//used to display the html files
app.engine('.html', require('ejs').renderFile);

// Serve requests to the / url and respond with the file 'test.html'
app.get('/', function (req, res) {
    res.render('festivalMap.html');
});

app.get('/event', require("./controllers/events.js"));

app.get('/create', require('./controllers/testEvents.js'));

// Serve requests to 'event' 
// // Returns a given events data from the Skiddle database using event_id
// app.get('/event', function (req, res) {
	
// 	var event_id = req.query.event_id;
// 	var response;

// 	res.contentType('json');

//     // Call skiddle api and return the response
// 	request(api_keys.skiddle.url + "events/" + event_id + api_keys.skiddle.key, function (error, request, body) {
// 		if(!error && request.statusCode == 200){
// 			response = body;
// 			res.send(response)
// 		}
// 		else{
// 			response ={"error": "couldnt get data"};
// 			res.send(response);
// 		}
// 	});
// });

/* 
    Start the server listening on port 3000
    All database logic in models,
    Sequelize will sync the models with database and then start the server
*/
models.sequelize.sync().then(function () {
    var server = app.listen(process.env.PORT || 3000, function () {

        var host = server.address().address;
        var port = server.address().port;

        console.log('Fester app listening at http://%s:%s', host, port);

    });
});


