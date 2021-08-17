import React from "react";
import { configure, mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import Cards from "./Cards";
import Card from "./Card";
configure({ adapter: new Adapter() });

describe("Cards", () => {
  let wrapper;
  let store;
  const testRecipes = [
    {
      id: "f9927d5b-da5c-4763-a51c-8452f61b1afc",
      name: "Milanesa de suprema de pollo con pure",
      score: null,
      diets: [],
      image: "https://i.postimg.cc/T1y6kdbQ/no-img.png",
      createdInDB: true,
    },
    {
      id: 592479,
      name: "Kale and Quinoa Salad with Black Beans",
      score: 100,
      diets: ["gluten free", "dairy free", "lacto ovo vegetarian", "vegan"],
      dishTypes: ["side dish"],
      image: "https://spoonacular.com/recipeImages/592479-312x231.jpg",
    },
    {
      id: 547775,
      name: "Creamy Avocado Pasta",
      score: 100,
      diets: ["dairy free", "lacto ovo vegetarian", "vegan"],
      dishTypes: ["lunch", "main course", "main dish", "dinner"],
      image: "https://spoonacular.com/recipeImages/547775-312x231.jpg",
    },
  ];
  const mockStore = configureStore();
  store = mockStore(testRecipes);

  beforeEach(() => {
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/home"]}>
                <Cards recipes={testRecipes}/>
        </MemoryRouter>
      </Provider>
    );
  });

  it("Should map the amount of recipes in store and renderize one <Card /> for each", () => {
    expect(wrapper.find(Card)).toHaveLength(3);
  });
});
