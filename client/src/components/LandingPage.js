import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const linkToHenry = () => {
    window.open("https://www.soyhenry.com/");
  };
  const linkToMe = () => {
    window.open(
      "https://www.linkedin.com/in/felipe-roman-saracho-6620aa1b3/"
    );
  };
  return (
    <div>
      <div className="player">
        <iframe
          src="https://www.youtube.com/embed/tJlzIJaokVY?playlist=tJlzIJaokVY&amp;controls=0&amp;autoplay=1&amp;mute=1&amp;start=4&amp;loop=1;&amp;disablem=1&amp;rel=0&amp;end=86"
          title="Food Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="video-background"
          allowFullScreen
        ></iframe>
        <img
          src="https://i.postimg.cc/zDy3Fp6V/fondo-png-vacio-by-juuliidev-d4x2xn5-fullview-1.png"
          alt="protector"
          className="invisible"
        />
      </div>
      <div className="navbar">
        <button className="infoButton">
          <img
            src="https://i.postimg.cc/rs41pGTy/henrylogo.png"
            alt="henryButton"
            onClick={linkToHenry}
            style={{ height: "30px", width: "40px" }}
          />
        </button>
        <button className="infoButton" onClick={linkToMe}>
          <p>Sobre mi</p>
        </button>
      </div>
      <div className="presentation">
        <img
          src="https://i.postimg.cc/6QJchtJM/henryfoodfixed.png"
          alt="logo"
          className="logo"
        />
        <p className="description">Recetas de todo tipo en un solo click!</p>
        <Link to="/home">
          <button>Ver Todo</button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
