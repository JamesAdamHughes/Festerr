var express = require('express');
var request = require('request');
var fs = require('fs');
var models = require("./models"); // Database models
var sessions = require("client-sessions");

var app = express();


if(process.env.mode === "PROD"){
    // the env vars are already set
} else {
    // else in dev enviroment, so add the env variables
    var init = require('./config/setEnvVars.js');  
}

// Secret string for sessions cookie
var secretString = process.env.session_secret;

// All static filss are in the public folder
app.use(express.static(__dirname + '/public'));

// Set session middlewear configuration
app.use(sessions({
  cookieName: 'session',
  secret: secretString,
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

//used to display the html files
app.engine('.html', require('ejs').renderFile);

// Serve requests to the / url
app.get('/', setupUserSession, function (req, res) {
  res.render('index.html');
});

// Check if a user has a session, if not create one with spotify ID if they have one
function setupUserSession(req, res, next){
    if(!req.session.userID){
        // User has no session, create one for them with no id
        req.session.userID = -1;
    }
    //Finish middlewear continue route
    next();
}

// Serve /event 
app.get('/event/*', require("./controllers/events.js"));
app.get('/spotify/*', require('./controllers/spotify'));

// Example query for google image search
// var query = imageSearch.buildImageQuery("Strawberries and cream festival 2016");
// var imageSearchResult = imageSearch.makeRequest(query).then(function(res){
//     console.log(res);
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


