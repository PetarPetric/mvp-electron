import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div style={styles.container}>
      <Link to="/" style={styles.link}>
        Stolovi
      </Link>
      <h1 style={styles.header}>Stranica ne postoji...</h1>
      <h3>Za vise informacija kontaktirajte Petra</h3>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "50vh",
  },
  header: {
    fontSize: "36px",
    fontWeight: "bold",
  },
  link: {
    marginTop: "20px",
    fontSize: "24px",
    textDecoration: "none",
    color: "#333",
  },
};

export default ErrorPage;
