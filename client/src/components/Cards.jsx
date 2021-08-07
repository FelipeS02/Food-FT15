import React from 'react'
import Card from './Card'

const Cards = ({recipes}) => {
    return (
        <div>
            {recipes?.length && recipes?.map((e) => <Card name={e.name} img={e.image} diets={e.diets} id={e.id} key={e.id} />)}
        </div>
    )
    
}

export default Cards
