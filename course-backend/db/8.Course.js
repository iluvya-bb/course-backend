
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      Course.hasMany(models.Lesson, {
        foreignKey: "courseId",
        as: "lessons",
      });
      Course.hasMany(models.Subscription, {
        foreignKey: "courseId",
        as: "subscriptions",
      });
      Course.belongsTo(models.Teacher, {
        foreignKey: "teacherId",
        as: "teacher",
      });
    }
  }
  Course.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.FLOAT,
      bannerImage: DataTypes.STRING,
      teacherId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Course",
    }
  );
  return Course;
};
