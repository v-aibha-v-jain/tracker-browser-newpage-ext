let tasks = [];
let dailyData = {};
let filterSettings = {
    startDate: null,
    endDate: null,
    minCompletion: 0,
    selectedTasks: []
};

function showDialog(message, type = 'info', callback = null) {
    let existingDialog = document.getElementById('custom-dialog');
    if (existingDialog) existingDialog.remove();

    const dialog = document.createElement('div');
    dialog.id = 'custom-dialog';
    dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border: 2px solid #000000;
        padding: 25px;
        border-radius: 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        min-width: 300px;
        max-width: 500px;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    const messageEl = document.createElement('p');
    messageEl.textContent = message;
    messageEl.style.cssText = 'margin-bottom: 20px; font-size: 14px; color: #000000; line-height: 1.5;';
    dialog.appendChild(messageEl);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; gap: 10px; justify-content: center;';

    if (type === 'confirm') {
        const yesBtn = document.createElement('button');
        yesBtn.textContent = 'Yes';
        yesBtn.style.cssText = 'padding: 10px 25px; background: #000000; color: white; border: 2px solid #000000; cursor: pointer; font-weight: 600; font-size: 13px;';
        yesBtn.addEventListener('click', () => {
            dialog.remove();
            document.getElementById('dialog-overlay').remove();
            if (callback) callback(true);
        });

        const noBtn = document.createElement('button');
        noBtn.textContent = 'No';
        noBtn.style.cssText = 'padding: 10px 25px; background: white; color: #000000; border: 2px solid #000000; cursor: pointer; font-weight: 600; font-size: 13px;';
        noBtn.addEventListener('click', () => {
            dialog.remove();
            document.getElementById('dialog-overlay').remove();
            if (callback) callback(false);
        });

        buttonContainer.appendChild(yesBtn);
        buttonContainer.appendChild(noBtn);
    } else {
        const okBtn = document.createElement('button');
        okBtn.textContent = 'OK';
        okBtn.style.cssText = 'padding: 10px 25px; background: #000000; color: white; border: 2px solid #000000; cursor: pointer; font-weight: 600; font-size: 13px;';
        okBtn.addEventListener('click', () => {
            dialog.remove();
            document.getElementById('dialog-overlay').remove();
            if (callback) callback();
        });
        buttonContainer.appendChild(okBtn);
    }

    dialog.appendChild(buttonContainer);

    const overlay = document.createElement('div');
    overlay.id = 'dialog-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        z-index: 9999;
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(dialog);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    loadData();
    setupEventListeners();
});

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');

    if (tabName === 'analysis') {
        updateAnalysis();
    } else if (tabName === 'filter') {
        updateFilterOptions();
    } else if (tabName === 'edit') {
        updateEditTaskList();
    }
}

function loadData() {
    chrome.storage.local.get(['tasks', 'dailyData'], (result) => {
        tasks = result.tasks || ['Exercise', 'Read', 'Code', 'Meditate'];
        dailyData = result.dailyData || {};

        ensureTodayExists();
        renderTable();
    });
}

function saveData() {
    chrome.storage.local.set({
        tasks: tasks,
        dailyData: dailyData
    }, () => {
        console.log('Data saved');
    });
}

function ensureTodayExists() {
    const today = getTodayDate();
    if (!dailyData[today]) {
        dailyData[today] = {};
        tasks.forEach(task => {
            dailyData[today][task] = false;
        });
        saveData();
    }
}

function getTodayDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function renderTable() {
    const headerRow = document.getElementById('header-row');
    const consistencyRow = document.getElementById('consistency-row');
    const tableBody = document.getElementById('table-body');

    headerRow.innerHTML = '<th class="date-column">Date</th>';
    consistencyRow.innerHTML = '<th class="consistency-label">Consistency</th>';
    tableBody.innerHTML = '';

    tasks.forEach(task => {
        const th = document.createElement('th');
        th.textContent = task;
        headerRow.appendChild(th);
    });

    const completionTh = document.createElement('th');
    completionTh.textContent = 'Done';
    completionTh.style.background = '#764ba2';
    headerRow.appendChild(completionTh);

    tasks.forEach(task => {
        const consistency = calculateTaskConsistency(task);
        const th = document.createElement('th');
        th.className = 'consistency-value';
        th.textContent = consistency + '%';
        consistencyRow.appendChild(th);
    });

    const emptyTh = document.createElement('th');
    emptyTh.style.background = '#764ba2';
    consistencyRow.appendChild(emptyTh);

    const dates = Object.keys(dailyData).sort().reverse();

    dates.forEach(date => {
        const tr = document.createElement('tr');

        const dateTd = document.createElement('td');
        dateTd.className = 'date-column';
        dateTd.textContent = formatDate(date);
        tr.appendChild(dateTd);

        tasks.forEach(task => {
            const td = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            checkbox.checked = dailyData[date][task] || false;
            checkbox.addEventListener('change', (e) => {
                dailyData[date][task] = e.target.checked;
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

function calculateDayCompletion(date) {
    if (!dailyData[date]) return 0;

    const completed = tasks.filter(task => dailyData[date][task]).length;
    return Math.round((completed / tasks.length) * 100);
}

function calculateTaskConsistency(task) {
    const dates = Object.keys(dailyData);
    if (dates.length === 0) return 0;

    const completed = dates.filter(date => dailyData[date][task]).length;
    return Math.round((completed / dates.length) * 100);
}

function updateRowCompletion(row, date) {
    const completionCell = row.querySelector('.completion-cell');
    const completion = calculateDayCompletion(date);
    completionCell.textContent = completion + '%';
}

function setupEventListeners() {
    document.getElementById('add-task-btn').addEventListener('click', addNewTask);

    document.getElementById('save-tasks-btn').addEventListener('click', saveTaskChanges);

    document.getElementById('clear-data-btn').addEventListener('click', clearAllData);

    document.getElementById('apply-filter-btn').addEventListener('click', applyFilter);
    document.getElementById('reset-filter-btn').addEventListener('click', resetFilter);

    document.getElementById('min-completion').addEventListener('input', (e) => {
        document.getElementById('min-completion-value').textContent = e.target.value + '%';
    });
}

function addNewTask() {
    const input = document.getElementById('new-task-input');
    const taskName = input.value.trim();

    if (taskName && !tasks.includes(taskName)) {
        tasks.push(taskName);

        Object.keys(dailyData).forEach(date => {
            dailyData[date][taskName] = false;
        });

        input.value = '';
        saveData();
        renderTable();
        updateEditTaskList();
    }
}

function updateEditTaskList() {
    const taskList = document.getElementById('edit-task-list');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
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

function deleteTask(index) {
    const taskName = tasks[index];
    showDialog(`Delete task "${taskName}"?`, 'confirm', (confirmed) => {
        if (confirmed) {
            tasks.splice(index, 1);

            Object.keys(dailyData).forEach(date => {
                delete dailyData[date][taskName];
            });

            saveData();
            renderTable();
            updateEditTaskList();
        }
    });
}

function saveTaskChanges() {
    const inputs = document.querySelectorAll('#edit-task-list input');
    const newTasks = [];

    inputs.forEach((input, index) => {
        const newName = input.value.trim();
        const oldName = tasks[index];

        if (newName && newName !== oldName) {
            Object.keys(dailyData).forEach(date => {
                dailyData[date][newName] = dailyData[date][oldName];
                delete dailyData[date][oldName];
            });
        }

        newTasks.push(newName || oldName);
    });

    tasks = newTasks;
    saveData();
    renderTable();
    showDialog('Tasks updated successfully!');
}

function clearAllData() {
    showDialog('Are you sure you want to clear all data? This cannot be undone!', 'confirm', (confirmed) => {
        if (confirmed) {
            dailyData = {};
            ensureTodayExists();
            saveData();
            renderTable();
            showDialog('All data cleared!');
        }
    });
}

function updateAnalysis() {
    const dates = Object.keys(dailyData);

    let totalCompletion = 0;
    dates.forEach(date => {
        totalCompletion += calculateDayCompletion(date);
    });
    const avgCompletion = dates.length > 0 ? Math.round(totalCompletion / dates.length) : 0;
    document.getElementById('overall-completion').textContent = avgCompletion + '%';

    const streak = calculateCurrentStreak();
    document.getElementById('current-streak').textContent = streak + ' days';

    document.getElementById('total-days').textContent = dates.length;

    let bestTask = '-';
    let bestConsistency = 0;
    tasks.forEach(task => {
        const consistency = calculateTaskConsistency(task);
        if (consistency > bestConsistency) {
            bestConsistency = consistency;
            bestTask = task;
        }
    });
    document.getElementById('best-task').textContent = bestTask;
}

function calculateCurrentStreak() {
    const dates = Object.keys(dailyData).sort().reverse();
    let streak = 0;

    for (let date of dates) {
        const completion = calculateDayCompletion(date);
        if (completion >= 50) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}

function updateFilterOptions() {
    const taskFilterList = document.getElementById('task-filter-list');
    taskFilterList.innerHTML = '';

    tasks.forEach(task => {
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

function applyFilter() {
    const startDate = document.getElementById('filter-start-date').value;
    const endDate = document.getElementById('filter-end-date').value;
    const minCompletion = parseInt(document.getElementById('min-completion').value);

    showDialog('Filter functionality coming soon!');
}

function resetFilter() {
    document.getElementById('filter-start-date').value = '';
    document.getElementById('filter-end-date').value = '';
    document.getElementById('min-completion').value = 0;
    document.getElementById('min-completion-value').textContent = '0%';

    document.querySelectorAll('#task-filter-list input[type="checkbox"]').forEach(cb => {
        cb.checked = true;
    });

    renderTable();
}
