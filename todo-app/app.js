const express = require("express");
var csrf = require("csurf");
const app = express();
const { Todo } = require("./models");
var cookieParser = require("cookie-parser")
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const path = require("path");
const { title } = require("process");
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csrf({ cookie: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs");


// Route to handle marking a todo as completed
app.put("/todos/:id", async function (request, response) {
  const todoId = request.params.id;
  const { completed } = request.body;
  try {
    const todo = await Todo.reverse(todoId);
    await todo.save();
    return response.json({ success: true })
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
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

app.delete("/todos/:id", async function (request, response) {
  const todoId = parseInt(request.params.id, 10); // Ensure the ID is an integer
  try {
    await Todo.remove(request.params.id);
    return response.json({ success: true })
  } catch (error) {
    return response.status(422).json(error);
  }
});

// Route to handle adding a new todo
app.post("/todos", async function (request, response) {
  try {
    const todo = await Todo.create({
      title: request.body.title,
      dueDate: request.body.dueDate,
      completed: request.body.completed,
    });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
app.get('/', async (request, response) => {
  const allTodos = await Todo.getTodos();
  const overdue = await Todo.overdue();
  const dueToday = await Todo.dueToday();
  const dueLater = await Todo.dueLater();
  if (request.accepts("html")) {
    response.render("index", {
      title: "Todo application",
      overdue,
      dueToday,
      dueLater,
      allTodos,
      csrfToken: request.csrfToken(),
    })
  } else {
    response.json({
      overdue,
      dueToday,
      dueLater,
    })
    } });

module.exports = app;
