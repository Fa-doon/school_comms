"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chatroom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Chatroom.belongsTo(models.User, {
        foreignKey: "sender_id",
        as: "sender",
      });

      Chatroom.belongsTo(models.User, {
        foreignKey: "receiver_id",
        as: "receiver",
      });

      Chatroom.hasMany(models.Chatmessage, {
        foreignKey: "room_id",
        sourceKey: "name",
        as: "messages",
      });
    }
  }
  Chatroom.init(
    {
      name: DataTypes.STRING,
      sender_id: DataTypes.INTEGER,
      receiver_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Chatroom",
      timestamps: false,
    }
  );
  return Chatroom;
};
