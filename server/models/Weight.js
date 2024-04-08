module.exports = (sequelize, DataTypes) => {
    const Weight = sequelize.define("Weight", {
        NRIC: {
            type: DataTypes.STRING(100),
        },
        weightValue: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        heightValue: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        BMI: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        measureDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        
    }, {
        tableName: 'Weight'
    });

    Weight.associate = (models) => {
        Weight.belongsTo(models.User, {// change tutorial to something else
                foreignKey: "userid",
                onDelete: "cascade"
            });
        };

    return Weight;
}