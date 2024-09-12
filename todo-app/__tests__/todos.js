const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const cheerio = require("cheerio");
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

test("Create a new todo", async () => {
  const res = await agent.get("/");
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
  let res = await agent.get("/");
  let csrfToken = extractCsrfToken(res);

  await agent
    .post("/todos")
    .send({
      title: "Test todo",
      dueDate: new Date().toISOString().split('T')[0],
      completed: false,
      _csrf: csrfToken,
    });

  const todosResponse = await agent.get("/").set("Accept", "application/json");
  const todos = JSON.parse(todosResponse.text);
  dueTodaycount = todos.dueToday.length;
  const latestTodo = todos.dueToday[dueTodaycount - 1];
  const newStatus = !latestTodo.completed;
  res = await agent.get("/");
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
  let res = await agent.get("/");
  let csrfToken = extractCsrfToken(res);

  await agent
    .post("/todos")
    .send({
      title: "Delete me",
      dueDate: new Date().toISOString().split('T')[0],
      completed: false,
      _csrf: csrfToken,
    });

  const todosResponse = await agent.get("/").set("Accept", "application/json");
  const todos = JSON.parse(todosResponse.text);
  dueTodaycount = todos.dueToday.length;
  const latestTodo = todos.dueToday[dueTodaycount - 1];


  res = await agent.get("/");
  csrfToken = extractCsrfToken(res);

  const deleteResponse = await agent
    .delete(`/todos/${latestTodo.id}`)
    .send({
      _csrf: csrfToken
    });

  expect(deleteResponse.statusCode).toBe(200); 
  expect(deleteResponse.body.success).toBe(true);
});
test("Should create sample due today item", async () => {
  const res = await agent.get("/");
  const csrfToken = extractCsrfToken(res);
  
  const response = await agent
    .post("/todos")
    .send({
      title: "Due Today",
      dueDate: new Date().toISOString().split('T')[0],
      completed: false,
      _csrf: csrfToken
    });
  
  expect(response.statusCode).toBe(302);
});
test("Should create sample due later item", async () => {
  const res = await agent.get("/");
  const csrfToken = extractCsrfToken(res);
  
  // Add 1 day to today's date
  const dueLaterDate = new Date();
  dueLaterDate.setDate(dueLaterDate.getDate() + 1);
  
  const response = await agent
    .post("/todos")
    .send({
      title: "Due Later",
      dueDate: dueLaterDate.toISOString().split('T')[0],
      completed: false,
      _csrf: csrfToken
    });
  
  expect(response.statusCode).toBe(302);
});
test("Should create sample overdue item", async () => {
  const res = await agent.get("/");
  const csrfToken = extractCsrfToken(res);
  
  // Subtract 1 day from today's date
  const overdueDate = new Date();
  overdueDate.setDate(overdueDate.getDate() - 1);
  
  const response = await agent
    .post("/todos")
    .send({
      title: "Overdue",
      dueDate: overdueDate.toISOString().split('T')[0],
      completed: false,
      _csrf: csrfToken
    });
  
  expect(response.statusCode).toBe(302);
});
