const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const cheerio = require("cheerio");

function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

beforeAll(async () => {
  await sequelize.sync({ force: true }); 
});

afterAll(async () => {
  await sequelize.close();
});

test("Create a new todo", async () => {
  const res = await request(app).get("/");
  const csrfToken = extractCsrfToken(res);

  const response = await request(app)
    .post("/todos")
    .send({
      title: "Test todo",
      dueDate: new Date().toISOString().split('T')[0], 
      completed: false,
      "_csrf": csrfToken
    });

  expect(response.statusCode).toBe(302);
});

/*test("Marks a todo as complete", async () => {
  let res = await request(app).get("/");
  let csrfToken = extractCsrfToken(res);

  await request(app)
    .post("/todos")
    .send({
      title: "Test todo",
      dueDate: new Date().toISOString().split('T')[0],
      completed: false,
      "_csrf": csrfToken,
    });

  const todosResponse = await request(app).get("/todos");
  const todos = JSON.parse(todosResponse.text);
  const todoID = todos[0].id;

  res = await request(app).get("/");
  csrfToken = extractCsrfToken(res);

  const markCompleteResponse = await request(app)
    .put(`/todos/${todoID}`)
    .send({
      completed: true,
      "_csrf": csrfToken
    });

  expect(markCompleteResponse.statusCode).toBe(200);
  const updatedTodo = JSON.parse(markCompleteResponse.text);
  expect(updatedTodo.completed).toBe(true);
});

test("Deletes a todo", async () => {
  // Step 1: Create a new todo item
  let res = await request(app).get("/");
  let csrfToken = extractCsrfToken(res);

  await request(app)
    .post("/todos")
    .send({
      title: "Delete me",
      dueDate: new Date().toISOString().split('T')[0],
      completed: false,
      "_csrf": csrfToken,
    });

  const todosResponse = await request(app).get("/todos");
  const todos = JSON.parse(todosResponse.text);
  const todoID = todos[0].id;

  res = await request(app).get("/");
  csrfToken = extractCsrfToken(res);

  const deleteResponse = await request(app)
    .delete(`/todos/${todoID}`)
    .send({
      "_csrf": csrfToken
    });

  expect(deleteResponse.statusCode).toBe(200); 
  expect(deleteResponse.body.success).toBe(true);
});*/
