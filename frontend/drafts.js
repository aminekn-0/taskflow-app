// drafts.js 


const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id') || 'default_project'; 
const DRAFT_KEY = `task_draft_${projectId}`;

document.addEventListener('DOMContentLoaded', () => {
   
    const taskTitle = document.getElementById('taskTitle');
    const taskDesc = document.getElementById('taskDesc');
    const taskPriority = document.getElementById('taskPriority');
    const taskDueDate = document.getElementById('taskDueDate');
    const addTaskBtn = document.getElementById('addTaskBtn');

   
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
        const data = JSON.parse(savedDraft);
        
        const confirmRestore = confirm("Vous avez un brouillon non enregistré. Voulez-vous le restaurer ?");
        
        if (confirmRestore) {
            if (taskTitle) taskTitle.value = data.title || '';
            if (taskDesc) taskDesc.value = data.description || '';
            if (taskPriority) taskPriority.value = data.priority || '';
            if (taskDueDate) taskDueDate.value = data.dueDate || '';
        } else {
            localStorage.removeItem(DRAFT_KEY); 
        }
    }


    const saveDraft = () => {
        const draftData = {
            title: taskTitle.value,
            description: taskDesc.value,
            priority: taskPriority.value,
            dueDate: taskDueDate.value
        };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
    };

    
    [taskTitle, taskDesc, taskPriority, taskDueDate].forEach(element => {
        if (element) {
            element.addEventListener('input', saveDraft);
        }
    });

   
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
           
            localStorage.removeItem(DRAFT_KEY);
        });
    }
});