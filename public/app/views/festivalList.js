angular.module('FestivalListView', ['ngMaterial'])
    .controller('FestivalListCtrl', ['$scope', 'FestivalDataService', function($scope, FestivalDataService) {

        // Holds all info for all events we show in the events list
        $scope.eventList;

        $scope.currentlySelectedTile = -1;

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
            }

            $scope.eventList = res;
        });

        $scope.selectTile = function(tile) {
            var event = $scope.eventList[tile.ID];

            // Make the previosuly selected event (if exists) original size again
            var prevEvent = $scope.eventList[$scope.currentlySelectedTile];
            if (prevEvent !== undefined) {
                prevEvent.tileInfo.displaySpan = {
                    cols: prevEvent.tileInfo.defaultSpan.cols,
                    rows: prevEvent.tileInfo.defaultSpan.rows
                };
            }

            // If it was not the previosuly selected tile, make big
            if ($scope.currentlySelectedTile !== tile.ID) {
                // Make the event taller
                event.tileInfo.displaySpan.rows = 5;
                $scope.currentlySelectedTile = tile.ID;
            } else {
                // Unselected previsouly selected tile, reset counter
                $scope.currentlySelectedTile = -1;
            }

            //TODO make old span when clicking off
        }



    }]);