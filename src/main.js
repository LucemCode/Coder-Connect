const { app, BrowserWindow } = require('electron');
// Enable live reload for all the files inside your project directory
//require('electron-reload')(`${__dirname}`);

let win;

function createWindow() {
    win = new BrowserWindow({ width: 800, height: 800, titleBarStyle: 'hidden' });
    win.setOpacity(0.98);

    win.loadFile(`${__dirname}/index.html`);

    // Öffnen der DevTools.
    //win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
