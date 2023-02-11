import sqlite3 from "sqlite3";

// Initializing a new database
const database = new sqlite3.Database("/db/mvp.db");

export const getTipProizvoda = async () => {
  const result = await database.query("SELECT * FROM tipProizvoda");
  return result;
};

export const addArtikal = async (name, tipProizvodaId, cena) => {
  const result = await database.run(
    "INSERT INTO artikli (name, tipProizvoda_id, cena) VALUES (?, ?, ?)",
    [name, tipProizvodaId, cena]
  );
  return result;
};

// get all artikli
export const getArtikli = async () => {
  const result = await database.query("SELECT * FROM artikli");
  return result;
};

// get artikal by id
export const getArtikalById = async (id) => {
  console.log(id);
  const result = await database.query(
    "SELECT * FROM artikli WHERE tipProizvoda_id = ?",
    [id]
  );
  return result;
};

// add kolicina to artikal
export const addKolicina = async (id, kolicina) => {
  console.log(id, kolicina);
  const result = await database.run(
    `UPDATE
        artikli
      SET
        kolicina = kolicina + ?
      WHERE
        id = ?`,
    [kolicina, id]
  );
  console.log(result);
  return result;
};
