import React from "react";
import { useState } from "react";
import { db } from "../services/dataservice";

export default function DodavanjeNaStoComponenta(props) {
  const [tipProizvoda, setTipProizvoda] = useState(null);
  const [proizvodi, setProizvodi] = useState([]);

  return (
    <>
      {tipProizvoda && (
        <div
          className="tipProizvoda"
          onClick={() => {
            setTipProizvoda(null);
            setProizvodi([]);
          }}
        >
          <div className="tipProizvodaTitle">
            <p>NAZAD</p>
          </div>
        </div>
      )}
      <br></br>
      {!tipProizvoda
        ? props.tipoviProizvoda.map((tipProizvoda) => {
            return (
              <>
                <div
                  className="tipProizvoda"
                  key={tipProizvoda.id}
                  onClick={() => {
                    setTipProizvoda(tipProizvoda);
                    db.getArtikalById(tipProizvoda.id).then((res) => {
                      setProizvodi(res);
                    });
                  }}
                >
                  <div className="tipProizvodaTitle">
                    <p>{tipProizvoda.name}</p>
                  </div>
                </div>
              </>
            );
          })
        : proizvodi.map((proizvod) => {
            return (
              <div className="proizvod" key={proizvod.id}>
                <div className="proizvodTitle">
                  <p>{proizvod.name}</p>
                </div>
                <div className="proizvodPrice">
                  <p>{proizvod.price}</p>
                </div>
              </div>
            );
          })}
    </>
  );
}
