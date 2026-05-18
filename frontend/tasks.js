

document.addEventListener('DOMContentLoaded', () => {
    // 1.Fake data
    const fakeTasks = [
        { id: 1, title: "Design Landing Page", status: "inprogress", priority: "high" },
        { id: 2, title: "Fix Navbar Bug", status: "todo", priority: "medium" },
        { id: 3, title: "Setup Database", status: "done", priority: "high" },
        { id: 4, title: "Write Documentation", status: "inprogress", priority: "low" },
        { id: 5, title: "User Interview", status: "todo", priority: "medium" }
    ];

    // 2. pour avoir accès aux éléments du DOM
    const taskList = document.getElementById('taskList');
    const searchInput = document.getElementById('taskSearch');
    const filterStatus = document.getElementById('filterStatus');
    const filterPriority = document.getElementById('filterPriority');
    const clearFilters = document.getElementById('clearFilters');

    // 3. pour afficher les tâches dans le DOM
    function renderTasks(tasksToDisplay) {
        taskList.innerHTML = ''; // clear previous tasks

        if (tasksToDisplay.length === 0) {
            taskList.innerHTML = '<p class="empty-msg">No tasks match your criteria.</p>';
            return;
        }

        tasksToDisplay.forEach(task => {
            const taskCard = document.createElement('div');
            // design simple pour chaque tâche
            taskCard.style.cssText = `
                background: white;
                padding: 15px;
                border-radius: 10px;
                border: 1px solid #e2e8f0;
                margin-bottom: 15px;
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-left: 6px solid ${task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f59e0b' : '#10b981'};
            `;

            taskCard.innerHTML = `
                <div>
                    <h3 style="margin: 0; color: #1e293b;">${task.title}</h3>
                    <span style="font-size: 13px; color: #64748b;">Status: ${task.status}</span>
                </div>
                <div style="text-transform: uppercase; font-size: 12px; font-weight: bold; color: #475569;">
                    ${task.priority}
                </div>
            `;
            taskList.appendChild(taskCard);
        });
    }

    // 4. pour gérer filtrage des tâches et recherche
    function handleFilters() {
        const searchText = searchInput.value.toLowerCase();
        const statusValue = filterStatus.value;
        const priorityValue = filterPriority.value;

        const filtered = fakeTasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchText);
            const matchesStatus = statusValue === 'all' || task.status === statusValue;
            const matchesPriority = priorityValue === 'all' || task.priority === priorityValue;
            return matchesSearch && matchesStatus && matchesPriority;
        });

        renderTasks(filtered);
    }

// lier les événements d'entrée et de changement aux fonctions de filtrage
    searchInput.addEventListener('input', handleFilters);
    filterStatus.addEventListener('change', handleFilters);
    filterPriority.addEventListener('change', handleFilters);

    // bouton pour réinitialiser les filtres et afficher toutes les tâches
    clearFilters.addEventListener('click', () => {
        searchInput.value = '';
        filterStatus.value = 'all';
        filterPriority.value = 'all';
        renderTasks(fakeTasks);
    });

    // afficher les tâches initialement
    renderTasks(fakeTasks);
});
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
