angular.module('festerrApp', [
    'MainView', 'FestivalListView', 'HeaderView', 'EventDetailView', 'ngRoute', 'festivalTileDirective']).config(function ($routeProvider) {
        
        $routeProvider.when('/', {
            controller: 'MainCtrl',
            templateUrl: '/templates/bodyTemplate.html',
            resolve: {
                'SpotifyServiceSetup': function(SpotifyService){
                    // main controller won't be instanciated until this promise resolves
                    // allows us to do spoitfy setup beofre anything else happens
                    return SpotifyService.setup();
                }
            }
        }).when('/event', {
            controller: 'EventDetailCtrl',
            templateUrl: '/app/views/eventDetail/eventDetail.html'            
        });

    });