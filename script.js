// ======================================================
// ELEMENT REFERENCES
// ======================================================
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const taskCount = document.getElementById("task-count");
const prioritySelect = document.getElementById("priority");

// ======================================================
// TOAST NOTIFICATION
// ======================================================
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ======================================================
// ADD TASK
// ======================================================
function addTask() {
  const text = inputBox.value.trim();
  if (!text) {
    showToast("Task cannot be empty", "error");
    return;
  }

  const priority = prioritySelect ? prioritySelect.value : "medium";

  createTask(text, false, priority);
  inputBox.value = "";

  saveData();
  updateCount();
  showToast("Task added", "success");
}

// ENTER KEY SUPPORT
inputBox.addEventListener("keydown", e => {
  if (e.key === "Enter") addTask();
});

// ======================================================
// CREATE TASK
// ======================================================
function createTask(text, completed, priority = "medium") {
  const li = document.createElement("li");
  li.draggable = true;

  if (completed) li.classList.add("checked");

  const textSpan = document.createElement("span");
  textSpan.textContent = text;

  const priorityTag = document.createElement("span");
  priorityTag.className = `priority ${priority}`;
  priorityTag.textContent = priority.toUpperCase();

  const deleteBtn = document.createElement("span");
  deleteBtn.className = "delete-btn";
  deleteBtn.innerHTML = "×";

  li.append(textSpan, priorityTag, deleteBtn);
  listContainer.appendChild(li);

  addDragEvents(li);
}

// ======================================================
// CLICK HANDLER (CHECK / DELETE)
// ======================================================
listContainer.addEventListener("click", e => {
  const li = e.target.closest("li");
  if (!li) return;

  if (e.target.classList.contains("delete-btn")) {
    li.remove();
    showToast("Task deleted", "error");
  } else {
    li.classList.toggle("checked");
  }

  saveData();
  updateCount();
});

// ======================================================
// CLEAR ALL TASKS
// ======================================================
function clearAllTasks() {
  if (!listContainer.children.length) {
    showToast("No tasks to clear", "info");
    return;
  }

  listContainer.innerHTML = "";
  saveData();
  updateCount();
  showToast("All tasks cleared", "info");
}

// ======================================================
// DRAG & DROP (SMOOTH)
// ======================================================
let draggedItem = null;

function addDragEvents(li) {
  li.addEventListener("dragstart", () => {
    draggedItem = li;
    li.classList.add("dragging");
  });

  li.addEventListener("dragend", () => {
    draggedItem = null;
    li.classList.remove("dragging");
    saveData();
  });

  li.addEventListener("dragover", e => {
    e.preventDefault();
    li.classList.add("drag-over");
  });

  li.addEventListener("dragleave", () => {
    li.classList.remove("drag-over");
  });

  li.addEventListener("drop", () => {
    li.classList.remove("drag-over");
    if (draggedItem && draggedItem !== li) {
      listContainer.insertBefore(draggedItem, li);
    }
  });
}

// ======================================================
// LOCAL STORAGE
// ======================================================
function saveData() {
  const tasks = [];

  document.querySelectorAll("#list-container li").forEach(li => {
    tasks.push({
      text: li.firstChild.textContent,
      completed: li.classList.contains("checked"),
      priority: li.querySelector(".priority")?.classList[1] || "medium"
    });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  listContainer.innerHTML = "";

  tasks.forEach(task =>
    createTask(task.text, task.completed, task.priority)
  );

  updateCount();
}

// ======================================================
// TASK COUNTER
// ======================================================
function updateCount() {
  const total = listContainer.children.length;
  const completed = document.querySelectorAll("#list-container li.checked").length;
  taskCount.textContent = `${completed}/${total}`;
}

// ======================================================
// THEME TOGGLE (PERSISTENT)
// ======================================================
function toggleTheme() {
  document.body.classList.toggle("light");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light") ? "light" : "dark"
  );
}

// RESTORE THEME
(function () {
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
  }
})();

// ======================================================
// INITIAL LOAD
// ======================================================
showTasks();
updateCount();
