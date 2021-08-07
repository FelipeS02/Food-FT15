import React from 'react'
import { Link } from 'react-router-dom'
import './LandingPage.css'

const LandingPage = () => {
    return (
        <div>
            <div className="player">
            <iframe src="https://www.youtube.com/embed/tJlzIJaokVY?playlist=tJlzIJaokVY&amp;controls=0&amp;autoplay=1&amp;mute=1&amp;start=4&amp;loop=1;&amp;disablem=1&amp;rel=0&amp;end=86" title="Food Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" className="video-background" allowfullscreen></iframe>
            <img src="https://i.postimg.cc/zDy3Fp6V/fondo-png-vacio-by-juuliidev-d4x2xn5-fullview-1.png" alt="protector" className="invisible"/>
            </div>
            <div className="navbar">
            <form name="soyhenry" method="get" action="https://www.soyhenry.com/">
            <input id="henryButton" type="image" src="https://i.postimg.cc/rs41pGTy/henrylogo.png" alt="henryLogo"/>
            </form>
            <Link to="/about" style={{ textDecoration: 'inherit' }} className="link">
                <p>Sobre mi</p>
            </Link>

            <Link to="/tecnologies" style={{textDecoration: 'inherit' }} className="link">
                <p>Tecnologias</p>
            </Link>
            </div>
            <div className="presentation">
                <img src="https://i.postimg.cc/6QJchtJM/henryfoodfixed.png" alt="logo" className="logo"/>
                <p className="description">Recetas de todo tipo en un solo click!</p>
                <Link to="/home">
                    <button>Ver Todo</button>
                </Link>
            </div>
        </div>
    )
}

export default LandingPage
