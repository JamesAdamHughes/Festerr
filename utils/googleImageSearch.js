var request = require('request');
var fs = require('fs');
var q = require('q');
var queryBuilder = require('./queryBuilder.js');

// Load the google search api key
var contents = fs.readFileSync(__dirname + '/../config/api_keys.json');
var googleSearchAPI = JSON.parse(contents).google_search;

// Set the default params for the search
var defaultParams = {
    // search term
    q: "parklife+festival+2016",
    // custom seach engine key
    cx: googleSearchAPI.cx_key,
    // app key
    key: googleSearchAPI.key,
    // type of search to conduct
    searchType: "image",
    // filetype of image to search for
    fileType: "jpg",
    // what type of image to search for
    imgType: "photo",
    // how many results to return
    num: 5
};

var googleImageSearch = {
    
    // Builds a query string given a search term which can be used to make a request
    buildImageQuery: function (searchTerm) {
        var params = defaultParams;
        var query = "";
        var escapedSearch = "";
        var searchTermList = searchTerm.split(" ");
           
        // Create a properly formatted search term, replacing whitespace with '+'
        for(var i = 0; i < searchTermList.length; i++){
            escapedSearch = escapedSearch + searchTermList[i] + "+";
        }
        escapedSearch = escapedSearch.substring(0, escapedSearch.length);
        
        // Build the final query
        params.q = escapedSearch;
        query = queryBuilder.buildQuery(googleSearchAPI.url, params);
        
        return query;         
    },
    
    // Execute a request with the given query
    // returns a promise resolved with the json of the search result
    // Or an object containing the error response
    makeRequest: function (query) {
        var deferred = q.defer();

        request(query, function (err, res, body) {
            if (!err && res.statusCode === 200) {
                var searchResult = JSON.parse(body);
                deferred.resolve(searchResult.items);
            } else {
                var body = JSON.parse(res.body);
                deferred.reject(body.error);
            }
        });

        return deferred.promise;
    }
};

module.exports = googleImageSearch;