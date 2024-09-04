const todoList = require('../todo')

const {all, markAsComplete, add, overdue, dueToday, dueLater} = todoList();

describe("Todolist Test Suite", () => {
    beforeAll(() => {
        add({
            title: 'Test todo',
            completed: false,
            dueDate: new Date().toLocaleDateString("en-CA")}
    ); 
    })

    test("Should add new todo", () => {
        const todoItemsCount = all.length;
        add({
            title: 'Test todo',
            completed: false,
            dueDate: new Date().toLocaleDateString("en-CA")
        })
        expect(all.length).toBe(todoItemsCount + 1);
    });

    test("Should mark a todo as complete", () => {
        expect(all[0].completed).toBe(false);
        markAsComplete(0);
        expect(all[0].completed).toBe(true);
    });

    test("to retrive due today item", () => {
        let itemsDueTday = dueToday();
        expect(itemsDueTday.every(item => item.dueDate === new Date().toLocaleDateString("en-CA"))).toBe(true);
    });
    
    test("Should retrieve overdue items", () => {
        add({
          title: 'Overdue todo',
          completed: false,
          dueDate: new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString("en-CA"),
        });
      
        const overdueItems = overdue();
        expect(overdueItems.length).toBeGreaterThan(0); // At least one item should be overdue
        expect(overdueItems.every(item => item.dueDate < new Date().toLocaleDateString("en-CA"))).toBe(false);
      });
      
    
        test("to retrive dueLater item", () => {
        add({
            title: 'dueLater todo',
            completed: false,
            dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString("en-CA")
        });
        let itemsDueLater = dueLater();
        expect(itemsDueLater.every(item => item.dueDate > new Date().toLocaleDateString("en-CA"))).toBe(true);
    });


})
