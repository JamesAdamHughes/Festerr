var request = require('request');
var fs = require('fs');
var queryBuilder = require('./queryBuilder.js');

// Load the google search api key
var contents = fs.readFileSync(__dirname + '/../config/api_keys.json');
var googleSearchAPI = JSON.parse(contents).google_search;

console.log(queryBuilder.buildQuery);
var params = {
   q: "parklife+festival+2016",
   cx:  googleSearchAPI.cx_key,
   key: googleSearchAPI.key,
   fileType: "jpg",
   imgType: "photo",
   serchType: "image",
   num: 5
};

var query = queryBuilder.buildQuery(googleSearchAPI.url, params);


// Make a request
// request