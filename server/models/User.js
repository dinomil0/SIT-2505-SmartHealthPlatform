module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        NRIC: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        address: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        phoneNo: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        DOB: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        gender: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        role: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        
    }, {
        tableName: 'users'
    });


    User.associate = (models) => {
        User.hasMany(models.bloodPressure, {
            foreignKey: "userid",
            onDelete: "cascade"
        });
        User.hasMany(models.Weight, {
            foreignKey: "userid",
            onDelete: "cascade"
        });
        User.hasOne(models.dashboardSetting, {
            foreignKey: "userid",
            onDelete: "cascade"
        });
    };

    return User;
}
