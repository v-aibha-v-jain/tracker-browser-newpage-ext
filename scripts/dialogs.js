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

export function showNoteDialog(message, initialNote, callback) {
    clearDialog();

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
        min-width: 320px;
        max-width: 520px;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    const messageEl = document.createElement('p');
    messageEl.textContent = message;
    messageEl.style.cssText = 'margin-bottom: 14px; font-size: 14px; color: #000000; line-height: 1.5;';
    dialog.appendChild(messageEl);

    const textarea = document.createElement('textarea');
    textarea.value = initialNote || '';
    textarea.rows = 4;
    textarea.style.cssText = 'width: 100%; padding: 10px; border: 2px solid #000000; resize: vertical; font-size: 13px;';
    dialog.appendChild(textarea);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; gap: 10px; justify-content: center; margin-top: 16px;';

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.style.cssText = 'padding: 10px 25px; background: #000000; color: white; border: 2px solid #000000; cursor: pointer; font-weight: 600; font-size: 13px;';
    saveBtn.addEventListener('click', () => {
        const note = textarea.value.trim();
        clearDialog();
        callback(true, note);
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = 'padding: 10px 25px; background: white; color: #000000; border: 2px solid #000000; cursor: pointer; font-weight: 600; font-size: 13px;';
    cancelBtn.addEventListener('click', () => {
        clearDialog();
        callback(false, '');
    });

    buttonContainer.appendChild(saveBtn);
    buttonContainer.appendChild(cancelBtn);
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

export function showNoteViewDialog(title, date, task, note) {
    clearDialog();

    const dialog = document.createElement('div');
    dialog.id = 'custom-dialog';
    dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border: 2px solid #000000;
        padding: 20px;
        border-radius: 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        min-width: 75vw;
        max-width: 90vw;
        max-height: 70vh;
        text-align: left;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        display: flex;
        flex-direction: column;
        gap: 12px;
    `;

    const header = document.createElement('div');
    header.style.cssText = 'font-size: 12px; text-transform: uppercase; letter-spacing: 0.6px; color: #666666;';
    header.textContent = title;
    dialog.appendChild(header);

    const content = document.createElement('textarea');
    content.value = note || '';
    content.rows = 10;
    content.style.cssText = 'width: 100%; border: 2px solid #000000; padding: 10px; resize: vertical; font-size: 13px; color: #000000; background: #ffffff;';
    dialog.appendChild(content);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; justify-content: flex-end;';

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.style.cssText = 'padding: 10px 25px; background: #000000; color: white; border: 2px solid #000000; cursor: pointer; font-weight: 600; font-size: 13px;';
    saveBtn.addEventListener('click', () => {
        const updated = content.value.trim();
        setTaskEntry(date, task, getTaskEntry(date, task).done, updated);
        saveData();
        renderTable();
        updateNotesTab();
        clearDialog();
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = 'padding: 10px 25px; background: white; color: #000000; border: 2px solid #000000; cursor: pointer; font-weight: 600; font-size: 13px; margin-left: 8px;';
    cancelBtn.addEventListener('click', () => {
        clearDialog();
    });

    buttonContainer.appendChild(saveBtn);
    buttonContainer.appendChild(cancelBtn);
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
