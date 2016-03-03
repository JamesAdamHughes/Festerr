angular.module('FestivalListView', ['ngMaterial'])
    .controller('FestivalListCtrl', ['$scope', 'FestivalDataService', '$interval', function ($scope, FestivalDataService, $interval) {

        // Holds all info for all events we show in the events list
        $scope.eventList;
        $scope.artistList;
        $scope.currentlySelectedEventTile = -1;

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

        }).then(function() {
            
            var results = [];
            var names = [];
            // Create list of available list
            for (var i = $scope.eventList.length - 1; i >= 0; i--) {
                for (var j = $scope.eventList[i].artists.length - 1; j >= 0; j--) {
                    // Uses separate list of artist names so as to be able to quickly check their presence
                    if (names.indexOf($scope.eventList[i].artists[j].name) === -1) {
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
            var eventName = angular.lowercase(event.eventname);
            var chipName = "";
            var artistPresent;
            var artistName = "";
            
            //If there are no chips, display all results
            if ($scope.selectedChips.length === 0) return true;
            

            for (var i = $scope.selectedChips.length - 1; i >=0; i--) {
                chipName = angular.lowercase($scope.selectedChips[i].name);
                //Is this an event or an artist chip?
                if ($scope.selectedChips[i].eventname) {
                    display = display && (eventName === chipName);
                } else {
                    artistPresent = false;
                    //Check through all artists in this event and return true if one matches the chip
                    for (var j = event.artists.length -1; j >=0; j--) {
                        artistName = angular.lowercase(event.artists[j].name);
                        artistPresent = artistPresent || artistName === chipName;

                        //LOGIC FOR HIGHLIGHTING MATCHING ARTISTS CAN GO HERE, EG:
                        // event.artists[j].tileInfo.border = artistName  ===  chipName? 'solid 5px blue' : '';
                    }
                    display = display && artistPresent;
                }
            }
            return display;
        };

        //Function to filter events and artist lists and show autocomplete suggestions for chip search
        $scope.chipSearch = function (query) {
            var events;
            var artists;
            var results; 
            
            events = query ? $scope.eventList.filter($scope.createEventFilterFor(query)) : [];
            events = events.map(function (event) {
                //Allows HTML to display 'name' and 'type' values in chips
                event.name = event.eventname;
                event.type = "event";
                return event;
            });
            artists = query ? $scope.artistList.filter($scope.createArtistFilterFor(query)) : [];
            artists = artists.map(function (artist) {
                artist.type = "artist";
                return artist;
            });
            results = events.concat(artists);
            //RESULTS COULD BE SORTED BY SOME VALUE HERE?
            return results;
        };

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
            };
        };

        //Filters the artist for artists matching a query
        $scope.createArtistFilterFor = function (query) {
            var lowerCaseQuery = angular.lowercase(query);
            
            return function filterFn(artist) {
                return (angular.lowercase(artist.name).indexOf(lowerCaseQuery) !== -1);
            }; 
        };
        
        // When a tile is selected, tell the prev selected to collapse          
        $scope.tileSelected = function(id){               
            var prevEvent = $scope.eventList[$scope.currentlySelectedEventTile];

            // tell prev selected to close, unless it is same as the one selected
            // that is handled by the directive itself
            if(prevEvent !== undefined){           
                if(prevEvent.tileInfo.ID === id){
                    // selected prev open, reset counter
                    $scope.currentlySelectedEventTile = -1;
                } else {
                    $scope.currentlySelectedEventTile = id;
                }
                // collpase is a function defined in the festvial tile directive
                prevEvent.collapse();
            }  else {
                $scope.currentlySelectedEventTile = id;
            } 
            
            console.log($scope.currentlySelectedEventTile);         

        };
  
    }]);