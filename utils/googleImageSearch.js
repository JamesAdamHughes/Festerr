var request = require('request');
var fs = require('fs');
var q = require('q');
var queryBuilder = require('./queryBuilder.js');

// Load the google search api key
var contents = fs.readFileSync(__dirname + '/../config/api_keys.json');
var googleSearchAPI = JSON.parse(contents).google_search;

// Set the params for the search
var params = {
    q: "parklife+festival+2016",
    cx: googleSearchAPI.cx_key,
    key: googleSearchAPI.key,
    fileType: "jpg",
    imgType: "photo",
    searchType: "image",
    num: 5
};

// Create the query from the params
var query = queryBuilder.buildQuery(googleSearchAPI.url, params);

// Make a request with the query
// returns a promise resolved with the json of the search result
// Or an object containing the error response
function makeRequest(query) {
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

// Make a request
makeRequest(query).then(function (res) {
    console.log(res);
}).catch(function (err) {
    console.error(err);
});