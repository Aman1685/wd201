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
       const itemsDueToday = dueToday();
       var today_date = new Date();
       today_date.setDate(today_date.getDate());
       let today = today_date.toLocaleDateString("en-CA");
       add({
        title: "today System",
        dueDate: today,
        completed: false,
      });
      expect(dueToday().length).toBe(itemsDueToday.length +1);
    });
    
    test("Over due tasks", () => {
        const overdueItems=overdue();
        var prev_date = new Date();
        prev_date.setDate(prev_date.getDate() - 1);
        let yesterday=prev_date.toLocaleDateString("en-CA");
        add({
          title: "Update System",
          dueDate: yesterday,
          completed: false,
        });
        expect(overdue().length).toBe(overdueItems.length +1);
      });
      
    test("to retrive dueLater item", () => {
        const itemsDueLater =  dueLater();
        var nxt_date = new Date();
        nxt_date.setDate(nxt_date.getDate() + 1);
        let tommorow = nxt_date.toLocaleDateString("en-CA");
        add({
            title: 'dueLater todo',
            dueDate: tommorow,
            completed: false
        });
        expect(dueLater().length).toBe(itemsDueLater.length + 1);
    });


})
