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
test("Create a sample dueLater todo", async () => {
  const res = await agent.get("/");
  const csrfToken = extractCsrfToken(res);
  console.log(csrfToken);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
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
test("Create a sample overdue todo", async () => {
  const res = await agent.get("/");
  const csrfToken = extractCsrfToken(res);
  console.log(csrfToken);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const response = await agent
    .post("/todos")
    .send({
      title: "Test todo",
      dueDate: yesterday.toISOString().split('T')[0], 
      completed: false,
      _csrf: csrfToken
    });

  expect(response.statusCode).toBe(302);
});
/*test("Marks a todo as complete", async () => {
  let res = await agent.get("/");
  let csrfToken = extractCsrfToken(res);

  await agent
    .post("/todos")
    .send({
      title: "Test todo",
      dueDate: new Date().toISOString().split('T')[0],
      completed: false,
      "_csrf": csrfToken,
    });

  const todosResponse = await agent.get("/todos");
  const todos = JSON.parse(todosResponse.text);
  const todoID = todos[0].id;

  res = await agent.get("/");
  csrfToken = extractCsrfToken(res);

  const markCompleteResponse = await agent
    .put(`/todos/${todoID}`)
    .send({
      completed: true,
      _csrf: csrfToken
    });

  expect(markCompleteResponse.statusCode).toBe(200);
  const updatedTodo = JSON.parse(markCompleteResponse.text);
  expect(updatedTodo.completed).toBe(true);
});

test("Deletes a todo", async () => {
  // Step 1: Create a new todo item
  let res = await agent.get("/");
  let csrfToken = extractCsrfToken(res);

  await agent
    .post("/todos")
    .send({
      title: "Delete me",
      dueDate: new Date().toISOString().split('T')[0],
      completed: false,
      "_csrf": csrfToken,
    });

  const todosResponse = await agent.get("/todos");
  const todos = JSON.parse(todosResponse.text);
  const todoID = todos[0].id;

  res = await agent.get("/");
  csrfToken = extractCsrfToken(res);

  const deleteResponse = await agent
    .delete(`/todos/${todoID}`)
    .send({
      _csrf: csrfToken
    });

  expect(deleteResponse.statusCode).toBe(200); 
  expect(deleteResponse.body.success).toBe(true);
});*/
