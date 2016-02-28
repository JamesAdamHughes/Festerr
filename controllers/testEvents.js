var express = require('express'),
    router = express.Router();
var fs = require('fs');
var models = require('../models');

router.get('/create', function (req, res) {
    console.log("Handing create route");
    models.Event.create({
        name: "Event 20",
        description: "THis is a evenet that was created in the DB yay!!"
    }).then(function(){
        res.redirect('/');
    }).catch(function (err) {
        console.log("probable made that one before...");
        console.error(err);
    });
});

module.exports = router;