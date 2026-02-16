import { state } from './state.js';
import { calculateDayCompletion, calculateTaskConsistency } from './table.js';

export function updateAnalysis() {
    const dates = Object.keys(state.dailyData);

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
    state.tasks.forEach(task => {
        const consistency = calculateTaskConsistency(task);
        if (consistency > bestConsistency) {
            bestConsistency = consistency;
            bestTask = task;
        }
    });
    document.getElementById('best-task').textContent = bestTask;
}

function calculateCurrentStreak() {
    const dates = Object.keys(state.dailyData).sort().reverse();
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
