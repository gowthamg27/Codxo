const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

const API_URL = '/api/tasks';

// Fetch and display tasks
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const tasks = await response.json();
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = createTaskElement(task);
            taskList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        alert('Failed to fetch tasks. Please check the console for more details.');
    }
}

// Create task element
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.innerHTML = `
        <input type="text" class="task-title" value="${task.title}" readonly>
        <div class="task-actions">
            <button class="edit-btn">Edit</button>
            <button class="save-btn" style="display:none;">Save</button>
            <button class="toggle-btn">${task.completed ? 'Undo' : 'Complete'}</button>
             <button class="delete-btn">Delete</button>
        </div>
    `;

    const titleInput = li.querySelector('.task-title');
    const editBtn = li.querySelector('.edit-btn');
    const saveBtn = li.querySelector('.save-btn');
    const deleteBtn = li.querySelector('.delete-btn');
    const toggleBtn = li.querySelector('.toggle-btn');

    editBtn.addEventListener('click', () => {
        titleInput.readOnly = false;
        titleInput.focus();
        editBtn.style.display = 'none';
        saveBtn.style.display = 'inline-block';
    });

    saveBtn.addEventListener('click', () => saveTask(task._id, titleInput.value, li));
    deleteBtn.addEventListener('click', () => deleteTask(task._id, li));
    toggleBtn.addEventListener('click', () => toggleTask(task._id, !task.completed, li));

    return li;
}

// Add new task
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    if (!title) return;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newTask = await response.json();
        console.log('New task added:', newTask);
        const li = createTaskElement(newTask);
        taskList.appendChild(li);
        taskInput.value = '';
    } catch (error) {
        console.error('Error adding task:', error);
        alert('Failed to add task. Please check the console for more details.');
    }
});

// Save edited task
async function saveTask(id, newTitle, li) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: newTitle }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('Task updated');
        const titleInput = li.querySelector('.task-title');
        const editBtn = li.querySelector('.edit-btn');
        const saveBtn = li.querySelector('.save-btn');

        titleInput.readOnly = true;
        editBtn.style.display = 'inline-block';
        saveBtn.style.display = 'none';
    } catch (error) {
        console.error('Error editing task:', error);
        alert('Failed to edit task. Please check the console for more details.');
    }
}

// Delete task
async function deleteTask(id, li) {
    const confirmed = confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('Task deleted');
        li.remove();
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please check the console for more details.');
    }
}

// Toggle task completion
async function toggleTask(id, completed, li) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('Task toggled');
        li.classList.toggle('completed');
        const toggleBtn = li.querySelector('.toggle-btn');
        toggleBtn.textContent = completed ? 'Undo' : 'Complete';
    } catch (error) {
        console.error('Error toggling task:', error);
        alert('Failed to toggle task. Please check the console for more details.');
    }
}

// Initial fetch
fetchTasks();