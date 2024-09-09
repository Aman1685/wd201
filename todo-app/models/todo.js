'use strict';
const { Op } = require('sequelize');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    static addtodo({ title, dueDate }) {
      return this.create({ title: title, dueDate: dueDate, completed: false})
    }
    static async overdue () {
      return this.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date(),
          },
       },
      });
    }
    static async dueToday () {
      return this.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date(),
          },
       },
      });
    }
    static async dueLater () {
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(),
          },
       },
      });
    }
    static async remove(id) {
      return this.destroy({
        where: {
          id,
        },
      });
    }
    markAsCompleted() {
      return this.update({ completed: true })
    }
    static getTodos() {
      return this.findAll() ;
    }
  }
  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};