import axios from "axios";
import {
  GET_RECIPES,
  GET_DIETS,
  SEARCH_BY_NAME,
  RECIPE_DETAIL,
  SORT,
  DELETE_RECIPE,
} from "./actions";

export const getRecipes = () => async (dispatch) => {
  try {
    const json = await axios.get("http://localhost:3001/recipes");
    dispatch({
      type: GET_RECIPES,
      payload: json.data.recipes,
    });
  } catch (err) {
    console.log(err);
  }
};

export const createRecipe = async (data) => {
  try {
    await axios.post("http://localhost:3001/recipe", { data } );
  } catch (err) {
    console.log(err);
  }
};

export const deleteRecipe = (data) => async (dispatch) => {
  try {
    await axios.get("http://localhost:3001/delete/" + data );
    dispatch({
      type: DELETE_RECIPE,
      payload: data
    })
  } catch (err) {
    console.log(err);
  }
};

export const recipeDetail = (id) => async (dispatch) => {
  try {
    const json = await axios.get("http://localhost:3001/recipes/" + id);
    dispatch({
      type: RECIPE_DETAIL,
      payload: json.data.recipe,
    });
  } catch (err) {
    console.log(err);
  }
};

export const searchByName = (value) => async (dispatch) => {
  try {
    const json = await axios.get("http://localhost:3001/recipes?name=" + value);
    return dispatch({
      type: SEARCH_BY_NAME,
      payload: json.data.recipes,
    });
  } catch (err) {
    console.log(err);
  }
};

export const sortRecipes = (value) => (dispatch) => {
  dispatch({
    type: SORT,
    payload: value,
  });
};


export const getDiets = () => async (dispatch) => {
  try {
    const json = await axios.get("http://localhost:3001/types");
    dispatch({
      type: GET_DIETS,
      payload: json.data.diets,
    });
  } catch (err) {
    console.log(err);
  }
};
