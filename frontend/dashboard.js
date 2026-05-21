// récupérer le token
const token = localStorage.getItem("token");

// vérifier si l'utilisateur est connecté
if (!token) {
  window.location.href = "login.html";
}

// charger les données du dashboard
async function loadDashboard() {

  try {

    // appel API
    const response = await axios.get(
      "http://localhost:5000/api/dashboard",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // données reçues
    const data = response.data;

    // afficher statistiques
    document.getElementById("projectsCount").textContent =
      data.activeProjects;

    document.getElementById("tasksCount").textContent =
      data.assignedTasks;

    document.getElementById("completedCount").textContent =
      data.completedTasks;

    document.getElementById("overdueCount").textContent =
      data.overdueTasks;

    // conteneur des tâches
    const tasksContainer =
      document.getElementById("tasksContainer");

    // vider avant affichage
    tasksContainer.innerHTML = "";

    // afficher chaque tâche
    data.tasks.forEach(task => {

      const taskCard = document.createElement("div");

      taskCard.classList.add("task-card");

      taskCard.innerHTML = `
        <h3>${task.title}</h3>

        <p>
          Priorité :
          <strong>${task.priority}</strong>
        </p>

        <p>
          Status :
          <strong>${task.status}</strong>
        </p>

        <p>
          Date limite :
          ${task.dueDate || "Aucune"}
        </p>
      `;

      tasksContainer.appendChild(taskCard);
    });

  } catch (error) {

    console.log(error);

    alert("Erreur lors du chargement du dashboard");
  }
}

// lancer le chargement
loadDashboard();


// fonction logout
function logout() {

  localStorage.removeItem("token");

  window.location.href = "login.html";
}
         
