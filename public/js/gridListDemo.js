angular.module('MyApp', ['ngMaterial'])
    .controller('gridListDemoCtrl', function($scope) {

        console.log("we loaded brah");

        $scope.tileList = [];

        for (var i = 0; i < 10; i++) {
            var numDays = Math.floor(Math.random() * 8);
            if (numDays === 0) {
                numDays = 1;
            }

            var tiles = buildGridModel({
                icon: "avatar:svg-",
                title: "",
                background: ""
            }, numDays);
            $scope.tileList.push(tiles);            
        }

        console.log($scope.tileList);

        $scope.changeSize = function(tile) {
            if (tile.selected === false || tile.selected === undefined) {
                tile.oldSpan = {
                    row: tile.span.row,
                    col: tile.span.col
                };
                tile.span.col = 8;
                tile.span.row = 3;
                tile.selected = true;

            } else {
                tile.span = tile.oldSpan;
                tile.selected = false;
            }

        }


        function buildGridModel(tileTmpl, numDays) {
            var it, results = [];

            var defaults = [
                [8, 2],
                [
                    [4, 2],
                    [4, 2]
                ],
                [
                    [4, 2],
                    [4, 1],
                    [4, 1]
                ],
                [
                    [2, 2],
                    [4, 2],
                    [2, 1],
                    [2, 1]
                ],
                [
                    [4, 2],
                    [2, 1],
                    [1, 1],
                    [1, 1],
                    [2, 1]
                ],
                [
                    [4, 2],
                    [2, 1],
                    [1, 1],
                    [1, 1],
                    [1, 1],
                    [1, 1]

                ],
                [
                    [4, 2],
                    [2, 1],
                    [1, 1],
                    [1, 1],
                    [1, 1],
                    [1, 1],
                    [1, 1]
                ]
            ];

            var grid = [
                [8, 2]
            ];
            var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

            var valid = false;

            var maxTries = 100;
            for (var i = 0; i < maxTries; i++) {
                grid = gridSplit(grid, numDays);
                valid = layoutGrid(grid, 8, 2);
                if (valid) {
                    i = maxTries;
                }
            }


            if (!valid) {
                grid = defaults[numDays - 1];
            }


            for (var j = 0; j < numDays; j++) {

                cell = grid[j];

                it = angular.extend({}, tileTmpl);
                it.icon = it.icon + (j + 1);
                it.title = it.title + days[j];
                it.span = {
                    row: cell[1],
                    col: cell[0]
                };
                switch (j + 1) {
                    case 1:
                        it.background = "red";
                        break;
                    case 2:
                        it.background = "green";
                        break;
                    case 3:
                        it.background = "darkBlue";
                        break;
                    case 4:
                        it.background = "blue";
                        break;
                    case 5:
                        it.background = "orange";
                        break;
                    case 6:
                        it.background = "pink";
                        break;
                    case 7:
                        it.background = "lightPurple";
                        break;
                    case 8:
                        it.background = "purple";
                        break;
                    case 9:
                        it.background = "deepBlue";
                        break;
                    case 10:
                        it.background = "lightPurple";
                        break;
                    case 11:
                        it.background = "yellow";
                        break;
                }
                results.push(it);
            }
            return results;
        }

        function gridSplit(grid, numCells) {
            // console.log(grid);

            // base case, split into desired number of cells
            if (grid.length === numCells || numCells === 16) {
                var string = "";
                grid.forEach(function(cell) {
                    string = string + "[" + cell.toString() + "], ";
                })
                return grid;
            } else {

                var cell = [1, 1];
                var splitIndex;

                // Choose a cell to split, not a 1x1 however
                while (cell[0] === 1 && cell[1] === 1) {
                    splitIndex = Math.floor(Math.random() * grid.length);
                    cell = grid[splitIndex];
                }

                // choose to split on the x or y axis
                var originalXSize = cell[0]; // dimesion to be split
                var originalYSize = cell[1]; // dimesion to be split


                if ((Math.random() > 0.5 && originalXSize > 1) || originalYSize === 1) {
                    originalXSize = originalXSize / 2;
                } else {
                    originalYSize = originalYSize / 2;
                }

                var newGrid = [];

                // place new cells into the correct position in the original grid
                for (var i = 0; i < grid.length; i++) {
                    if (i === splitIndex) {
                        //add the split cells
                        var newCell = [originalXSize, originalYSize];
                        newGrid.push(newCell);
                        newGrid.push(newCell);
                    } else {
                        newGrid.push(grid[i]);
                    }
                }


                return gridSplit(newGrid, numCells);
            }
        }


        function layoutGrid(grid, maxX, maxY) {

            var xPos = 0,
                yPos = 0;
            var valid = true;

            for (var i = 0; i < grid.length; i++) {
                cell = grid[i];
                if (xPos + cell[0] <= maxX && yPos + cell[1] <= maxY) {
                    xPos = xPos + cell[0];
                } else {

                    yPos++;
                    xPos = 0;
                    if (cell[1] > 1) {
                        valid = false;
                    }
                }
            }

            return valid;
        }
    })
    .config(function($mdIconProvider) {
        $mdIconProvider.iconSet("avatar", 'icons/avatar-icons.svg', 128);
    });