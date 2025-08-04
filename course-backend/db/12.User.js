
"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Subscription, {
        foreignKey: "userId",
        as: "subscriptions",
      });
      User.hasMany(models.Session, {
        foreignKey: "userId",
        as: "sessions",
      });
      User.hasMany(models.Booking, {
        foreignKey: "userId",
        as: "bookings",
      });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("user", "admin", "teacher"),
        defaultValue: "user",
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  User.beforeSave(async (user, options) => {
    if (user.changed("password")) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  return User;
};
