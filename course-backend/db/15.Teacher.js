
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    static associate(models) {
      Teacher.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      Teacher.hasMany(models.Course, {
        foreignKey: "teacherId",
        as: "courses",
      });
      Teacher.hasMany(models.Booking, {
        foreignKey: "teacherId",
        as: "bookings",
      });
    }
  }
  Teacher.init(
    {
      name: DataTypes.STRING,
      bio: DataTypes.TEXT,
      avatar: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Teacher",
    }
  );
  return Teacher;
};
