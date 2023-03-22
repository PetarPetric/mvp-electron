class Crud {
  constructor(dao) {
    this.dao = dao;
  }

  createTable() {
    const CREATE_TABLE = `
      CREATE TABLE IF NOT EXISTS tipProizvoda (
          id INTEGER PRIMARY KEY,
          value TEXT NOT NULL,
          name TEXT NOT NULL,
          sale BOOLEAN
      );
    `;

    const CREATE_TABLE1 = `
      CREATE TABLE IF NOT EXISTS artikli (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          tipProizvoda_id INTEGER NOT NULL,
          cena INTEGER,
          kolicina INTEGER DEFAULT 0,
          subArtikli INTEGER REFERENCES artikli(id),
          FOREIGN KEY (tipProizvoda_id) REFERENCES tipProizvoda(id)
      );
    `;

    const CREATE_TABLE4 = `
        CREATE TABLE IF NOT EXISTS sub_artikli (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        artikal_id INTEGER NOT NULL,
        kolicina INTEGER NOT NULL,
        sub_artikal_id INTEGER NOT NULL,
        FOREIGN KEY (artikal_id) REFERENCES artikli(id),
        FOREIGN KEY (sub_artikal_id) REFERENCES artikli(id)
        );
    ;`;

    const CREATE_TABLE5 = `
        CREATE TABLE IF NOT EXISTS ulazni_izvestaj (
        id INTEGER PRIMARY KEY,
        artikal_id INTEGER NOT NULL,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        kolicina INTEGER NOT NULL,
        FOREIGN KEY (artikal_id) REFERENCES artikli(id)
      );
      `;

    const CREATE_TABLE3 = `;
      CREATE TABLE IF NOT EXISTS narudzbine (
          id INTEGER PRIMARY KEY,
          stol_id INTEGER NOT NULL,
          artikal_id INTEGER NOT NULL,
          kolicina INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (stol_id) REFERENCES stolovi(id),
          FOREIGN KEY (artikal_id) REFERENCES artikli(id)
      );
    `;

    const CREATE_TABLE2 = `
      CREATE TABLE IF NOT EXISTS stolovi (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL
        );
    `;

    const INSERT_STOLOVA = `
    INSERT OR IGNORE INTO stolovi (id, title, description)
      VALUES
          (1, '1', 'unutra'),
          (2, '2', 'unutra'),
          (3, '3', 'unutra'),
          (4, '4', 'unutra'),
          (5, 'Dostava', 'dostava'),
          (6, 'Sank', 'sank'),
          (7, '5', 'napolje'),
          (8, '6', 'napolje');
    `;
    const SET_TIP_PROIZVODA = `
      INSERT OR IGNORE INTO tipProizvoda (id, value, name, sale)
      VALUES
          (1, 'komadno', 'Komadno', true),
          (2, 'kilo', 'Na kilo', false),
          (3, 'hrana', 'Hrana', true),
          (4, 'alkoholna', 'Alkoholna pica', true),
          (5, 'litar', 'Litar', false)
      `;

    const INSERT_NA_KILO = `
    INSERT OR IGNORE INTO artikli (name, tipProizvoda_id) 
    VALUES 
      ('Brasno', 2),
      ('Pelat', 2),
      ('Kulen', 2),
      ('Govedja Prsuta', 2),
      ('Svinjska Prsuta', 2),
      ('Kackavalj', 2),
      ('Ljuta', 2),
      ('Gorgonzola', 2),
      ('Sunka', 2),
      ('Pecurke', 2),
      ('Feferone', 2),
      ('Crne masline', 2),
      ('Zelene masline', 2),
      ('Pavlaka', 2),
      ('Rukola', 2),
      ('Kajmak', 2),
      ('Brije', 2),
      ('Mocarela', 2),
      ('Tikvica', 2),
      ('Paradajiz', 2),
      ('Luk', 2),
      ('Plavi patlidzan', 2);
    `;

    this.dao.run(CREATE_TABLE);
    this.dao.run(CREATE_TABLE2);
    this.dao.run(CREATE_TABLE3);
    this.dao.run(CREATE_TABLE4);
    this.dao.run(CREATE_TABLE5);
    this.dao.run(INSERT_STOLOVA);
    this.dao.run(INSERT_NA_KILO);
    this.dao.run(SET_TIP_PROIZVODA);
    return this.dao.run(CREATE_TABLE1);
  }

  getTipProizvoda = () => {
    return this.dao.all(`SELECT * FROM tipProizvoda`);
  };

  getTipProizvodaZaKucanje = () => {
    return this.dao.all(`SELECT * FROM tipProizvoda WHERE sale <>0`);
  };

  getStolovi = () => {
    return this.dao.all(`SELECT * FROM stolovi`);
  };

  addArtikal = (name, tipProizvodaId, cena, subArtikli) => {
    return this.dao
      .run(
        "INSERT INTO artikli (name, tipProizvoda_id, cena) VALUES (?, ?, ?)",
        [name, tipProizvodaId, cena]
      )
      .then((result) => {
        const artikalId = result.id;
        if (
          (tipProizvodaId === 3 || tipProizvodaId === 4) &&
          subArtikli.length > 0
        ) {
          return Promise.all(
            subArtikli.map((sastojak) =>
              this.dao.run(
                "INSERT INTO sub_artikli (name, artikal_id, sub_artikal_id, kolicina) VALUES (?, ?, ?, ?)",
                [
                  sastojak.ime.name,
                  artikalId,
                  sastojak.ime.id,
                  sastojak.kolicina,
                ]
              )
            )
          ).then(() => artikalId);
        } else {
          return artikalId;
        }
      });
  };

  getArtikalById = (id) => {
    return this.dao.all("SELECT * FROM artikli WHERE tipProizvoda_id = ?", [
      id,
    ]);
  };

  getArtikalExceptFood = () => {
    return this.dao.all(
      "SELECT * FROM artikli WHERE tipProizvoda_id <> 3 AND tipProizvoda_id <> 4"
    );
  };

  addKolicina = (id, kolicina) => {
    this.dao.run(
      "INSERT INTO ulazni_izvestaj (artikal_id, kolicina) VALUES (?, ?)",
      [id, kolicina]
    );
    return this.dao.run(
      `UPDATE
        artikli
      SET
        kolicina = kolicina + ?
      WHERE
        id = ?`,
      [kolicina, id]
    );
  };

  deleteArtikal(id) {
    this.dao.run(`DELETE FROM sub_artikli WHERE artikal_id = ?`, [id]);
    return this.dao.run(`DELETE FROM artikli WHERE id = ?`, [id]);
  }

  getAllArtikli() {
    return this.dao.all(`SELECT * FROM artikli`);
  }

  async getUlazniIzvestaj(startDate, endDate, pageSize, pageNumber) {
    const offset = (pageNumber - 1) * pageSize;
    const countResult = await this.dao.all(
      `SELECT COUNT(*) as count
      FROM ulazni_izvestaj ui
      JOIN artikli a ON ui.artikal_id = a.id
      JOIN tipProizvoda tp ON a.tipProizvoda_id = tp.id
      WHERE ui.date BETWEEN ? AND ?`,
      [startDate, endDate]
    );

    const result = await this.dao.all(
      `SELECT
      ui.id,
      ui.date,
      ui.kolicina,
      a.name,
      tp.name AS tip_proizvoda_name
    FROM
      ulazni_izvestaj ui
      JOIN artikli a ON ui.artikal_id = a.id
      JOIN tipProizvoda tp ON a.tipProizvoda_id = tp.id
    WHERE
      ui.date BETWEEN ? AND ?
    ORDER BY
      ui.date ASC
    LIMIT ?
    OFFSET ?`,
      [startDate, endDate, pageSize, offset]
    );

    return {
      result,
      count: countResult[0].count,
    };
  }
}

export default Crud;
