angular.module('festerrApp').factory('FestivalDataService', function($q, NetworkService) {


    /*
        Returns the festivals data

        TODO call the api from here
        TODO allow for query paramters to refine the search
    */
    var getFestivalData = function() {
        var deferred = $q.defer();

        NetworkService.callAPI({
            url: '/event/?type=all',
            method: 'GET'
        }).then(function(res){
            deferred.resolve(res);
        }).catch(function(err){
            deferred.reject(err);
        })

        return deferred.promise;
    }

    return {
        getFestivalData: getFestivalData
    }



});