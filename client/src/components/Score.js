import React from "react";

const Score = ({ value }) => {
  return (
    <div>
      <p
        style={{
          position: "absolute",
          padding: "10px 0 0 23px",
          color: "black",
        }}
      >
        <b>{value}</b>
      </p>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Estrella_amarilla.png/240px-Estrella_amarilla.png"
        alt="score"
        style={{ height: "70px" }}
      ></img>
    </div>
  );
};

export default Score;
