import React from "react";
import { Link } from "react-router-dom";
import "./Card.css";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { deleteRecipe } from "../actions";
import swal from "sweetalert";
import { useDispatch } from "react-redux";
const Card = ({ name, img, diets, id, createdInDB }) => {
  const dispatch = useDispatch();
  const handleClick = async () => {
    try {
      const alert = await swal({
        title: "¿Estas seguro que quieres eliminar esta receta?",
        text: "Los cambios no se pueden deshacer.",
        icon: "warning",
        buttons: ["Cancelar", "Ok"],
      });
      if (alert) {
        await swal({
          title: "Receta eliminada correctamente",
          icon: "success",
        });
        console.log(id);
        dispatch(deleteRecipe(id));
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="cardStyle" key={id}>
      <div className="cardImage">
        <Link to={`/detail/${id}`}>
          <img src={img} alt={name} />
        </Link>
      </div>
      <div>
        <Link to={`/detail/${id}`}>{name}</Link>
      </div>
      <div>
        <select name="Tipo de dieta" defaultValue="">
          <option value="" disabled hidden>
            Dietas
          </option>
          {diets &&
            diets?.map((e) => (
              <option key={e} disabled>
                {e.replace(/\w\S*/g, (w) =>
                  w.replace(/^\w/, (c) => c.toUpperCase())
                )}
              </option>
            ))}
        </select>
      </div>
      <div className="deleteButton">
        {createdInDB && (
          <button onClick={handleClick}>
            <DeleteForeverIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
