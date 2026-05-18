

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
