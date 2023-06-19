import React from "react";
import SingleAstal from "../components/AstalComponent";
import "../styles/StoloviView.css";
import { db } from "../services/dataservice";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import ComputerIcon from '@mui/icons-material/Computer';


const views = [
  {
    name: "Unutra",
    id: 1,
  },
  {
    name: "Basta",
    id: 2,
  },
]

export default function StoloviView() {
  const [tables, setTables] = useState([]);
  const { id } = useParams();
  const [tablesNextToFootbalField, settablesNextToFootbalField] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    db.getTablesById(id).then((res) => {
      setTables(res.filter(obj => obj.id < 24 || obj.id > 41))
      settablesNextToFootbalField(res.filter(obj => obj.id > 23 && obj.id < 42))
    });
  }, [id]);

  return (
    <>
      <div className="stolovi-control">
        {views.map((view) => (
          <div onClick={
            () => {
              navigate(`/${view.id}`);
            }
          } className="control-button" key={view.id}>
            {view.name}
          </div>
        ))
        }
      </div>
      <div className="lokal">
        {id == 1 ? <div className="lokal-unutra">
          <div className="toalet-slika pt1">
          </div>
          <div className="sank-slika">
            <div className="sank-cut">
            </div>
            <ComputerIcon style={{ color: "white", marginLeft: "5px" }} />
          </div>
          {tables.map((table) => (
            <SingleAstal key={table.id} table={table} />
          ))}

          <div className="footbalField">
            {tablesNextToFootbalField.map((table) => (
              <SingleAstal key={table.id} table={table} />
            ))}
          </div>
          <div className="container">
            <div className="line"></div>
            <div className="half"></div>
            <div className="panelty left"></div>
            <div className="panelty right"></div>
            <div className="p-spot left">&nbsp;</div>
            <div className="p-spot right">&nbsp;</div>
            <div className="center"></div>
            <div className="p-place left"></div>
            <div className="p-place right"></div>
          </div>
        </div> :
          <div className="lokal-basta">
            {tables.map((table) => (
              <SingleAstal key={table.id} table={table} />
            ))}
            <div className="swim-pool-container">
              <div className="swim-pool-container-left"></div>
              <div className="swim-pool-container-right"></div>

              <div className="tyre tyre1"></div>
              <div className="tyre tyre2"></div>
              <div className="stairs">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        }
      </div>
    </>
  );
}
