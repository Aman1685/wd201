const todoList = () => {
    all = []
    const add = (todoItem) => {
      all.push(todoItem)
    }
    const markAsComplete = (index) => {
      all[index].completed = true
    }
  
    const overdue = () => {
        let date = new Date().toLocaleDateString("en-CA");
        return all.filter((item) => item.dueDate < date );
    }
  
    const dueToday = () => {
        let date = new Date().toLocaleDateString("en-CA");
        return all.filter((item) => item.dueDate === date );
    }
  
    const dueLater = () => {
        let date = new Date().toLocaleDateString("en-CA");
        return all.filter((item) => item.dueDate > date );
    }
  
    const toDisplayableList = (list) => {
        return list.map((item) => {
            const checkbox = item.completed ? "[x]" : "[ ]";
            const displayDate = item.dueDate === new Date().toLocaleDateString("en-CA") ? "" : item.dueDate;
            return `${checkbox} ${item.title}${displayDate ? " " + displayDate : ""}`}).join("\n");
  };

  
    return {
      all,
      add,
      markAsComplete,
      overdue,
      dueToday,
      dueLater,
      toDisplayableList
    };
  };
  
  // ####################################### #
  // DO NOT CHANGE ANYTHING BELOW THIS LINE. #
  // ####################################### #

  module.exports = todoList;