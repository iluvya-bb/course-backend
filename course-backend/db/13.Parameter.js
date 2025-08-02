
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Parameter extends Model {
    static associate(models) {}
  }
  Parameter.init(
    {
      key: DataTypes.STRING,
      value: DataTypes.TEXT,
      tag: DataTypes.STRING,
      privacy: {
        type: DataTypes.ENUM("all", "user", "admin"),
        defaultValue: "all",
      },
    },
    {
      sequelize,
      modelName: "Parameter",
    }
  );
  return Parameter;
};
