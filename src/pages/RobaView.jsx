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
  TableFooter,
  TablePagination,
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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [artikliCount, setArtikliCount] = useState(0);

  useEffect(() => {
    Promise.all([
      db.getArtikalById(1, rowsPerPage, page),
      db.getTipProizvoda(),
    ]).then((res) => {
      handleChange({ target: { value: 1 } });
      setArtikliToShow(res[0].artikli);
      setArtikliCount(res[0].count);
      setTipoviProizvoda(res[1]);
    });
  }, []);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);

    if (artikalId) {
      db.getArtikalById(
        artikalId,
        parseInt(event.target.value, 10),
        0,
        true
      ).then((res) => {
        setArtikliToShow(res.artikli);
        setArtikliCount(res.count);
      });
      return;
    }

    db.getAllArtikli(parseInt(event.target.value, 10), 0).then((res) => {
      setArtikliToShow(res.artikli);
      setArtikliCount(res.count);
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);

    if (artikalId) {
      db.getArtikalById(artikalId, rowsPerPage, newPage + 1, true).then(
        (res) => {
          setArtikliToShow(res.artikli);
        }
      );
      return;
    }

    db.getAllArtikli(rowsPerPage, newPage + 1).then((res) => {
      setArtikliToShow(res.artikli);
      setArtikliCount(res.count);
    });
  };

  const handleChange = (event) => {
    setArtikalId(event.target.value);
    setRowsPerPage(10);
    setPage(0);
    if (!event.target.value) {
      db.getAllArtikli(10, 0).then((res) => {
        setArtikliToShow(res.artikli);
        setArtikliCount(res.count);
      });
    } else {
      db.getArtikalById(event.target.value, 10, 1, true).then((res) => {
        setArtikliToShow(res.artikli);
        setArtikliCount(res.count);
      });
    }
  };

  return (
    <div>
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
                db.getArtikalById(
                  selectedArtikal.tipProizvoda_id,
                  rowsPerPage,
                  page
                ).then((res) => {
                  setArtikliToShow(res.artikli);
                  setArtikliCount(res.count);
                  handleChange({
                    target: { value: selectedArtikal.tipProizvoda_id },
                  });
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
                <TableCell align="center">{artikal.id}</TableCell>
                <TableCell align="center">{artikal.name}</TableCell>
                <TableCell align="center">
                  {artikal.tipProizvoda_id == 3 ? "Jelo" : artikal.kolicina}
                </TableCell>
                <TableCell align="center">
                  {artikal.cena || "Artikal nema cenu"}
                </TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    color="info"
                    style={{ marginRight: "1rem" }}
                    variant="contained"
                    onClick={() => {
                      setSelectedArtikal(artikal);
                      navigate(`/izmena-artikla/${artikal.id}`);
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
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 20, 40]}
                colSpan={5}
                count={artikliCount}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "Rekorda po stranici",
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    </div>
  );
}

const styles = {
  dugmici: {
    margin: "auto",
    display: "flex",
    justifyContent: "center",
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
