'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Todo, {
        foreignKey: 'userId'
      })
      // define association here
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "First name is required" },
        len: 1,
        notEmpty: {
          msg: 'First name cannot be empty',
        },
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Email address must be valid" },
        notNull: { msg: "Email is required" },
        notEmpty: {
          msg: 'email cannot be empty',
        },
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "password is required" },
        len: 8,
        notEmpty: {
          msg: 'password cannot be empty',
        },
      }   
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};