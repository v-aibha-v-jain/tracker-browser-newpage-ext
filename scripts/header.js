export function initializeEditableHeader() {
    const titleEl = document.getElementById('editable-title');
    const subtitleEl = document.getElementById('editable-subtitle');
    if (!titleEl || !subtitleEl) return;

    const setPageTitle = (title) => {
        document.title = title && title.trim() ? title.trim() : 'Task Tracker';
    };

    chrome.storage.local.get(['headerTitle', 'headerSubtitle'], (result) => {
        titleEl.textContent = result.headerTitle || 'Task Tracker';
        subtitleEl.textContent = result.headerSubtitle || 'Track your daily habits';
        setPageTitle(titleEl.textContent);
    });

    const saveHeader = () => {
        const headerTitle = titleEl.textContent.trim() || 'Task Tracker';
        const headerSubtitle = subtitleEl.textContent.trim() || 'Track your daily habits';
        titleEl.textContent = headerTitle;
        subtitleEl.textContent = headerSubtitle;
        chrome.storage.local.set({ headerTitle, headerSubtitle });
        setPageTitle(headerTitle);
    };

    [titleEl, subtitleEl].forEach(el => {
        el.addEventListener('blur', saveHeader);
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                el.blur();
            }
        });
    });
}
