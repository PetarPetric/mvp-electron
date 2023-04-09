import React from "react";
import { useState, useEffect } from "react";
import { db } from "../services/dataservice";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import {
  Card,
  Divider,
  List,
  ListItem,
  CardHeader,
  ListItemText,
  ListSubheader,
} from "@mui/material";

export default function KucaniProizvodi(props) {
  const [narudzbineNaStolu, setNarudzbineNaStolu] = useState([]);
  const [groupedNarudzbineNaStolu, setGroupedNarudzbineNaStolu] = useState([]);
  const [open, setOpen] = useState(false);
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

      const groupedById = Object.keys(groupedByDate).map((key) => {
        return {
          date: key,
          items: groupBy(groupedByDate[key], "artikal_id"),
        };
      });

      setGroupedNarudzbineNaStolu(groupedById);
    });
  }, []);

  return (
    <Card sx={{ margin: 2 }}>
      <CardHeader sx={{ px: 2, py: 3 }} title={"Kucani proizvodi"} />
      <Divider />
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
        {groupedNarudzbineNaStolu.map((narudzbina) => (
          <li key={narudzbina.date}>
            <ul>
              <ListSubheader>
                Vreme: {dayjs(narudzbina.date).format("MMM DD hh:mm")}
              </ListSubheader>
              {Object.keys(narudzbina.items).map((key, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${narudzbina.items[key].length} x ${narudzbina.items[key][0].name}`}
                  />
                </ListItem>
              ))}
            </ul>
          </li>
        ))}
      </List>
    </Card>
  );
}
