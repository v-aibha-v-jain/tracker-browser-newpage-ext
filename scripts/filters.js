import { state } from './state.js';
import { renderTable } from './table.js';
import { showDialog } from './dialogs.js';

export function updateFilterOptions() {
    const taskFilterList = document.getElementById('task-filter-list');
    taskFilterList.innerHTML = '';

    state.tasks.forEach(task => {
        const label = document.createElement('label');
        label.className = 'filter-task-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = task;
        checkbox.checked = true;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(task));
        taskFilterList.appendChild(label);
    });
}

export function applyFilter() {
    const startDate = document.getElementById('filter-start-date').value;
    const endDate = document.getElementById('filter-end-date').value;
    const minCompletion = parseInt(document.getElementById('min-completion').value);

    showDialog('Filter functionality coming soon!');
}

export function resetFilter() {
    document.getElementById('filter-start-date').value = '';
    document.getElementById('filter-end-date').value = '';
    document.getElementById('min-completion').value = 0;
    document.getElementById('min-completion-value').textContent = '0%';

    document.querySelectorAll('#task-filter-list input[type="checkbox"]').forEach(cb => {
        cb.checked = true;
    });

    renderTable();
}

export function setupFilterEventListeners() {
    document.getElementById('apply-filter-btn').addEventListener('click', applyFilter);
    document.getElementById('reset-filter-btn').addEventListener('click', resetFilter);

    document.getElementById('min-completion').addEventListener('input', (e) => {
        document.getElementById('min-completion-value').textContent = e.target.value + '%';
    });
}
