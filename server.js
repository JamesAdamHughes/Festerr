var express = require('express');
var fs = require('fs');
var https = require('https');

if(process.env.mode === "PROD"){
    // the env vars are already set
} else {
    // else in dev enviroment, so add the env variables
    require('./config/setEnvVars.js');  
}

var options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
};

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
app.get('/spotify/*', require('./controllers/spotify'));

console.log("starting server");
// Start the server listening on port 3000
https.createServer(options, app).listen(process.env.PORT || 3000, function(){
    console.log("Server listening on port 3000");
});
