var Sequelize = require('sequelize');
// var seq = new Sequelize('database', 'username', null, {
//     host: 'localhost',
//     dialect: 'sqlite',
//     storage: '../test.db',
//     pool: {
//         max: 5,
//         min: 0,
//         idle: 10000
//     },
//     logging: false
// });

// var User = seq.define('user', {
//     firstName: {
//         type: Sequelize.STRING,
//     },
//     lastName: {
//         type: Sequelize.STRING
//     }
// }, {
//         freezeTableName: true
//     });

function dbManager() {
    
    var self = this;  
        
    self.seq = new Sequelize('database', 'username', null, {
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

    self.User = self.seq.define('user', {
        firstName: {
            type: Sequelize.STRING,
        },
        lastName: {
            type: Sequelize.STRING
        }
    }, {
            freezeTableName: true
    });
};

module.exports = dbManager;
