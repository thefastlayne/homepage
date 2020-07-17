const kanban = document.getElementById("kanban");

/**
 * Begin Kanboard
 */


/* Drag Events */

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("cardId", ev.target.id);
  // console.log(ev.target.id);
}

function drop(ev, list) {
  let card = document.getElementById(ev.dataTransfer.getData("cardId")),
    todoObj = Object;

  ev.preventDefault();
  list.appendChild(card);
  todoObj.id = card.id;

  switch (list.id) {
    case "todo-list":
      todoObj.list = "todo";
      todoObj.completed = false;
      break;
    case "doing-list":
      todoObj.list = "doing";
      todoObj.completed = false;
      break;
    case "done-list":
      todoObj.list = "done";
      if (todoObj.completed === false) {
        todoObj.completed = Date.now()
      } else {
        todo.Obj.completed = JSON.parse(localStorage.getItem(card.id)).completed;
      };
      break;
  }

  updateTodo(todoObj);
}

function moveDown(ev) {
  // move parent down if card is dropped on top of another card
}


/* CRUD functionality */

function getTodos() {
  let todos = Object.entries(localStorage),
    todosArray = [], todo;

  for (let i = 0; i < todos.length; i++) {
    if (todos[i][0] === "name" || todos[i][0] === "focus") { ; /* fails to check if false */ }
    else {
      todosArray.push(JSON.parse(todos[i][1]));
    }
  }

  // console.log(todosArray.sort(function (a, b) { return a.position - b.position; })); // returns array of objects sorted by position
  // todosArray.sort((a, b) => { return a.position - b.position; }).forEach(item => console.log(item)); // returns the objects sorted by position


  todosArray
    .sort((a, b) => {
      return a.position - b.position
    }) // end of sort
    .forEach(todo => {
      (todo)
    }); // end of forEach



  /*
    for (let [k, v] of Object.entries(todos)) {
      if (k === "name" || k === "focus") {
        ; // do nothing if true, fails to check if false
      } else {
        let card = document.createElement("div"),
          cardBody = document.createElement("div"),
          cardText = document.createElement("span"),
          cardButton = document.createElement("button"),
          values = JSON.parse(v), list;

        switch (values.list) {
          case 'todo':
            list = document.getElementById("todo-list");
            break;
          case 'doing':
            list = document.getElementById("doing-list");
            break;
          case 'done':
            list = document.getElementById("done-list");
            break;
        }
        card.setAttribute("id", k);
        card.setAttribute("class", "card p-1");
        card.setAttribute("draggable", true);
        card.setAttribute("ondragstart", "drag(event)");
        card.setAttribute("ondblclick", `editTodo(${card.id})`);
        cardButton.setAttribute("class", "badge badge-danger float-right");
        cardButton.setAttribute("onclick", `deleteTodo(${card.id})`);
        cardButton.innerHTML = "&times;";
        cardText.innerText = values.data;
        list.appendChild(card);
        card.appendChild(cardBody);
        cardBody.appendChild(cardText);
        cardBody.appendChild(cardButton);

        if (values.completed !== false) {
          card.classList.add("completed");
        } else {
          if (card.classList.contains("completed")) {
            card.classList.remove("completed");
          }
        }
      }
    }

  */
}

function createTodo() {
  let card = document.createElement("div"),
    todo = document.createElement("input"),
    list = document.getElementById("todo-list");

  card.setAttribute("id", Date.now());
  card.setAttribute("class", "card p-1");
  todo.setAttribute("type", "text");
  todo.setAttribute("class", "form-control");
  todo.setAttribute("placeholder", "What do you have to do?");
  list.appendChild(card);
  card.appendChild(todo);
  todo.addEventListener("keypress", function (evt) {
    if (evt.which == 13 || evt.keyCode == 13) {
      storeTodo(card.id);
    }
  });
}

function storeTodo(id) {
  let card = document.getElementById(id),
    todo = card.firstChild, todoObj,
    cardBody = document.createElement("div"),
    cardText = document.createElement("span"),
    cardButton = document.createElement("button");
  if (todo.value !== "") {

    if (localStorage.getItem(id)) {
      todoObj = JSON.parse(localStorage.getItem(id));
      localStorage.setItem(card.id, JSON.stringify({
        list: todoObj.list,
        data: todoObj.data,
        completed: todoObj.completed,
        position: todoObj.position,
      }));
    } else {
      localStorage.setItem(card.id, JSON.stringify({
        list: "todo",
        data: todo.value,
        completed: false,
        position: 0,
      }));
    }


    card.setAttribute("draggable", true);
    card.setAttribute("ondragstart", "drag(event)");
    card.setAttribute("ondblclick", `editTodo(${card.id})`);
    cardButton.setAttribute("class", "badge badge-danger float-right");
    cardButton.setAttribute("onclick", `deleteTodo(${card.id})`);
    cardButton.innerHTML = "&times;";
    cardText.innerText = todo.value;
    card.replaceChild(cardBody, todo);
    cardBody.appendChild(cardText);
    cardBody.appendChild(cardButton);

  } else {
    card.remove();
    localStorage.removeItem(card.id);
  }
  todo.blur();
}

function editTodo(id) {
  let card = document.getElementById(id),
    cardBody = card.firstChild,
    cardText = cardBody.firstChild;

  todo = document.createElement("input");
  todo.setAttribute("class", "form-control");
  card.removeAttribute("draggable", true);
  card.removeAttribute("ondragstart", "drag(event)");
  card.removeAttribute("ondblclick", `editTodo(${card.id})`);
  todo.value = cardText.innerText;
  cardBody.replaceWith(todo);
  todo.addEventListener("keypress", function (evt) {
    if (evt.which == 13 || evt.keyCode == 13) {
      storeTodo(card.id);
    }
  });
}

function updateTodo(obj) {
  let todo = JSON.parse(localStorage.getItem(obj.id)),
    card = document.getElementById(obj.id);

  localStorage.setItem(obj.id, JSON.stringify({
    list: obj.list,
    data: todo.data,
    completed: obj.completed,
    position: 0,
  }));

  if (obj.completed !== false) {
    card.classList.add("completed");
  } else {
    if (card.classList.contains("completed")) {
      card.classList.remove("completed");
    }
  }

  // set position
}

function deleteTodo(id) {
  let card = document.getElementById(id);
  if (confirm("Are you sure?")) {
    card.remove();
    localStorage.removeItem(card.id);
  }
}

/* Helpers */

function closeTodoForms() {
  // on blur convert all todo inputs back to cards
}

function countTodos() {
  // count how many todos are before current to apply a position key
}

function expireTodos() {
  // check if compelted todos are older than 24 hours, if they are, expire them from the done list
}



/**
 * End Kanboard
 */


getTodos();
