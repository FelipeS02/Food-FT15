import React from "react";
import "./App.css";
import { Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Home from "./components/Home";
import RecipeDetails from "./components/RecipeDetails";
import CreateRecipe from "./components/CreateRecipe";

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/home" component={Home} />
      <Route path="/detail/:idReceta" render={({ match }) => <RecipeDetails idReceta={match.params.idReceta} />} />
      <Route path="/create" component={CreateRecipe}/>
    </div>
  );
}

export default App;
