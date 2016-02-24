angular.module('FestivalListView', ['ngMaterial'])
    .controller('FestivalListCtrl', ['$scope', 'FestivalDataService', function($scope, FestivalDataService) {

        // Holds all info for all events we show in the events list
        $scope.eventList = FestivalDataService.getFestivalData();


//         for (var i = 0; i < 10; i++) {
//             var numDays = Math.floor(Math.random() * 8);
//             if (numDays === 0) {
//                 numDays = 1;
//             }

//             var tiles = buildGridModel({
//                 icon: "avatar:svg-",
//                 title: "",
//                 background: ""
//             }, numDays);
//             $scope.tileList.push(tiles);
//         }

// =    

        
        // $scope.changeSize = function(tile) {
        //     if (tile.selected === false || tile.selected === undefined) {
        //         tile.oldSpan = {
        //             row: tile.span.row,
        //             col: tile.span.col
        //         };
        //         tile.span.col = 8;
        //         tile.span.row = 3;
        //         tile.selected = true;

        //     } else {
        //         tile.span = tile.oldSpan;
        //         tile.selected = false;
        //     }

        // }


        
    }]);