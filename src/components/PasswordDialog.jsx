import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { db } from "../services/dataservice";
const { useNavigate } = require("react-router-dom");

export default function PasswordDialog(props) {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    console.log(props.type);
    if (password == "0407") {
      props.setOpenModal(false);
      if (props.type == "dnevni-izvestaj") {
        db.getDnevniIzvestaj().then(() => {
          alert("Dnevni izvestaj se stampa");
          props.setOpen(false);
        });
      } else if (props.type == "izvestaji") {
        navigate("/izvestaji");
        props.setOpen(false);
      } else if (props.type == "sto-izvestaj") {
        navigate(props.type);
      }
    } else {
      alert("Pogresna sifra");
    }
  };

  return (
    <>
      <Dialog
        open={props.open}
        onClose={() => {
          props.setOpenModal(false);
        }}
      >
        <DialogTitle>Izvestaji</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="password"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              props.setOpenModal(false);
            }}
          >
            Nazad
          </Button>
          <Button onClick={handleNext}>Ok</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
