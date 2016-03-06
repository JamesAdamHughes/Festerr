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
            console.log(trackItem);
            var track = trackItem.track;
            track.artists.forEach(function (artist) {
                artists.push(artist.name);
            });
        });
        
        console.log(artists);
    }
};

module.exports = spotifyAPI;