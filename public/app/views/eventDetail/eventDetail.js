angular.module('EventDetailView', ['ngMaterial'])
    .controller('EventDetailCtrl', ['$scope', '$q', 'NetworkService', "$location", "SpotifyService", EventDetailController]);


function EventDetailController($scope, $q, NetworkService, $location, SpotifyService) {

    $scope.eventLiked = false;
    $scope.event = {};
    $scope.userArtists;
    $scope.otherArtists;

    var likeElement = document.getElementById('event-like-circle');
    var eventID = $location.search().id; // get the event ID from the query string

    getEventDetails(eventID);
    
    // Get the infomation about the event from the server
    // Filter the artist data into two groups
    function getEventDetails(eventID) {
        
        // Create the request
        var url = "/event/?type=single&id=" + eventID;
        var options = {
            method: 'GET',
            credentials: 'include'
        };
        
        // Get artist data then filter it
        NetworkService.callAPI(url, options).then(function(res) {
            if (res.ok) {
                $scope.event = res.event;
                $scope.eventLiked = res.liked ? true : false;
                // filter the artists in the event 
                return SpotifyService.filterUserArtists(res.event.artists);
            } else {
                console.error(res);
            }
        }).then(function(filteredArtists){
            $scope.userArtists = filteredArtists.user;
            $scope.otherArtists = filteredArtists.other;
        });
    }

    // Toggle the user liking or un-liking an event
    // Saves it for the user to the server, and does a little animation
    $scope.likeClicked = function() {
        likeElement.classList.add("animate-like-button");

        //toggle liked
        $scope.eventLiked = !$scope.eventLiked;

        //Send the like change to the server to save it
        //TODO 
        NetworkService.callAPI('/event/' + eventID + '/like', {method:'GET', credentials: 'include'});
        
        // Remove the animate class when finished
        likeElement.addEventListener("animationend", removeAnimationClass);
    };

    // Remove animation class
    function removeAnimationClass(e) {
        likeElement.classList.remove("animate-like-button");
    }
    
}

