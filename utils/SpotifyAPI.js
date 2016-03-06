var fs = require('fs');

var spotifyAPI = {
    
    // Returns all artists in every playlist for a given user
    getAllArtists: function (accessToken, userID) {
        // TODO replace with API call here
        var content = fs.readFileSync('./public/json_dump/spotify_playlist_dump.json');
        content = JSON.parse(content);
        
        var tracksItems = content.items;
        var artists = [];
        
        // Get all unique artists
        tracksItems.forEach(function(trackItem){
            var track = trackItem.track;
            track.artists.forEach(function (artist) {
                if(artists.indexOf(artist.name) === -1) {
                    artists.push(artist.name);
                }
            });
        });
        
        return artists;        
    }
};

module.exports = spotifyAPI;