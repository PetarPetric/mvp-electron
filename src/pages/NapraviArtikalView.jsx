import React, { useEffect, useState } from "react";
import { db } from "../services/dataservice";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
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
  Input,
  Typography,
  AlertTitle,
  Button,
  IconButton,
} from "@mui/material";

function NapraviArtikalView() {
  const [tipoviProizvoda, setTipoviProizvoda] = useState([]);
  const [tipProizvoda, setTipProizvoda] = useState("");
  const [sastojciZaProizvod, setSastojciZaProizvod] = useState([]);
  const [dostupniSastojci, setDostupniSastojci] = useState([]);
  const [cena, setCena] = useState(0);
  const [ime, setIme] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/roba");
  };

  const handleChange = (event) => {
    setTipProizvoda(event.target.value);
    console.log(event.target.value);
    if (event.target.value.id === 3) {
      db.getArtikalById(2)
        .then((res) => {
          setDostupniSastojci(res);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    if (event.target.value.id === 4) {
      db.getArtikalById(5)
        .then((res) => {
          setDostupniSastojci(res);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const onSubmit = async (values) => {
    await db
      .addArtikal(
        values.imeProizvoda,
        values.tipProizvoda.id,
        values.cena,
        sastojciZaProizvod
      )
      .then((res) => {
        console.log(res);
        setOpen(true);
      })
      .catch((err) => {
        alert(JSON.stringify(err));
      });

    console.log(values);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const validate = (values) => {
    const errors = {};
    if (!values.imeProizvoda) {
      errors.imeProizvoda = "Ime proizvoda je obavezno";
    }
    if (!values.tipProizvoda) {
      errors.tipProizvoda = "Tip proizvoda je obavezan";
    }
    if (
      tipProizvoda.id == 3 ||
      tipProizvoda.id == 4 ||
      (tipProizvoda.id == 1 && !values.cena)
    ) {
      errors.cena = "Cena je obavezna";
    }
    return errors;
  };

  useEffect(() => {
    db.getTipProizvoda().then((res) => {
      setTipoviProizvoda(res);
    });
  }, []);

  const dodajSastojak = () => {
    setSastojciZaProizvod([
      ...sastojciZaProizvod,
      {
        ime: "",
        kolicina: 0,
      },
    ]);
  };

  const handleChangeSastojak = (value, index) => {
    const newSastojci = [...sastojciZaProizvod];
    newSastojci[index].ime = value;
    setSastojciZaProizvod(newSastojci);
  };

  const handleChangeKolicina = (value, index) => {
    const newSastojci = [...sastojciZaProizvod];
    newSastojci[index].kolicina = value;
    setSastojciZaProizvod(newSastojci);
  };

  const removeSastojak = (index) => {
    setSastojciZaProizvod(sastojciZaProizvod.filter((_, i) => i !== index));
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" onClick={handleBackClick}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Napravi Artikal</Typography>
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
        validate={validate}
        render={({ handleSubmit, values, form, submitting }) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (tipProizvoda.id == 3 || tipProizvoda.id == 4) {
                onSubmit(values);
                navigate("/roba");
              } else {
                handleSubmit(values).then(() => {
                  form.reset();
                });
              }
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "20px",
            }}
          >
            <Field name="imeProizvoda">
              {({ input, meta }) => (
                <TextField
                  {...input}
                  label="Ime Proizvoda"
                  variant="standard"
                  onChange={(e) => {
                    input.onChange(e);
                    setIme(e.target.value);
                  }}
                  error={!!meta.touched && !!meta.error}
                  style={{ marginBottom: "20px", width: "30%" }}
                />
              )}
            </Field>
            <Field name="tipProizvoda">
              {({ input, meta }) => (
                <FormControl style={{ marginBottom: "20px", width: "30%" }}>
                  <InputLabel id="tipProizvoda-label">Tip Proizvoda</InputLabel>
                  <Select
                    {...input}
                    labelId="tipProizvoda-label"
                    id="tipProizvoda"
                    value={input.value}
                    onChange={(event) => {
                      input.onChange(event);
                      handleChange(event);
                    }}
                    label="Tip Proizvoda"
                    error={!!meta.touched && !!meta.error}
                  >
                    <MenuItem value="" disabled>
                      Tip Proizvoda
                    </MenuItem>
                    {tipoviProizvoda.map((proizvod) => (
                      <MenuItem key={proizvod.id} value={proizvod}>
                        {proizvod.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Field>
            {tipProizvoda.id === 3 || tipProizvoda.id === 4 ? (
              <div style={{ width: "30%", marginBottom: "20px" }}>
                <p>Dodaj sastojke</p>
                <FormControl className="dodavanje-sastojaka">
                  <Button
                    type="button"
                    style={{ marginBottom: "30%" }}
                    className="dodaj-sastojak"
                    onClick={() => dodajSastojak()}
                    color="primary"
                    variant="outlined"
                    size="small"
                  >
                    +
                  </Button>
                </FormControl>

                {sastojciZaProizvod.map((sastojak, index) => (
                  <div
                    key={index}
                    style={{
                      width: "100%",
                      marginBottom: "20px",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <FormControl style={{ marginBottom: "20px" }}>
                        <InputLabel>Sastojak</InputLabel>
                        <Select
                          label="Sastojak"
                          value={sastojak.ime}
                          onChange={(event) =>
                            handleChangeSastojak(event.target.value, index)
                          }
                          placeholder="Sastojak"
                        >
                          {dostupniSastojci.map((s) => (
                            <MenuItem key={s.id} value={s}>
                              {s.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl>
                        <InputLabel>Količina</InputLabel>
                        <Input
                          value={sastojak.kolicina}
                          onChange={(event) =>
                            handleChangeKolicina(event.target.value, index)
                          }
                          type="number"
                          placeholder="Količina"
                        />
                      </FormControl>
                    </div>
                    <Button
                      type="button"
                      className="dodaj-sastojak"
                      onClick={() => removeSastojak(index)}
                      color="secondary"
                      variant="outlined"
                      size="small"
                    >
                      <DeleteIcon />
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}
            {tipProizvoda.id == 3 ||
            tipProizvoda.id == 4 ||
            tipProizvoda.id == 1 ? (
              <Field name="cena">
                {({ input, meta }) => (
                  <FormControl style={{ width: "30%", marginBottom: "20px" }}>
                    <InputLabel>Cena</InputLabel>
                    <Input
                      {...input}
                      error={!!meta.touched && !!meta.error}
                      onChange={(event) => {
                        input.onChange(event);
                        setCena(event.target.value);
                      }}
                      type="number"
                      placeholder="Cena"
                    />
                  </FormControl>
                )}
              </Field>
            ) : null}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
            >
              Dodaj
            </Button>
          </form>
        )}
      />
    </>
  );
}

export default NapraviArtikalView;
