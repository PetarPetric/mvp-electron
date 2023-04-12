const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const { PosPrinter } = require("electron-pos-printer");
const path = require("path");
const isDev = require("electron-is-dev");
const fs = require("fs");

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

function getDefaultPrinterName(webContents) {
  const printers = webContents.getPrinters();
  const defaultPrinter = printers.find((printer) => printer.isDefault);
  return defaultPrinter ? defaultPrinter.name : null;
}

ipcMain.on("printPorudzbinu", (event, arg) => {
  const data = JSON.parse(arg);
  PosPrinter.print(data, {
    copies: 1,
    printerName: "POS-58 11.3.0.1",
    pageSize: "58mm",
    margin: "10px 10px 10px 10px",
    silent: true,
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
    copies: 1,
    printerName: "POS-58 11.3.0.1",
    pageSize: "58mm",
    margin: "10px 10px 10px 10px",
    silent: true,
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
    copies: 1,
    printerName: "POS-58 11.3.0.1",
    pageSize: "58mm",
    margin: "10px 10px 10px 10px",
    silent: true,
  })
    .then(() => {
      console.log(printers);
      console.log("Printed successfully");
    })
    .catch((error) => {
      console.error(error);
    });
});

ipcMain.on("printDnevni", (event, arg) => {
  const data = JSON.parse(arg);
  PosPrinter.print(data, {
    preview: true,
    copies: 1,
    printerName: "POS-58 11.3.0.1",
    pageSize: "58mm",
    margin: "10px 10px 10px 10px",
    silent: true,
  })
    .then(() => {
      console.log(printers);
      console.log("Printed successfully");
    })
    .catch((error) => {
      console.error(error);
    });
});

ipcMain.handle("get-db-path", async () => {
  // Get the user data path and create the database directory if it doesn't exist
  const userDataPath = app.getPath("userData");
  const dbPath = path.join(userDataPath, "db");

  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath);
  }

  // Copy the bundled database file to the user data directory if it doesn't exist there already
  const bundledDbPath = path.join(
    process.resourcesPath,
    "db",
    "database.sqlite3"
  );
  const userDbPath = path.join(dbPath, "database.sqlite3");

  if (!fs.existsSync(userDbPath)) {
    fs.copyFileSync(bundledDbPath, userDbPath);
  }

  return userDbPath;
});
