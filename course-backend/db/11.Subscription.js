
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model {
    static associate(models) {
      Subscription.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      Subscription.belongsTo(models.Course, {
        foreignKey: "courseId",
        as: "course",
      });
    }
  }
  Subscription.init(
    {
      userId: DataTypes.INTEGER,
      courseId: DataTypes.INTEGER,
      endDate: DataTypes.DATE,
      purchasePrice: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Subscription",
    }
  );
  return Subscription;
};
