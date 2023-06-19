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
      className={`table table-${
        props.table.id} ${props.table.cena ? "table-occupied" : ""}`}
    >
      <p>{props.table.title}</p>
      {props.table.cena ? <p className="table-bill">{props.table.cena}</p> : null}
    </div>
  );
}
