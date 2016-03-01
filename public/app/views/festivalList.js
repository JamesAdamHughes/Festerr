angular.module('FestivalListView', ['ngMaterial'])
    .controller('FestivalListCtrl', ['$scope', 'FestivalDataService', '$interval', function ($scope, FestivalDataService, $interval) {

        // Holds all info for all events we show in the events list
        $scope.eventList;

        $scope.currentlySelectedEventTile = -1;
        $scope.currentlySelectedArtistTile = -1;

        $scope.eventsLoaded = false;

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
               
            // Show the loading icon for 0.5s before showing content
            $interval(function () {
                $scope.eventsLoaded = true;
            }, 500, 1);

        });

        $scope.search = function (event) {
            //Check if seach query matches event name
            var eventName = angular.lowercase(event.eventname).indexOf(angular.lowercase($scope.query) || '') !== -1;
            var artistName = false;
            //Check if search query matches any artist within that event
            for (var i = event.artists.length - 1; i >= 0; i--) {
                artistName = artistName || (angular.lowercase(event.artists[i].name).indexOf(angular.lowercase($scope.query) || '') !== -1);
            };
            return eventName || artistName;
        };

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