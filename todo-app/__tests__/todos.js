const request = require("supertest");
const app = require("../app");
const { sequelize, Todo } = require("../models");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

test("Create a new todo", async () => {
  const responce = await request(app)
  .post("/todos")
  .send({
    test: "Create todo",
    duedate: new Date().toISOString(),
    completed: false,
  });
  expect(302).toBe(302);
})

test("Marks a todo as complete or incomplete", async () => {
  const response = await request(app)
    .post("/todos")
    .send({
      title: "Test todo",
      dueDate: new Date().toISOString(),
      completed: false,
    });

  const todo = JSON.parse(response.text);
  const todoID = todo.id;

  const markCompleteResponse = await request(app)
    .put(`/todos/${todoID}/markAsCompleted`)
    .send({ completed: true });

  const updatedTodo = JSON.parse(markCompleteResponse.text);
  expect(updatedTodo.completed).toBe(true);

  const markIncompleteResponse = await request(app)
    .put(`/todos/${todoID}/markAsCompleted`)
    .send({ completed: false });

  const updatedTodo2 = JSON.parse(markIncompleteResponse.text);
  expect(updatedTodo2.completed).toBe(false);
});

test("Deletes a todo", async () => {
  const response = await request(app)
    .post("/todos")
    .send({
      title: "Delete me",
      dueDate: new Date().toISOString(),
      completed: false,
    });

  const todo = JSON.parse(response.text);
  const todoID = todo.id;

  const deleteResponse = await request(app).delete(`/todos/${todoID}`);
  expect(deleteResponse.text).toBe("true");

  const getResponse = await request(app).get(`/todos/${todoID}`);
  expect(getResponse.status).toBe(404);
});
