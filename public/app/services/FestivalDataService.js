angular.module('festerrApp').factory('FestivalDataService', function ($q, NetworkService, DateFormatService) {

    var cachedEventList = [];
    var artistList = [];

    /*
        Returns the festivals data

        TODO allow for query paramters to refine the search
    */
    var getFestivalData = function () {
        var deferred = $q.defer();

        if (cachedEventList.length === 0) {
            NetworkService.callAPI('/event/?type=all', {
                method: 'GET'
            }).then(function (res) {
                cachedEventList = res;
                
                var addedArtists = [];

                // Get the artists into a seperate list, get nice date for events
                cachedEventList.forEach(function (event) {
                    
                    event.formattedDate = DateFormatService.format(event.date);
                    
                    event.artists.forEach(function (artist) {
                        // Only add artists not already added
                        if (addedArtists.indexOf(artist.name) === -1) {
                            artistList.push(artist);
                            addedArtists.push(artist.name);
                        }
                    });
                });

                deferred.resolve({events: cachedEventList, artists: artistList});
            }).catch(function (err) {
                deferred.reject(err);
            });
        } else {
            deferred.resolve({events: cachedEventList, artists: artistList});
        }

        return deferred.promise;
    };

    var getArtistList = function () {
        return artistList;
    };

    return {
        getFestivalData: getFestivalData,
        getArtistList: getArtistList
    };

});