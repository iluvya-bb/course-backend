
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    static associate(models) {
      Lesson.belongsTo(models.Course, {
        foreignKey: "courseId",
        as: "course",
      });
      Lesson.hasMany(models.Exercise, {
        foreignKey: "lessonId",
        as: "exercises",
      });
    }
  }
  Lesson.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      wysiwygContent: DataTypes.TEXT,
      courseId: DataTypes.INTEGER,
      videoPath: DataTypes.STRING,
      bannerImage: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Lesson",
    }
  );
  return Lesson;
};
