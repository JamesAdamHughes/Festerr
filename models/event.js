module.exports = function (sequelize, DataTypes) {
    var Event = sequelize.define("Event", {
        skiddleID: {type: DataTypes.INTEGER, unique: true},
        name: DataTypes.STRING,
    }, {
            classMethods: {
                associate: function (models) {
                    Event.belongsToMany(models.User, {
                        through: 'UserEventLikes',
                        foreignKey: {
                            allowNull: false
                        }
                    });
                }
            },
            timestamps: false,
        });

    return Event;
};