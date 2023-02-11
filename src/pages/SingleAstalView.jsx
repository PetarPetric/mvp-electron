import React from "react";
import { useParams } from "react-router-dom";

export default function SingleAstalView() {
  const params = useParams();

  return <div className="asdas">{params.id}</div>;
}
