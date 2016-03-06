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
            console.error("Error getting spotify resource " + resourceURL + ": " + JSON.parse(body));
            deferred.reject(err);
        }
    });

    return deferred.promise;
}

var spotifyAPI = {
    
    // Returns all artists in every playlist for a given user
    // get playlists first, then gets artists from each
    getAllArtists: function (accessToken, userID) {

        var artists = [];
        
        // Get user playlists
        var resourceURL =  'users/' + userID + '/playlists';

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

    }
};

module.exports = spotifyAPI;