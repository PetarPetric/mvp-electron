import React, { useEffect, useState } from "react";
import { db } from "../services/dataservice";
import { useNavigate } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";
import DodavanjeNaStoComponenta from "../components/DodavanjeProizvodaComponent";
import KucaniProizvodi from "../components/KucaniProizvodi";
import NaplataComponent from "../components/NaplatiComponent";
import StornoComponent from "../components/StornoComponent";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PaymentsIcon from "@mui/icons-material/Payments";
import Alert from "@mui/material/Alert";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import {
  AppBar,
  Toolbar,
  Typography,
  AlertTitle,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";
import "../styles/SingleAstalView.css";

function SingleAstal() {
  const [tipoviProizvoda, setTipoviProizvoda] = useState([]);
  const [open, setOpen] = useState(false);
  const [actionValue, setActionValue] = useState(2);
  const navigate = useNavigate();
  const params = useParams();
  const { state } = useLocation();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleBackClick = () => {
    navigate("/");
  };

  useEffect(() => {
    db.getTipProizvodaZaKucanje().then((res) => {
      setTipoviProizvoda(res);
    });
  }, []);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" onClick={handleBackClick}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Sto: {state.table.title} </Typography>
        </Toolbar>
      </AppBar>
      {open && (
        <Alert severity="success" open={open} onClose={handleClose}>
          <AlertTitle>Uspesno dodat proizvod</AlertTitle>
          Proizvod je uspesno dodat u bazu podataka
        </Alert>
      )}
      <div className="singleAstal-body-container">
        {actionValue === 1 ? (
          <DodavanjeNaStoComponenta
            tipoviProizvoda={tipoviProizvoda}
            setActionValue={setActionValue}
          />
        ) : null}
        {actionValue === 2 ? <KucaniProizvodi /> : null}
        {actionValue === 4 ? (
          <NaplataComponent setActionValue={setActionValue} />
        ) : null}
        {actionValue === 3 ? <StornoComponent /> : null}
      </div>
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}
        elevation={6}
      >
        <BottomNavigation
          showLabels
          onChange={(e, newValue) => {
            setActionValue(newValue);
            if (newValue === 0)
              navigate("/izvestaji", { state: { table: state.table } });
          }}
        >
          <BottomNavigationAction
            style={{ position: "absolute", left: 0, top: "10px" }}
            label="Istorija"
            icon={<MenuBookIcon />}
          />
          <BottomNavigationAction
            label="Dodaj"
            icon={<AddShoppingCartIcon />}
          />
          <BottomNavigationAction
            label="Kucani artikli"
            icon={<FormatListNumberedIcon />}
          />
          <BottomNavigationAction
            style={{ position: "absolute", right: 0, top: "10px" }}
            label="Storno"
            icon={<DeleteForeverIcon />}
          />
          <BottomNavigationAction label="Naplati" icon={<PaymentsIcon />} />
        </BottomNavigation>
      </Paper>
    </>
  );
}

export default SingleAstal;
