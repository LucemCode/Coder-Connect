const { app, BrowserWindow } = require('electron');

let win;

function createWindow() {
    win = new BrowserWindow({ width: 600, height: 400, titleBarStyle: 'hidden' });
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