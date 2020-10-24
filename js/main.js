const { app, BrowserWindow, crashReporter, dialog, Menu } = require("electron");

if (require("electron-squirrel-startup")) return app.quit();

function createWindow() {
  if (app.isPackaged) Menu.setApplicationMenu(false);

  const win = new BrowserWindow({
    width: 1100,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  win.loadFile("html/index.html");
  // win.setMenuBarVisibility(false);
  if (!app.isPackaged) win.webContents.openDevTools();
}

if (app.isPackaged) {
  require("update-electron-app")({
    repo: "jogurat/sync-me-app",
    updateInterval: "5 minutes",
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
