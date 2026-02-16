import { ensureTodayExists, saveData } from './storage.js';
import { renderTable } from './table.js';
import { showDialog } from './dialogs.js';
import { state } from './state.js';

export function clearAllData() {
    showDialog('Are you sure you want to clear all data? This cannot be undone!', 'confirm', (confirmed) => {
        if (confirmed) {
            state.dailyData = {};
            ensureTodayExists();
            saveData();
            renderTable();
            showDialog('All data cleared!');
        }
    });
}

export function setupDataEventListeners() {
    document.getElementById('clear-data-btn').addEventListener('click', clearAllData);
}
