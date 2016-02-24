angular.module('MyApp', ['ngMaterial'])
    .controller('FestivalListCtrl', function($scope) {

        // Holds all info for all events we show in the events list
        $scope.eventList = [{
            name: "Parklife 2016",
            date: "26th July 2016",
            location: "Hampshire Road, Manchester",
            description: "Parklife Festival is a Mancunian institution of urban," +
                " electro, indie and pop music. In five short years it has built" +
                "up a near-legendary reputation that pulls in a unique and diverse lineup year after year.",
            layout: {
                // Size of the tile in the grid
                span: {
                    row: 3,
                    col: 8
                },
                backgroundColor: "#9585BE",
                backgroundImage: "http://quaysnews.net/wp-content/uploads/2016/02/PL_FB_AD_1.png"
            },
            artists: [{
                name: "The Chemical Brothers",
                layout: {
                    span: {
                        row: 2,
                        col: 2
                    },
                    backgroundImage: "https://static-secure.guim.co.uk/sys-images/Observer/Columnist/Columnists/2015/7/24/1437753327251/the-chemical-brothers-009.jpg"
                }
            }, {
                name: "Major Lazer",
                layout: {
                    span: {
                        row: 2,
                        col: 2
                    },
                    backgroundImage: "http://www.tribalmixes.com/pic/dj/new/major-lazer-1.jpg"
                }
            }]
        }, {
            name: "Strawberrys and Creem Festival",
            date: "26th July 2016",
            location: "Hampshire Road, Manchester",
            description: "Parklife Festival is a Mancunian institution of urban," +
                " electro, indie and pop music. In five short years it has built" +
                "up a near-legendary reputation that pulls in a unique and diverse lineup year after year.",
            layout: {
                // Size of the tile in the grid
                span: {
                    row: 3,
                    col: 8
                },
                backgroundColor: "#9585BE",
                backgroundImage: "https://d31fr2pwly4c4s.cloudfront.net/c/8/7/786794_0_strawberries-creem-festival_400.jpg"
            }
        }, {
            name: "Glastonbury 2016",
            date: "26th July 2016",
            location: "Hampshire Road, Manchester",
            description: "Parklife Festival is a Mancunian institution of urban," +
                " electro, indie and pop music. In five short years it has built" +
                "up a near-legendary reputation that pulls in a unique and diverse lineup year after year.",
            layout: {
                // Size of the tile in the grid
                span: {
                    row: 3,
                    col: 8
                },
                backgroundColor: "#9585BE",
                backgroundImage: "https://metrouk2.files.wordpress.com/2015/09/glastonbury-festival-2015-day-2.jpg?w=748&h=486&crop=1"
            }
        }];



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