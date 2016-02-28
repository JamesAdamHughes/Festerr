var Sequelize = require('sequelize');
var seq = new Sequelize('database', 'username', null, {
    host: 'localhost',
    dialect: 'sqlite',
    storage: '../test.db',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    logging: false

});

var User = seq.define('user', {
    firstName: {
        type: Sequelize.STRING,
    },
    lastName: {
        type: Sequelize.STRING
    }
    }, {
        freezeTableName: true
});

// Force will drop the table then re-create it afterwards
// sync creates tables
User.sync({force:true}).then(function(){
    //table created
    return User.create({
        firstName: "john",
        lastName: 'Hancock'
    });
});

User.findOne().then(function(user){
    console.log(user.get({plain:true}));
});

