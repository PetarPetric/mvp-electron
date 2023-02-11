import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  AppBar,
  InputLabel,
  Container,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";

function NapraviArtikalView() {
  const [tipoviProizvoda, setTipoviProizvoda] = useState([]);
  const [sastojciZaProizvod, setSastojciZaProizvod] = useState([]);
  const [sviSastojci, setSviSastojci] = useState([]);
  const [imeProizvoda, setImeProizvoda] = useState("");
  const [tipProizvoda, setTipProizvoda] = useState("");
  const [cenaProizvoda, setCenaProizvoda] = useState(0);

  useEffect(() => {}, []);

  const dodajSastojak = () => {
    setSastojciZaProizvod([
      ...sastojciZaProizvod,
      {
        ime: "",
        jedinica: "",
        kolicina: 0,
        expanded: false,
      },
    ]);
  };

  const removeSastojak = (index) => {
    setSastojciZaProizvod(sastojciZaProizvod.filter((_, i) => i !== index));
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Napravi Artikal</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <TextField
          label="Ime proizvoda"
          placeholder="Ime proizvoda"
          value={imeProizvoda}
          onChange={(event) => setImeProizvoda(event.target.value)}
        />
        <FormControl>
          <InputLabel id="tip-proizvoda">Tip proizvoda</InputLabel>
          <Select
            labelId="tip-proizvoda"
            value={tipProizvoda}
            onChange={handleTipProizvodaChange}
          >
            {tipoviProizvoda.map((proizvod) => (
              <MenuItem key={proizvod.id} value={proizvod.id}>
                {proizvod.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {tipProizvoda === 3 && (
          <>
            <FormControl>
              <InputLabel id="sastojak">Sastojak</InputLabel>
              <Select
                labelId="sastojak"
                value={selectedSastojak}
                onChange={handleSastojakChange}
              >
                {sviSastojci.values.map((sastojak) => (
                  <MenuItem key={sastojak.id} value={sastojak}>
                    {sastojak.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Količina"
              type="number"
              placeholder="Količina"
              value={selectedSastojakKolicina}
              onChange={(event) =>
                setSelectedSastojakKolicina(event.target.value)
              }
            />
            <Button variant="outlined" color="primary" onClick={addSastojak}>
              +
            </Button>
          </>
        )}
      </Container>
    </>
  );
}

export default NapraviArtikalView;
