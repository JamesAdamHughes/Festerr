angular.module('festerrApp').factory('SearchService', function() {

    //Function to filter events and artist lists and show autocomplete suggestions for chip search
    var chipSearch = function(query, eventList, artistList) {
        var searching = true;
        var searchQuery = query;
        var events;
        var artists;
        var results;

        events = query ? eventList.filter(createEventFilterFor(query)) : [];
        events = events.map(function(event) {
            //Allows HTML to display 'name' and 'type' values in chips
            event.name = event.eventname;
            event.type = "event";
            return event;
        });

        artists = query ? artistList.filter(createArtistFilterFor(query)) : [];
        artists = artists.map(function(artist) {
            artist.type = "artist";
            return artist;
        });
        results = events.concat(artists);

        // Sort results using levenshteinSearch distance        
        results.sort(createlevenshteinSearch(searchQuery));

        // Only return the top 10 results
        return results.slice(0, 10);
    };

    // Returns a filter for the eventlist for events (or artists within that event) matching a query
    var createEventFilterFor = function(query) {
        var lowerCaseQuery = angular.lowercase(query);

        return function filterFn(event) {
            //Check if seach query matches event name
            var eventName = angular.lowercase(event.eventname).indexOf(lowerCaseQuery) !== -1;
            var artistName = false;

            //Check if search query matches any artist within that event
            if (event.artists !== undefined) {
                for (var i = event.artists.length - 1; i >= 0; i--) {
                    artistName = artistName || (angular.lowercase(event.artists[i].name).indexOf(lowerCaseQuery || '') !== -1);
                };
            }
            if (event.spotifyArtists !== undefined) {
                for (var i = event.spotifyArtists.length - 1; i >= 0; i--) {
                    artistName = artistName || (angular.lowercase(event.spotifyArtists[i].name).indexOf(lowerCaseQuery || '') !== -1);
                };
            }

            return eventName || artistName;
        };
    };

    // Returns a filter for the artist for artists matching a query
    var createArtistFilterFor = function(query) {
        var lowerCaseQuery = angular.lowercase(query);

        return function filterFn(artist) {
            return (angular.lowercase(artist.name).indexOf(lowerCaseQuery) !== -1);
        };
    };

    var createlevenshteinSearch = function(searchQuery) {
        return function(a, b) {
            var aDistance = levenshteinDistance(searchQuery, a.name);
            var bDistance = levenshteinDistance(searchQuery, b.name);
            return aDistance - bDistance;
        }
    }

    var levenshteinSearch = function(a, b) {
        var aDistance = levenshteinDistance(searchQuery, a.name);
        var bDistance = levenshteinDistance(searchQuery, b.name);
        return aDistance - bDistance;
    }

    var levenshteinDistance = function(a, b) {
        if (a.length == 0) return b.length;
        if (b.length == 0) return a.length;

        var matrix = [];

        // increment along the first column of each row
        var i;
        for (i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }

        // increment each column in the first row
        var j;
        for (j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        // Fill in the rest of the matrix
        for (i = 1; i <= b.length; i++) {
            for (j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) == a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                        Math.min(matrix[i][j - 1] + 1, // insertion
                            matrix[i - 1][j] + 1)); // deletion
                }
            }
        }

        return matrix[b.length][a.length];
    }

    return {
        chipSearch: chipSearch
    }
});