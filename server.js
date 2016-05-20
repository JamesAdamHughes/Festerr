var express = require('express');
var fs = require('fs');
var https = require('https');
var http = require('http');
var sessions = require("client-sessions");
var models = require("./models"); // Database models

// check if enviroment vars are set, else load them
if (process.env.mode !== "PROD") { require('./config/setEnvVars.js'); }

var secretString = process.env.session_secret; // secret used to encrypt the session cookies
var app = express();

// Whether the app can run https or not (heroku it cannot have https for example, locally we can)
var httpsEnabled = false;
var options = {};

try {
    options = {
        key: fs.readFileSync('./config/server.key'),
        cert: fs.readFileSync('./config/server.crt')
    };
    httpsEnabled = true;
} catch (err) {
    console.log("CERTS NOT FOUND, USING HTTP INSTEAD");
}

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
function setupUserSession(req, res, next) {
    if (!req.session.userID) {
        // User has no session, create one for them with no id
        req.session.userID = -1;
    }
    //Finish middlewear continue route
    next();
}

// Serve endpoints with different controllers
app.get('/event/*', require("./controllers/events.js"));
app.get('/spotify/*', require('./controllers/spotify'));

/*
    Start the server listening on port 3000
    All database logic in models,
    Sequelize will sync the models with database and then start the server
*/
models.sequelize.sync().then(function () {

    if (httpsEnabled) {
        var server = https.createServer(options, app).listen(process.env.PORT || 3000, function () {
            var host = server.address().address;
            var port = server.address().port;

            console.log('Fester app listening at https://%s:%s', host, port);

        });
    } else {
        var server = http.createServer(app).listen(process.env.PORT || 3000, function () {
            var host = server.address().address;
            var port = server.address().port;

            console.log('Fester app listening at http://%s:%s', host, port);

        });
    }
});


