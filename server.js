var express = require('express');
var request = require('request');
var fs = require('fs');
var imageSearch = require('./utils/googleImageSearch');

var app = express();

// All static filss are in the public folder
app.use(express.static(__dirname + '/public'));

//used to display the html files
app.engine('.html', require('ejs').renderFile);

// Serve requests to the / url and respond with the file 'test.html'
app.get('/', function (req, res) {
  res.render('index.html');
});

// Serve /event 
app.get('/event', require("./controllers/events.js"));

// Example query for google image search
// var query = imageSearch.buildImageQuery("Strawberries and cream festival 2016");
// var imageSearchResult = imageSearch.makeRequest(query).then(function(res){
//     console.log(res);
// });



// Start the server listening on port 3000
var server = app.listen(process.env.PORT || 3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Fester app listening at http://%s:%s', host, port);

});
