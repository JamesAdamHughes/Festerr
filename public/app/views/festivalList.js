angular.module('FestivalListView', ['ngMaterial'])
    .controller('FestivalListCtrl', ['$scope', 'FestivalDataService', '$interval', function ($scope, FestivalDataService, $interval) {

        // Holds all info for all events we show in the events list
        $scope.eventList;
        $scope.artistList;
        $scope.currentlySelectedEventTile = -1;
        $scope.currentlySelectedArtistTile = -1;

        $scope.eventsLoaded = false;

        $scope.selectedChips = [];
        $scope.selectedChip = null;
        $scope.searchText = null;

        // Get the festival data from the server and display it
        FestivalDataService.getFestivalData().then(function (res) {

            // add tile information to each festival we get
            for (var i = 0; i < res.length; i++) {
                var tileInfo = {
                    ID: i,
                    selected: false,
                    defaultSpan: {
                        cols: 8,
                        rows: 3
                    },
                    expandedSpan: {
                        cols: 8,
                        rows: 5
                    },
                    displaySpan: {
                        cols: 8,
                        rows: 3
                    }
                }
                res[i].tileInfo = tileInfo;
                for (var j = 0; j < res[i].artists.length; j++) {
                    var artistTileInfo = {
                        ID: j,
                        selected: false,
                        defaultSpan: {
                            cols: 2,
                            rows: 2
                        },
                        expandedSpan: {
                            cols: 4,
                            rows: 4
                        },
                        displaySpan: {
                            cols: 2,
                            rows: 2
                        }
                    }
                    res[i].artists[j].tileInfo = artistTileInfo;
                }
            }

            $scope.eventList = res;

        }).then(function() {
            var results = [];
            var names = [];
            // Create list of available list
            for (var i = $scope.eventList.length - 1; i >= 0; i--) {
                for (var j = $scope.eventList[i].artists.length - 1; j >= 0; j--) {
                    // Uses separate list of artist names so as to be able to quickly check their presence
                    if (names.indexOf($scope.eventList[i].artists[j].name) == -1) {
                        results.push($scope.eventList[i].artists[j]);
                        names.push($scope.eventList[i].artists[j].name);
                    }
                };
            };
            $scope.artistList = results;
  
            // Show the loading icon for 0.5s before showing content
            $interval(function () {
                $scope.eventsLoaded = true;
            }, 500, 1);

        });

        //Fucntion to filter event tiles from the list based on search chips
        $scope.displayEvent = function (event) {
            var display = true;
            //If there are no chips, display all results
            if ($scope.selectedChips.length == 0) return true;
            var eventName = angular.lowercase(event.eventname);
            for (var i = $scope.selectedChips.length - 1; i >=0; i--) {
                var chipName = angular.lowercase($scope.selectedChips[i].name);
                //Is this an event or an artist chip?
                if ($scope.selectedChips[i].eventname) {
                    display = display && (eventName == chipName);
                } else {
                    var artistPresent = false;
                    //Check through all artists in this event and return true if one matches the chip
                    for (var j = event.artists.length -1; j >=0; j--) {
                        var artistName = angular.lowercase(event.artists[j].name);
                        artistPresent = artistPresent || artistName == chipName;

                        //LOGIC FOR HIGHLIGHTING MATCHING ARTISTS CAN GO HERE, EG:
                        // event.artists[j].tileInfo.border = artistName == chipName? 'solid 5px blue' : '';
                    }
                    display = display && artistPresent;
                }
            }
            return display;
        }

        //Function to filter events and artist lists and show autocomplete suggestions for chip search
        $scope.chipSearch = function (query) {
            var events = query ? $scope.eventList.filter($scope.createEventFilterFor(query)) : [];
            events = events.map(function (event) {
                //Allows HTML to display 'name' and 'type' values in chips
                event.name = event.eventname;
                event.type = "event";
                return event;
            });
            var artists = query ? $scope.artistList.filter($scope.createArtistFilterFor(query)) : [];
            artists = artists.map(function (artist) {
                artist.type = "artist";
                return artist;
            });
            var results = events.concat(artists);
            //RESULTS COULD BE SORTED BY SOME VALUE HERE?
            return results;
        }

        //Filters the eventlist for events (or artists within that event) matching a query
        $scope.createEventFilterFor = function (query) {
            var lowerCaseQuery = angular.lowercase(query);
            return function filterFn(event) {
                //Check if seach query matches event name
                var eventName = angular.lowercase(event.eventname).indexOf(lowerCaseQuery) !== -1;
                var artistName = false;
                //Check if search query matches any artist within that event
                for (var i = event.artists.length - 1; i >= 0; i--) {
                    artistName = artistName || (angular.lowercase(event.artists[i].name).indexOf(lowerCaseQuery || '') !== -1);
                };
                return eventName || artistName;
            }
        }

        //Filters the artist for artists matching a query
        $scope.createArtistFilterFor = function (query) {
            var lowerCaseQuery = angular.lowercase(query);
            return function filterFn(artist) {
                return (angular.lowercase(artist.name).indexOf(lowerCaseQuery) !== -1);
            }   
        }

        $scope.selectEventTile = function (tile) {
            var event = $scope.eventList[tile.ID];

            // Make the previosuly selected event (if exists) original size again
            var prevEvent = $scope.eventList[$scope.currentlySelectedEventTile];
            if (prevEvent !== undefined) {
                prevEvent.tileInfo.displaySpan = {
                    cols: prevEvent.tileInfo.defaultSpan.cols,
                    rows: prevEvent.tileInfo.defaultSpan.rows
                };
            }

            // If it was not the previosuly selected tile, make big
            if ($scope.currentlySelectedEventTile !== tile.ID) {
                // Make the event taller
                event.tileInfo.displaySpan = {
                    cols: event.tileInfo.expandedSpan.cols,
                    rows: event.tileInfo.expandedSpan.rows
                };
                $scope.currentlySelectedEventTile = tile.ID;
            } else {
                // Unselected previsouly selected tile, reset counter
                $scope.currentlySelectedEventTile = -1;
            }

            //TODO make old span when clicking off
        }

        $scope.selectArtistTile = function (event, tile) {
            var artist = $scope.eventList[event.ID].artists[tile.ID];

            var prevArtist = $scope.eventList[event.ID].artists[$scope.currentlySelectedArtistTile];
            if (prevArtist !== undefined) {
                prevArtist.tileInfo.displaySpan = {
                    cols: prevArtist.tileInfo.defaultSpan.cols,
                    rows: prevArtist.tileInfo.defaultSpan.rows
                };
            }

            // If it was not the previosuly selected tile, make big
            if ($scope.currentlySelectedArtistTile !== tile.ID) {
                // Make the artist taller and wider
                artist.tileInfo.displaySpan = {
                    cols: artist.tileInfo.expandedSpan.cols,
                    rows: artist.tileInfo.expandedSpan.rows
                };
                $scope.currentlySelectedArtistTile = tile.ID;
            } else {
                // Unselected previsouly selected tile, reset counter
                $scope.currentlySelectedArtistTile = -1;
            }

        }    
    }]);