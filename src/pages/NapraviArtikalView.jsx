import React, { useEffect, useState } from "react";
import { db } from "../services/dataservice";
import { useNavigate, useParams } from "react-router-dom";
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
import smalltalk from "smalltalk";


function NapraviArtikalView() {
  const [tipoviProizvoda, setTipoviProizvoda] = useState([]);
  const [tipProizvoda, setTipProizvoda] = useState("");
  const [sastojciZaProizvod, setSastojciZaProizvod] = useState([]);
  const [dostupniSastojci, setDostupniSastojci] = useState([]);
  const [cena, setCena] = useState(null);
  const [ime, setIme] = useState("");
  const [kolicina, setKolicina] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    async function fetchData() {
      const tipProizvoda = await db.getTipProizvoda();
      setTipoviProizvoda(tipProizvoda);
      if (params.id) {
        const res = await db.getSingleArtikalById(params.id);
        setSastojciZaProizvod(res.subArtikli);
        setTipProizvoda(res.tipProizvoda_id);
        setIme(res.name);
        setCena(res.cena);
        setKolicina(res.kolicina);
        if (res.tipProizvoda_id === 3) {
          try {
            const sastojci = await db.getArtikalById(2);
            setDostupniSastojci(sastojci.artikli);
          } catch (e) {
            console.error(e);
          }
        }
        if (res.tipProizvoda_id === 4) {
          try {
            const sastojci = await db.getArtikalById(5);
            setDostupniSastojci(sastojci.artikli);
          } catch (e) {
            console.error(e);
          }
        }
      }
    }

    fetchData();
  }, []);


  const handleBackClick = () => {
    navigate("/roba");
  };

  const handleChange = (event) => {
    setTipProizvoda(event.target.value);
    if (event.target.value === 3) {
      db.getArtikalById(2)
        .then((res) => {
          setDostupniSastojci(res.artikli);
        })
        .catch((e) => {
          console.error(e);
        });
    }
    if (event.target.value === 4) {
      db.getArtikalById(5)
        .then((res) => {
          setDostupniSastojci(res.artikli);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };

  const onSubmit = async (values) => {
    if (params.id) {
      await db
        .updateSingleArtikal(
          params.id,
          values.imeProizvoda,
          values.tipProizvoda,
          values.tipProizvoda == 2 || values.tipProizvoda == 5
            ? null
            : values.cena,
          sastojciZaProizvod,
          kolicina
        )
        .then(() => {
          setOpen(true);
        })
        .catch((err) => {
          smalltalk
            .alert('Greska', JSON.stringify(err))
            .then(() => {
            });
        });
      return;
    }
    await db
      .addArtikal(
        values.imeProizvoda,
        values.tipProizvoda,
        values.cena,
        sastojciZaProizvod
      )
      .then(() => {
        setOpen(true);
      })
      .catch((err) => {
        smalltalk
          .alert('Greska', JSON.stringify(err))
          .then(() => {
          });
      });
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
      tipProizvoda == 3 ||
      tipProizvoda == 4 ||
      (tipProizvoda == 1 && !values.cena)
    ) {
      errors.cena = "Cena je obavezna";
    }
    return errors;
  };

  const dodajSastojak = () => {
    setSastojciZaProizvod([
      ...sastojciZaProizvod,
      {
        name: "",
        kolicina: 0,
        artikal_id: "",
      },
    ]);
  };

  const handleChangeSastojak = (value, index) => {
    const newSastojci = [...sastojciZaProizvod];
    newSastojci[index].name = dostupniSastojci.find(
      (sastojak) => sastojak.id === value
    ).name;
    newSastojci[index].artikal_id = value;
    newSastojci[index].id = value;
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
          {!params.id ? (
            <AlertTitle>Uspesno dodat proizvod</AlertTitle>
          ) : (
            <AlertTitle>Uspesno izmenjen proizvod</AlertTitle>
          )}
        </Alert>
      )}
      <Form
        onSubmit={onSubmit}
        validate={validate}
        initialValues={{
          imeProizvoda: ime,
          tipProizvoda: tipProizvoda,
          cena: cena,
        }}
        render={({ handleSubmit, values, form, submitting }) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (tipProizvoda == 3 || tipProizvoda == 4) {
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
                <FormControl
                  disabled={!!params.id}
                  style={{ marginBottom: "20px", width: "30%" }}
                >
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
                      <MenuItem key={proizvod.id} value={proizvod.id}>
                        {proizvod.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Field>
            {tipProizvoda === 3 || tipProizvoda === 4 ? (
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
                          value={sastojak.artikal_id}
                          onChange={(event) => {
                            handleChangeSastojak(event.target.value, index)
                          }
                          }
                          placeholder="Sastojak"
                        >
                          {dostupniSastojci.map((dostupanSastojak) => (
                            <MenuItem key={dostupanSastojak.id} value={dostupanSastojak.id}>
                              {dostupanSastojak.name}
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
            {tipProizvoda == 3 || tipProizvoda == 4 || tipProizvoda == 1 ? (
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
            {tipProizvoda != 3 && tipProizvoda != 4 && params.id ? (
              <Field name="kolicina">
                {({ input, meta }) => (
                  <FormControl style={{ width: "30%", marginBottom: "20px" }}>
                    <InputLabel>Količina</InputLabel>
                    <Input
                      {...input}
                      value={kolicina}
                      error={!!meta.touched && !!meta.error}
                      onChange={(event) => {
                        input.onChange(event);
                        setKolicina(event.target.value);
                      }}
                      type="number"
                      placeholder="Količina"
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
              {params.id ? "Izmeni" : "Dodaj"}
            </Button>
          </form>
        )}
      />
    </>
  );
}

export default NapraviArtikalView;
