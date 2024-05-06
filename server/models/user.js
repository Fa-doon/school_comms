"use strict";

const { Model } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Role, {
        foreignKey: "role_id",
        targetKey: "id",
      });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User",
      timestamps: false,
    }
  );

  // Hash password
  User.beforeCreate(async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  });

  // verify & compare password
  User.prototype.isValidPassword = async function (password) {
    return await bcrypt.compareSync(password, this.password);
  };

  return User;
};
