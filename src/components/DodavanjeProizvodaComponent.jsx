import React, { useEffect, useState } from "react";
import { db } from "../services/dataservice";
import { Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation } from "react-router-dom";
import {
  Card,
  Divider,
  List,
  ListItem,
  CardHeader,
  ListItemText,
} from "@mui/material";

export default function DodavanjeNaStoComponenta(props) {
  const [tipProizvoda, setTipProizvoda] = useState(null);
  const [proizvodi, setProizvodi] = useState([]);
  const [porudzbenicaList, setPorudzbenicaList] = useState([]);
  const [groupedPorudzbenicaList, setGroupedPorudzbenicaList] = useState({});
  const [disableButton, setDisableButton] = useState(false);
  const [description, setDescription] = useState("");
  const { state } = useLocation();

  const groupBy = (array, key) => {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      return result;
    }, {});
  };

  const deleteItem = (key) => {
    setPorudzbenicaList((prevList) =>
      prevList.filter((item) => item.id != key)
    );
    setGroupedPorudzbenicaList(
      groupBy(
        porudzbenicaList.filter((item) => item.id != key),
        "id"
      )
    );
  };

  return (
    <div className="dodavanje-proizvoda-container">
      <div className="articles-list">
        {tipProizvoda && (
          <div
            className="tipProizvoda"
            onClick={() => {
              setTipProizvoda(null);
              setProizvodi([]);
            }}
            style={{ color: "red", border: "1px solid red" }}
          >
            NAZAD
          </div>
        )}
        {!tipProizvoda
          ? props.tipoviProizvoda.map((tipProizvoda) => {
            return (
              <div
                key={tipProizvoda.id}
                className="tipProizvoda"
                onClick={() => {
                  setTipProizvoda(tipProizvoda);
                  db.getArtikalById(tipProizvoda.id).then((res) => {
                    setProizvodi(res.artikli);
                  });
                }}
              >
                {tipProizvoda.name}
              </div>
            );
          })
          : proizvodi.map((proizvod) => {
            return (
              <div
                onClick={() => {
                  setPorudzbenicaList((prevState) => {
                    const newState = [...prevState, proizvod];
                    setGroupedPorudzbenicaList(groupBy(newState, "id"));
                    return newState;
                  });
                }}
                className="proizvod"
                key={proizvod.id}
              >
                <div className="proizvodTitle">
                  {proizvod.name}
                </div>
                <div className="proizvodPrice">
                  {proizvod.cena}
                </div>
              </div>
            );
          })}
      </div>
      <div className="porudzbenica-container">
        <Card sx={{ margin: 2 }}>
          <CardHeader sx={{ padding: 2 }} title={"Izabrani artikli"} />
          <Divider />
          <List
            sx={{
              height: 450,
              bgcolor: "background.paper",
              overflow: "auto",
            }}
            dense
            component="div"
            role="list"
          >
            {Object.keys(groupedPorudzbenicaList).map((key, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${groupedPorudzbenicaList[key].length} x ${groupedPorudzbenicaList[key][0].name}`}
                />
                <IconButton
                  onClick={() => {
                    deleteItem(key);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Card>
        <div className="porudzbenica-total">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="napomena">Napomena</label>
            <input
              id="napomena"
              type={"text"}
              style={{ height: "45px", borderRadius: "5px", border: "1px solid #ccc", padding: "5px", margin: '10px 0' }}
              label="Napomena"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>
          <div>
            <p>Ukupno: {porudzbenicaList.length} proizvoda</p>
            <Button
              onClick={(event) => {
                event.currentTarget.disabled = true;
                db.napraviPorudzbinu(
                  state.table.id,
                  porudzbenicaList,
                  description
                ).then((res) => {
                  props.setActionValue(2);
                });
              }}
              variant="contained"
              disabled={!porudzbenicaList.length || disableButton}
            >
              NARUCI
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
