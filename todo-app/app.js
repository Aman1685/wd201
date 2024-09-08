const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const path = require("path");

app.set("view engine", "ejs");
app.get('/', async (req, res) => {
  try {
      const todos = await Todo.findAll(); // Fetch all todos from the database
      
      // Categorize todos
      const today = new Date();
      const overdueTodos = todos.filter(todo => new Date(todo.dueDate) < today );
      const dueTodayTodos = todos.filter(todo => new Date(todo.dueDate).toDateString() === today.toDateString());
      const dueLaterTodos = todos.filter(todo => new Date(todo.dueDate) > today);

      // Render the main page with categorized todos
      res.render('index', {
          overdueTodos,
          dueTodayTodos,
          dueLaterTodos,
      });
  } catch (error) {
      console.error('Error fetching todos:', error);
      res.status(500).send('Server error');
  }
});


app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  try {
    const todo = await Todo.addtodo(request.body);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  const todoId = parseInt(request.params.id, 10); // Ensure the ID is an integer
  if (isNaN(todoId)) {
    return response.status(400).send(false); // Return false if the ID is not a valid number
  }
  try {
    const todo = await Todo.findByPk(todoId);
    if (!todo) {
      return response.send(false);
    }
    await todo.destroy();
    return response.send(true);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});




module.exports = app;
