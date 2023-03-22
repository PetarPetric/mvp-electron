import React from "react";
import SingleAstal from "../components/AstalComponent";
import "../styles/StoloviView.css";
import pizzaSlika from "../assets/pizza-svgrepo-com.svg";
import { db } from "../services/dataservice";
import { useState, useEffect } from "react";

export default function StoloviView() {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    db.getStolovi().then((res) => {
      setTables(res);
    });
  }, []);

  return (
    <div>
      <div className="lokal">
        <div className="sank">
          <div className="sank-pizza">
            <img src={pizzaSlika} alt="" />
          </div>
        </div>
        <div className="lokal-unutra">
          {tables.map((table) => (
            <SingleAstal key={table.id} table={table} />
          ))}
        </div>
        <div className="napolje"></div>
      </div>
    </div>
  );
}
