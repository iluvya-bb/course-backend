
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      Booking.belongsTo(models.Teacher, {
        foreignKey: "teacherId",
        as: "teacher",
      });
    }
  }
  Booking.init(
    {
      userId: DataTypes.INTEGER,
      teacherId: DataTypes.INTEGER,
      location: DataTypes.STRING,
      studentCount: DataTypes.INTEGER,
      sessionCount: DataTypes.INTEGER,
      notes: DataTypes.TEXT,
      status: {
        type: DataTypes.ENUM(
          "pending",
          "accepted",
          "paid",
          "completed",
          "cancelled"
        ),
        defaultValue: "pending",
      },
      price: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
