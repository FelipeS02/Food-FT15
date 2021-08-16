import React from "react";
import Card from "./Card";
import "./Cards.css";
const Cards = ({ recipes }) => {
  return (
    <div className="cardsRender">
      {recipes?.length &&
        recipes?.map((e) => (
          <Card
            name={e.name}
            img={e.image}
            diets={e.diets}
            id={e.id}
            createdInDB={e.createdInDB ? true : false}
            key={e.id}
          />
        ))}
    </div>
  );
};

export default Cards;
