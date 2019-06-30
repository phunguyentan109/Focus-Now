const {app, BrowserWindow} = require("electron");

const path = require('path');
const glob = require('glob');
const isDev = require("electron-is-dev");

let win;

function createWindow() {

    makeSingleInstance();
    loadProcesses();

    win = new BrowserWindow({
        width: 329,
        height: 300,
        resizable: false,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        },
    })

    win.setMenu(null);

    win.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, '../build/index.html')}`);

    win.on('closed', () => {
        win = null
    })
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

function makeSingleInstance () {
    if (process.mas) return;

    app.requestSingleInstanceLock()

    app.on('second-instance', () => {
        if (win) {
            if (win.isMinimized()) win.restore()
            win.focus()
        }
    })
}

function loadProcesses() {
    const files = glob.sync(path.join(__dirname, '../src/main-prc/*.js'));
    files.forEach((file) => { require(file) });
}
