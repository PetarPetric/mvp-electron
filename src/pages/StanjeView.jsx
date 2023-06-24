import React, { useState, useEffect } from "react";
import { db } from "../services/dataservice";
import {
    Button,
    Toolbar,
    Table,
    AppBar,
    Typography,
    TableCell,
    TableBody,
    TableHead,
    TableRow,
    Paper,
    TableFooter,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function StanjeView() {
    const navigate = useNavigate();
    const [artikli, setArtikli] = useState([]);
    const [ukupnoCena, setUkupnoCena] = useState(0);

    useEffect(() => {
        db.getStanje().then((res) => {
            setArtikli(Object.values(res.naplaceno.artikli));
            setUkupnoCena(res.naplaceno.ukupnaCena)
        });
    }, []);

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className="title">
                        Stanje
                    </Typography>
                </Toolbar>
            </AppBar>
            <div style={styles.dugmici}>
                <Button
                    variant="contained"
                    onClick={() => {
                        db.getStanje().then((res) => {
                            setArtikli(Object.values(res.naplaceno.artikli));
                            setUkupnoCena(res.naplaceno.ukupnaCena)
                        });
                    }}
                >
                    Naplaceno
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        db.getStanje().then((res) => {
                            setArtikli(Object.values(res.stornirano.artikli));
                            setUkupnoCena(res.stornirano.ukupnaCena)
                        });
                    }}
                >
                    Stornirano
                </Button>
            </div>
            <Paper style={styles.tabelaRobe}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">No.</TableCell>
                            <TableCell align="center">Ime</TableCell>
                            <TableCell align="center">Kolicina</TableCell>
                            <TableCell align="center">Cena</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {artikli.map((artikal, index) => (
                            <TableRow key={index}>
                                <TableCell align="center">{index + 1}</TableCell>
                                <TableCell align="center">{artikal[0].name}</TableCell>
                                <TableCell align="center">{artikal.length}</TableCell>
                                <TableCell align="center">
                                    {artikal[0].cena * artikal.length}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell align="center"></TableCell>
                            <TableCell align="center"></TableCell>
                            <TableCell align="center"></TableCell>
                            <TableCell align="center">Ukupno <b>{ukupnoCena}</b> RSD</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </Paper>
        </div >
    );
}

const styles = {
    dugmici: {
        margin: "auto",
        display: "flex",
        justifyContent: "center",
        paddingTop: "1rem",
        rowGap: "1rem",
        columnGap: "1rem",
    },
    tabelaRobe: {
        width: "80%",
        margin: "auto",
        position: "relative",
        padding: "2rem",
        marginTop: "2rem",
    },
};

export default StanjeView;
