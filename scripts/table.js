import { state } from './state.js';
import { formatDate } from './utils.js';
import { getTaskEntry, setTaskEntry, saveData, getDayNotes } from './storage.js';
import { showNoteDialog } from './dialogs.js';

export function generateFilteredTableHTML(filter) {
    const dates = Object.keys(state.dailyData).sort().reverse();

    let filteredDates = dates;

    if (filter.startDate) {
        filteredDates = filteredDates.filter(date => date >= filter.startDate);
    }

    if (filter.endDate) {
        filteredDates = filteredDates.filter(date => date <= filter.endDate);
    }

    if (filter.minCompletion > 0) {
        filteredDates = filteredDates.filter(date => {
            return calculateDayCompletion(date) >= filter.minCompletion;
        });
    }

    const tasksToShow = filter.selectedTasks.length > 0 ? filter.selectedTasks : state.tasks;

    return generateTableHTML(filteredDates, tasksToShow);
}

function generateTableHTML(dates, tasksToShow) {
    let html = '<table class="filtered-table"><thead>';

    html += '<tr id="filtered-header-row"><th class="date-column">Date</th>';
    tasksToShow.forEach(task => {
        html += `<th>${task}</th>`;
    });
    html += '<th class="done-column">Done</th></tr>';

    html += '<tr class="consistency-row"><th class="consistency-label">Consistency</th>';
    tasksToShow.forEach(task => {
        const consistency = calculateTaskConsistency(task);
        html += `<th>${consistency}%</th>`;
    });
    html += '<th></th></tr>';
    html += '</thead><tbody>';

    dates.forEach((date, index) => {
        html += `<tr>`;
        html += `<td class="date-column" title="${getDayNotes(date).replace(/"/g, '&quot;')}">${formatDate(date)}</td>`;

        tasksToShow.forEach(task => {
            const entry = getTaskEntry(date, task);
            const checked = entry.done ? 'checked' : '';
            const title = entry.done && entry.note ? `title="${entry.note.replace(/"/g, '&quot;')}"` : '';
            html += `<td>`;
            html += `<input type="checkbox" ${checked} ${title} disabled>`;
            html += `</td>`;
        });

        const completion = calculateDayCompletionForTasks(date, tasksToShow);
        html += `<td class="completion-cell">${completion}%</td>`;
        html += '</tr>';
    });

    html += '</tbody></table>';

    if (dates.length === 0) {
        html = '<p class="no-filter-results">No data matches your filters.</p>';
    }

    return html;
}

function calculateDayCompletionForTasks(date, tasksToShow) {
    if (!state.dailyData[date]) return 0;
    const completed = tasksToShow.filter(task => getTaskEntry(date, task).done).length;
    return Math.round((completed / tasksToShow.length) * 100);
}

export function renderTable() {
    const dates = Object.keys(state.dailyData).sort().reverse();
    renderTableWithData(dates, state.tasks);
}

function renderTableWithData(dates, tasksToShow) {
    const headerRow = document.getElementById('header-row');
    const consistencyRow = document.getElementById('consistency-row');
    const tableBody = document.getElementById('table-body');

    headerRow.innerHTML = '<th class="date-column">Date</th>';
    consistencyRow.innerHTML = '<th class="consistency-label">Consistency</th>';
    tableBody.innerHTML = '';

    tasksToShow.forEach(task => {
        const th = document.createElement('th');
        th.textContent = task;
        headerRow.appendChild(th);
    });

    const completionTh = document.createElement('th');
    completionTh.textContent = 'Done';
    completionTh.className = 'done-header-cell';
    headerRow.appendChild(completionTh);

    tasksToShow.forEach(task => {
        const consistency = calculateTaskConsistency(task);
        const th = document.createElement('th');
        th.className = 'consistency-value';
        th.textContent = consistency + '%';
        consistencyRow.appendChild(th);
    });

    const emptyTh = document.createElement('th');
    emptyTh.className = 'done-header-cell';
    consistencyRow.appendChild(emptyTh);

    dates.forEach(date => {
        const tr = document.createElement('tr');

        const dateTd = document.createElement('td');
        dateTd.className = 'date-column';
        dateTd.textContent = formatDate(date);
        dateTd.title = getDayNotes(date);
        tr.appendChild(dateTd);

        tasksToShow.forEach(task => {
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
        const completion = calculateDayCompletionForTasks(date, tasksToShow);
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
