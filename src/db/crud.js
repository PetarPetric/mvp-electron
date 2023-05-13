import {
  printPorudzbinu,
  printRacun,
  printStorno,
  printDnevni,
  groupBy,
} from "../services/printservice";
import dayjs from "dayjs";

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
        parent_artikal_id INTEGER NOT NULL,
        kolicina INTEGER NOT NULL,
        artikal_id INTEGER NOT NULL,
        FOREIGN KEY (parent_artikal_id) REFERENCES artikli(id),
        FOREIGN KEY (artikal_id) REFERENCES artikli(id)
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
          created_at DATETIME DEFAULT (datetime('now','localtime')),
          ukupna_cena INTEGER NOT NULL,
          description TEXT,
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
      ('Coca Cola', 1, 120),
      ('Fanta', 1, 120),
      ('Biter', 1, 120),
      ('Tonik', 1, 120),
      ('Jabuka', 1, 120),
      ('Breskva', 1, 120),
      ('Jagoda', 1, 120),
      ('Djus', 1, 120),
      ('Lav 0.5', 1, 120),
      ('Heiniken 0.4', 1, 150),
      ('Voda OB 0.25', 1, 120),
      ('Kisela voda 0.25', 1, 120),
      ('Kisela voda 0.7', 1, 160),
      ('Nespreso', 1, 150),
      ('Nespreso mleko', 1, 160),
      ('Banjalucko 0.3', 1, 140),
      ('Nektar limun', 1, 150),
      ('Guarana', 1, 150),
      ('Voda negazirana', 1, 120),
      ('Domaca kafa', 1, 100);
    `;

    const INSERT_PIZZE = `
    INSERT INTO artikli (id, name, tipProizvoda_id, cena, kolicina)
      VALUES
      (1, 'MVP Pizza 24', 3, 0, 0),
      (2, 'MVP Pizza 32', 3, 0, 0),
      (3, 'MVP Pizza 50', 3, 0, 0),
      (4, 'Capricciosa 24', 3, 0, 0),
      (5, 'Capricciosa 32', 3, 0, 0),
      (6, 'Capricciosa 50', 3, 0, 0),
      (7, 'Diavolo 24', 3, 0, 0),
      (8, 'Diavolo 32', 3, 0, 0),
      (9, 'Diavolo 50', 3, 0, 0),
      (10, 'Vesuvio 24', 3, 0, 0),
      (11, 'Vesuvio 32', 3, 0, 0),
      (12, 'Vesuvio 50', 3, 0, 0),
      (13, 'Quattro Stagioni 24', 3, 0, 0),
      (14, 'Quattro Stagioni 32', 3, 0, 0),
      (15, 'Quattro Stagioni 50', 3, 0, 0),
      (16, 'Uzicanka 24', 3, 0, 0),
      (17, 'Uzicanka 32', 3, 0, 0),
      (18, 'Uzicanka 50', 3, 0, 0),
      (19, 'Sortino 24', 3, 0, 0),
      (20, 'Sortino 32', 3, 0, 0),
      (21, 'Srbijana 24', 3, 0, 0),
      (22, 'Srbijana 32', 3, 0, 0),
      (23, 'Srbijana 50', 3, 0, 0),
      (24, 'Quattro Formaggi 24', 3, 0, 0),
      (25, 'Quattro Formaggi 32', 3, 0, 0),
      (26, 'Quattro Formaggi 50', 3, 0, 0),
      (27, 'Vegetarijana 24', 3, 0, 0),
      (28, 'Vegetarijana 32', 3, 0, 0),
      (29, 'Vegetarijana 50', 3, 0, 0);
    `;

    this.dao.run(CREATE_ARTIKLI);
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
    return this.dao.run(CREATE_STORNO_NARUDZBINE_ARTIKLI);
    // this.dao.run(INSERT_NA_KILO);
    // return this.dao.run(INSERT_KOMADNO);
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
                "INSERT INTO sub_artikli (parent_artikal_id, artikal_id, kolicina) VALUES (?, ?, ?)",
                [artikalId, sastojak.id, sastojak.kolicina]
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
          this.dao.run(`DELETE FROM sub_artikli WHERE parent_artikal_id = ?`, [id]);
          Promise.all(
            subArtikli.map((sastojak) => {
              this.dao.run(
                "INSERT INTO sub_artikli (parent_artikal_id, artikal_id, kolicina) VALUES (?, ?, ?)",
                [id, sastojak.artikal_id, sastojak.kolicina]
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
      `SELECT sub_artikli.*, artikli.name 
        FROM sub_artikli 
        JOIN artikli ON sub_artikli.artikal_id = artikli.id 
        WHERE sub_artikli.parent_artikal_id = ?;
      `,
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
    this.dao.run(`DELETE FROM sub_artikli WHERE parent_artikal_id = ?`, [id]);
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
        sa.kolicina,
        sa.artikal_id,
        a.name AS artikal_name
      FROM
        sub_artikli sa
        JOIN artikli a ON sa.parent_artikal_id = a.id
      WHERE
        sa.parent_artikal_id = ?`,
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

    for (let i = 0; i < artikli.length; i++) {
      await this.dao.run(
        `DELETE FROM narudzbine_artikli WHERE rowid IN (
          SELECT rowid FROM narudzbine_artikli WHERE id = ? AND artikal_id = ? AND narudzbina_id = ?
          )`,
        [artikli[i].narudzbina_artikal_id, artikli[i].artikal_id, artikli[i].narudzbina_id]
      );
      await this.dao.run(
        "INSERT INTO naplacene_narudzbine_artikli (naplacena_narudzbina_id , artikal_id) VALUES (?, ?)",
        [narudzbina.id, artikli[i].artikal_id]
      );

      await this.updateKolicina(artikli[i].artikal_id, -1)

      if (artikli[i].tip_proizvoda == 3 || artikli[i].tip_proizvoda == 5) {
        const subArtikli = await this.getSubArtikliByArtikalId(artikli[i].artikal_id);

        for (const subArtikal of subArtikli) {
          // Subtract the sub_article quantity from the sub_artikli table
          await this.updateKolicina(
            subArtikal.artikal_id,
            -subArtikal.kolicina
          );
        }
      }
    }
    const narudzbineNaStolu = await this.dao.all(
      `SELECT
        *
      FROM
        narudzbine
      WHERE
        stol_id = ?`,
      [stolId]
    );

    for (const narudzbina of narudzbineNaStolu) {
      const artikliNarudzbine = await this.dao.all(
        `SELECT
          *
        FROM
          narudzbine_artikli
        WHERE
          narudzbina_id = ?`,
        [narudzbina.id]
      );

      if (artikliNarudzbine.length == 0) {
        await this.dao.run(
          `DELETE FROM narudzbine WHERE id = ?`,
          [narudzbina.id]
        );
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
    const ukupnaCena = artikli.reduce((acc, curr) => {
      return acc + curr.cena;
    }, 0);

    const storniranaNarudzbina = await this.dao.run(
      "INSERT INTO storno_narudzbine (stol_id, description, ukupna_cena) VALUES (?, ?, ?)",
      [stolId, description, ukupnaCena]
    );

    const storniranaNarudzbinainfo = await this.dao.all(
      "SELECT * FROM storno_narudzbine WHERE id = ?",
      [storniranaNarudzbina.id]
    );
    console.log(storniranaNarudzbina, storniranaNarudzbinainfo)

    for (let i = 0; i < artikli.length; i++) {
      await this.dao.run(
        `DELETE FROM narudzbine_artikli WHERE rowid IN (
          SELECT rowid FROM narudzbine_artikli WHERE id = ? AND artikal_id = ? AND narudzbina_id = ?
          )`,
        [artikli[i].narudzbina_artikal_id, artikli[i].artikal_id, artikli[i].narudzbina_id]
      );
      await this.dao.run(
        "INSERT INTO storno_narudzbine_artikli (storno_narudzbina_id , artikal_id) VALUES (?, ?)",
        [storniranaNarudzbina.id, artikli[i].artikal_id]
      );
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

    const totalCount = await this.dao.all(
      `
      SELECT COUNT(*) as count
      FROM (
        SELECT id
        FROM naplacene_narudzbine
        WHERE stol_id = ? AND created_at BETWEEN ? AND ?
        UNION ALL
        SELECT id
        FROM storno_narudzbine
        WHERE stol_id = ? AND created_at BETWEEN ? AND ?
      ) combined
      `,
      [stol_id, startDate, endDate, stol_id, startDate, endDate]
    );

    const combinedResults = await this.dao.all(
      `
        SELECT *
        FROM (
          SELECT
            *,
            'Naplaceno' as status
          FROM
            naplacene_narudzbine
          WHERE
            stol_id = ? AND created_at BETWEEN ? AND ?
          UNION ALL
          SELECT
            *,
            'Stornirano' as status
          FROM
            storno_narudzbine
          WHERE
            stol_id = ? AND created_at BETWEEN ? AND ?
        ) combined
        ORDER BY
          created_at ASC
        LIMIT ?
        OFFSET ?
      `,
      [
        stol_id,
        startDate,
        endDate,
        stol_id,
        startDate,
        endDate,
        pageSize,
        offset,
      ]
    );

    await Promise.all(
      combinedResults.map(async (narudzbina) => {
        let sql = "";
        if (narudzbina.status === "Naplaceno") {
          sql = `
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
          `;
        } else {
          sql = `
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
          `;
        }
        const artikli = await this.dao.all(sql, [narudzbina.id]);
        narudzbina.artikli = artikli;
      })
    );

    return {
      result: combinedResults,
      count: totalCount[0].count,
    };
  };

  getDnevniIzvestaj = async () => {
    // get all naplaceni artikli and all storno artikli for today with dayjs
    const startDateFormated = dayjs().format("YYYY-MM-DD") + " 00:00:00";
    const endDateFormated = dayjs().format("YYYY-MM-DD") + " 23:59:59";

    const narudzbineArtikli = await this.dao.all(
      `
        SELECT * FROM narudzbine_artikli
        LIMIT 5
      `
    );

    if (narudzbineArtikli.length) {
      alert("Nisu naplaceni svi stolovi!");
      return;
    }

    // delete all narudzbine
    await this.dao.run(
      `
        DELETE FROM narudzbine
      `
    );

    const naplaceneNarudzbine = await this.dao.all(
      `
        SELECT
          a.name,
          a.cena,
          a.id as artikal_id,
          a.tipProizvoda_id as tip_proizvoda,
          'Naplaceno' as status
        FROM
          naplacene_narudzbine_artikli na
          JOIN artikli a ON na.artikal_id = a.id
          JOIN naplacene_narudzbine nn ON na.naplacena_narudzbina_id = nn.id
        WHERE
          nn.created_at BETWEEN ? AND ?
        `,
      [startDateFormated, endDateFormated]
    );

    const storniraneNarudzbine = await this.dao.all(
      `
        SELECT
          a.name,
          a.cena,
          a.id as artikal_id,
          a.tipProizvoda_id as tip_proizvoda,
          'Stornirano' as status
        FROM
          storno_narudzbine_artikli na
          JOIN artikli a ON na.artikal_id = a.id
          JOIN storno_narudzbine sn ON na.storno_narudzbina_id = sn.id
        WHERE
          sn.created_at BETWEEN ? AND ?
        `,
      [startDateFormated, endDateFormated]
    );
    alert("Dnevni izvestaj se stampa");

    printDnevni(naplaceneNarudzbine, storniraneNarudzbine);
  };
}

export default Crud;
