import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { db } from "../services/dataservice";
import { useNavigate, useLocation } from "react-router-dom";

export default function PasswordDialog(props) {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { state = {} } = useLocation();

  const handleNext = () => {
    if (password == "0407") {
      props.setOpenModal(false);
      if (props.type == "dnevni-izvestaj") {
        db.getDnevniIzvestaj().then(() => {
          props.setOpen(false);
        });
      } else if (props.type == "izvestaji") {
        navigate("/izvestaji");
        props.setOpen(false);
      } else if (props.type == "sto-izvestaj") {
        navigate("/izvestaji", { state: { table: state.table } });
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
          <input
            id="password"
            type={"password"}
            style={{ height: "45px", borderRadius: "5px", border: "1px solid #ccc", padding: "5px", margin: '10px 0' }}
            label="Sifra"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
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
