module.exports = function (sequelize, DataTypes) {
    var Event = sequelize.define("Event", {
        skiddleID: {type: DataTypes.INTEGER, unique: true, primaryKey: true},
        name: DataTypes.STRING,
    }, {
            classMethods: {
                associate: function (models) {
                    Event.belongsToMany(models.User, {
                        through: 'UserEventLikes',
                        foreignKey: 'skiddleID',
                        otherKey: 'spotifyID'
                    });
                }
            },
            timestamps: false,
        });

    return Event;
};