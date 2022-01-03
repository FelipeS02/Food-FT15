import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { searchByName, sortRecipes } from "../actions";
import { Link } from "react-router-dom";
import LocalPharmacyIcon from "@material-ui/icons/LocalPharmacy";
import { Search } from "@material-ui/icons";
import "./Nav.css";

const Nav = ({ diets, setCurrentPage }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");

  const handleOption = (e) => {
    e.preventDefault();
    dispatch(sortRecipes(e.target.value));
    setCurrentPage(1);
  };

  const handleNameChange = (e) => {
    e.preventDefault();
    setName(e.target.value);
  };

  const handleClick = (e) => {
    e.preventDefault();
    setName("");
    dispatch(searchByName(name));
    setCurrentPage(1);
  };

  return (
    <div>
      <nav className="homeNav" style={{ margin: "12px" }}>
        <select name="Tipo de dieta" onChange={handleOption} defaultValue="">
          <option value="" disabled hidden>
            TIPO DE DIETA
          </option>
          <option value="all">Todas</option>
          {diets.map((d) => (
            <option value={d.name} key={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <select
          name="alfabeticalSort"
          onChange={handleOption}
          defaultValue="alfabeticalASC"
        >
          <option value="alfabeticalASC">A-Z▲</option>
          <option value="alfabeticalDESC">Z-A▼</option>
        </select>
        <select
          name="scoreSort"
          onChange={handleOption}
          defaultValue="scoreASC"
        >
          <option value="scoreASC">★★★▲</option>
          <option value="scoreDESC">★★★▼</option>
        </select>

        <div className="searchBar">
          <Link to="/create" style={{ padding: "0px 10px 0px 10px" }}>
            <button>
              <LocalPharmacyIcon />
            </button>
          </Link>
          <div className="inputText2">
            <input
              type="text"
              placeholder="Buscar..."
              value={name}
              onChange={handleNameChange}
              className="searchBox"
            />
          </div>
          <button onClick={handleClick} className="searchButton">
            <Search />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
