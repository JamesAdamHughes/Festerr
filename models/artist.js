module.exports = function (sequelize, DataTypes) {
    var Artist = sequelize.define("Artist", {
        name: DataTypes.STRING
    }, {
            classMethods: {
                associate: function (models) {
                    Artist.belongsTo(models.Event, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });
                }
            }, 
            timestamps: false,
        });
    return Artist;
};