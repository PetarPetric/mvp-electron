import React, { useState, useEffect } from "react";
import { db } from "../services/dataservice";
import {
  Button,
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
} from "@mui/material";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function RobaView() {
  const [artikliToShow, setArtikliToShow] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().subtract(1, "day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [artikliCount, setArtikliCount] = useState(0);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    const startDateFormated =
      dayjs(startDate).format("YYYY-MM-DD") + " 00:00:00";
    const endDateFormated = dayjs(endDate).format("YYYY-MM-DD") + " 23:59:59";

    db.getUlazniIzvestaj(
      startDateFormated,
      endDateFormated,
      parseInt(event.target.value, 10),
      0
    ).then((res) => {
      setArtikliCount(res.count);
      setArtikliToShow(res.result);
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    const startDateFormated =
      dayjs(startDate).format("YYYY-MM-DD") + " 00:00:00";
    const endDateFormated = dayjs(endDate).format("YYYY-MM-DD") + " 23:59:59";
    db.getUlazniIzvestaj(
      startDateFormated,
      endDateFormated,
      rowsPerPage,
      newPage + 1
    ).then((res) => {
      setArtikliCount(res.count);
      setArtikliToShow(res.result);
    });
  };

  useEffect(() => {}, []);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Ulazni izvestaj</Typography>
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
                onChange={(newValue) => {
                  setStartDate(newValue);
                }}
              />
              -
              <DatePicker
                label="Do"
                value={endDate}
                onChange={(newValue) => {
                  setEndDate(newValue);
                }}
              />
            </LocalizationProvider>
            <Button
              variant="contained"
              onClick={() => {
                const startDateFormated =
                  dayjs(startDate).format("YYYY-MM-DD") + " 00:00:00";
                const endDateFormated =
                  dayjs(endDate).format("YYYY-MM-DD") + " 23:59:59";

                db.getUlazniIzvestaj(
                  startDateFormated,
                  endDateFormated,
                  rowsPerPage,
                  page
                ).then((res) => {
                  setArtikliCount(res.count);
                  setArtikliToShow(res.result);
                });
              }}
            >
              Potvrdi
            </Button>
          </FormControl>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Ime</TableCell>
              <TableCell align="center">Kolicina</TableCell>
              <TableCell align="center">Vreme</TableCell>
              <TableCell align="center">Tip Proizvoda</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {artikliToShow.map((artikal) => (
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
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 20, 40]}
                colSpan={4}
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
