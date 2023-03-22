import React, { useState, useEffect } from "react";
import { db } from "../services/dataservice";
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
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function RobaView() {
  const navigate = useNavigate();
  const [artikalId, setArtikalId] = useState("");
  const [artikliToShow, setArtikliToShow] = useState([]);
  const [tipoviProizvoda, setTipoviProizvoda] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedArtikal, setSelectedArtikal] = useState("");

  useEffect(() => {
    Promise.all([db.getAllArtikli(), db.getTipProizvoda()]).then((res) => {
      setArtikliToShow(res[0]);
      setTipoviProizvoda(res[1]);
    });
  }, []);

  const handleChange = (event) => {
    setArtikalId(event.target.value);
    db.getArtikalById(event.target.value).then((res) => {
      setArtikliToShow(res);
    });
  };

  return (
    <>
      <Dialog
        onClose={() => {
          setOpen(false);
        }}
        open={open}
      >
        <DialogTitle>Brisanje artikla</DialogTitle>
        <DialogContent>
          Da li ste sigurni da zelite da obrisete artikal?
        </DialogContent>
        <DialogActions>
          <Button
            color="info"
            onClick={() => {
              setOpen(false);
            }}
          >
            Ne
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              db.deleteArtikal(selectedArtikal.id).then(() => {
                db.getAllArtikli().then((res) => {
                  setArtikliToShow(res);
                });
                setOpen(false);
              });
            }}
          >
            Da
          </Button>
        </DialogActions>
      </Dialog>
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
              id="izbor-tabele"
              value={artikalId}
              label="Prikazi vrstu robe"
              onChange={(e) => {
                handleChange(e);
              }}
            >
              {tipoviProizvoda.map((tipProizvoda) => (
                <MenuItem value={tipProizvoda.id} key={tipProizvoda.id}>
                  {tipProizvoda.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">No.</TableCell>
              <TableCell align="center">Ime</TableCell>
              <TableCell align="center">Kolicina</TableCell>
              <TableCell align="center">Cena</TableCell>
              <TableCell align="center">Opcije</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {artikliToShow.map((artikal, index) => (
              <TableRow key={artikal.id}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{artikal.name}</TableCell>
                <TableCell align="center">
                  {artikal.tipProizvoda_id == 3 ? "Jelo" : artikal.kolicina}
                </TableCell>
                <TableCell align="center">
                  {artikal.cena || "Sastojak nema cenu"}
                </TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    color="info"
                    style={{ marginRight: "1rem" }}
                    variant="contained"
                    onClick={() => {
                      setSelectedArtikal(artikal);
                      navigate(`/izmena-proizvoda/${artikal.id}`);
                    }}
                  >
                    <EditIcon style={{ width: "20px" }} />
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => {
                      setSelectedArtikal(artikal);
                      setOpen(true);
                    }}
                  >
                    <DeleteIcon style={{ width: "20px" }} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
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
