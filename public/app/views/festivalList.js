angular.module('FestivalListView', ['ngMaterial'])
    .controller('FestivalListCtrl', ['$scope', 'FestivalDataService', function($scope, FestivalDataService) {

        // Holds all info for all events we show in the events list
        $scope.eventList;

        var currentlySelectedTile = -1;

        // Get the festival data from the server and display it
        FestivalDataService.getFestivalData().then(function(res) {
            console.log(res);

            // add tile information to each festival we get
            for (var i = 0; i < res.length; i++) {
                var tileInfo = {
                    ID: i,
                    selected: false,
                    defaultSpan: {
                        cols: 8,
                        rows: 3
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
                        displaySpan: {
                            cols: 2,
                            rows: 2
                        }
                    }
                    res[i].artists[j].tileInfo = artistTileInfo;
                }
            }

            $scope.eventList = res;
        });

        $scope.search = function (row) {
            //Check if seach query matches event name
            var event = angular.lowercase(row.eventname).indexOf(angular.lowercase($scope.query) || '') !== -1;
            var artist = false;
            //Check if search query matches any artist within that event
            for (var i = row.artists.length - 1; i >= 0; i--) {
                artist = artist || (angular.lowercase(row.artists[i].name).indexOf(angular.lowercase($scope.query) || '') !== -1);
            };
            return event || artist;
        };

        $scope.selectTile = function(tile) {
            var event = $scope.eventList[tile.ID];

            // Make the previosuly selected event (if exists) original size again
            var prevEvent = $scope.eventList[currentlySelectedTile];
            if (prevEvent !== undefined) {
                prevEvent.tileInfo.displaySpan = {
                    cols: prevEvent.tileInfo.defaultSpan.cols,
                    rows: prevEvent.tileInfo.defaultSpan.rows
                };
            }

            // If it was not the previosuly selected tile, make big
            if (currentlySelectedTile !== tile.ID) {
                // Make the event taller
                event.tileInfo.displaySpan.rows = 5;
                currentlySelectedTile = tile.ID;
            } else {
                // Unselected previsouly selected tile, reset counter
                currentlySelectedTile = -1;
            }

            //TODO make old span when clicking off
        }



    }]);