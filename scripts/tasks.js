import { state } from './state.js';
import { saveData } from './storage.js';
import { renderTable } from './table.js';
import { updateNotesFilterOptions } from './notes.js';
import { showDialog } from './dialogs.js';

export function addNewTask() {
    const input = document.getElementById('new-task-input');
    const taskName = input.value.trim();

    if (taskName && !state.tasks.includes(taskName)) {
        state.tasks.push(taskName);

        Object.keys(state.dailyData).forEach(date => {
            state.dailyData[date][taskName] = { done: false, note: '' };
        });

        input.value = '';
        saveData();
        renderTable();
        updateEditTaskList();
        updateNotesFilterOptions();
    }
}

export function updateEditTaskList() {
    const taskList = document.getElementById('edit-task-list');
    taskList.innerHTML = '';

    state.tasks.forEach((task, index) => {
        const div = document.createElement('div');
        div.className = 'task-item';

        const input = document.createElement('input');
        input.type = 'text';
        input.value = task;
        input.dataset.index = index;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTask(index));

        div.appendChild(input);
        div.appendChild(deleteBtn);
        taskList.appendChild(div);
    });
}

export function deleteTask(index) {
    const taskName = state.tasks[index];
    showDialog(`Delete task "${taskName}"?`, 'confirm', (confirmed) => {
        if (confirmed) {
            state.tasks.splice(index, 1);

            Object.keys(state.dailyData).forEach(date => {
                delete state.dailyData[date][taskName];
            });

            saveData();
            renderTable();
            updateEditTaskList();
            updateNotesFilterOptions();
        }
    });
}

export function saveTaskChanges() {
    const inputs = document.querySelectorAll('#edit-task-list input');
    const newTasks = [];

    inputs.forEach((input, index) => {
        const newName = input.value.trim();
        const oldName = state.tasks[index];

        if (newName && newName !== oldName) {
            Object.keys(state.dailyData).forEach(date => {
                state.dailyData[date][newName] = state.dailyData[date][oldName];
                delete state.dailyData[date][oldName];
            });
        }

        newTasks.push(newName || oldName);
    });

    state.tasks = newTasks;
    saveData();
    renderTable();
    showDialog('Tasks updated successfully!');
    updateNotesFilterOptions();
}

export function setupTaskEventListeners() {
    document.getElementById('add-task-btn').addEventListener('click', addNewTask);
    document.getElementById('save-tasks-btn').addEventListener('click', saveTaskChanges);
}
