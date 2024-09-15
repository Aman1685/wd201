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
    static addtodo({ title, dueDate, userId }) {
      return this.create({ title: title, dueDate: dueDate, completed: false, userId });
    }
    static async overdue (userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date().toISOString().split('T')[0],
          },
          userId,
          completed: false ,
       },
      });
    }
    static async dueToday (userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date().toISOString().split('T')[0],
          },
          userId,
          completed: false ,
       },
      });
    }
    static async dueLater (userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date().toISOString().split('T')[0],
          },
          userId,
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
    static async remove(id, userId) {
      return this.destroy({
        where: {
          id,
          userId
        },
      });
    }
    markAsCompleted() {
      return this.update({ completed: true })
    }
    static getTodos(userId) {
      return this.findAll({
        where: {
          completed: true,
          userId
        }
      }) ;
    } 
    setCompletionStatus(todoStatus) {
    return this.update({ completed: todoStatus });
  }
  }
 
  Todo.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false, 
      validate: {
        notNull: { msg: "Title is required" },
          len: 5
      }
   },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: { msg: "Due date is required" }
      }
    },
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};