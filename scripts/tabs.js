import { updateAnalysis } from './analysis.js';
import { updateFilterOptions } from './filters.js';
import { updateNotesTab } from './notes.js';
import { updateEditTaskList } from './tasks.js';

export function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

export function switchTab(tabName) {
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
    } else if (tabName === 'notes') {
        updateNotesTab();
    } else if (tabName === 'edit') {
        updateEditTaskList();
    }
}
