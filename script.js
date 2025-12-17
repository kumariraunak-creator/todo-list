// =================== ELEMENTS ===================
const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const priority = document.getElementById("priority");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");
const themeToggle = document.getElementById("themeToggle");

const addBtn = document.querySelector(".add-btn");
const clearBtn = document.querySelector(".clear-btn");
const sortPriorityBtn = document.getElementById("sortPriority");
const sortDateBtn = document.getElementById("sortDate");

// =================== DATA ===================
let tasks = [];

// =================== LOCAL STORAGE ===================
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
  }
}

// =================== NOTIFICATIONS ===================
if ("Notification" in window) {
  Notification.requestPermission();
}

function showNotification(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body: body,
      icon: "icon-192.png"
    });
  }
}

// =================== ADD TASK ===================
function addTask() {
  if (!taskInput.value || !dueDate.value) return;

  tasks.push({
    text: taskInput.value,
    date: dueDate.value,
    priority: priority.value,
    done: false
  });

  showNotification("Task Added ✅", taskInput.value);

  taskInput.value = "";
  dueDate.value = "";

  saveTasks();
  renderTasks();
}

// =================== DELETE TASK ===================
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// =================== EDIT TASK ===================
function editTask(index) {
  const t = tasks[index];
  const newText = prompt("Edit task", t.text);
  if (newText !== null && newText.trim() !== "") {
    t.text = newText;
    saveTasks();
    renderTasks();
  }
}

// =================== TOGGLE COMPLETE ===================
function toggleDone(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

// =================== CLEAR COMPLETED ===================
function clearCompleted() {
  tasks = tasks.filter(t => !t.done);
  saveTasks();
  renderTasks();
}

// =================== SORT ===================
function sortByPriority() {
  const order = { high: 1, medium: 2, low: 3 };
  tasks.sort((a, b) => order[a.priority] - order[b.priority]);
  renderTasks();
}

function sortByDate() {
  tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
  renderTasks();
}

// =================== COUNTER ===================
function updateCounter() {
  const completed = tasks.filter(t => t.done).length;
  const pending = tasks.length - completed;
  counter.textContent = `Pending: ${pending} | Completed: ${completed}`;
}

// =================== DUE DATE CHECK ===================
function checkDueToday() {
  const today = new Date().toISOString().split("T")[0];
  tasks.forEach(t => {
    if (t.date === today && !t.done) {
      showNotification("Due Today ⏰", t.text);
    }
  });
}

// =================== RENDER ===================
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.done ? "done" : "";

    li.innerHTML = `
      <input type="checkbox" ${task.done ? "checked" : ""} onclick="toggleDone(${index})">
      <div class="task-info">
        <span class="task-text">${task.text}</span>
        <small>Due: ${task.date}</small>
        <span class="tag ${task.priority}">${task.priority}</span>
      </div>
      <button onclick="editTask(${index})">✏️</button>
      <button onclick="deleteTask(${index})">❌</button>
    `;

    taskList.appendChild(li);
  });

  updateCounter();
}

// =================== DARK MODE ===================
function loadTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark");
  }
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
});

// =================== EVENTS ===================
addBtn.addEventListener("click", addTask);
clearBtn.addEventListener("click", clearCompleted);
sortPriorityBtn.addEventListener("click", sortByPriority);
sortDateBtn.addEventListener("click", sortByDate);

// =================== INIT ===================
loadTasks();
loadTheme();
renderTasks();
checkDueToday();

