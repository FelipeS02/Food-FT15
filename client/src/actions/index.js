import axios from "axios";
import {
  GET_RECIPES,
  GET_DIETS,
  RECIPES_BY_NAME,
  RECIPE_DETAIL,
  SORT,
} from "./actions";

export const getRecipes = () => async (dispatch) => {
  const json = await axios.get("http://localhost:3001/recipes");
  dispatch({
    type: GET_RECIPES,
    payload: json.data.recipes,
  });
};

export const recipeDetail = (id) => async (dispatch) => {
  const json = await axios.get("http://localhost:3001/recipes/" + id);
  dispatch({
    type: RECIPE_DETAIL,
    payload: json.data.recipe,
  });
};

export const dietsByName = (name) => async (dispatch) => {
  const json = await axios.get("http://localhost:3001/recipes?name=" + name);
  dispatch({
    type: RECIPES_BY_NAME,
    payload: json.data.recipes,
  });
};

export const sortRecipes = (value) => (dispatch) => {
  dispatch({
    type: SORT,
    payload: value,
  });
};


export const getDiets = () => {
  return async (dispatch) => {
    const json = await axios.get("http://localhost:3001/types");
    return dispatch({
      type: GET_DIETS,
      payload: json.data.diets,
    });
  };
};
