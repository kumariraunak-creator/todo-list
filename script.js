let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let darkMode = localStorage.getItem("darkMode") === "true";

const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const priority = document.getElementById("priority");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");
const themeToggle = document.getElementById("themeToggle");

if (darkMode) document.body.classList.add("dark");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  let completed = 0;

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.done) {
      li.classList.add("completed");
      completed++;
    }
const today = new Date().toISOString().split("T")[0];

if (!task.done && task.date && task.date !== "No date" && task.date < today) {
  li.classList.add("overdue");
}

    li.innerHTML = `
      <input type="checkbox" ${task.done ? "checked" : ""}>
      <span>${task.text}<br><small>Due: ${task.date}</small></span>
      <span class="priority ${task.priority}">${task.priority}</span>
      <button onclick="editTask(${index})">✏️</button>
      <button onclick="deleteTask(${index})">❌</button>
    `;

    li.querySelector("input").addEventListener("change", () => {
      task.done = !task.done;
      saveTasks();
      renderTasks();
    });

    taskList.appendChild(li);
  });

  counter.innerText = `Pending: ${tasks.length - completed} | Completed: ${completed}`;
}

function addTask() {
  if (!taskInput.value || !dueDate.value) return;

  tasks.push({
    text: taskInput.value,
    date: dueDate.value,
    priority: priority.value,
    done: false
  });

  taskInput.value = "";
  dueDate.value = "";

  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const t = tasks[index];
  const newText = prompt("Edit task", t.text);
  const newDate = prompt("Edit due date (YYYY-MM-DD)", t.date);
  const newPriority = prompt("Priority: high / medium / low", t.priority);

  if (newText && newDate && newPriority) {
    t.text = newText;
    t.date = newDate;
    t.priority = newPriority;
    saveTasks();
    renderTasks();
  }
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.done);
  saveTasks();
  renderTasks();
}

function sortByPriority() {
  const order = { high: 1, medium: 2, low: 3 };
  tasks.sort((a, b) => order[a.priority] - order[b.priority]);
  renderTasks();
}

function sortByDate() {
  tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
  renderTasks();
}

themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
};

document.querySelector(".add-btn").onclick = addTask;
document.querySelector(".clear-btn").onclick = clearCompleted;
document.getElementById("sortPriority").onclick = sortByPriority;
document.getElementById("sortDate").onclick = sortByDate;

renderTasks();
