import { state } from './state.js';
import { getTodayDate } from './utils.js';

export function loadData(callback) {
    chrome.storage.local.get(['tasks', 'dailyData'], (result) => {
        state.tasks = result.tasks || ['Exercise', 'Read', 'Code', 'Meditate'];
        state.dailyData = result.dailyData || {};
        const changed = normalizeDailyData();
        ensureTodayExists();
        if (changed) saveData();
        if (callback) callback();
    });
}

export function saveData() {
    chrome.storage.local.set({
        tasks: state.tasks,
        dailyData: state.dailyData
    }, () => {
        console.log('Data saved');
    });
}

export function ensureTodayExists() {
    const today = getTodayDate();
    if (!state.dailyData[today]) {
        state.dailyData[today] = {};
        state.tasks.forEach(task => {
            state.dailyData[today][task] = { done: false, note: '' };
        });
        saveData();
    }
}

export function normalizeDailyData() {
    let changed = false;
    Object.keys(state.dailyData).forEach(date => {
        if (!state.dailyData[date] || typeof state.dailyData[date] !== 'object') {
            state.dailyData[date] = {};
            changed = true;
        }
        state.tasks.forEach(task => {
            const val = state.dailyData[date][task];
            if (typeof val === 'boolean') {
                state.dailyData[date][task] = { done: val, note: '' };
                changed = true;
                return;
            }
            if (!val || typeof val !== 'object') {
                state.dailyData[date][task] = { done: false, note: '' };
                if (val !== undefined) changed = true;
                return;
            }
            const done = Boolean(val.done);
            const note = val.note ? String(val.note) : '';
            if (val.done !== done || val.note !== note) changed = true;
            state.dailyData[date][task] = { done, note };
        });
    });
    return changed;
}

export function getTaskEntry(date, task) {
    const day = state.dailyData[date];
    if (!day || !day[task] || typeof day[task] !== 'object') return { done: false, note: '' };
    return { done: Boolean(day[task].done), note: day[task].note ? String(day[task].note) : '' };
}

export function setTaskEntry(date, task, done, note) {
    if (!state.dailyData[date]) state.dailyData[date] = {};
    state.dailyData[date][task] = { done: Boolean(done), note: note ? String(note) : '' };
}

export function getDayNotes(date) {
    const notes = [];
    state.tasks.forEach(task => {
        const entry = getTaskEntry(date, task);
        if (entry.note && entry.note.trim() !== '') {
            notes.push(`${task}: ${entry.note}`);
        }
    });
    return notes.length ? notes.join('\n') : 'No notes';
}
