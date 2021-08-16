/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createRecipe, getDiets } from "../actions";
import { Link, useHistory } from "react-router-dom";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import swal from "sweetalert";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import "./CreateRecipe.css";

const CreateRecipe = () => {
  const [recipe, setRecipe] = useState({
    name: "",
    diet: [],
    score: 0,
    healthScore: 0,
    instructions: "",
    resume: "",
    image: "https://i.postimg.cc/T1y6kdbQ/no-img.png",
  });

  const history = useHistory();
  const allDiets = useSelector((state) => state.allDiets);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDiets());
  }, [dispatch]);

  //* ------------------------------------ MANTENCION DE FORM ------------------------------------
  let imgError;
  let errors = {};
  (() => {
    if (recipe.name === "") {
      errors["name"] = " Este campo es obligatorio";
    }
    if (recipe.image === "https://i.postimg.cc/T1y6kdbQ/no-img.png") {
      imgError = " Este campo debe contener una URL valida";
    }
    if (recipe.diet.length === 0) {
      errors["diet"] = " Debe elegir al menos una dieta";
    }
    if (recipe.resume === "") {
      errors["resume"] = " Este campo es obligatorio";
    }
  })();

  const handleClick = (e) => {
    if (!recipe.diet.includes(e.target.value)) {
      setRecipe({
        ...recipe,
        diet: [...recipe.diet, e.target.value],
      });
    } else {
      const newDiets = [...recipe.diet].filter((d) => d !== e.target.value);
      setRecipe({
        ...recipe,
        diet: [...newDiets],
      });
    }
  };

  const alert = async () => {
    try {
      if (
        errors.name ||
        errors.diet ||
        errors.score ||
        errors.healthScore ||
        errors.resume
      ) {
        await swal({
          title: "Error al crear la receta",
          text: "Asegurate que todos los campos esten correctos",
          icon: "error",
        });
      } else {
        const message = await swal({
          title: "Receta creada correctamente!",
          text: "Ahora podras verla en el menu principal",
          icon: "success",
          buttons: ["Seguir creando", "Pagina principal"],
        });
        if (message) {
          history.push("/home");
        } else {
          history.go(0);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = () => {
    if (
      errors.name ||
      errors.diet ||
      errors.score ||
      errors.healthScore ||
      errors.resume
    ) {
      alert();
    } else {
      createRecipe(recipe);
      alert();
    }
  };
  const handleChange = (e) => {
    e.preventDefault();
    setRecipe({
      ...recipe,
      [e.target.name]: e.target.value,
    });
  };
  //* ------------------------------------ IMAGEN ------------------------------------
  const validURL = (str) => {
    let pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  };
  (() => {
    if (recipe.image === "") {
      setRecipe({
        ...recipe,
        image: "https://i.postimg.cc/T1y6kdbQ/no-img.png",
      });
    }
  })();

  const handleImageChange = (e) => {
    if (validURL(e.target.value) || e.target.value === "") {
      setRecipe({
        ...recipe,
        image: e.target.value,
      });
    }
  };

  return (
    <div>
      <Link to="/home" className="backButton">
        <ArrowBackIosIcon /> Volver
      </Link>
      <div className="formContainer">
        <div className="createTitle">
          <p id="title">Crea tu receta</p>
        </div>
        <img
          src={
            !validURL(recipe.image) ||
            recipe.image === "https://i.postimg.cc/T1y6kdbQ/no-img.png"
              ? "https://i.postimg.cc/63yhNq1N/no-img.png"
              : recipe.image
          }
          alt="foodImg"
          className="foodImage"
        />
        <div className="form">
          <div style={{ margin: "12px" }}>
            <label className="inputNames" htmlFor="name">
              Nombre:{" "}
            </label>
            <input
              className="inputText"
              type="text"
              id="name"
              name="name"
              onChange={handleChange}
            />
            {errors.name && <div className="error">{errors.name}</div>}
          </div>
          <div style={{ margin: "12px" }}>
            <label className="inputNames" htmlFor="resume">
              Resumen:{" "}
            </label>
            <input
              id="resume"
              name="resume"
              type="textarea"
              onChange={handleChange}
              className="inputText"
            />
            {errors.resume && <div className="error">{errors.resume}</div>}
          </div>
          <div style={{ margin: "12px" }}>
            <label className="inputNames" htmlFor="score">
              Puntuacion General:{" "}
            </label>
            <input
              type="range"
              id="score"
              name="score"
              value={recipe.score}
              onChange={handleChange}
            />
            <label> {recipe.score}</label>
          </div>

          <div style={{ margin: "12px" }}>
            <label className="inputNames" htmlFor="healthScore">
              Puntaje de Salud:{" "}
            </label>
            <input
              type="range"
              id="healthScore"
              name="healthScore"
              value={recipe.healthScore}
              onChange={handleChange}
            />
            <label> {recipe.healthScore}</label>
          </div>

          <div style={{ margin: "12px" }}>
            <div className="inputNames">Dietas: </div>
            <div className="dietsChecks">
              {allDiets &&
                allDiets?.map((e) => (
                  <div key={e.id}>
                    <input
                      type="checkbox"
                      value={e.name}
                      onClick={handleClick}
                      className="checks"
                    />
                    <label style={{ color: "#d7d7d7" }}>
                      {e.name}
                    </label>
                  </div>
                ))}
            </div>
            {errors.diet && <div className="error">{errors.diet}</div>}
          </div>

          <div style={{ margin: "12px" }}>
            <label className="inputNames" htmlFor="image">
              Imagen:{" "}
            </label>
            <input
              id="image"
              name="image"
              type="text"
              onChange={handleImageChange}
              className="inputText"
            />
            {imgError && <div className="error">{imgError}</div>}
          </div>

          <div style={{ margin: "12px" }}>
            <p className="inputNames">
              Instrucciones:{" "}
              <a title="Aqui debes explicar el paso a paso para la conformacion del plato recuerda dejar un '-' entre cada paso (Ej: - Marinar la carne con sal - Pasarla por pan rallado) ">
                <HelpOutlineIcon className="toolTip" />
              </a>
            </p>
            <textarea
              id="instructions"
              name="instructions"
              onChange={handleChange}
            />
          </div>
          <button
            className="submitButton"
            onClick={handleSubmit}
            style={{ margin: "12px" }}
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipe;
