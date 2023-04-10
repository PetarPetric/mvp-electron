import React, { useState, useEffect } from "react";
import { db } from "../services/dataservice";
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  Box,
  FormControl,
  AppBar,
  Toolbar,
  Typography,
  TableFooter,
  TablePagination,
  IconButton,
  Collapse,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useLocation, useNavigate } from "react-router-dom";
import { groupBy } from "../services/printservice";

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {row.status}
        </TableCell>
        <TableCell align="center">{row.description}</TableCell>
        <TableCell align="center">
          <b>{dayjs(row.created_at).format("DD MMM YYYY HH:mm ")}</b>
        </TableCell>
        <TableCell align="center">{row.ukupna_cena}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Artikli
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Ime</TableCell>
                    <TableCell>Kolicina</TableCell>
                    <TableCell>Cena</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(groupBy(row.artikli, "artikal_id")).map(
                    (artikal, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {groupBy(row.artikli, "artikal_id")[artikal][0].name}
                        </TableCell>
                        <TableCell>
                          x {groupBy(row.artikli, "artikal_id")[artikal].length}
                        </TableCell>
                        <TableCell>
                          {groupBy(row.artikli, "artikal_id")[artikal][0].cena *
                            groupBy(row.artikli, "artikal_id")[artikal].length}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function RobaView() {
  const [artikliToShow, setArtikliToShow] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().subtract(1, "day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [artikliCount, setArtikliCount] = useState(0);
  const { state = {} } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const startDateFormated =
      dayjs(startDate).format("YYYY-MM-DD") + " 00:00:00";
    const endDateFormated = dayjs(endDate).format("YYYY-MM-DD") + " 23:59:59";
    if (state?.table) {
      db.getNaplaceneIStorniraneNarudzbine(
        state.table.id,
        startDateFormated,
        endDateFormated,
        rowsPerPage,
        page + 1
      ).then((res) => {
        setArtikliCount(res.count);
        setArtikliToShow(res.result);
      });
    } else {
      db.getUlazniIzvestaj(
        startDateFormated,
        endDateFormated,
        rowsPerPage,
        page + 1
      ).then((res) => {
        setArtikliCount(res.count);
        setArtikliToShow(res.result);
      });
    }
  }, [startDate, endDate, rowsPerPage, page, state]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" onClick={handleBackClick}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">
            {state?.table
              ? `Istorija stola ${state.table.title}`
              : "Ulazni izvestaj"}
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper style={styles.tabelaRobe}>
        <Box sx={{ maxWidth: 600 }}>
          <FormControl
            fullWidth
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Od"
                value={startDate}
                slotProps={{
                  textField: {
                    helperText: "MM / DD / GGGG",
                  },
                }}
                onChange={(newValue) => {
                  setStartDate(newValue);
                }}
              />
              -
              <DatePicker
                label="Do"
                value={endDate}
                slotProps={{
                  textField: {
                    helperText: "MM / DD / GGGG",
                  },
                }}
                onChange={(newValue) => {
                  setEndDate(newValue);
                }}
              />
            </LocalizationProvider>
          </FormControl>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              {state?.table ? <TableCell align="center"></TableCell> : null}
              <TableCell align="center">
                {state?.table ? "Status" : "Ime"}
              </TableCell>
              <TableCell align="center">
                {state?.table ? "Opis" : "Kolicina"}
              </TableCell>
              <TableCell align="center">Vreme</TableCell>
              <TableCell align="center">
                {state?.table ? "Ukupna cena" : "Tip Proizvoda"}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!state?.table
              ? artikliToShow.map((artikal) => (
                  <TableRow key={artikal.id}>
                    <TableCell align="center">{artikal.name}</TableCell>
                    <TableCell align="center">{artikal.kolicina}</TableCell>
                    <TableCell align="center">
                      <b>{dayjs(artikal.date).format("DD MMM YYYY HH:mm ")}</b>
                    </TableCell>
                    <TableCell align="center">
                      {artikal.tip_proizvoda_name}
                    </TableCell>
                  </TableRow>
                ))
              : artikliToShow.map((artikal) => (
                  <Row key={artikal.created_at} row={artikal} />
                ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 20, 40]}
                colSpan={state?.table ? 5 : 4}
                count={artikliCount}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "Rekorda po stranici",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    </>
  );
}

const styles = {
  dugmici: {
    width: "50%",
    margin: "auto",
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "1rem",
  },
  tabelaRobe: {
    width: "80%",
    margin: "auto",
    position: "relative",
    padding: "2rem",
    marginTop: "2rem",
  },
};

export default RobaView;
