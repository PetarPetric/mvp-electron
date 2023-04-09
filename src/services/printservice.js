import dayjs from "dayjs";
const { ipcRenderer } = window.require("electron");

const groupBy = (array, key) => {
  return array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    return result;
  }, {});
};

function printRacun(groupedArticles, narudzbinaInfo, stolId) {
  const data = [
    {
      type: "text",
      value: "Naplata",
      style: {
        fontWeight: "600",
        textAlign: "center",
        fontSize: "16px",
        marginBottom: "5px",
      },
    },
    {
      type: "text",
      value: `Vreme: ${dayjs(narudzbinaInfo[0].created_at).format(
        "DD MMM YYYY HH:mm"
      )}`,
      style: {
        fontWeight: "600",
        textAlign: "left",
        fontSize: "14px",
        marginBottom: "5px",
      },
    },
    {
      type: "text",
      value: "Sto: " + stolId,
      style: {
        fontWeight: "600",
        textAlign: "center",
        fontSize: "16px",
        marginBottom: "5px",
      },
    },
    ...Object.keys(groupedArticles).map((key) => {
      return {
        type: "text",
        value: `${groupedArticles[key].length} x ${
          groupedArticles[key][0].name
        } - ${groupedArticles[key][0].cena * groupedArticles[key].length}`,
        style: {
          fontWeight: "500",
          textAlign: "left",
          fontSize: "14px",
          marginBottom: "5px",
        },
      };
    }),
    {
      type: "text",
      value: "Cena ukupno: " + narudzbinaInfo[0].ukupna_cena,
      style: {
        fontWeight: "600",
        textAlign: "left",
        fontSize: "16px",
        marginBottom: "5px",
      },
    },
  ];

  ipcRenderer.send("printRacun", JSON.stringify(data));
}

function printPorudzbinu(artikli, narudzbinaInfo, stolId) {
  const groupedArticles = groupBy(artikli, "id");

  const data = [
    {
      type: "text",
      value: "PORUDZBINA",
      style: {
        fontWeight: "600",
        textAlign: "center",
        fontSize: "16px",
        marginBottom: "5px",
      },
    },
    {
      type: "text",
      value: `Vreme: ${dayjs(narudzbinaInfo[0].created_at).format(
        "DD MMM YYYY HH:mm"
      )}`,
      style: {
        fontWeight: "600",
        textAlign: "left",
        fontSize: "14px",
        marginBottom: "5px",
      },
    },
    {
      type: "text",
      value: "Sto: " + stolId,
      style: {
        fontWeight: "600",
        textAlign: "center",
        fontSize: "16px",
        marginBottom: "5px",
      },
    },
    ...Object.keys(groupedArticles).map((key) => {
      return {
        type: "text",
        value: `${groupedArticles[key].length} x ${
          groupedArticles[key][0].name
        } - ${groupedArticles[key][0].cena * groupedArticles[key].length}`,
        style: {
          fontWeight: "500",
          textAlign: "left",
          fontSize: "14px",
          marginBottom: "5px",
        },
      };
    }),
    {
      type: "text",
      value:
        "Cena ukupno: " + artikli.reduce((acc, curr) => acc + curr.cena, 0),
      style: {
        fontWeight: "600",
        textAlign: "left",
        fontSize: "16px",
        marginBottom: "5px",
      },
    },
    {
      type: "text",
      value: "Napomena: " + narudzbinaInfo[0].description,
      style: {
        fontWeight: "600",
        textAlign: "left",
        fontSize: "16px",
        marginBottom: "5px",
      },
    },
  ];
  ipcRenderer.send("printPorudzbinu", JSON.stringify(data));
}

function printStorno(groupedArticles, narudzbinaInfo, stolId) {
  const data = [
    {
      type: "text",
      value: "STORNO",
      style: {
        fontWeight: "600",
        textAlign: "center",
        fontSize: "16px",
        marginBottom: "5px",
      },
    },
    {
      type: "text",
      value: `Vreme: ${dayjs(narudzbinaInfo[0].created_at).format(
        "DD MMM YYYY HH:mm"
      )}`,
      style: {
        fontWeight: "600",
        textAlign: "left",
        fontSize: "14px",
        marginBottom: "5px",
      },
    },
    {
      type: "text",
      value: "Sto: " + stolId,
      style: {
        fontWeight: "600",
        textAlign: "center",
        fontSize: "16px",
        marginBottom: "5px",
      },
    },
    ...Object.keys(groupedArticles).map((key) => {
      return {
        type: "text",
        value: `${groupedArticles[key].length} x ${
          groupedArticles[key][0].name
        } - ${groupedArticles[key][0].cena * groupedArticles[key].length}`,
        style: {
          fontWeight: "500",
          textAlign: "left",
          fontSize: "14px",
          marginBottom: "5px",
        },
      };
    }),
    {
      type: "text",
      value: "Razlog: " + narudzbinaInfo[0].description,
      style: {
        fontWeight: "600",
        textAlign: "left",
        fontSize: "16px",
        marginBottom: "5px",
      },
    },
  ];
  ipcRenderer.send("printStorno", JSON.stringify(data));
}

export { printPorudzbinu, printRacun, printStorno, groupBy };
