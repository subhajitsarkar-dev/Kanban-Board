let draggedCard = null;
let rightClickedCard = null;
document.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage);

function addTask(columnId) {
  const input = document.getElementById(`${columnId}-input`);
  const taskText = input.value.trim();

  if (taskText === "") {
    return;
  }
  const taskDate = new Date().toLocaleString();
  const taskElement = createTaskEle(taskText, taskDate);
  document.getElementById(`${columnId}-tasks`).appendChild(taskElement);
  updateTasksCount(columnId);
  saveTasksToLocalStorage(columnId, taskText, taskDate);
  input.value = "";
}

const createTaskEle = (taskText, taskDate) => {
  const taskElement = document.createElement("div");
  taskElement.innerHTML = `<span>${taskText}</span> <br> <small class="time">${taskDate}</small>`;
  taskElement.classList.add("card");
  // taskElement.setAttribute("draggable", true);
  taskElement.draggable = true;
  taskElement.addEventListener("dragstart", dragStart);
  taskElement.addEventListener("dragend", dragEnd);
  taskElement.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    rightClickedCard = this;
    showContextMenu(e.pageX, e.pageY);
  });
  return taskElement;
};

function dragStart() {
  this.classList.add("dragging");
  draggedCard = this;
}
function dragEnd() {
  this.classList.remove("dragging");
  ["todo", "doing", "done"].forEach((columnId) => {
    updateTasksCount(columnId);
    updateLocalStorage();
  });
}

const columns = document.querySelectorAll(".tasks");
columns.forEach((column) => {
  column.addEventListener("dragover", dragOver);
});

function dragOver(e) {
  e.preventDefault();
  this.appendChild(draggedCard);
}
const contextMenu = document.querySelector(".context-menu");
function showContextMenu(x, y) {
  contextMenu.style.left = `${x}px`;
  contextMenu.style.top = `${y}px`;
  contextMenu.style.display = "block";
}

document.addEventListener("click", () => {
  contextMenu.style.display = "none";
});

function editTask() {
  if (rightClickedCard !== null) {
    const newTask = prompt("Edit task - ", rightClickedCard.textContent);
    if (newTask !== "") {
      rightClickedCard.textContent = newTask;
      updateLocalStorage();
    }
  }
}

function deleteTask() {
  if (rightClickedCard !== null) {
    const columnId = rightClickedCard.parentElement.id.replace("-tasks", "");
    rightClickedCard.remove();
    updateTasksCount(columnId);
    updateLocalStorage();
  }
}

function updateTasksCount(columnId) {
  const count = document.querySelectorAll(`#${columnId}-tasks .card`).length;
  document.getElementById(`${columnId}-count`).textContent = count;
}

function saveTasksToLocalStorage(columnId, taskText, taskDate) {
  const tasks = JSON.parse(localStorage.getItem(columnId)) || [];
  tasks.push({ text: taskText, date: taskDate });
  localStorage.setItem(columnId, JSON.stringify(tasks));
}
function loadTasksFromLocalStorage() {
  ["todo", "doing", "done"].forEach((columnId) => {
    const tasks = JSON.parse(localStorage.getItem(columnId)) || [];
    tasks.forEach(({ text, date }) => {
      const taskEle = createTaskEle(text, date);
      document.getElementById(`${columnId}-tasks`).appendChild(taskEle);
    });
    updateTasksCount(columnId);
  });
}
function updateLocalStorage() {
  ["todo", "doing", "done"].forEach((columnId) => {
    const tasks = [];
    document.querySelectorAll(`#${columnId}-tasks .card`).forEach((card) => {
      const taskText = card.querySelector("span").textContent;
      const taskDate = card.querySelector("small").textContent;
      tasks.push({ text: taskText, date: taskDate });
    });
    localStorage.setItem(columnId, JSON.stringify(tasks));
  });
}
