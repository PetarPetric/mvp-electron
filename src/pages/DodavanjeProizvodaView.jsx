import React, { useEffect, useState } from "react";
import { db } from "../services/dataservice";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Alert from "@mui/material/Alert";
import { Field, Form } from "react-final-form";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  AppBar,
  InputLabel,
  Toolbar,
  Typography,
  AlertTitle,
  Button,
  IconButton,
} from "@mui/material";

const DodavanjeStanja = () => {
  const [artikli, setArtikli] = useState([]);
  const [izabranArtikal, setIzabranArtikal] = useState("");
  const [kolicinaProizvoda, setKolicinaProizvoda] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    db.getArtikalExceptFood().then((res) => {
      setArtikli(res);
    });
  }, []);

  const onSubmit = async () => {
    await db.addKolicina(izabranArtikal, kolicinaProizvoda).then(() => {
      setOpen(true);
    });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleBackClick = () => {
    navigate("/roba");
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" onClick={handleBackClick}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Dodavanje robe na stanje</Typography>
        </Toolbar>
      </AppBar>
      {open && (
        <Alert severity="success" open={open} onClose={handleClose}>
          <AlertTitle>Uspesno dodat proizvod</AlertTitle>
          Proizvod je uspesno dodat u bazu podataka
        </Alert>
      )}
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, form }) => (
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "20px",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e).then(() => {
                form.reset();
              });
            }}
          >
            <FormControl
              fullWidth
              style={{ width: "30%", marginBottom: "20px" }}
            >
              <InputLabel>Izaberi proizvod</InputLabel>
              <Field name="izabranArtikal">
                {({ input }) => (
                  <Select
                    {...input}
                    label="izabran-artikal"
                    value={izabranArtikal}
                    onChange={(event) => {
                      input.onChange(event);
                      setIzabranArtikal(event.target.value);
                    }}
                  >
                    {artikli.map((artikal) => (
                      <MenuItem key={artikal.id} value={artikal.id}>
                        {artikal.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </Field>
            </FormControl>

            <Field name="kolicinaProizvoda">
              {({ input }) => (
                <TextField
                  style={{ width: "30%", marginBottom: "20px" }}
                  {...input}
                  label="Kolicina"
                  type="number"
                  fullWidth
                  onChange={(event) => {
                    input.onChange(event);
                    setKolicinaProizvoda(event.target.value);
                  }}
                />
              )}
            </Field>

            <Button variant="contained" color="primary" type="submit">
              Dodaj
            </Button>
          </form>
        )}
      />
    </>
  );
};

export default DodavanjeStanja;
