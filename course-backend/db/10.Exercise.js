
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Exercise extends Model {
    static associate(models) {
      Exercise.belongsTo(models.Lesson, {
        foreignKey: "lessonId",
        as: "lesson",
      });
    }
  }
  Exercise.init(
    {
      question: DataTypes.TEXT,
      answer: DataTypes.TEXT,
      lessonId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Exercise",
    }
  );
  return Exercise;
};
