module.exports = function (sequelize, DataTypes) {
    var Event = sequelize.define("Event", {
        name: DataTypes.STRING,
        description: DataTypes.TEXT
    }, {
            classMethods: {
                associate: function (models) {
                    Event.hasMany(models.Artist);
                }
            },
            timestamps: false,
        });

    return Event;
};