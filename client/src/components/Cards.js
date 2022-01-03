import React from "react";
import Card from "./Card";
import "./Cards.css";
import Loading from "./Loading";
const Cards = ({ recipes }) => {
  return (
    <div className="cardsRender">
      {recipes?.length ?
        recipes?.map((e) => (
          <Card
            name={e.name}
            img={e.image}
            diets={e.diets}
            id={e.id}
            createdInDB={e.createdInDB ? true : false}
            key={e.id}
            score={e.score}
          />
        )) : <Loading/>}
    </div>
  );
};

export default Cards;
