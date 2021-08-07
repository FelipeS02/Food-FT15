import React from 'react'
import { Link } from 'react-router-dom'
import './Card.css'
const Card = ({ name, img, diets, id }) => {
    return (
        <div className="card">
            <img src={img} alt={name} />
            <Link to={`/detail/${id}`} >
                <p className="foodName">{name}</p>
            </Link>
            {diets?.length && diets?.map((d) => <p>,{d}</p>)}
        </div>
    )
}

export default Card
