var express = require('express');
var request = require('request');
var fs = require('fs');

var app = express();

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

// Serve /event 
app.get('/event', require("./controllers/events.js"));


// Start the server listening on port 3000
var server = app.listen(process.env.PORT || 3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Fester app listening at http://%s:%s', host, port);

});
