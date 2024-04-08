module.exports = (sequelize, DataTypes) => {
  const Reminder = sequelize.define("Reminder", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    deviceId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    notifications: {
      type: DataTypes.STRING, // You can adjust the data type based on notification settings
      allowNull: false
    },
    reminderTime: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

  // Define associations (if needed)
  Reminder.associate = (models) => {
    // Reminder belongs to User
    Reminder.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'cascade'
    });

    // Reminder belongs to Device
    Reminder.belongsTo(models.Device, {
      foreignKey: 'deviceId',
      onDelete: 'cascade'
    });
  };

  return Reminder;
};
