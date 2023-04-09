const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const { PosPrinter } = require("electron-pos-printer");
const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools();
  }
  mainWindow.maximize();
  mainWindow.setMenu(null);
  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// let webContents = mainWindow.webContents;
// let printers = webContents.getPrinters(); //list the printers

ipcMain.on("printPorudzbinu", (event, arg) => {
  const data = JSON.parse(arg);
  PosPrinter.print(data, {
    preview: true,
    copies: 1,
    printerName: "POS58",
    pageSize: "58mm",
    margin: "10px 10px 10px 10px",
  })
    .then(() => {
      console.log(printers);
      console.log("Printed successfully");
    })
    .catch((error) => {
      console.error(error);
    });
});

ipcMain.on("printRacun", (event, arg) => {
  const data = JSON.parse(arg);
  PosPrinter.print(data, {
    // preview: true,
    copies: 1,
    printerName: "POS58",
    pageSize: "58mm",
    margin: "10px 10px 10px 10px",
  })
    .then(() => {
      console.log(printers);
      console.log("Printed successfully");
    })
    .catch((error) => {
      console.error(error);
    });
});

ipcMain.on("printStorno", (event, arg) => {
  const data = JSON.parse(arg);
  PosPrinter.print(data, {
    preview: true,
    copies: 1,
    printerName: "POS58",
    pageSize: "58mm",
    margin: "10px 10px 10px 10px",
  })
    .then(() => {
      console.log(printers);
      console.log("Printed successfully");
    })
    .catch((error) => {
      console.error(error);
    });
});
