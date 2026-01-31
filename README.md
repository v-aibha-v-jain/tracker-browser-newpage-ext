# Task Tracker Browser Extension :)

A minimal, high-contrast habit and task tracking browser extension that opens as a new tab page. Track your daily tasks with a clean, professional interface.

*;-; why comment "excel" and "tracker" on insta comment section and let followers know when you can have a tracker on an application which you use everyday*. Since this is an new page extension, it will remaind you and drag you back to your daily grind every time you open a new tab

## Features ;)

- **Daily Task Tracking**: Track multiple tasks/habits with an organized table layout
- **Auto-Generated Rows**: New date rows are automatically created each day you use it
- **Consistency Metrics**: See percentage completion for each task (column headers)
- **Daily Completion**: Each row shows the percentage of tasks completed that day
- **Four Main Tabs**:
  - **Main**: View and update tasks with an interactive table
  - **Analysis**: See overall stats - completion %, current streak, total days, best task
  - **Filter**: Filter data by date range and completion percentage
  - **Edit**: Add, rename, or delete tasks
- **Custom Dialogs**: Clean, professional dialog boxes instead of browser alerts
- **Local Storage**: All data stored locally on your device
- **High Contrast Design**: Professional black & white interface for maximum readability

## Installation :o

### Chrome/Edge

1. Open Chrome or Edge browser
2. Navigate to `chrome://extensions/` (Chrome) or `edge://extensions/` (Edge)
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Select the `todo-ext` folder
6. Done! A new tab will now show your task tracker instead of the default page

### Firefox

1. Navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select the `manifest.json` file from the `todo-ext` folder

(similar actions for other browsers like brave)

## Usage

The extension opens automatically whenever you open a new tab in your browser.

### Main Tab

- **Check off tasks** as you complete them throughout the day
- Each task has a checkbox next to the date
- **View daily completion %** on the right side of each row
- **See consistency %** for each task at the top of the table
- New dates are added automatically when needed

### Analysis Tab

- **Overall Completion %**: Average completion across all days
- **Current Streak**: Number of consecutive days with 50%+ completion
- **Total Days**: Total number of days tracked
- **Best Task**: Your most consistent task

### Filter Tab

- Filter by date range
- Set minimum completion percentage threshold
- Select specific tasks to display
- Apply or reset filters

### Edit Tab

- **Add new tasks**: Enter task name and click "Add Task"
- **Rename tasks**: Edit task names directly in the list
- **Delete tasks**: Click delete button next to any task
- **Save changes**: Click "Save Changes" to confirm edits
- **Clear all data**: Remove all tracked data (with confirmation)

## Data Storage

All data is stored **locally on your computer** using Chrome's storage API:

- Data persists even after closing the browser
- Data is **not synced** to other devices
- Data is **private** and only accessible by this extension
- Storage limit: ~10MB (enough for years of data)

To sync across devices where you're logged into Chrome, the storage API can be switched to `chrome.storage.sync`.

## Customization

### Default Tasks

Edit `background.js` to change the default tasks:

```javascript
tasks: ["Exercise", "Read", "Code", "Meditate"];
```

Replace with your own habits before loading the extension.

## Technical Details

- **New Tab Override**: Yes (replaces default new tab page)
- **Permissions**: `storage`
- **Technologies**: Vanilla JavaScript, HTML, CSS
- **Storage**: Chrome Storage API (local)
- **File Structure**:
  - `manifest.json` - Extension configuration
  - `newtab.html` - Main UI
  - `newtab.js` - All functionality
  - `styles/newtab.css` - Styling
  - `background.js` - Extension lifecycle
  - `icons/` - Extension icons (optional)


## Future Enhancements

- Advanced filtering and sorting options
- Weekly/monthly summary views
- Statistics charts and graphs
- Recurring tasks
- Task categories
- Pop up thingy for current day todos

## Contributions
:3 *why not contribute to this repo and make it more cooler and shine on contributors panel, ofc contributors get more credits than me*

## Troubleshooting

**Extension not showing on new tabs:**

- Make sure it's properly loaded in `chrome://extensions/`
- Try reloading the page
- Disable and re-enable the extension

**Data not saving:**

- Check browser storage permissions
- Ensure you're not in incognito mode
- Try clearing browser cache and reloading

## License

MIT License - Free to use and modify!
