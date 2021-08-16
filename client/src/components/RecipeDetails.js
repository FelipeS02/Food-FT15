import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { recipeDetail } from "../actions";
import { Link } from "react-router-dom";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import parse from "html-react-parser";
import "./RecipeDetails.css";

const RecipeDetails = ({ idReceta }) => {
  const state = useSelector((state) => state.recipeDetail);
  const { name, image, instructions, diets, dishTypes, resume } = state;
  const dispatch = useDispatch();
  const arrayFormatter = (array) => {
    let newString = "";
    for (let i = 0; i < array.length; i++) {
      if (i === 0) {
        newString =
          newString +
          " | " +
          array[i].replace(/\w\S*/g, (w) =>
            w.replace(/^\w/, (c) => c.toUpperCase())
          ) +
          " | ";
      } else {
        newString =
          newString +
          array[i].replace(/\w\S*/g, (w) =>
            w.replace(/^\w/, (c) => c.toUpperCase())
          ) +
          " | ";
      }
    }
    return newString;
  };

  useEffect(() => {
    dispatch(recipeDetail(idReceta));
  }, [dispatch, idReceta]);
  return (
    <div>
      <Link to="/home" className="backButton">
        <ArrowBackIosIcon /> Volver
      </Link>
      <div className="details">
        <h1>{name}</h1>
        <img src={image} alt={name} />
        <div className="recipeInfo">
          <h4>Dietas:</h4>
          {diets && arrayFormatter(diets)}
          {dishTypes && <h4>Tipo de plato:</h4>}
          {dishTypes && arrayFormatter(dishTypes)}
          <h4>Resumen:</h4>
          <p className="resume">{parse(resume || "")}</p>
          {instructions?.length > 1 && <h4>Instrucciones:</h4>}
          {instructions?.length > 1 && <ol>
            {instructions?.length &&
              instructions?.map((e, index) => (
                <li key={index}>{parse(e[index + 1] || "")}</li>
              ))}
          </ol>}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
