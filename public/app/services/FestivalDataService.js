angular.module('festerrApp').factory('FestivalDataService', function ($q, NetworkService) {

    var cachedEventList = [];
    /*
        Returns the festivals data

        TODO call the api from here
        TODO allow for query paramters to refine the search
    */
    var getFestivalData = function () {
        var deferred = $q.defer();

        if (cachedEventList.length === 0) {
            NetworkService.callAPI('/event/?type=all', {
                method: 'GET'
            }).then(function (res) {
                cachedEventList = res;
                deferred.resolve(cachedEventList);
            }).catch(function (err) {
                deferred.reject(err);
            });
        } else {
            deferred.resolve(cachedEventList);
        }
        
        return deferred.promise;
    };

    return {
        getFestivalData: getFestivalData
    };



});