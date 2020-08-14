const { app, BrowserWindow, crashReporter, dialog, Menu } = require("electron");

function createWindow() {
  // Menu.setApplicationMenu(false);

  const win = new BrowserWindow({
    width: 1100,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  win.loadFile("index.html");
  // win.setMenuBarVisibility(false);
  win.webContents.openDevTools();
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
