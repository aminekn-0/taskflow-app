const API = "http://localhost:5000/api";
const projectId = localStorage.getItem("currentProjectId");
const token = localStorage.getItem("token");

// Redirect if not logged in
if (!token) window.location.href = "index.html";

const headers = { Authorization: `Bearer ${token}` };

// — Load tasks for the dropdown —
async function loadTasks() {
    try {
        const res = await axios.get(`${API}/projects/${projectId}/tasks`, { headers });
        const taskSelect = document.getElementById("taskSelect");
        taskSelect.innerHTML = "<option value=\"\">-- Select a task --</option>";
        res.data.forEach(task => {
            const option = document.createElement("option");
            option.value = task._id;
            option.textContent = task.title;
            taskSelect.appendChild(option);
        });
    } catch (err) {
        console.error(err);
    }
}

// — Load members for the dropdown —
async function loadMembers() {
    try {
        const res = await axios.get(`${API}/projects/${projectId}/members`, { headers });
        const memberSelect = document.getElementById("memberSelect");
        memberSelect.innerHTML = "<option value=\"\">– Select a member –</option>";
        res.data.forEach(member => {
            const option = document.createElement("option");
            option.value = member._id;
            option.textContent = `${member.name} (${member.email})`;
            memberSelect.appendChild(option);
        });
    } catch (err) {
        console.error(err);
    }
}

// — Load my assigned tasks —
async function loadMyTasks() {
    try {
        const res = await axios.get(`${API}/tasks/my-tasks`, { headers });
        const myTaskList = document.getElementById("myTaskList");
        myTaskList.innerHTML = "";

if (res.data.length === 0) {
  myTaskList.innerHTML = "<p style=\"color:#5b6e8c\">No tasks assigned to you.</p>";
  return;
}


res.data.forEach(task => {
  const div = document.createElement("div");
  div.className = `task - item priority - ${ task.priority } `;
  div.innerHTML = `
            < h3 > ${ task.title }</h3 >
    <span>Priority: ${task.priority} | Status: ${task.status}</span><br/>
    <span>Assigned to: ${task.assignedTo ? task.assignedTo.name : "N/A"}</span>
        `;
  myTaskList.appendChild(div);
});


    } catch (err) {
        console.error(err);
    }
}
// — Assign task to member —
document.getElementById("assignBtn").addEventListener("click", async () => {
    const taskId = document.getElementById("taskSelect").value;
    const memberId = document.getElementById("memberSelect").value;

    if (!taskId || !memberId) {
        alert("Please select a task and a member.");
return;
    }

    try {
        await axios.put(`${API}/tasks/${taskId}`, { assignedTo: memberId }, { headers });
        alert("Task assigned successfully!");
loadMyTasks();
    } catch (err) {
        alert(err.response?.data?.message || "Error assigning task");
    }
});

// — Logout —
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
});

// Init
loadTasks();
loadMembers();
loadMyTasks();