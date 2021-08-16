import {
  GET_DIETS,
  GET_RECIPES,
  SEARCH_BY_NAME,
  RECIPE_DETAIL,
  SORT,
  DELETE_RECIPE,
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

    case SEARCH_BY_NAME:
      return {
        ...state,
        recipes: action.payload,
      };

    case DELETE_RECIPE:
      const actualizedRecipes = [...state.recipes].filter(
        (e) => e.id !== action.payload
      );
      return {
        ...state,
        recipes: [...actualizedRecipes],
      };
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
      }
      if (action.payload.includes("score")) {
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
      if (action.payload === "all") {
        sortRecipe = [...state.allRecipes]
      }
      if (state.allDiets.some((e) => e.name === action.payload)) {
        sortRecipe = [...state.allRecipes].filter((e) =>
          e.diets.includes(action.payload.toLowerCase())
        );
      }
      return {
        ...state,
        recipes: [...sortRecipe],
      };
    }

    case RECIPE_DETAIL:
      return {
        ...state,
        recipeDetail: action.payload,
      };

    default:
      return {
        ...state,
      };
  }
}

export default rootReducer;
