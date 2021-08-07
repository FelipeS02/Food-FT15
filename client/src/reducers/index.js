import {
  GET_DIETS,
  GET_RECIPES,
  RECIPES_BY_NAME,
  RECIPE_DETAIL,
  SORT,
} from "../actions/actions";

const initialState = {
  allRecipes: [],
  recipes: [],
  allDiets: [],
  recipeDetail: [],
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case GET_RECIPES:
      return {
        ...state,
        allRecipes: action.payload,
        recipes: action.payload,
      };
    case GET_DIETS:
      return {
        ...state,
        allDiets: action.payload,
      };
    case RECIPES_BY_NAME: {
      return {
        ...state,
        recipes: action.payload,
      };
    }
    case SORT: {
      let sortRecipe = [];
      if (action.payload.includes("alfabetical")) {
        let sortedAlfabetical = state.recipes.sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          }
          if (b.name > a.name) {
            return -1;
          }
          return 0;
        });
        if (action.payload === "alfabeticalASC") {
          sortRecipe = sortedAlfabetical;
        } else {
          sortRecipe = sortedAlfabetical.reverse();
        }
      } else {
        let sortedByScore = state.recipes.sort((a, b) => {
          if (a.score > b.score) {
            return 1;
          }
          if (b.score > a.score) {
            return -1;
          }
          return 0;
        });
        if (action.payload === "scoreASC") {
          sortRecipe = sortedByScore;
        } else {
          sortRecipe = sortedByScore.reverse();
        }
      }
      return {
        ...state,
        recipes: sortRecipe,
      };
    }
    case RECIPE_DETAIL: {
      return {
        ...state,
        recipeDetail: action.payload,
      };
    }
    default:
      return {
        ...state,
      };
  }
}

export default rootReducer;
