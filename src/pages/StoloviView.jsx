import React from "react";
import SingleAstal from "../components/AstalComponent";
import "../styles/StoloviView.css";
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
      <div className="napolje"></div>
      <div className="lokal">
        <div className="lokal-unutra">
          <div className="sank">
          </div>
          {tables.map((table) => (
            <SingleAstal key={table.id} table={table} />
          ))}
          <div className="kuhinja"></div>
        </div>
      </div>
    </div>
  );
}
