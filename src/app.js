// Init
let todoArray = [];
let todoItemArray = [];

// When DOM loaded
window.addEventListener("DOMContentLoaded", (e) => {
  getDataFromLocal();
  getTodoItem();
  filterTodo();

  // Store list item
  storeListItems();
  // Theme switch
  themeSwitch();
  // Clear completed
  clearCompleted();
  // Drag todo
  dragTodo();
});

// Add local storage
function addLocalStorage() {
  const lists = document.querySelector(".todo-list");

  localStorage.setItem("todos", lists.innerHTML);
}

// Get data from local storage
function getDataFromLocal() {
  const lists = document.querySelector(".todo-list");

  if (localStorage.getItem("todos") === null) {
    localStorage.setItem("todos", lists.innerHTML);
    const defaultData = localStorage.getItem("todos");
    lists.innerHTML = defaultData;
  } else {
    const data = localStorage.getItem("todos");
    lists.innerHTML = data;
  }

  // store items
  storeItems();
  seeItemLeft();
}

// Theme switch
function themeSwitch() {
  const switchButton = document.querySelector("#theme-switch");
  const themeIcon = document.querySelector("#theme-icon");

  let themeMode = localStorage.getItem("darkMode");

  if (themeMode === "enable") {
    document.body.classList.add("light");
    themeIcon.src = "./src/images/icon-moon.svg";
  }

  switchButton.addEventListener("click", () => {
    let iconSrc = "./src/images/icon-sun.svg";
    themeMode = localStorage.getItem("darkMode");

    // Check switch mode
    if (themeMode !== "enable") {
      localStorage.setItem("darkMode", "enable");
      document.body.classList.add("light");
    } else {
      localStorage.setItem("darkMode", null);
      document.body.classList.remove("light");
    }

    // Check icon
    if (themeIcon.getAttribute("src") === iconSrc) {
      themeIcon.src = "./src/images/icon-moon.svg";
    } else {
      themeIcon.src = iconSrc;
    }

    // Check icon animation
    if (themeIcon.classList.contains("fade-out")) {
      themeIcon.classList.remove("fade-out");
      themeIcon.classList.add("fade-in");
    } else {
      themeIcon.classList.remove("fade-in");
      themeIcon.classList.add("fade-out");
    }
  });
}

// Get TODO item
function getTodoItem() {
  const todoForm = document.querySelector(".todo-form");
  const todoInput = document.querySelector("#todo-input");

  todoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!todoInput.value) {
      alert("Input field cannot be empty.");
    } else {
      displayTodoItem(todoInput.value);
      todoInput.value = "";
    }

    // item left
    seeItemLeft();
  });
}

// Display todo item
function displayTodoItem(item) {
  const todoList = document.querySelector(".todo-list");
  const listItem = document.createElement("li");
  listItem.classList.add("todo-list__item");

  listItem.innerHTML = `
                <div class="item">
                    <span class="todo-list__icon-check check-circle">
                    </span>

                    <h2 class="todo-list__name">
                    ${item}
                    </h2>

                    <span class="todo-list__icon-cross">
                    <img src="./src/images/icon-cross.svg" class="cross-icon" alt="Cross Icon" />
                    </span>
                </div>
  `;

  todoList.appendChild(listItem);

  // store items
  storeItems();
  storeListItems();
  addLocalStorage();
}

// Sotre items
function storeItems() {
  const items = document.querySelectorAll(".todo-list__item");

  items.forEach((item) => {
    const itemName = item.querySelector("h2");
    if (todoArray.includes(item)) return;
    if (itemName.classList.contains("complete-name")) return;

    todoArray.push(item);
  });
}

// Todo item array
function storeListItems() {
  const items = document.querySelectorAll(".todo-list__item");

  items.forEach((item) => {
    const itemName = item.querySelector("h2");
    if (itemName.classList.contains("complete-name")) {
      item.setAttribute("data-id", "completed");
    } else {
      item.setAttribute("data-id", "active");
    }
    todoItemArray.push(item);
  });
}

// See item left
function seeItemLeft() {
  const showLeftItem = document.querySelector(".item-left");

  showLeftItem.innerText = `${todoArray.length} items left`;
}

// Set completed item
document.addEventListener("click", (event) => {
  const target = event.target;

  if (target.classList.contains("todo-list__icon-check")) {
    removeTodo(target);
    addLocalStorage();
  }

  if (target.classList.contains("cross-icon")) {
    removeEl(target);
    addLocalStorage();
  }
});

// Remove todo
function removeTodo(span) {
  const name = span.nextElementSibling;
  src = "./src/images/icon-check.svg";
  span.classList.add("show-bg");
  span.innerHTML = `<img src="${src}" alt="Checkbox Icon" />`;
  name.classList.add("complete-name");

  const parent = name.parentElement.parentElement;
  // Remove from array
  const indexParent = todoArray.indexOf(parent);

  if (indexParent > -1) {
    todoArray.splice(indexParent, 1);
  }

  // Set data id attribute
  if (todoItemArray.includes(parent)) {
    let idData = parent.dataset;
    idData.id = "completed";
  }

  seeItemLeft();
  addLocalStorage();
}

// Remove element
function removeEl(el) {
  const parent = el.parentElement.parentElement.parentElement;
  parent.remove();

  const indexPrent = todoArray.indexOf(parent);
  if (indexPrent > -1) {
    todoArray.splice(indexPrent, 1);
  }

  seeItemLeft();
}

// Filter todo
function filterTodo() {
  const filterButton = document.querySelectorAll(".filter-item li");

  filterButton.forEach((button) => {
    button.addEventListener("click", (event) => {
      filterButton.forEach((btn) => btn.classList.remove("active"));
      event.target.classList.add("active");
      if (event.target.innerText.toLowerCase() === "active") {
        filterItem("active");
        addLocalStorage();
      } else if (event.target.innerText.toLowerCase() === "completed") {
        filterItem("completed");
        addLocalStorage();
      } else if (event.target.innerText.toLowerCase() === "all") {
        displayAll();
        addLocalStorage();
      }
    });
  });
}

// Filter
function filterItem(id) {
  todoItemArray.forEach((todo) => {
    if (todo.dataset.id !== id) {
      todo.style.display = "none";
    } else {
      todo.style.display = "block";
    }
  });
}

function displayAll() {
  todoItemArray.forEach((todo) => {
    todo.style.display = "block";
  });
}

// Clear completed
function clearCompleted() {
  const clearButton = document.querySelector(".item-clear");

  clearButton.addEventListener("click", () => {
    todoItemArray.forEach((todo) => {
      if (todo.dataset.id === "completed") {
        todo.remove();
        addLocalStorage();
      }
    });
  });
}

// Drag todos
function dragTodo() {
  const todos = document.querySelector(".todo-list");
  const todoLists = document.querySelectorAll(".todo-list__item");

  todoLists.forEach((todo) => {
    todo.setAttribute("draggable", true);

    todo.addEventListener("dragstart", (e) => {
      todo.classList.add("dragging");
    });

    todo.addEventListener("dragend", (e) => {
      todo.classList.remove("dragging");
    });
  });

  todos.addEventListener("dragover", (e) => {
    e.preventDefault();

    if (
      !e.target.classList.contains("dragging") &&
      e.target.classList.contains("todo-list__item")
    ) {
      const draggingTodo = document.querySelector(".dragging");
      const allTodos = [...todos.querySelectorAll(".todo-list__item")];
      const currentPos = allTodos.indexOf(draggingTodo);
      const newPos = allTodos.indexOf(e.target);

      if (currentPos > newPos) {
        todos.insertBefore(draggingTodo, e.target);
      } else {
        todos.insertBefore(draggingTodo, e.target.nextSibling);
      }

      const removed = allTodos.splice(currentPos, 1);
      allTodos.splice(newPos, 0, removed[0]);

      addLocalStorage();
    }
  });
}
