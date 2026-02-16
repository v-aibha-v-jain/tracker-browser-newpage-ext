import { state } from './state.js';
import { formatDate } from './utils.js';
import { getTaskEntry, setTaskEntry, saveData } from './storage.js';
import { showNoteViewDialog } from './dialogs.js';
import { renderTable } from './table.js';

export function updateNotesTab() {
    const notesList = document.getElementById('notes-list');
    if (!notesList) return;

    notesList.innerHTML = '';

    updateNotesFilterOptions();

    const dates = Object.keys(state.dailyData).sort().reverse();
    let hasNotes = false;

    dates.forEach(date => {
        if (state.notesFilter.date && state.notesFilter.date !== date) return;
        state.tasks.forEach(task => {
            if (state.notesFilter.task !== 'all' && state.notesFilter.task !== task) return;
            const entry = getTaskEntry(date, task);
            if (!entry.note || entry.note.trim() === '') return;
            hasNotes = true;

            const card = document.createElement('div');
            card.className = 'note-card';

            const meta = document.createElement('div');
            meta.className = 'note-meta';
            meta.textContent = `${formatDate(date)} · ${task}`;
            card.appendChild(meta);

            const expandBtn = document.createElement('button');
            expandBtn.className = 'note-expand';
            expandBtn.type = 'button';
            expandBtn.title = 'Open note';
            expandBtn.setAttribute('aria-label', 'Open note');
            expandBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M14 3h7v7" stroke="currentColor" stroke-width="2"/><path d="M21 3l-9 9" stroke="currentColor" stroke-width="2"/><path d="M5 21h7v-7" stroke="currentColor" stroke-width="2"/><path d="M5 21l9-9" stroke="currentColor" stroke-width="2"/></svg>';
            expandBtn.addEventListener('click', () => {
                showNoteViewDialog(`${formatDate(date)} · ${task}`, date, task, entry.note);
            });
            card.appendChild(expandBtn);

            const textarea = document.createElement('textarea');
            textarea.className = 'note-textarea';
            textarea.value = entry.note;
            textarea.addEventListener('blur', () => {
                const updated = textarea.value.trim();
                setTaskEntry(date, task, entry.done, updated);
                saveData();
                renderTable();
                if (updated === '') updateNotesTab();
            });
            card.appendChild(textarea);

            notesList.appendChild(card);
        });
    });

    if (!hasNotes) {
        const empty = document.createElement('div');
        empty.className = 'notes-empty';
        empty.textContent = 'No notes yet.';
        notesList.appendChild(empty);
    }
}

export function updateNotesFilterOptions() {
    const select = document.getElementById('notes-filter-task');
    if (!select) return;

    const current = state.notesFilter.task || 'all';
    select.innerHTML = '';

    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All tasks';
    select.appendChild(allOption);

    state.tasks.forEach(task => {
        const option = document.createElement('option');
        option.value = task;
        option.textContent = task;
        select.appendChild(option);
    });

    select.value = current;
}

export function setupNotesEventListeners() {
    const notesDate = document.getElementById('notes-filter-date');
    const notesTask = document.getElementById('notes-filter-task');
    const notesClear = document.getElementById('notes-clear-filter');

    if (notesDate) {
        notesDate.addEventListener('change', () => {
            state.notesFilter.date = notesDate.value;
            updateNotesTab();
        });
    }

    if (notesTask) {
        notesTask.addEventListener('change', () => {
            state.notesFilter.task = notesTask.value || 'all';
            updateNotesTab();
        });
    }

    if (notesClear) {
        notesClear.addEventListener('click', () => {
            state.notesFilter = { date: '', task: 'all' };
            if (notesDate) notesDate.value = '';
            if (notesTask) notesTask.value = 'all';
            updateNotesTab();
        });
    }
}
