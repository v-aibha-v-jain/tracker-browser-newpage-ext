export const state = {
    tasks: [],
    dailyData: {},
    filterSettings: {
        startDate: null,
        endDate: null,
        minCompletion: 0,
        selectedTasks: []
    },
    notesFilter: {
        date: '',
        task: 'all'
    }
};

export function getTasks() {
    return state.tasks;
}

export function setTasks(tasks) {
    state.tasks = tasks;
}

export function getDailyData() {
    return state.dailyData;
}

export function setDailyData(data) {
    state.dailyData = data;
}

export function getNotesFilter() {
    return state.notesFilter;
}

export function setNotesFilter(filter) {
    state.notesFilter = filter;
}
