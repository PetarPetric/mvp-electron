import AppDAO from "../db/dao";
import Crud from "../db/crud";

let dao;
let db;

function setDatabase() {
  dao = new AppDAO("./node_modules/database.sqlite3");
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
