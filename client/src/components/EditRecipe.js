import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { editRecipe, getDiets, recipeDetail } from "../actions";
import { Link, useHistory } from "react-router-dom";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import swal from "sweetalert";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import SaveAltIcon from "@material-ui/icons/SaveAlt";

const EditRecipe = ({ idReceta }) => {
  const dispatch = useDispatch();

  const allDiets = useSelector((state) => state.allDiets);

  const currentRecipe = useSelector((state) => state.recipeDetail);
  const { name, diets, score, healthScore, stringInstructions, resume, image } =
    currentRecipe;

  const [recipe, setRecipe] = useState({
    name: "",
    diets: [],
    score: 0,
    healthScore: 0,
    instructions: "",
    resume: "",
    image: "",
  });

  const chargeData = async () => {
    await setRecipe({
      name,
      diets,
      score,
      healthScore,
      instructions: stringInstructions,
      resume,
      image,
    });
  };

  useEffect(() => {
    dispatch(recipeDetail(idReceta));
    dispatch(getDiets());
  }, [dispatch, idReceta]);

  //* ------------------------------------ MANTENCION DE FORM ------------------------------------
  const history = useHistory();
  let imgError;
  let errors = {};
  (() => {
    if (recipe.name === "") {
      errors["name"] = " Este campo es obligatorio";
    }
    if (recipe.image === "https://i.postimg.cc/T1y6kdbQ/no-img.png") {
      imgError = " Este campo debe contener una URL valida";
    }
    if (recipe.diets?.length === 0) {
      errors["diets"] = " Debe elegir al menos una dieta";
    }
    if (recipe.resume === "") {
      errors["resume"] = " Este campo es obligatorio";
    }
  })();

  const handleClick = (e) => {
    if (!recipe.diets.includes(e.target.value)) {
      setRecipe({
        ...recipe,
        diets: [...recipe.diets, e.target.value],
      });
    } else {
      const newDiets = [...recipe.diets].filter((d) => d !== e.target.value);
      setRecipe({
        ...recipe,
        diets: [...newDiets],
      });
    }
  };

  const validateCheck = (diet, dietsArray) => {
    if (dietsArray.includes(diet)) {
      return true;
    } else {
      return false;
    }
  };

  const alert = async () => {
    try {
      if (
        errors.name ||
        errors.diets ||
        errors.score ||
        errors.healthScore ||
        errors.resume
      ) {
        await swal({
          title: "Error al modificar la receta",
          text: "Asegurate que todos los campos esten correctos",
          icon: "error",
        });
      } else {
        const message = await swal({
          title: "Receta modificada correctamente!",
          text: "Los cambios se reflejaran en la pantalla principal",
          icon: "success",
        });
        message && history.push("/home");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = () => {
    if (
      errors.name ||
      errors.diets ||
      errors.score ||
      errors.healthScore ||
      errors.resume
    ) {
      alert();
    } else {
      editRecipe(idReceta, recipe);
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

  // const arrayFormatter = (array) => {
  //   if (array) {
  //     let newString = "";
  //     for (let i = 0; i < array.length; i++) {
  //       if (i === 0) {
  //         newString =
  //           newString +
  //           " | " +
  //           array[i].replace(/\w\S*/g, (w) =>
  //             w.replace(/^\w/, (c) => c.toUpperCase())
  //           ) +
  //           " | ";
  //       } else {
  //         newString =
  //           newString +
  //           array[i].replace(/\w\S*/g, (w) =>
  //             w.replace(/^\w/, (c) => c.toUpperCase())
  //           ) +
  //           " | ";
  //       }
  //     }
  //     return newString;
  //   }
  // };

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
          <p id="title">Modificar</p>
          <button onClick={chargeData} className="chargeData" title="Cargar Datos"> <SaveAltIcon fontSize="large"/></button>
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
              value={recipe.name}
              onChange={handleChange}
            />
            <label className="currentData"> ({name})</label>
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
              value={recipe.resume}
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
            <label className="currentData"> ({score})</label>
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
            <label className="currentData"> ({healthScore})</label>
          </div>

          <div style={{ margin: "12px" }}>
            <div className="inputNames">
              Dietas:{" "}
              {/* <label className="currentData">({arrayFormatter(diets)})</label> */}
            </div>
            <div className="dietsChecks">
              {allDiets &&
                allDiets?.map((e) => (
                  <div key={e.id}>
                    <input
                      type="checkbox"
                      value={e.name}
                      onClick={handleClick}
                      className="checks"
                      checked={validateCheck(e.name, recipe.diets)}
                    />
                    <label style={{ color: "#d7d7d7" }}>{e.name}</label>
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
            />{" "}
            <br />
            <label className="currentData"> ({image})</label>
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
              value={recipe.instructions}
              onChange={handleChange}
            />
          </div>
          <button
            className="submitButton"
            onClick={handleSubmit}
            style={{ margin: "12px" }}
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRecipe;
