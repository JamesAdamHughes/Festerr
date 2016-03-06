var express = require('express'),
    router = express.Router();
var request = require('request');
var querystring = require('querystring');

// Wrapper for the spotify API
var spotifyAPI = require('../utils/SpotifyAPI.js');

var client_id = process.env.spotify_client_id; // Your client id
var client_secret = process.env.spotify_client_secret; // Your client secret
var redirect_uri = 'http://localhost:3000/spotifyCallback'; // Your redirect uri

var stateKey = 'spotify_auth_state';

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

// Handle user wanting to auth with spotify
// Requests auth token from spotity
// Redirects user to spotify login page
router.get('/spotifyLogin', function (req, res) {

    console.log("GET https://accounts.spotify.com/authorize?");
    console.log("GET /spotifyLogin");
    
    // Generate a random state
    // The state can be useful for correlating requests and responses. Because your redirect_uri can
    // be guessed, using a state value can increase your assurance that an incoming connection is the  
    // result of an authentication request. 
    var state = generateRandomString(16);
    res.cookie(stateKey, state);
        
    // your application requests authorization
    var scope = 'user-read-private user-read-email user-library-read';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

// Called by the spotify accounts service as the given redicted URI
// Returns the auth code which we can use to ask for an access token
// access token allows to to get user spotify information
// TODO put this into spotify API file
router.get('/spotifyCallback', function (req, res) {

    console.log("GET /spotifyCallback");
    
    // your application requests refresh and access tokens
    // after checking the state parameter
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        
        // Request the access key using the auth code
        res.clearCookie(stateKey);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };
        
        // Send the request, then redirect the auth code to our client browser
        // TODO store the user access code
        // TODO handle refreshing access codes
        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {

                var access_token = body.access_token,
                    refresh_token = body.refresh_token;
                
                // Return access token in cookie to client
                res.cookie('spotifyAccessCode', access_token);
                res.cookie('spotifyRefreshToken', refresh_token);
                
                // we can also pass the token to the browser to make requests from there
                res.redirect('/#');
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        });
    }
});

// Returns all artists contained in every playlist from the given user 
router.get('/spotifyArtists', function (req, res) {
    
    var accessToken = "";
    
    // get the access token from cookie
    // TODO put this into middlewear
    var cookies = req.headers.cookie.split(" ");
    for(var i=0; i < cookies.length; i++){
        var cookie = cookies[i];
        var value = cookie.split('=');
        if(value[0] === 'spotifyAccessCode'){
            accessToken = value[1];
        }
    }

    var userID = req.query.userID;
    var response = {};

    if (accessToken !== "" || userID === undefined) {
        response.ok = true;
        response.artists = spotifyAPI.getAllArtists(accessToken, userID);
    } else {
        response.ok = false;
        response.error = "No Spotify access code in cookie or no userID given in query string";
    }

    res.send(response);
});

module.exports = router;