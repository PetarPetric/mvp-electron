import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AstalComponent.css";

export default function SingleAstalView(props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(`/stolovi/${props.table.id}/`, {
          state: { table: props.table },
        })
      }
      className={`astal ${
        props.table.description === "dostava" && "astal-dostava"
      } ${props.table.description === "sank" && "astal-sank"} ${
        props.table.description === "napolje" && "astal-napolje"
      }`}
    >
      <p>{props.table.title}</p>
      {props.table.cena ? <p>{props.table.cena}</p> : null}
    </div>
  );
}
