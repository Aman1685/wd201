const { connect } = require("./connectDB.js");
const Todo = require("./TodoModel.js");

const createTodo = async () => {
    try {
        await connect();
        const todo = await Todo.create({
            title: "Second Item",
            dueDate: new Date(),
            completed: false,
        });
        console.log(`Created todo with ID : ${todo.id}`);
    } catch(error) {
        console.error(error);
    }
};

const countItems = async () => {
    try {const totalCount = await Todo.count();
    console.log(`Found ${totalCount}`);
    } catch(error) {
        console.error(error);
}
} 

const tofind = async () => {
    try {
        const todos = await Todo.findAll();
        const todoList = todos.map(todo => todo.dispalyableString()).join("\n");
        console.log(todoList);
    } catch(error) {
        console.error(error);
    }
}

(async () => {
    //await createTodo();
    //await countItems();
    await tofind();
})();