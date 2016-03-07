var fs = require('fs');
var request = require('request');
var q = require('q');

var spotifyAPIUrl = 'https://api.spotify.com/v1/';
var defaultOptions = {
    url: spotifyAPIUrl,
    headers: { 'Authorization': '' } // put in access token here
};

function makeSpotifyRequest(resourceURL, accessToken) {
    var req = defaultOptions;
    var deferred = q.defer();

    req.url = spotifyAPIUrl + resourceURL;
    req.headers.Authorization = 'Bearer ' + accessToken;

    request(req, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            deferred.resolve(JSON.parse(body));
        } else {
            console.error("Error getting spotify resource " + resourceURL + ": %o", body);
            deferred.reject(err);
        }
    });

    return deferred.promise;
}

var spotifyAPI = {
    
    // Returns all promise that gives artists in every playlist for a given user    
    getAllArtists: function (accessToken, userID) {
        var artists = [];
        // Get user playlists
        var resourceURL = 'users/' + userID + '/playlists';
        
        // get playlists first, then gets artists from each
        return makeSpotifyRequest(resourceURL, accessToken).then(function (playlists) {
            // For each playlist, get the artists in the tracks
            // For now, just the top playlist
            var playlist = playlists.items[0];
            return makeSpotifyRequest(resourceURL + "/" + playlist.id, accessToken);
        }).then(function (playlist) {

            var trackItems = playlist.tracks.items;
            
            // Get all unique artists
            trackItems.forEach(function (trackItem) {
                var track = trackItem.track;
                track.artists.forEach(function (artist) {
                    if (artists.indexOf(artist.name) === -1) {
                        artists.push(artist.name);
                    }
                });
            });
            
            // return the artists list
            return artists;
        });
    },

    getAccessToken: function (code, redirect_uri, client_id, client_secret) {
        var deferred = q.defer();

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
        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var access_token = body.access_token,
                    refresh_token = body.refresh_token;

                deferred.resolve({
                    access_token: access_token,
                    refresh_token: refresh_token
                });
            } else {
                deferred.reject({
                    error: 'invalid_token'
                });
            }
        });

        return deferred.promise;
    },
    
    // Request a new access token
    // Requires an existing fresh token
    refreshAccessToken: function (refresh_token, client_id, client_secret) {
        var deferred = q.defer();
        
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
            form: {
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                deferred.resolve(body.access_token);
            } else {
                deferred.rejct(body);
            }
        });
    }
};

module.exports = spotifyAPI;