// — Brouillon (Draft) —
const DRAFT_KEY = `task_draft_${projectId}`;

// Restore draft on page load
const savedDraft = localStorage.getItem(DRAFT_KEY);
if (savedDraft) {
  const data = JSON.parse(savedDraft);
  const confirmRestore = confirm("Vous avez un brouillon non enregistré. Voulez-vous le restaurer ?");
  if (confirmRestore) {
    document.getElementById("taskTitle").value    = data.title       || "";
    document.getElementById("taskDesc").value     = data.description || "";
    document.getElementById("taskPriority").value = data.priority    || "";
    document.getElementById("taskDueDate").value  = data.dueDate     || "";
  } else {
    localStorage.removeItem(DRAFT_KEY);
  }
}

// Auto-save draft on input
const saveDraft = () => {
  localStorage.setItem(DRAFT_KEY, JSON.stringify({
    title:       document.getElementById("taskTitle").value,
    description: document.getElementById("taskDesc").value,
    priority:    document.getElementById("taskPriority").value,
    dueDate:     document.getElementById("taskDueDate").value,
  }));
};

["taskTitle", "taskDesc", "taskPriority", "taskDueDate"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("input", saveDraft);
});
const API = "http://localhost:5000/api";
const projectId = localStorage.getItem("currentProjectId");
const token = localStorage.getItem("token");

// Redirect if not logged in
if (!token) window.location.href = "index.html";

const headers = { Authorization: `Bearer ${token}` };

// — Load tasks —
async function loadTasks() {
  try {
    const res = await axios.get(`${API}/projects/${projectId}/tasks`, { headers });
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

  
if (res.data.length === 0) {
  taskList.innerHTML = '<p style="color:#5b6e8c">No tasks yet.</p>';
  return;
}

res.data.forEach(task => {
  const div = document.createElement('div');
  div.className = `task - item priority - ${ task.priority } `;
  div.innerHTML = `
      < div class="task-info" >
      <h3>${task.title}</h3>
      <span>Priority: ${task.priority} | Due: ${task.dueDate ? task.dueDate.slice(0,10) : 'N/A'}</span>
    </div >
      <div class="task-actions">
        <select onchange="updateStatus('${task._id}', this.value)">
          <option value="todo" ${task.status === 'todo' ? 'selected' : ''}>Todo</option>
          <option value="in progress" ${task.status === 'in progress' ? 'selected' : ''}>In Progress</option>
          <option value="done" ${task.status === 'done' ? 'selected' : ''}>Done</option>
        </select>
        <button onclick="deleteTask('${task._id}')">Delete</button>
      </div>
    `;
  taskList.appendChild(div);
});


  } catch (err) {
    console.error(err);
  }
}
// — Add task —
document.getElementById("addTaskBtn").addEventListener("click", async () => {
  const title = document.getElementById("taskTitle").value.trim();
  const desc = document.getElementById("taskDesc").value.trim();
  const priority = document.getElementById("taskPriority").value;
  const dueDate = document.getElementById("taskDueDate").value;

  if (!title || !priority) {
    alert("Title and priority are required.");
    return;
  }

  try {
    await axios.post(`${API}/tasks`, {
      title, description: desc, priority, dueDate, project: projectId
    }, { headers });

    ```
// Clear form
document.getElementById('taskTitle').value = '';
document.getElementById('taskDesc').value = '';
document.getElementById('taskPriority').value = '';
document.getElementById('taskDueDate').value = '';
localStorage.removeItem(DRAFT_KEY);
loadTasks();
```

  } catch (err) {
    alert(err.response?.data?.message || "Error adding task");
  }
});

// — Update status —
async function updateStatus(taskId, status) {
  try {
    await axios.patch(`${API}/tasks/${taskId}/status`, { status }, { headers });
    loadTasks();
  } catch (err) {
    alert(err.response?.data?.message || "Error updating status");
  }
}

// — Delete task —
async function deleteTask(taskId) {
  if (!confirm("Delete this task?")) return;
  try {
    await axios.delete(`${API}/tasks/${taskId}`, { headers });
    loadTasks();
  } catch (err) {
    alert(err.response?.data?.message || "Error deleting task");
  }
}

// — Logout —
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});

// Init
loadTasks();