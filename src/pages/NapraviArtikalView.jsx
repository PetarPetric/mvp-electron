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
  const [cena, setCena] = useState(null);
  const [ime, setIme] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    async function fetchData() {
      const tipProizvoda = await db.getTipProizvoda();
      setTipoviProizvoda(tipProizvoda);
      if (params.id) {
        const res = await db.getSingleArtikalById(params.id);
        setTipProizvoda(res.tipProizvoda_id);
        setIme(res.name);
        setCena(res.cena);
      }
    }

    fetchData();
  }, []);


  const handleBackClick = () => {
    navigate("/roba");
  };

  const handleChange = (event) => {
    setTipProizvoda(event.target.value);
  };

  const onSubmit = async (values) => {
    if (params.id) {
      await db
        .updateSingleArtikal(
          params.id,
          values.imeProizvoda,
          values.tipProizvoda,
          values.cena,
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
      !values.cena
    ) {
      errors.cena = "Cena je obavezna";
    }
    return errors;
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
