import React from "react";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../services/dataservice";
import {
  Card,
  Divider,
  List,
  ListItem,
  CardHeader,
  ListItemText,
  ListItemIcon,
  ListSubheader,
  Checkbox,
  Button,
  Box,
  Typography,
  Fade,
  Modal,
  Backdrop,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  // border: "1px solid #000",
  borderRadius: "6px",
  boxShadow: 2,
  p: 2,
};

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export default function NaplatiKomponenta(props) {
  const [checked, setChecked] = useState([]);
  const [narudzbineNaStolu, setNarudzbineNaStolu] = useState([]);
  const [groupedNarudzbineNaStolu, setGroupedNarudzbineNaStolu] = useState({});
  const [groupedById, setGroupedById] = useState({});
  const [ukupnaCena, setUkupnaCena] = useState(0);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { state } = useLocation();

  const groupBy = (array, key) => {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      return result;
    }, {});
  };

  useEffect(() => {
    db.getNarudzbineNaStolu(state.table.id).then((res) => {
      setNarudzbineNaStolu(res);
      const groupedByDate = groupBy(res, "created_at");
      setGroupedNarudzbineNaStolu(groupedByDate);
    });
  }, [state.table.id]);

  useEffect(() => {
    setUkupnaCena(
      checked.reduce((prevVal, currVal) => prevVal + currVal.cena, 0)
    );
  }, [checked]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  return (
    <>
      <Card sx={{ margin: 2, overflow: "auto", maxHeight: "70vh" }}>
        <CardHeader
          sx={{ px: 2, py: 1 }}
          avatar={
            <Checkbox
              onClick={handleToggleAll(narudzbineNaStolu)}
              checked={
                numberOfChecked(narudzbineNaStolu) ===
                narudzbineNaStolu.length && narudzbineNaStolu.length !== 0
              }
              indeterminate={
                numberOfChecked(narudzbineNaStolu) !==
                narudzbineNaStolu.length &&
                numberOfChecked(narudzbineNaStolu) !== 0
              }
              disabled={narudzbineNaStolu.length === 0}
              inputProps={{
                "aria-label": "all items selected",
              }}
            />
          }
          title={"Naplati"}
          subheader={`${numberOfChecked(narudzbineNaStolu)}/${narudzbineNaStolu.length
            } selected`}
        />
        <Divider />
        <List
          sx={{
            width: 400,
            height: 450,
            bgcolor: "background.paper",
            overflow: "auto",
          }}
          dense
          component="div"
          role="list"
          subheader={<li />}
        >
          {Object.keys(groupedNarudzbineNaStolu).map((key) => (
            <li key={key}>
              <ul style={{ margin: 0, padding: 0 }}>
                <ListSubheader>
                  Vreme: {dayjs(key).format("MMM DD hh:mm")}
                </ListSubheader>
                {groupedNarudzbineNaStolu[key].map((artikal, index) => (
                  <ListItem
                    key={index}
                    role="listitem"
                    button
                    onClick={handleToggle(artikal)}
                  >
                    <ListItemIcon>
                      <Checkbox
                        checked={checked.indexOf(artikal) !== -1}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText primary={`1 x ${artikal.name}`} />
                  </ListItem>
                ))}
              </ul>
            </li>
          ))}
        </List>
        <Divider />
      </Card>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Predracun
            </Typography>
            <List
              sx={{
                width: 400,
                maxHeight: 450,
                bgcolor: "background.paper",
                overflow: "auto",
              }}
              dense
              component="div"
              role="list"
              subheader={<li />}
            >
              {Object.keys(groupedById).map((key, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${groupedById[key].length} x ${groupedById[key][0].name}`}
                  />
                </ListItem>
              ))}
            </List>
            <h4>Ukupno: {ukupnaCena}</h4>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Button
                variant="contained"
                onClick={handleClose}
                disabled={!ukupnaCena}
                style={{ height: "35px" }}
              >
                Nazad
              </Button>
              <Button
                variant="contained"
                onClick={(e) => {
                  db.naplatiPorudzbinu(
                    state.table.id,
                    ukupnaCena,
                    checked
                  ).then((res) => {
                    alert("Uspesno ste naplatili proizvode!");
                    props.setActionValue(2);
                  });
                }}
                disabled={!ukupnaCena}
                style={{ height: "35px" }}
              >
                Naplati
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 10px",
        }}
      >
        <h4>Ukupno: {ukupnaCena}</h4>
        <Button
          variant="contained"
          onClick={(e) => {
            setGroupedById(groupBy(checked, "artikal_id"));
            handleOpen();
          }}
          disabled={!ukupnaCena}
          style={{ height: "35px" }}
        >
          Naplati
        </Button>
      </div>
    </>
  );
}
