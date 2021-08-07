import React from 'react'
import { Link } from 'react-router-dom'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import './About.css'

const About = () => {
    return (
        <div>
            <div className="returnButton">
            <Link to="/" style={{ textDecoration: 'inherit' }}>
                <ArrowBackIosIcon />
                Volver
            </Link>
            </div>
            <div className="containter">
                <img src="https://i.postimg.cc/VvXy1zqV/1616612854816.jpg" alt="profile" className="photo" />
                <fieldset className="info">
                    <p>Estudiante de Programacion Web Full Stack</p>
                    <div className="aboutMe">
                        <p>Sobre Mi:</p>
                    </div>
                </fieldset>
            </div>
        </div>
    )
}

export default About
