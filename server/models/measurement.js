module.exports = (sequelize, DataTypes) => {
  const Measurement = sequelize.define("Measurement", {
    attributeId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    measurementValue: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    dateTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    userDeviceId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  
  return Measurement;
};
