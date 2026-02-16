import { state } from './state.js';
import { formatDate } from './utils.js';
import { getTaskEntry, setTaskEntry, saveData, getDayNotes } from './storage.js';
import { showNoteDialog } from './dialogs.js';

export function renderTable() {
    const headerRow = document.getElementById('header-row');
    const consistencyRow = document.getElementById('consistency-row');
    const tableBody = document.getElementById('table-body');

    headerRow.innerHTML = '<th class="date-column">Date</th>';
    consistencyRow.innerHTML = '<th class="consistency-label">Consistency</th>';
    tableBody.innerHTML = '';

    state.tasks.forEach(task => {
        const th = document.createElement('th');
        th.textContent = task;
        headerRow.appendChild(th);
    });

    const completionTh = document.createElement('th');
    completionTh.textContent = 'Done';
    completionTh.style.background = '#764ba2';
    headerRow.appendChild(completionTh);

    state.tasks.forEach(task => {
        const consistency = calculateTaskConsistency(task);
        const th = document.createElement('th');
        th.className = 'consistency-value';
        th.textContent = consistency + '%';
        consistencyRow.appendChild(th);
    });

    const emptyTh = document.createElement('th');
    emptyTh.style.background = '#764ba2';
    consistencyRow.appendChild(emptyTh);

    const dates = Object.keys(state.dailyData).sort().reverse();

    dates.forEach(date => {
        const tr = document.createElement('tr');

        const dateTd = document.createElement('td');
        dateTd.className = 'date-column';
        dateTd.textContent = formatDate(date);
        dateTd.title = getDayNotes(date);
        tr.appendChild(dateTd);

        state.tasks.forEach(task => {
            const td = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            const entry = getTaskEntry(date, task);
            checkbox.checked = entry.done;
            if (entry.done && entry.note) checkbox.title = entry.note;
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    showNoteDialog('Add a note for this task', entry.note, (confirmed, note) => {
                        if (confirmed) {
                            setTaskEntry(date, task, true, note);
                        } else {
                            e.target.checked = false;
                            setTaskEntry(date, task, false, '');
                        }
                        saveData();
                        updateRowCompletion(tr, date);
                        renderTable();
                    });
                    return;
                }
                setTaskEntry(date, task, false, '');
                saveData();
                updateRowCompletion(tr, date);
                renderTable();
            });
            td.appendChild(checkbox);
            tr.appendChild(td);
        });

        const completionTd = document.createElement('td');
        completionTd.className = 'completion-cell';
        const completion = calculateDayCompletion(date);
        completionTd.textContent = completion + '%';
        tr.appendChild(completionTd);

        tableBody.appendChild(tr);
    });
}

export function calculateDayCompletion(date) {
    if (!state.dailyData[date]) return 0;

    const completed = state.tasks.filter(task => getTaskEntry(date, task).done).length;
    return Math.round((completed / state.tasks.length) * 100);
}

export function calculateTaskConsistency(task) {
    const dates = Object.keys(state.dailyData);
    if (dates.length === 0) return 0;

    const completed = dates.filter(date => getTaskEntry(date, task).done).length;
    return Math.round((completed / dates.length) * 100);
}

function updateRowCompletion(row, date) {
    const completionCell = row.querySelector('.completion-cell');
    const completion = calculateDayCompletion(date);
    completionCell.textContent = completion + '%';
}
