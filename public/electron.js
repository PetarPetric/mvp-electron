const { app, BrowserWindow, ipcMain } = require('electron');
const { PosPrinter } = require("electron-pos-printer");
const path = require("path");
const isDev = require("electron-is-dev");
const fs = require("fs");
const gotTheLock = app.requestSingleInstanceLock()

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

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  // Create myWindow, load the rest of the app, etc...
  app.on("ready", createWindow);
}


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

ipcMain.on("printPorudzbinu", (event, arg) => {
  const data = JSON.parse(arg);
  PosPrinter.print(data, {
    copies: 1,
    printerName: "POS-58",
    pageSize: "58mm",
    margin: "15px 30px 20px 10px",
    silent: true,
    pageSize: { height: 301000, width: 71000 }  // page size
  })
    .then((res) => {
      console.log(res)
    })
    .catch((error) => {
      console.error(error);
    });
});

ipcMain.on("printRacun", (event, arg) => {
  const data = JSON.parse(arg);
  PosPrinter.print(data, {
    copies: 1,
    printerName: "POS-58",
    pageSize: "58mm",
    margin: "15px 30px 20px 10px",
    silent: true,
    pageSize: { height: 301000, width: 71000 }  // page size
  })
    .then(() => {
      console.log(printers);
    })
    .catch((error) => {
      console.error(error);
    });
});

ipcMain.on("printStorno", (event, arg) => {
  const data = JSON.parse(arg);
  PosPrinter.print(data, {
    copies: 1,
    printerName: "POS-58",
    pageSize: "58mm",
    margin: "15px 30px 20px 10px",
    silent: true,
    pageSize: { height: 301000, width: 71000 }  // page size
  })
    .then(() => {
      console.log(printers);
    })
    .catch((error) => {
      console.error(error);
    });
});

ipcMain.on("printDnevni", (event, arg) => {
  const data = JSON.parse(arg);
  PosPrinter.print(data, {
    copies: 1,
    printerName: "POS-58",
    pageSize: "58mm",
    margin: "15px 40px 20px 0",
    silent: true,
    pageSize: { height: 301000, width: 71000 }  // page size
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
  let dbPath;

  if (isDev) {
    // In development mode, use the "database" folder in the application's root directory
    dbPath = path.join(__dirname, "..", "database");
  } else {
    // In production mode, use the "db" folder in the user data directory
    const userDataPath = app.getPath("userData");
    dbPath = path.join(userDataPath, "db");

    // Create the database directory if it doesn't exist
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath);
    }

    // Copy the bundled database file to the user data directory if it doesn't exist there already
    const bundledDbPath = path.join(process.resourcesPath, "db", "mvp-baza.sqlite3");
    const userDbPath = path.join(dbPath, "mvp-baza.sqlite3");

    if (!fs.existsSync(userDbPath)) {
      fs.copyFileSync(bundledDbPath, userDbPath);
    }
  }

  return path.join(dbPath, "mvp-baza.sqlite3");
});

