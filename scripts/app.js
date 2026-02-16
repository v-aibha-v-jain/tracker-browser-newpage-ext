import { loadData } from './storage.js';
import { renderTable } from './table.js';
import { initializeTabs } from './tabs.js';
import { initializeEditableHeader } from './header.js';
import { setupTaskEventListeners } from './tasks.js';
import { setupFilterEventListeners } from './filters.js';
import { setupNotesEventListeners } from './notes.js';
import { setupDataEventListeners } from './data.js';
import { updateNotesFilterOptions } from './notes.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    initializeEditableHeader();
    loadData(() => {
        updateNotesFilterOptions();
        renderTable();
    });
    setupEventListeners();
});

function setupEventListeners() {
    setupTaskEventListeners();
    setupFilterEventListeners();
    setupNotesEventListeners();
    setupDataEventListeners();
}
