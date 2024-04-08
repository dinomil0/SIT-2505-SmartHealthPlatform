module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define("Device", {
      name: {
          type: DataTypes.STRING,
          allowNull: false
      },
      type: {
          type: DataTypes.STRING,
          allowNull: false
      },
      userId: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      setupCompleted: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
      }
  });

  // Associate Device with User
  Device.associate = (models) => {
      Device.belongsTo(models.User, {
          foreignKey: 'userId',
          onDelete: 'cascade'
      });
  };

  return Device;
};
