module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        spotifyID: {type: DataTypes.STRING, unique: true},
        email: DataTypes.STRING
    }, {
            classMethods: {
                associate: function (models) {
                    User.belongsToMany(models.Event, {
                        through: 'UserEventLikes',
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