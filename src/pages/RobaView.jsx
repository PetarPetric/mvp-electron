import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  Box,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function RobaView() {
  const navigate = useNavigate();
  const [artikalId, setArtikalId] = useState("");

  useEffect(() => {
    console.log("first load");
  }, []);

  const handleChange = (event) => {
    setArtikalId(event.target.value);
  };

  return (
    <>
      <div style={styles.dugmici}>
        <Button
          variant="contained"
          onClick={() => {
            navigate("/dodavanje-proizvoda");
          }}
        >
          Dodaj robu na stanje
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            navigate("/napravi-artikal");
          }}
        >
          Napravi artikal
        </Button>
      </div>
      <Paper style={styles.tabelaRobe}>
        <Box sx={{ maxWidth: 200 }}>
          <FormControl fullWidth>
            <InputLabel id="izbor tabele">Prikazi vrstu robe</InputLabel>
            <Select
              labelId="izbor-tabele"
              id="demo-simple-select"
              value={artikalId}
              label="Izbor proizvoda"
              onChange={(e) => {
                handleChange(e);
              }}
            >
              <MenuItem value={1}>Prikazi komadno</MenuItem>
              <MenuItem value={2}>Prikazi robu na kilo</MenuItem>
              <MenuItem value={3}>Prikazi hranu</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Ime</TableCell>
              <TableCell align="center">Cena</TableCell>
              <TableCell align="center">Kolicina</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center">Ime</TableCell>
              <TableCell align="center">Cena</TableCell>
              <TableCell align="center">Kolicina</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}

const styles = {
  dugmici: {
    width: "50%",
    margin: "auto",
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "1rem",
  },
  tabelaRobe: {
    width: "80%",
    margin: "auto",
    position: "relative",
    padding: "2rem",
    marginTop: "2rem",
  },
};

export default RobaView;

// name: "RobaView",
// components: {
// IonPage,
// IonContent,
// IonButton,
// IonItem,
// IonRow,
// IonCol,
// IonGrid,
// IonSelect,
// IonSelectOption,
// napraviArtikal,
// dodavanjeProizvoda,
// },
// setup() {
// const router = useRouter();
// const isModalOpen = ref(false);
// const tipDodavanja = ref("");
// const proizvodi = ref<any>([]);
// const artikalId = ref(1);
//
// const komadnoIlikilo = computed(() => {
// if (artikalId.value === 1) {
// return "kom";
// } else if (artikalId.value === 2) {
// return "g";
// } else {
// return "";
// }
// });
//
// onBeforeMount(async () => {
// proizvodi.value = await getArtikalById(artikalId.value);
// });
//
// const showArtikal = async (id: number) => {
// proizvodi.value = await getArtikalById(id);
// };
//
// const openModal = (arg: string) => {
// isModalOpen.value = true;
// tipDodavanja.value = arg;
// };
//
// const presentToast = async () => {
// const toast = await toastController.create({
// message: "Proizvod uspesno dodat!",
// duration: 1500,
// position: "top",
// });
//
// await toast.present();
// };
//
// const closeModal = () => {
// tipDodavanja.value = "";
// isModalOpen.value = false;
// };
//
// const dodatProizvod = async () => {
// isModalOpen.value = false;
// tipDodavanja.value = "";
// await presentToast();
// artikalId.value = 1;
// proizvodi.value = await getArtikalById(artikalId.value);
// };
//
// return {
// router,
// isModalOpen,
// openModal,
// tipDodavanja,
// dodatProizvod,
// showArtikal,
// proizvodi,
// artikalId,
// komadnoIlikilo,
// closeModal,
// };
// },
{
  /* }); */
}
{
  /* </script> */
}
