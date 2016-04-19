module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        spotifyID: {type: DataTypes.STRING, unique: true},
        name: DataTypes.STRING
    }, {
            classMethods: {
                associate: function (models) {
                    User.belongsToMany(models.Event, {
                        through: 'UserEvent',
                        foreignKey: {
                            allowNull: false
                        }
                    });
                }
            }, 
            timestamps: false,
        });
    return User;
};