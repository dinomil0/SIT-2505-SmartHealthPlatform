module.exports = (sequelize, DataTypes) => {
    const bloodPressure = sequelize.define("bloodPressure", {
        NRIC: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        systolic: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        diastolic: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        measureDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        
    }, {
        tableName: 'bloodPressure'
    });


// can be edited to associate to many "BP" measures for example
bloodPressure.associate = (models) => {
    bloodPressure.belongsTo(models.User, {// change tutorial to something else
            foreignKey: "userid",
            onDelete: "cascade"
        });
    };

    return bloodPressure;
}
