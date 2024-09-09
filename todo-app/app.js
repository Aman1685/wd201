const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
var csrf =  require("csurf");
var cookieParser = require("cookie-parser");
app.use(bodyParser.json());
const path = require("path");
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csrf({ cookie: true }));

app.set("view engine", "ejs");

app.get('/', async (req, res) => {
    const todos = await Todo.findAll(); 
    
    const today = new Date();
today.setHours(0, 0, 0, 0); 

const overdueTodos = todos.filter(todo => {
  const dueDate = new Date(todo.dueDate);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate < today;
});

const dueTodayTodos = todos.filter(todo => {
  const dueDate = new Date(todo.dueDate);
  dueDate.setHours(0, 0, 0, 0); 
  return dueDate.toDateString() === today.toDateString();
});

const dueLaterTodos = todos.filter(todo => {
  const dueDate = new Date(todo.dueDate);
  dueDate.setHours(0, 0, 0, 0); 
  return dueDate > today;
});
if (req.accepts("html")) {
  res.render('index', {
      overdueTodos,
      dueTodayTodos,
      dueLaterTodos,
      csrfToken: req.csrfToken(),
    });} else {
    res.json({
      overdueTodos,
      dueTodayTodos,
      dueLaterTodos,
    });
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
    const todo = await Todo.create({
      title: request.body.title,
      dueDate: request.body.dueDate,
      completed: request.body.completed
    });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.update({ completed: true });
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  const todoId = parseInt(request.params.id, 10);
  if (isNaN(todoId)) {
    return response.status(400).send(false); 
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
