const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const cheerio = require("cheerio");
const { password } = require("pg/lib/defaults");
let server, agent ;

function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

beforeAll(async () => {
  await sequelize.sync({ force: true }); 
  server = app.listen(4000, () => {});
  agent = request.agent(server);
});
afterAll(async () => {
  await sequelize.close();
});

test("Sign Up", async () => {
  let res = await agent.get("/signup");
  const csrfToken = extractCsrfToken(res);
  res = await agent.post("/users").send({
    firstName: "Test",
    lastName: "User A",
    email: "user.a@test.com",
    password: "12345678",
    _csrf: csrfToken,
  });
  expect(res.statusCode).toBe(302);
})

test("Create a new todo", async () => {
  const res = await agent.get("/todos");
  const csrfToken = extractCsrfToken(res);
  console.log(csrfToken);
  const response = await agent
    .post("/todos")
    .send({
      title: "Test todo",
      dueDate: new Date().toISOString().split('T')[0], 
      completed: false,
      _csrf: csrfToken
    });

  expect(response.statusCode).toBe(302);
});
test("Marks a todo as complete or incomplete", async () => {
  let res = await agent.get("/todos");
  let csrfToken = extractCsrfToken(res);

  await agent
    .post("/todos")
    .send({
      title: "Test todo",
      dueDate: new Date().toISOString().split('T')[0],
      completed: false,
      _csrf: csrfToken,
    });

  const todosResponse = await agent.get("/todos").set("Accept", "application/json");
  const todos = JSON.parse(todosResponse.text);
  dueTodaycount = todos.dueToday.length;
  const latestTodo = todos.dueToday[dueTodaycount - 1];
  const newStatus = !latestTodo.completed;
  res = await agent.get("/todos");
  csrfToken = extractCsrfToken(res);
  const markCompleteResponse = await agent
    .put(`/todos/${latestTodo.id}`)
    .send({
      completed: true,
      _csrf: csrfToken,
    });
  const updatedTodo = JSON.parse(markCompleteResponse.text);
  expect(updatedTodo.completed).toBe(newStatus);
});

test("Deletes a todo", async () => {
  let res = await agent.get("/todos");
  let csrfToken = extractCsrfToken(res);

  await agent
    .post("/todos")
    .send({
      title: "Delete me",
      dueDate: new Date().toISOString().split('T')[0],
      completed: false,
      _csrf: csrfToken,
    });

  const todosResponse = await agent.get("/todos").set("Accept", "application/json");
  const todos = JSON.parse(todosResponse.text);
  dueTodaycount = todos.dueToday.length;
  const latestTodo = todos.dueToday[dueTodaycount - 1];


  res = await agent.get("/todos");
  csrfToken = extractCsrfToken(res);

  const deleteResponse = await agent
    .delete(`/todos/${latestTodo.id}`)
    .send({
      _csrf: csrfToken
    });

  expect(deleteResponse.statusCode).toBe(200); 
});
