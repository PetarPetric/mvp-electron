import {
  printPorudzbinu,
  printRacun,
  printStorno,
  printDnevni,
  groupBy,
} from "../services/printservice";
import dayjs from "dayjs";
import smalltalk from 'smalltalk';

class Crud {
  constructor(dao) {
    this.dao = dao;
  }

  createTable() {
    // const CREATE_TIP_PROIZVODA = `
    //   CREATE TABLE IF NOT EXISTS tipProizvoda (
    //       id INTEGER PRIMARY KEY,
    //       value TEXT NOT NULL,
    //       name TEXT NOT NULL,
    //       sale BOOLEAN
    //   );
    // `;

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

    const CREATE_NARUDZBINE = `;
      CREATE TABLE IF NOT EXISTS narudzbine (
          id INTEGER PRIMARY KEY,
          stol_id INTEGER NOT NULL,
          created_at DATETIME DEFAULT (datetime('now','localtime')),
          FOREIGN KEY (stol_id) REFERENCES tables(id)
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
          FOREIGN KEY (stol_id) REFERENCES tables(id)
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
          FOREIGN KEY (stol_id) REFERENCES tables(id)
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

    const CREATE_TABLES = `
      CREATE TABLE IF NOT EXISTS your_table_name (
        id INTEGER PRIMARY KEY,
        title TEXT,
        description TEXT,
        view_id INTEGER
    );`;

    const INSERT_STOLOVA = `
    INSERT INTO tables (id, title, description, view_id)
    VALUES
        (62, '62', NULL, 2),
        (68, '68', NULL, 2),
        (67, '67', NULL, 2),
        (63, '63', NULL, 2),
        (69, '69', NULL, 2),
        (59, '59', NULL, 2),
        (70, '70', 'NULL', 2),
        (72, '72', NULL, 2),
        (58, '58', NULL, 2),
        (55, '55', NULL, 2),
        (56, '56', NULL, 2),
        (57, '57', NULL, 2),
        (66, '66', NULL, 2),
        (61, '61', NULL, 2),
        (65, '65', NULL, 2),
        (64, '64', NULL, 2),
        (17, '17', NULL, 1),
        (71, '71', NULL, 1),
        (16, '16', NULL, 1),
        (12, '12', NULL, 1),
        (13, '13', NULL, 1),
        (14, '14', NULL, 1),
        (15, '15', NULL, 1),
        (11, '11', NULL, 1),
        (41, '41', NULL, 1),
        (40, '40', NULL, 1),
        (39, '39', NULL, 1),
        (38, '38', NULL, 1),
        (37, '37', NULL, 1),
        (36, '36', NULL, 1),
        (35, '35', NULL, 1),
        (34, '34', NULL, 1),
        (33, '33', NULL, 1),
        (32, '32', NULL, 1),
        (31, '31', NULL, 1),
        (30, '30', NULL, 1),
        (29, '29', NULL, 1),
        (28, '28', NULL, 1),
        (27, '27', NULL, 1),
        (26, '26', NULL, 1),
        (25, '25', NULL, 1),
        (24, '24', NULL, 1);
    `;

    const SET_TIP_PROIZVODA = `
    INSERT OR IGNORE INTO tipProizvoda(id, value, name, sale)
    VALUES
      (1, LOWER('topli napici'), UPPER('TOPLI NAPICI'), true),
      (2, LOWER('prirodni sokovi'), UPPER('PRIRODNI SOKOVI'), true),
      (3, LOWER('energ. pica'), UPPER('ENERG. PICA'), true),
      (4, LOWER('voda'), UPPER('VODA'), true),
      (5, LOWER('sokovi'), UPPER('SOKOVI'), true),
      (6, LOWER('pivo'), UPPER('PIVO'), true),
      (7, LOWER('alkohol. pica'), UPPER('ALKOHOL. PICA'), true),
      (8, LOWER('likeri'), UPPER('LIKERI'), true),
      (9, LOWER('vina'), UPPER('VINA'), true);
    `;

    // this.dao.run(CREATE_ARTIKLI);
    // this.dao.run(CREATE_TIP_PROIZVODA);
    // this.dao.run(CREATE_NARUDZBINE);
    // this.dao.run(CREATE_ULAZNI_IZVESTAJ);
    // this.dao.run(CREATE_tables);
    // this.dao.run(INSERT_STOLOVA);
    // this.dao.run(CREATE_NARUDZBINE_ARTIKLI);
    // this.dao.run(SET_TIP_PROIZVODA);
    // this.dao.run(CREATE_NAPLACENE_NARUDZBINE);
    // this.dao.run(CREATE_NAPLACENE_NARUDZBINE_ARTIKLI);
    // this.dao.run(CREATE_STORNO_NARUDZBINE);
    return this.dao.run(CREATE_TABLES);
  }

  getTipProizvoda = () => {
    return this.dao.all(`SELECT * FROM tipProizvoda`);
  };

  getTipProizvodaZaKucanje = () => {
    return this.dao.all(`SELECT * FROM tipProizvoda WHERE sale <> 0`);
  };

  getTablesById = async (id) => {
    const tables = await this.dao.all(`SELECT * FROM tables WHERE view_id = ? `, [id]);
    const narudzbinaNaStolu = Promise.all(
      tables.map((stol) => this.getNarudzbineNaStolu(stol.id))
    );
    return Promise.all([tables, narudzbinaNaStolu]).then((result) => {
      const tables = result[0];
      const narudzbine = result[1];
      return tables.map((stol, index) => {
        return {
          ...stol,
          cena: narudzbine[index].reduce((acc, curr) => acc + curr.cena, 0),
        };
      });
    });
  };

  addArtikal = (name, tipProizvodaId, cena) => {
    return this.dao
      .run(
        "INSERT INTO artikli (name, tipProizvoda_id, cena) VALUES (?, ?, ?)",
        [name, tipProizvodaId, cena]
      )
      .then((result) => {
        const artikalId = result.id;
        return artikalId;
      });
  };

  updateSingleArtikal = async (
    id,
    name,
    tipProizvodaId,
    cena,
    kolicina
  ) => {
    return this.dao
      .run(
        "UPDATE artikli SET name = ?, tipProizvoda_id = ?, cena = ?, kolicina = ? WHERE id = ?",
        [name, tipProizvodaId, cena, kolicina, id]
      )
      .then((res) => {
        console.log(res)
      });
  };

  getSingleArtikalById = async (id) => {
    const artikli = await this.dao.all(`SELECT * FROM artikli WHERE id = ? `, [
      id,
    ]);

    const tipProizvoda = await this.dao.all(
      `SELECT * FROM tipProizvoda WHERE id = ? `,
      [artikli[0].tipProizvoda_id]
    );

    const artikal = artikli[0];
    return {
      ...artikal,
      tipProizvoda,
    };
  };

  getArtikalById = async (id, pageSize, pageNumber, offset = null) => {
    let query;
    let queryParams;

    const countResult = await this.dao.all(
      `SELECT COUNT(*) as count FROM artikli WHERE tipProizvoda_id = ? `,
      [id]
    );

    if (offset === null) {
      query = `SELECT * FROM artikli WHERE tipProizvoda_id = ? `;
      queryParams = [id];
    } else {
      offset = (pageNumber - 1) * pageSize;
      query = `SELECT * FROM artikli WHERE tipProizvoda_id = ? LIMIT ? OFFSET ? `;
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
        id = ? `,
      [kolicina, id]
    );
  };

  deleteArtikal(id) {
    return this.dao.run(`DELETE FROM artikli WHERE id = ? `, [id]);
  }

  async getAllArtikli(pageSize, pageNumber) {
    const offset = (pageNumber - 1) * pageSize;
    const countResult = await this.dao.all(
      `SELECT COUNT(*) as count FROM artikli`
    );

    const artikli = await this.dao.all(
      `SELECT * FROM artikli LIMIT ? OFFSET ? `,
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
      OFFSET ? `,
      [startDate, endDate, pageSize, offset]
    );

    return {
      result,
      count: countResult[0].count,
    };
  }

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
        `DELETE FROM narudzbine_artikli WHERE rowid IN(
      SELECT rowid FROM narudzbine_artikli WHERE id = ? AND artikal_id = ? AND narudzbina_id = ?
          )`,
        [artikli[i].narudzbina_artikal_id, artikli[i].artikal_id, artikli[i].narudzbina_id]
      );
      await this.dao.run(
        "INSERT INTO naplacene_narudzbine_artikli (naplacena_narudzbina_id , artikal_id) VALUES (?, ?)",
        [narudzbina.id, artikli[i].artikal_id]
      );

    }
    const narudzbineNaStolu = await this.dao.all(
      `SELECT
      *
        FROM
      narudzbine
        WHERE
      stol_id = ? 
      `,
      [stolId]
    );

    for (const narudzbina of narudzbineNaStolu) {
      const artikliNarudzbine = await this.dao.all(
        `SELECT
      *
      FROM
        narudzbine_artikli
        WHERE
        narudzbina_id = ? 
        `,
        [narudzbina.id]
      );

      if (artikliNarudzbine.length == 0) {
        await this.dao.run(
          `DELETE FROM narudzbine WHERE id = ? `,
          [narudzbina.id]
        );
      }
    }
    smalltalk
      .alert('', 'Porudzbina se stampa!')
      .then(() => {
        console.log('ok');
      });

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
      smalltalk
        .alert('', 'Porudzbina se stampa!')
        .then(() => {
          console.log('ok');
        });

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
        `DELETE FROM narudzbine_artikli WHERE rowid IN(
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
    FROM(
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
      FROM(
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

  getStanje = async () => {
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
        `
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
          JOIN storno_narudzbine sn ON na.storno_narudzbina_id = sn.id`
    );

    const groupedNaplacene = groupBy(naplaceneNarudzbine, "artikal_id");
    const groupedStorno = groupBy(storniraneNarudzbine, "artikal_id");
    const ukupnaCenaNaplacene = await this.dao.all(
      `
      SELECT
      SUM(a.cena) as ukupna_cena
      FROM
            naplacene_narudzbine_artikli na
            JOIN artikli a ON na.artikal_id = a.id
            JOIN naplacene_narudzbine nn ON na.naplacena_narudzbina_id = nn.id
      `
    )
    const ukupnoStorno = await this.dao.all(
      `
      SELECT
      SUM(a.cena) as ukupna_cena
      FROM
            storno_narudzbine_artikli na
            JOIN artikli a ON na.artikal_id = a.id
            JOIN storno_narudzbine sn ON na.storno_narudzbina_id = sn.id
      `
    )

    return {
      naplaceno: {
        artikli: groupedNaplacene,
        ukupnaCena: ukupnaCenaNaplacene[0].ukupna_cena,
      },
      stornirano: {
        artikli: groupedStorno,
        ukupnaCena: ukupnoStorno[0].ukupna_cena,
      },
    };
  };


  getPresekStanja = async () => {
    // get all naplaceni artikli and all storno artikli for today with dayjs

    const narudzbineArtikli = await this.dao.all(
      `
        SELECT * FROM narudzbine_artikli
        LIMIT 5
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
          JOIN naplacene_narudzbine nn ON na.naplacena_narudzbina_id = nn.id`
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
          JOIN storno_narudzbine sn ON na.storno_narudzbina_id = sn.id`
    );

    printDnevni(naplaceneNarudzbine, storniraneNarudzbine, true);
  }

  getDnevniIzvestaj = async () => {
    // get all naplaceni artikli and all storno artikli for today with dayjs

    const narudzbineArtikli = await this.dao.all(
      `
        SELECT * FROM narudzbine_artikli
        LIMIT 5
      `
    );

    if (narudzbineArtikli.length) {
      smalltalk
        .alert('Greska', 'Nisu naplaceni svi stolovi!')
        .then(() => {
          console.log('ok');
        });
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
          JOIN naplacene_narudzbine nn ON na.naplacena_narudzbina_id = nn.id`
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
          JOIN storno_narudzbine sn ON na.storno_narudzbina_id = sn.id`
    );

    const deleteNaplacene = await this.dao.all(`
      DELETE FROM naplacene_narudzbine
    `);
    const deleteNaplaceneArtikli = await this.dao.all(`
      DELETE FROM naplacene_narudzbine_artikli
    `);
    const deleteStorno = await this.dao.all(`
      DELETE FROM storno_narudzbine
    `);
    const deleteStornoArtikli = await this.dao.all(`
      DELETE FROM storno_narudzbine_artikli
    `);

    printDnevni(naplaceneNarudzbine, storniraneNarudzbine);
  };
}

export default Crud;
