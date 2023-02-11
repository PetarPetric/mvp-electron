import React from "react";
import SingleAstal from "../components/AstalComponent";
import "../styles/StoloviView.css";
import pizzaSlika from "../assets/pizza-svgrepo-com.svg";

const tables = [
  { title: "1", id: 1, description: "unutra" },
  { title: "2", id: 2, description: "unutra" },
  { title: "3", id: 3, description: "unutra" },
  { title: "4", id: 4, description: "unutra" },
  { title: "Dostava", id: 5, description: "dostava" },
  { title: "Sank", id: 6, description: "sank" },
  { title: "5", id: 7, description: "napolje" },
  { title: "6", id: 8, description: "napolje" },
];

export default function StoloviView() {
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
            <SingleAstal table={table} key={table.id} />
          ))}
        </div>
        <div className="napolje"></div>
      </div>
    </div>
  );
}
