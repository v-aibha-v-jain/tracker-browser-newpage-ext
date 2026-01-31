chrome.runtime.onInstalled.addListener(() => {
    console.log('Task Tracker extension installed');

    chrome.storage.local.get(['tasks', 'dailyData'], (result) => {
        if (!result.tasks) {
            chrome.storage.local.set({
                tasks: ['Exercise', 'Read', 'Code', 'Meditate'],
                dailyData: {}
            });
        }
    });
});

