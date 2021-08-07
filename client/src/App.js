import React from "react";
import "./App.css";
import { Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import About from "./components/About";
import Home from "./components/Home";
import RecipeDetails from "./components/RecipeDetails";

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={LandingPage} />
      <Route path="/about" component={About} />
      <Route exact path="/home" component={Home} />
      <Route path="/detail/:idReceta" render={({ match }) => <RecipeDetails idReceta={match.params.idReceta} />} />
    </div>
  );
}

export default App;
