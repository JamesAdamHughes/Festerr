// Magic setup from http://docs.sequelizejs.com/en/1.7.0/articles/express/
var fs = require('fs');
var path = require("path");
var Sequelize = require('sequelize');

var sequelize = new Sequelize('database', 'username', null, {
    dialect: 'sqlite',
    storage: 'test.db',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

var db = {};

// load all the models in the models folder
fs.readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function (file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

// Do assocations?
Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
