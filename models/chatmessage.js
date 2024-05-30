"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chatmessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Chatmessage.belongsTo(models.User, {
        foreignKey: "sender_id",
        as: "sender",
      });

      Chatmessage.belongsTo(models.User, {
        foreignKey: "receiver_id",
        as: "receiver",
      });

      Chatmessage.belongsTo(models.Chatroom, {
        foreignKey: "room_id",
        targetKey: "name",
        as: "chatroom",
      });
    }
  }
  Chatmessage.init(
    {
      room_id: DataTypes.STRING,
      sender_id: DataTypes.INTEGER,
      receiver_id: DataTypes.INTEGER,
      message: DataTypes.TEXT,
      seen: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Chatmessage",
      timestamps: true,
    }
  );
  return Chatmessage;
};
