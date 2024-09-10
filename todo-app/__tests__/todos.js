const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const cheerio = require("cheerio");

function extractCsrfToken(res) {
  const $ = cheerio.load(res.text);
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
      dueDate: new Date().toISOString(),
      completed: false,
      "_csrf": csrfToken
    });

  expect(response.statusCode).toBe(302);
});

test("Marks a todo as complete", async () => {
  const res = await request(app).get("/");
  const csrfToken = extractCsrfToken(res);

  const response = await request(app)
    .post("/todos")
    .send({
      title: "Test todo",
      dueDate: new Date().toISOString(),
      completed: false,
      "_csrf": csrfToken ,
    });
  expect(response.statusCode).toBe(302);

  const todosResponse = await request(app).get("/todos");
  const todos = JSON.parse(todosResponse.text);
  const todoID = todos[0].id; 

  const markCompleteResponse = await request(app)
    .put(`/todos/${todoID}/markAsCompleted`)
    .send({
      completed: true,
      "_csrf": csrfToken // Pass the CSRF token
    });

  expect(markCompleteResponse.statusCode).toBe(200);
  const updatedTodo = JSON.parse(markCompleteResponse.text);
  expect(updatedTodo.completed).toBe(true);

});

test("Deletes a todo", async () => {
  const res = await request(app).get("/");
  const csrfToken = extractCsrfToken(res);

  const response = await request(app)
    .post("/todos")
    .send({
      title: "Delete me",
      dueDate: new Date().toISOString(),
      completed: false,
      "_csrf": csrfToken ,
    });
  expect(response.statusCode).toBe(302);

  const todosResponse = await request(app).get("/todos");
  const todos = JSON.parse(todosResponse.text);
  const todoID = todos[0].id;

  const deleteResponse = await request(app)
    .delete(`/todos/${todoID}`)
    .send({
      "_csrf": csrfToken ,
    });

  expect(deleteResponse.statusCode).toBe(200);
  expect(deleteResponse.body.success).toBe(true);
});
