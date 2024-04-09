module.exports = (sequelize, DataTypes) => {
    const dashboardSetting = sequelize.define("dashboardSetting", {
        NRIC: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        weightChange: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        muscleMassChange: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        bodyFatChange: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
    }, {
        tableName: 'dashboardSetting'
    });


// can be edited to associate to many "BP" measures for example
dashboardSetting.associate = (models) => {
    dashboardSetting.belongsTo(models.User, {// change tutorial to something else
            foreignKey: "userid",
            onDelete: "cascade"
        });
    };

    return dashboardSetting;
}
