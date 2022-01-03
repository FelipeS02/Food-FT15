import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDiets, getRecipes } from "../actions";
import Cards from "./Cards";
import "./Home.css";
import Nav from "./Nav";
import Paginate from "./Paginate";
import { Link } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const diets = useSelector((state) => state.allDiets);
  const recipes = useSelector((state) => state.recipes);
  useEffect(() => {
    dispatch(getRecipes());
    dispatch(getDiets());
  }, [dispatch]);

  //* ------------------------------PAGINADO------------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 9;
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  //* ------------------------------PAGINADO------------------------------

  return (
    <div className="startZone">
      <Link to="/">
        <img
          src="https://i.postimg.cc/hP82LTQz/miniLogo.png"
          alt="logo"
          className="homeLogo"
        />
      </Link>
      <Nav diets={diets} setCurrentPage={setCurrentPage} />
      <Cards recipes={currentRecipes} />
      <Paginate
        recipesPerPage={recipesPerPage}
        recipes={recipes.length}
        paginate={setCurrentPage}
        current={currentPage}
      />
    </div>
  );
};

export default Home;
