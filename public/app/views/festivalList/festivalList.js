angular.module('FestivalListView', ['ngMaterial'])
    .controller('FestivalListCtrl', ['$scope', '$rootScope', 'FestivalDataService', 'SpotifyService', 'DateFormatService', '$interval', '$q',
        function($scope, $rootScope, FestivalDataService, SpotifyService, DateFormatService, $interval, $q) {

            // Holds all info for all events we show in the events list
            $scope.eventList;
            $scope.artistList;
            $scope.currentlySelectedEventTile = -1;
            $scope.userArtistList = [];
            $scope.eventsLoaded = false;

            var selectedChips = [];

            // Get the festival data from the server and display it
            FestivalDataService.getFestivalData().then(function(res) {

                // add tile information to each festival we get
                for (var i = 0; i < res.length; i++) {
                    var tileInfo = {
                        ID: i,
                        selected: false
                    };
                    res[i].tileInfo = tileInfo;
                    for (var j = 0; j < res[i].artists.length; j++) {
                        var artistTileInfo = {
                            ID: j,
                            selected: false
                        };
                        res[i].artists[j].tileInfo = artistTileInfo;
                    }
                }
                $scope.eventList = res;

                var results = [];
                var names = [];
                // Create list of available list
                for (var i = $scope.eventList.length - 1; i >= 0; i--) {

                    $scope.eventList[i].formattedDate = DateFormatService.format($scope.eventList[i].date);

                    for (var j = $scope.eventList[i].artists.length - 1; j >= 0; j--) {
                        // Uses separate list of artist names so as to be able to quickly check their presence
                        if (names.indexOf($scope.eventList[i].artists[j].name) === -1) {
                            results.push($scope.eventList[i].artists[j]);
                            names.push($scope.eventList[i].artists[j].name);
                        }
                    }
                }
                $scope.artistList = results;

                // get user's artist list from spotify
                return SpotifyService.getAllArtists();

            }).then(function(userArtists) {

                // Set user artist list in directive
                $scope.userArtistList = userArtists;

                //Only need to calculate user artists if there are any
                if (userArtists.length !== 0) {
                    //Break event artist list into ones from the user's spotify and the rest
                    var promises = [];
                    for (var i = $scope.eventList.length - 1; i >= 0; i--) {
                        var promise = filterEventArtists(i);
                        promises.push(promise);
                    }
                    // return when all the events have been filtered
                    return $q.all(promises);

                }
            }).then(function(res) {
                
                // Sort the events by how many spotufy artist are in it
                $scope.eventList.sort(function(a, b) {
                    return b.spotifyArtists.length - a.spotifyArtists.length;
                });

                // Show the loading icon for 0.5s before showing content
                $interval(function() {
                    $scope.eventsLoaded = true;
                }, 500, 1);

            }).catch(function(err) {
                console.log("An error occured getting artist or festival data: %o", err);
                // show events anyway
                $scope.eventsLoaded = true;
            });

            // Listen for searches from the search box
            // Update the list of selected items to the selected Chips
            $rootScope.$on('header searchItemsUpdated', function(event, selected) {
                selectedChips = selected;
            });

            function filterEventArtists(i) {
                return SpotifyService.filterUserArtists($scope.eventList[i].artists).then(function(filtered) {
                    $scope.eventList[i].spotifyArtists = filtered.user;
                    $scope.eventList[i].artists = filtered.other;
                });
            }

            // Function to filter event tiles from the list based on search chips
            $scope.displayEvent = function(event) {
                var display = true;
                var eventName = angular.lowercase(event.eventname);
                var chipName = "";
                var artistPresent;
                var artistName = "";

                //If there are no chips, display all results
                if (selectedChips.length === 0) return true;

                for (var i = selectedChips.length - 1; i >= 0; i--) {
                    chipName = angular.lowercase(selectedChips[i].name);
                    //Is this an event or an artist chip?
                    if (selectedChips[i].eventname) {
                        display = display && (eventName === chipName);
                    } else {
                        artistPresent = false;
                        //Check through all artists in this event and return true if one matches the chip
                        for (var j = event.artists.length - 1; j >= 0; j--) {
                            artistName = angular.lowercase(event.artists[j].name);
                            artistPresent = artistPresent || artistName === chipName;

                            //LOGIC FOR HIGHLIGHTING MATCHING ARTISTS CAN GO HERE, EG:
                            // event.artists[j].tileInfo.border = artistName  ===  chipName? 'solid 5px blue' : '';
                        }
                        if (event.spotifyArtists !== undefined) {
                            for (var j = event.spotifyArtists.length - 1; j >= 0; j--) {
                                artistName = angular.lowercase(event.spotifyArtists[j].name);
                                artistPresent = artistPresent || artistName === chipName;
                            }
                        }

                        display = display && artistPresent;
                    }
                }
                return display;
            };

            // When a tile is selected, tell the prev selected to collapse          
            // $scope.tileSelected = function(id) {
            //     var prevEvent = $scope.eventList[$scope.currentlySelectedEventTile];

            //     // tell prev selected to close, unless it is same as the one selected
            //     // that is handled by the directive itself
            //     if (prevEvent !== undefined) {

            //         if (prevEvent.tileInfo.ID === id) {
            //             // selected prev open, reset counter
            //             $scope.currentlySelectedEventTile = -1;
            //         } else {
            //             $scope.currentlySelectedEventTile = id;
            //         }
            //         // collpase is a function defined in the festvial tile directive
            //         prevEvent.collapse();
            //     } else {
            //         $scope.currentlySelectedEventTile = id;
            //     }
            // };

            $scope.tileSelected = function(event) {
                window.location.href = "#/event/?id=" + event.id;

            };

        }]);