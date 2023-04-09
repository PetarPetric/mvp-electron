import {
  printPorudzbinu,
  printRacun,
  printStorno,
  groupBy,
} from "../services/printservice";
const { ipcRenderer } = window.require("electron");

class Crud {
  constructor(dao) {
    this.dao = dao;
  }

  createTable() {
    const CREATE_TIP_PROIZVODA = `
      CREATE TABLE IF NOT EXISTS tipProizvoda (
          id INTEGER PRIMARY KEY,
          value TEXT NOT NULL,
          name TEXT NOT NULL,
          sale BOOLEAN
      );
    `;

    const CREATE_ARTIKLI = `
      CREATE TABLE IF NOT EXISTS artikli (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          tipProizvoda_id INTEGER NOT NULL,
          cena INTEGER,
          kolicina INTEGER DEFAULT 0,
          FOREIGN KEY (tipProizvoda_id) REFERENCES tipProizvoda(id)
      );
    `;

    const CREATE_SUBARTIKLI = `
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

    const CREATE_ULAZNI_IZVESTAJ = `
        CREATE TABLE IF NOT EXISTS ulazni_izvestaj (
        id INTEGER PRIMARY KEY,
        artikal_id INTEGER NOT NULL,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        kolicina INTEGER NOT NULL,
        FOREIGN KEY (artikal_id) REFERENCES artikli(id)
      );
      `;

    const CREATE_NARUDZBINE = `;
      CREATE TABLE IF NOT EXISTS narudzbine (
          id INTEGER PRIMARY KEY,
          stol_id INTEGER NOT NULL,
          created_at DATETIME DEFAULT (datetime('now','localtime')),
          FOREIGN KEY (stol_id) REFERENCES stolovi(id)
      );
    `;

    const CREATE_NARUDZBINE_ARTIKLI = `
      CREATE TABLE IF NOT EXISTS narudzbine_artikli (
          id INTEGER PRIMARY KEY,
          narudzbina_id INTEGER NOT NULL,
          artikal_id INTEGER NOT NULL,
          FOREIGN KEY (narudzbina_id) REFERENCES narudzbine(id),
          FOREIGN KEY (artikal_id) REFERENCES artikli(id)
      );
    `;

    const CREATE_STORNO_NARUDZBINE = `
      CREATE TABLE IF NOT EXISTS storno_narudzbine (
          id INTEGER PRIMARY KEY,
          stol_id INTEGER NOT NULL,
          created_at DATETIME DEFAULT (datetime('now','localtime')),
          ukupna_cena INTEGER NOT NULL,
          description TEXT,
          FOREIGN KEY (stol_id) REFERENCES stolovi(id)
      );
    `;

    const CREATE_STORNO_NARUDZBINE_ARTIKLI = `
      CREATE TABLE IF NOT EXISTS storno_narudzbine_artikli (
          id INTEGER PRIMARY KEY,
          storno_narudzbina_id INTEGER NOT NULL,
          artikal_id INTEGER NOT NULL,
          FOREIGN KEY (storno_narudzbina_id) REFERENCES storno_narudzbine(id),
          FOREIGN KEY (artikal_id) REFERENCES artikli(id)
      );
    `;

    const CREATE_NAPLACENE_NARUDZBINE = `
      CREATE TABLE IF NOT EXISTS naplacene_narudzbine (
          id INTEGER PRIMARY KEY,
          stol_id INTEGER NOT NULL,
          ukupna_cena INTEGER NOT NULL,
          created_at DATETIME DEFAULT (datetime('now','localtime')),
          FOREIGN KEY (stol_id) REFERENCES stolovi(id)
      );
    `;

    const CREATE_NAPLACENE_NARUDZBINE_ARTIKLI = `
      CREATE TABLE IF NOT EXISTS naplacene_narudzbine_artikli (
          id INTEGER PRIMARY KEY,
          naplacena_narudzbina_id INTEGER NOT NULL,
          artikal_id INTEGER NOT NULL,
          description TEXT,
          FOREIGN KEY (naplacena_narudzbina_id) REFERENCES naplacene_narudzbine(id),
          FOREIGN KEY (artikal_id) REFERENCES artikli(id)
      );
    `;

    const CREATE_STOLOVI = `
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

    const INSERT_KOMADNO = `
    INSERT INTO artikli (name, tipProizvoda_id, cena) 
    VALUES
      ('Koka kola', 1, 120),
      ('Fanta', 1, 120),
      ('Biter', 1, 120),
      ('Tonik', 1, 120),
      ('Jabuka', 1, 120),
      ('Breska', 1, 120),
      ('Jagoda', 1, 120),
      ('Djus', 1, 120),
      ('Lav 0.5', 1, 120),
      ('Heiniken 0.4', 1, 150),
      ('Voda OB 0.25', 1, 120),
      ('Kisela voda 0.25', 1, 120),
      ('Kisela v0da 0.7', 1, 160),
      ('Nespreso', 1, 150),
      ('Nespreso mleko', 1, 160),
      ('Banjalucko 0.3', 1, 140),
      ('nektar limun', 1, 150),
      ('Guaran', 1, 150),
      ('Voda negazirana', 1, 120),
      ('Domaca kafa', 1, 100);
    `;

    this.dao.run(CREATE_TIP_PROIZVODA);
    this.dao.run(CREATE_SUBARTIKLI);
    this.dao.run(CREATE_NARUDZBINE);
    this.dao.run(CREATE_ULAZNI_IZVESTAJ);
    this.dao.run(CREATE_STOLOVI);
    this.dao.run(INSERT_STOLOVA);
    this.dao.run(CREATE_NARUDZBINE_ARTIKLI);
    this.dao.run(SET_TIP_PROIZVODA);
    this.dao.run(CREATE_NAPLACENE_NARUDZBINE);
    this.dao.run(CREATE_NAPLACENE_NARUDZBINE_ARTIKLI);
    this.dao.run(CREATE_STORNO_NARUDZBINE);
    this.dao.run(CREATE_STORNO_NARUDZBINE_ARTIKLI);
    return this.dao.run(CREATE_ARTIKLI);
  }

  getTipProizvoda = () => {
    return this.dao.all(`SELECT * FROM tipProizvoda`);
  };

  getTipProizvodaZaKucanje = () => {
    return this.dao.all(`SELECT * FROM tipProizvoda WHERE sale <>0`);
  };

  getStolovi = async () => {
    const stolovi = await this.dao.all(`SELECT * FROM stolovi`);
    const narudzbinaNaStolu = Promise.all(
      stolovi.map((stol) => this.getNarudzbineNaStolu(stol.id))
    );
    return Promise.all([stolovi, narudzbinaNaStolu]).then((result) => {
      const stolovi = result[0];
      const narudzbine = result[1];
      return stolovi.map((stol, index) => {
        return {
          ...stol,
          cena: narudzbine[index].reduce((acc, curr) => acc + curr.cena, 0),
        };
      });
    });
  };

  updateKolicina = (id, kolicina) => {
    return this.dao.run(
      `UPDATE artikli SET kolicina = kolicina + ? WHERE id = ?`,
      [kolicina, id]
    );
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
                [sastojak.name, artikalId, sastojak.id, sastojak.kolicina]
              )
            )
          ).then(() => artikalId);
        } else {
          return artikalId;
        }
      });
  };

  updateSingleArtikal = async (
    id,
    name,
    tipProizvodaId,
    cena,
    subArtikli,
    kolicina
  ) => {
    return this.dao
      .run(
        "UPDATE artikli SET name = ?, tipProizvoda_id = ?, cena = ?, kolicina = ? WHERE id = ?",
        [name, tipProizvodaId, cena, kolicina, id]
      )
      .then(() => {
        if (
          (tipProizvodaId == 3 || tipProizvodaId == 4) &&
          subArtikli.length > 0
        ) {
          this.dao.run(`DELETE FROM sub_artikli WHERE artikal_id = ?`, [id]);
          Promise.all(
            subArtikli.map((sastojak) => {
              this.dao.run(
                "INSERT INTO sub_artikli (name, artikal_id, sub_artikal_id, kolicina) VALUES (?, ?, ?, ?)",
                [sastojak.name, id, sastojak.id, sastojak.kolicina]
              );
            })
          );
        }
      });
  };

  getSingleArtikalById = async (id) => {
    const artikli = await this.dao.all(`SELECT * FROM artikli WHERE id = ?`, [
      id,
    ]);
    const subArtikli = await this.dao.all(
      `SELECT * FROM sub_artikli WHERE artikal_id = ?`,
      [id]
    );
    const tipProizvoda = await this.dao.all(
      `SELECT * FROM tipProizvoda WHERE id = ?`,
      [artikli[0].tipProizvoda_id]
    );

    const artikal = artikli[0];
    return {
      ...artikal,
      subArtikli,
      tipProizvoda,
    };
  };

  getArtikalById = async (id, pageSize, pageNumber, offset = null) => {
    let query;
    let queryParams;

    const countResult = await this.dao.all(
      `SELECT COUNT(*) as count FROM artikli WHERE tipProizvoda_id = ?`,
      [id]
    );

    if (offset === null) {
      query = `SELECT * FROM artikli WHERE tipProizvoda_id = ?`;
      queryParams = [id];
    } else {
      offset = (pageNumber - 1) * pageSize;
      query = `SELECT * FROM artikli WHERE tipProizvoda_id = ? LIMIT ? OFFSET ?`;
      queryParams = [id, pageSize, offset];
    }

    const artikli = await this.dao.all(query, queryParams);

    return {
      count: countResult[0].count,
      artikli,
    };
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

  async getAllArtikli(pageSize, pageNumber) {
    const offset = (pageNumber - 1) * pageSize;
    const countResult = await this.dao.all(
      `SELECT COUNT(*) as count FROM artikli`
    );

    const artikli = await this.dao.all(
      `SELECT * FROM artikli LIMIT ? OFFSET ?`,
      [pageSize, offset]
    );

    return {
      count: countResult[0].count,
      artikli,
    };
  }

  async getUlazniIzvestaj(startDate, endDate, pageSize, pageNumber) {
    const offset = (pageNumber - 1) * pageSize;
    const countResult = await this.dao.all(
      `
        SELECT COUNT(*) as count
        FROM ulazni_izvestaj ui
        JOIN artikli a ON ui.artikal_id = a.id
        JOIN tipProizvoda tp ON a.tipProizvoda_id = tp.id
        WHERE ui.date BETWEEN ? AND ?
      `,
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

  getSubArtikliByArtikalId = (id) => {
    return this.dao.all(
      `SELECT
        sa.id,
        sa.name,
        sa.kolicina,
        sa.sub_artikal_id,
        a.name AS artikal_name
      FROM
        sub_artikli sa
        JOIN artikli a ON sa.artikal_id = a.id
      WHERE
        sa.artikal_id = ?`,
      [id]
    );
  };

  naplatiPorudzbinu = async (stolId, ukupnaCena, artikli) => {
    const groupedArticles = groupBy(artikli, "artikal_id");

    const narudzbina = await this.dao.run(
      "INSERT INTO naplacene_narudzbine (stol_id, ukupna_cena) VALUES (?, ?)",
      [stolId, ukupnaCena]
    );

    const narudzbinaInfo = await this.dao.all(
      "SELECT * FROM naplacene_narudzbine WHERE id = ?",
      [narudzbina.id]
    );

    for (const artikalId in groupedArticles) {
      const articleGroup = groupedArticles[artikalId];
      const quantity = articleGroup.length;

      const promises = groupedArticles[artikalId].map((artikal) => {
        this.dao.run(
          "DELETE FROM narudzbine_artikli WHERE narudzbina_id = ? AND artikal_id = ?",
          [artikal.narudzbina_id, artikal.artikal_id]
        );

        this.dao.run("DELETE from narudzbine WHERE id = ?", [
          artikal.narudzbina_id,
        ]);

        return this.dao.run(
          "INSERT INTO naplacene_narudzbine_artikli (naplacena_narudzbina_id , artikal_id) VALUES (?, ?)",
          [narudzbina.id, artikal.artikal_id]
        );
      });

      await Promise.all(promises);

      // Update the artikli table by subtracting the quantity
      await this.updateKolicina(artikalId, -quantity);

      const article = articleGroup[0];

      // Update sub_artikli for articles with tipProizvoda_id as 2 or 5
      if (article.tip_proizvoda == 3 || article.tip_proizvoda == 5) {
        const subArtikli = await this.getSubArtikliByArtikalId(artikalId);

        for (const subArtikal of subArtikli) {
          // Subtract the sub_article quantity from the sub_artikli table
          await this.updateKolicina(
            subArtikal.sub_artikal_id,
            -subArtikal.kolicina * quantity
          );
        }
      }
    }

    printRacun(groupedArticles, narudzbinaInfo, stolId);
  };

  napraviPorudzbinu = async (stolId, artikli, description) => {
    const narudzbina = await this.dao.run(
      "INSERT INTO narudzbine (stol_id, description) VALUES (?, ?)",
      [stolId, description]
    );

    const narudzbinaInfo = await this.dao.all(
      "SELECT * FROM narudzbine WHERE id = ?",
      [narudzbina.id]
    );

    const promises = artikli.map((artikal) => {
      return this.dao.run(
        "INSERT INTO narudzbine_artikli (narudzbina_id , artikal_id) VALUES (?, ?)",
        [narudzbina.id, artikal.id]
      );
    });

    try {
      await Promise.all(promises);

      printPorudzbinu(artikli, narudzbinaInfo, stolId);

      return {
        message: "Uspesno ste napravili porudzbinu",
        stolId,
        narudzbinaInfo,
        artikli,
      };
    } catch (error) {
      console.error("Error inserting records", error);
    }
  };

  stornirajPorudzbinu = async (stolId, artikli, description) => {
    const groupedArticles = groupBy(artikli, "artikal_id");

    const storniranaNarudzbina = await this.dao.run(
      "INSERT INTO storno_narudzbine (stol_id, description) VALUES (?, ?)",
      [stolId, description]
    );

    const storniranaNarudzbinainfo = await this.dao.all(
      "SELECT * FROM storno_narudzbine WHERE id = ?",
      [storniranaNarudzbina.id]
    );

    for (const artikalId in groupedArticles) {
      const quantity = groupedArticles[artikalId].length;

      const promises = groupedArticles[artikalId].map((artikal) => {
        this.dao.run(
          `DELETE FROM narudzbine_artikli
            WHERE rowid IN (
                SELECT rowid FROM narudzbine_artikli
                WHERE narudzbina_id = ? AND artikal_id = ?
                LIMIT ?
            )
          `,
          [artikal.narudzbina_id, artikal.artikal_id, quantity]
        );

        return this.dao.run(
          `
          INSERT INTO storno_narudzbine_artikli (storno_narudzbina_id, artikal_id) VALUES (?, ?)
          `,
          [storniranaNarudzbina.id, artikal.artikal_id]
        );
      });
      await Promise.all(promises);
    }

    printStorno(groupedArticles, storniranaNarudzbinainfo, stolId);
  };

  getNarudzbineNaStolu = async (stol_id) => {
    const result = await this.dao.all(
      `SELECT
        na.id as narudzbina_artikal_id,
        n.id as narudzbina_id,
        n.created_at,
        n.stol_id,
        a.name,
        a.cena,
        a.id as artikal_id,
        a.tipProizvoda_id as tip_proizvoda
      FROM
        narudzbine n
        JOIN narudzbine_artikli na ON n.id = na.narudzbina_id
        JOIN artikli a ON na.artikal_id = a.id
      WHERE
        n.stol_id = ?
      ORDER BY
        n.created_at ASC`,
      [stol_id]
    );

    return result;
  };

  getNaplaceneIStorniraneNarudzbine = async (
    stol_id,
    startDate,
    endDate,
    pageSize,
    pageNumber
  ) => {
    const offset = (pageNumber - 1) * pageSize;

    const naplaceneNarudzbineCount = await this.dao.all(
      `
      SELECT COUNT(*) as count
      FROM naplacene_narudzbine
      WHERE stol_id = ? AND created_at BETWEEN ? AND ?
    `,
      [stol_id, startDate, endDate]
    );

    const storniraneNarudzbineCount = await this.dao.all(
      `
      SELECT COUNT(*) as count
      FROM storno_narudzbine
      WHERE stol_id = ? AND created_at BETWEEN ? AND ?
    `,
      [stol_id, startDate, endDate]
    );

    const naplaceneOffset = Math.max(
      0,
      offset - storniraneNarudzbineCount.count
    );
    const naplaceneLimit =
      pageSize - Math.max(0, storniraneOffset - naplaceneOffset);
    const storniraneOffset = Math.max(
      0,
      offset - naplaceneNarudzbineCount.count
    );
    const storniraneLimit =
      pageSize - Math.max(0, naplaceneOffset - storniraneOffset);

    console.log(naplaceneLimit, naplaceneOffset);

    const naplaceneNarudzbine = await this.dao.all(
      `
      SELECT
        *,
        'Naplaceno' as status
      FROM
        naplacene_narudzbine
      WHERE
        stol_id = ? AND created_at BETWEEN ? AND ?
      ORDER BY
        created_at ASC
      LIMIT ?
      OFFSET ?
    `,
      [stol_id, startDate, endDate, pageSize, offset]
    );

    const storniraneNarudzbine = await this.dao.all(
      `
      SELECT 
        *,
        'Stornirano' as status
      FROM
        storno_narudzbine
      WHERE
        stol_id = ? AND created_at BETWEEN ? AND ?
      ORDER BY
        created_at ASC
      LIMIT ?
      OFFSET ?
    `,
      [stol_id, startDate, endDate, pageSize, offset]
    );

    await Promise.all(
      naplaceneNarudzbine.map(async (narudzbina) => {
        const artikli = await this.dao.all(
          `
      SELECT
        a.name,
        a.cena,
        a.id as artikal_id,
        a.tipProizvoda_id as tip_proizvoda
      FROM
        naplacene_narudzbine_artikli na
        JOIN artikli a ON na.artikal_id = a.id
      WHERE
        na.naplacena_narudzbina_id = ?
      `,
          [narudzbina.id]
        );
        narudzbina.artikli = artikli;
      })
    );

    await Promise.all(
      storniraneNarudzbine.map(async (narudzbina) => {
        const artikli = await this.dao.all(
          `
          SELECT
            a.name,
            a.cena,
            a.id as artikal_id,
            a.tipProizvoda_id as tip_proizvoda
          FROM
            storno_narudzbine_artikli na
            JOIN artikli a ON na.artikal_id = a.id
          WHERE
            na.storno_narudzbina_id = ?
          `,
          [narudzbina.id]
        );
        narudzbina.artikli = artikli;
      })
    );

    const combinedResults = [...naplaceneNarudzbine, ...storniraneNarudzbine];
    combinedResults.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );

    const totalCount =
      naplaceneNarudzbineCount[0].count + storniraneNarudzbineCount[0].count;

    return {
      result: combinedResults,
      count: totalCount,
    };
  };
}

export default Crud;
