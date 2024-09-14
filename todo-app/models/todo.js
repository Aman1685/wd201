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
      Todo.belongsTo(models.User, {
        foreignKey: 'userId'
      })
      // define association here
    }
    static addtodo({ title, dueDate }) {
      return this.create({ title: title, dueDate: dueDate, completed: false })
    }
    static async overdue () {
      return this.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date().toISOString().split('T')[0],
          },
          completed: false ,
       },
      });
    }
    static async dueToday () {
      return this.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date().toISOString().split('T')[0],
          },
          completed: false ,
       },
      });
    }
    static async dueLater () {
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date().toISOString().split('T')[0],
          },
          completed: false ,
       },
      });
    }
static async reverse(id) {
  try {
      const todo = await this.findByPk(id);
      if (!todo) {
          throw new Error('Todo not found');
      }
        todo.completed = !todo.completed;
        await todo.save();
        return todo;
  } catch (error) {
      console.error("Error in todo completion:", error);
      throw error;
  }
   
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
      return this.findAll({
        where: {
          completed: true
        }
      }) ;
    } 
    setCompletionStatus(todoStatus) {
    return this.update({ completed: todoStatus });
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