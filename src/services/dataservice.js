import AppDAO from "../db/dao";
import Crud from "../db/crud";
const { ipcRenderer } = window.require("electron");

async function getDatabasePath() {
  const dbPath = await ipcRenderer.invoke("get-db-path");
  return dbPath;
}

let dao;
let db;

async function setDatabase() {
  const dbPath = await getDatabasePath();
  dao = new AppDAO(dbPath);
  db = new Crud(dao);
  db.createTable()
    .then(() => {
      console.log("db is created...");
    })
    .catch((err) => {
      console.log("Error: ");
      console.log(JSON.stringify(err));
    });
}

export { setDatabase, db };
