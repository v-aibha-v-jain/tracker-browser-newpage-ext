import { getTaskEntry, setTaskEntry, saveData } from './storage.js';
import { renderTable } from './table.js';
import { updateNotesTab } from './notes.js';

export function clearDialog() {
    const existingDialog = document.getElementById('custom-dialog');
    const existingOverlay = document.getElementById('dialog-overlay');
    if (existingDialog) existingDialog.remove();
    if (existingOverlay) existingOverlay.remove();
}

export function showDialog(message, type = 'info', callback = null) {
    clearDialog();

    const dialog = document.createElement('div');
    dialog.id = 'custom-dialog';
    dialog.className = 'custom-dialog';

    const messageEl = document.createElement('p');
    messageEl.className = 'dialog-message';
    messageEl.textContent = message;
    dialog.appendChild(messageEl);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'dialog-buttons';

    if (type === 'confirm') {
        const yesBtn = document.createElement('button');
        yesBtn.className = 'dialog-btn primary';
        yesBtn.textContent = 'Yes';
        yesBtn.addEventListener('click', () => {
            dialog.remove();
            document.getElementById('dialog-overlay').remove();
            if (callback) callback(true);
        });

        const noBtn = document.createElement('button');
        noBtn.className = 'dialog-btn secondary';
        noBtn.textContent = 'No';
        noBtn.addEventListener('click', () => {
            dialog.remove();
            document.getElementById('dialog-overlay').remove();
            if (callback) callback(false);
        });

        buttonContainer.appendChild(yesBtn);
        buttonContainer.appendChild(noBtn);
    } else {
        const okBtn = document.createElement('button');
        okBtn.className = 'dialog-btn primary';
        okBtn.textContent = 'OK';
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
    overlay.className = 'dialog-overlay';

    document.body.appendChild(overlay);
    document.body.appendChild(dialog);
}

export function showNoteDialog(message, initialNote, callback) {
    clearDialog();

    const dialog = document.createElement('div');
    dialog.id = 'custom-dialog';
    dialog.className = 'custom-dialog note-dialog';

    const messageEl = document.createElement('p');
    messageEl.className = 'dialog-message';
    messageEl.textContent = message;
    dialog.appendChild(messageEl);

    const textarea = document.createElement('textarea');
    textarea.className = 'dialog-textarea';
    textarea.value = initialNote || '';
    textarea.rows = 4;
    dialog.appendChild(textarea);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'dialog-buttons';

    const saveBtn = document.createElement('button');
    saveBtn.className = 'dialog-btn primary';
    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', () => {
        const note = textarea.value.trim();
        clearDialog();
        callback(true, note);
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'dialog-btn secondary';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => {
        clearDialog();
        callback(false, '');
    });

    buttonContainer.appendChild(saveBtn);
    buttonContainer.appendChild(cancelBtn);
    dialog.appendChild(buttonContainer);

    const overlay = document.createElement('div');
    overlay.id = 'dialog-overlay';
    overlay.className = 'dialog-overlay';

    document.body.appendChild(overlay);
    document.body.appendChild(dialog);
}

export function showNoteViewDialog(title, date, task, note) {
    clearDialog();

    const dialog = document.createElement('div');
    dialog.id = 'custom-dialog';
    dialog.className = 'custom-dialog note-view-dialog';

    const header = document.createElement('div');
    header.className = 'dialog-header';
    header.textContent = title;
    dialog.appendChild(header);

    const content = document.createElement('textarea');
    content.className = 'dialog-textarea';
    content.value = note || '';
    content.rows = 10;
    dialog.appendChild(content);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'dialog-buttons';

    const saveBtn = document.createElement('button');
    saveBtn.className = 'dialog-btn primary';
    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', () => {
        const updated = content.value.trim();
        setTaskEntry(date, task, getTaskEntry(date, task).done, updated);
        saveData();
        renderTable();
        updateNotesTab();
        clearDialog();
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'dialog-btn secondary cancel';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => {
        clearDialog();
    });

    buttonContainer.appendChild(saveBtn);
    buttonContainer.appendChild(cancelBtn);
    dialog.appendChild(buttonContainer);

    const overlay = document.createElement('div');
    overlay.id = 'dialog-overlay';
    overlay.className = 'dialog-overlay';

    document.body.appendChild(overlay);
    document.body.appendChild(dialog);
}

export function showFilteredTableDialog(content) {
    clearDialog();

    const dialog = document.createElement('div');
    dialog.id = 'custom-dialog';
    dialog.className = 'custom-dialog filtered-table-dialog';

    const header = document.createElement('div');
    header.className = 'dialog-header';
    header.innerHTML = '<span>Filtered Results</span>';
    dialog.appendChild(header);

    const tableContainer = document.createElement('div');
    tableContainer.className = 'dialog-table-container';
    tableContainer.innerHTML = content;
    dialog.appendChild(tableContainer);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'dialog-buttons';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'dialog-btn primary';
    closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', () => {
        clearDialog();
    });

    buttonContainer.appendChild(closeBtn);
    dialog.appendChild(buttonContainer);

    const overlay = document.createElement('div');
    overlay.id = 'dialog-overlay';
    overlay.className = 'dialog-overlay';

    document.body.appendChild(overlay);
    document.body.appendChild(dialog);
}
