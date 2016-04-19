angular.module('festerrApp').factory('NetworkService', function($q) {
    
    // Calls the api with a given request
    // Returns the josn of the response
    function callAPI(url, options){
        var deferred = $q.defer();
        
        var request = new Request(url, options);        

        fetch(request).then(function(response){
            deferred.resolve(response.json());
        }).catch(function(err){
            console.error(err);
            deferred.reject(err);
        });

        return deferred.promise;
    }

    return {
        callAPI: callAPI
    };
});