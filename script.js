document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let deleteTaskIndex = null; // To keep track of which task to delete
    let completeTaskIndex = null; // To keep track of which task to mark as complete

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskItem = document.createElement('div');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;

            const taskText = document.createElement('span');
            taskText.textContent = `${task.text} ${task.time ? `- ${task.time} min` : ''}`;
            taskItem.appendChild(taskText);

            const taskActions = document.createElement('div');
            taskActions.className = 'task-actions';

            const editButton = document.createElement('button');
            editButton.innerHTML = '✏️';
            editButton.className = 'edit';
            editButton.addEventListener('click', () => editTask(index));
            taskActions.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '🗑️';
            deleteButton.className = 'delete';
            deleteButton.addEventListener('click', () => showDeletePopup(index));
            taskActions.appendChild(deleteButton);

            const completeButton = document.createElement('button');
            completeButton.innerHTML = '✔️';
            completeButton.className = 'complete';
            completeButton.addEventListener('click', () => showTimePopup(index));
            taskActions.appendChild(completeButton);

            taskItem.appendChild(taskActions);
            taskList.appendChild(taskItem);
        });
    }

    function addTask(text) {
        tasks.push({ text, completed: false });
        saveTasks();
        renderTasks();
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    function editTask(index) {
        const newText = prompt('Edit Task', tasks[index].text);
        if (newText !== null && newText.trim() !== '') {
            tasks[index].text = newText.trim();
            saveTasks();
            renderTasks();
        }
    }

    function toggleCompleteTask(index, time) {
        tasks[index].completed = !tasks[index].completed;
        tasks[index].time = time;
        saveTasks();
        renderTasks();
    }

    function showDeletePopup(index) {
        deleteTaskIndex = index;
        document.getElementById('popup').style.display = 'flex';
    }

    function hideDeletePopup() {
        deleteTaskIndex = null;
        document.getElementById('popup').style.display = 'none';
    }

    function showTimePopup(index) {
        completeTaskIndex = index;
        document.getElementById('time-popup').style.display = 'flex';
    }

    function hideTimePopup() {
        completeTaskIndex = null;
        document.getElementById('time-popup').style.display = 'none';
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            addTask(taskText);
            taskInput.value = '';
        }
    });

    document.getElementById('confirm-delete').addEventListener('click', () => {
        if (deleteTaskIndex !== null) {
            deleteTask(deleteTaskIndex);
            hideDeletePopup();
        }
    });

    document.getElementById('cancel-delete').addEventListener('click', hideDeletePopup);

    document.getElementById('save-time').addEventListener('click', () => {
        const timeInput = document.getElementById('time-input').value;
        if (completeTaskIndex !== null && timeInput) {
            toggleCompleteTask(completeTaskIndex, timeInput);
            hideTimePopup();
        }
    });

    document.getElementById('cancel-time').addEventListener('click', hideTimePopup);

    renderTasks();
});
