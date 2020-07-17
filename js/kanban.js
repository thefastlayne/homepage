/**********
 * Kanban *
 **********/
"use-strict";

/**
 * Drag and Drop
 */

function allowDrop(evt) {
  evt.preventDefault();
}

function drag(evt) {
  let todoObj;

  evt.dataTransfer.setData("cardId", evt.target.id);
  // todoObj = JSON.parse(localStorage.getItem(evt.target.id));
  // evt.dataTransfer.setData("cardPosition");
}

function drop(evt, list) {
  let card, todoObj;

  evt.preventDefault();
  card = document.getElementById(evt.dataTransfer.getData("cardId"));
  if (evt.target.hasAttribute("ondrop")) {
    evt.target.appendChild(card);
    todoObj = JSON.parse(localStorage.getItem(card.id));
    todoObj.list = list.id;
    // add position after function is written to find it
    // todoObj.position = ;

    updateTodo(todoObj);
  }
}

function moveDown(evt, id) {
  // once the card is dropped onto another card, it will move the old card's position down one
  let sourceCard, destinationCard, sourceTodoObj, destinationTodoObj, destinationList, destinationCount;

  sourceCard = document.getElementById(evt.dataTransfer.getData("cardId"));

  destinationCard = document.getElementById(id);

  sourceTodoObj = JSON.parse(localStorage.getItem(sourceCard.id));
  destinationTodoObj = JSON.parse(localStorage.getItem(destinationCard.id));

  // drop (replace) card and then append source
  destinationCard.replaceWith(sourceCard);

  /*
    // count destination list's nodes
    destinationList = document.getElementById(destinationTodoObj.list);
    destinationCount = destinationList.children.length;

    // update source card's position
    sourceTodoObj.position = destinationTodoObj.position;

    // update cards list
    sourceTodoObj.list = destinationTodoObj.list;

    // reappend destination to source's parent
    sourceCard.parentNode.appendChild(destinationCard);

    // update destination card's position
    destinationTodoObj.position += 1;

    // set to local storage
    updateTodo(sourceTodoObj);
    updateTodo(destinationTodoObj);
  */

  // console.log(destinationCount);
  // console.log(sourceCard.id + " is the source");
  // console.log(destinationCard.id + " is the destination");
  // console.log(sourceTodoObj);
  // console.log(destinationTodoObj);
}

function transparent(evt) {
  // make card transparent when another card is enters the dropzone
  if (evt.target.className == "dropzone") {
    evt.target.style.opacity = 0.15;
  }
}

function opaque(evt) {
  // reset transparency when the card leaves the dropzone
  if (evt.target.className == "dropzone") {
    evt.target.style.opacity = 1;
  }
}

/**
 * CRUD
 */

function index() {
  // get, sort, and then populate objects
  let list, todos, todosArray, card, div, span, button,
    cardAttributes, buttonAttributes;

  todos = Object.entries(localStorage);
  todosArray = [];

  // get objects into an array
  for (let i = 0; i < todos.length; i++) {
    if (todos[i][0] === "name" || todos[i][0] === "focus") { ; /* fails to check if false */ }
    else {
      todosArray.push(JSON.parse(todos[i][1]));
    }
  }

  todosArray
    .sort((a, b) => {
      // sort
      return a.position - b.position
    })
    .forEach(todo => {
      // populate
      cardAttributes = {
        id: todo.id,
        class: "card p-2 m-1 dropzone",
        draggable: true,
        ondragstart: "drag(event);",
        // ondragenter: "transparent(event);",
        // ondragleave: "opaque(event);",
        ondblclick: `editTodo(${todo.id});`,
        // ondrop: 'moveDown(event, this.id);',
      };

      buttonAttributes = {
        class: "badge badge-danger float-right dropzone",
        onclick: `deleteTodo(${todo.id});`,
      };

      card = document.createElement("div");
      for (let [k, v] of Object.entries(cardAttributes)) {
        card.setAttribute(k, v);
      }

      button = document.createElement("button");
      for (let [k, v] of Object.entries(buttonAttributes)) {
        button.setAttribute(k, v);
      }
      button.innerHTML = "&times;";

      list = document.getElementById(todo.list);
      div = document.createElement("div");
      div.setAttribute("class", "dropzone");
      span = document.createElement("span");
      span.setAttribute("class", "dropzone");
      span.innerText = todo.data;
      list.appendChild(card);
      card.appendChild(div);
      div.appendChild(span);
      div.appendChild(button);

      if (todo.list === "done-list") {
        card.classList.add("completed");
      }
    });
}

function createTodo() {
  // create form, store data, then convert to card
  let list, todoObj, card, form, div, span, button,
    formAtrributes, cardAttributes, buttonAttributes;

  todoObj = {
    id: Date.now(),
    data: null,
    list: "todo-list",
    position: 0,
    completed: false,
  }

  formAtrributes = {
    type: "text",
    class: "form-control",
    placeholder: "What do you have to do?",
  }

  cardAttributes = {
    id: todoObj.id,
    class: "card p-2 m-1 dropzone",
    draggable: false,
    ondragstart: "drag(event);",
    // ondragenter: "transparent(event);",
    // ondragleave: "opaque(event);",
    ondblclick: `editTodo(${todoObj.id});`,
    // ondrop: 'moveDown(event, this.id);',
  };

  buttonAttributes = {
    class: "badge badge-danger float-right dropzone",
    onclick: `deleteTodo(${todoObj.id});`,
  };

  list = document.getElementById(todoObj.list);

  card = document.createElement("div");
  for (let [k, v] of Object.entries(cardAttributes)) {
    card.setAttribute(k, v);
  }

  form = document.createElement("input");
  for (let [k, v] of Object.entries(formAtrributes)) {
    form.setAttribute(k, v);
  }

  button = document.createElement("button");
  for (let [k, v] of Object.entries(buttonAttributes)) {
    button.setAttribute(k, v);
  }
  button.innerHTML = "&times;";

  list.appendChild(card);
  card.appendChild(form);

  form.addEventListener("keypress", evt => {
    if (evt.which == 13 || evt.keyCode == 13) {
      if (form.value === "") {
        card.remove();
      } else {
        todoObj.data = form.value;
        div = document.createElement("div");
        div.setAttribute("class", "dropzone")
        span = document.createElement("span");
        span.setAttribute("class", "dropzone");
        span.innerText = form.value;
        card.replaceChild(div, form);
        div.appendChild(span);
        div.appendChild(button);
        card.setAttribute("draggable", true);
        storeTodo(todoObj);
      }
      div.blur();
    }
  }, false);
}

function storeTodo(obj) {
  // store form data to local storage
  localStorage.setItem(obj.id, JSON.stringify(obj));
}

function editTodo(id) {
  // turn card into form, update data, then convert to back card
  let list, todoObj, card, form, div, span, button,
    formAtrributes, cardAttributes, buttonAttributes;

  todoObj = JSON.parse(localStorage.getItem(id));
  card = document.getElementById(id);
  div = card.firstChild;
  span = div.firstChild;

  formAtrributes = {
    type: "text",
    class: "form-control",
  }

  buttonAttributes = {
    class: "badge badge-danger float-right dropzone",
    onclick: `deleteTodo(${todoObj.id})`,
  };

  form = document.createElement("input");
  for (let [k, v] of Object.entries(formAtrributes)) {
    form.setAttribute(k, v);
  }
  form.value = span.innerText;

  button = document.createElement("button");
  for (let [k, v] of Object.entries(buttonAttributes)) {
    button.setAttribute(k, v);
  }
  button.innerHTML = "&times;";

  card.setAttribute("draggable", false);
  card.replaceChild(form, div);

  form.addEventListener("keypress", evt => {
    if (evt.which == 13 || evt.keyCode == 13) {
      if (form.value === "") {
        card.remove();
        localStorage.removeItem(id);
      } else {
        todoObj.data = form.value;
        div = document.createElement("div");
        div.setAttribute("class", "dropzone");
        span = document.createElement("span");
        span.setAttribute("class", "dropzone");
        span.innerText = form.value;
        card.replaceChild(div, form);
        div.appendChild(span);
        div.appendChild(button);
        card.setAttribute("draggable", true);
        updateTodo(todoObj);
      }
      div.blur();
    }
  }, false);


}

function updateTodo(obj) {
  // update supplied object data to local storage
  let card = document.getElementById(obj.id);

  if (obj.list === "done-list") {
    card.classList.add("completed");
    if (obj.completed === false) {
      obj.completed = Date.now();
    }
  } else {
    if (card.classList.contains("completed")) {
      card.classList.remove("completed");
      obj.completed = false;
    }
  }

  localStorage.setItem(obj.id, JSON.stringify(obj));
}

function deleteTodo(id) {
  // remove localstorage item based on supplied id
  if (confirm("Are you sure?")) {
    document.getElementById(id).remove();
    localStorage.removeItem(id);
  }
}

/*******
 * Run *
 *******/

index();
