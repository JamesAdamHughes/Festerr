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

        res.clearCookie(stateKey);
        
        // Request the access key using the auth code
        spotifyAPI.getAccessToken(code, redirect_uri, client_id, client_secret).then(function (tokens) {
            // Return access token in cookie to client
            res.cookie('spotifyAccessCode', tokens.access_token);
            res.cookie('spotifyRefreshToken', tokens.refresh_token);
                
            // we can also pass the token to the browser to make requests from there
            res.redirect('/#');
        }).catch(function(err){
            res.redirect('/#' + querystring.stringify(err));
        });
    }
});

// Returns all artists contained in every playlist from the given user 
router.get('/spotifyArtists', function (req, res) {

    console.log("GET /spotifyArtists");
    var accessToken = "";
    
    // get the access token from cookie
    // TODO put this into middlewear
    var cookies = req.headers.cookie.split(" ");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var value = cookie.split('=');
        if (value[0] === 'spotifyAccessCode') {
            accessToken = value[1];
        }
    }

    var userID = req.query.userID;
    var response = {};
    
    // Get all the artists for the given user ID
    if (accessToken !== "" || userID === undefined) {

        spotifyAPI.getAllArtists(accessToken, userID).then(function (artists) {
            response.ok = true;
            response.artists = artists;
            console.log(response);
            res.send(response);
        }).catch(function (err) {
            response.ok = false;
            response.message = "an error occured";
            response.statusCode = "500";
            response.err = err;
            console.log(response);
            res.send(response);
        });

    } else {
        response.ok = false;
        response.error = "No Spotify access code in cookie or no userID given in query string";
        res.send(response);
    }
});

module.exports = router;