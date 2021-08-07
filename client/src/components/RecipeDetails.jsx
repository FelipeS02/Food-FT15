import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { recipeDetail } from '../actions'
import parse from 'html-react-parser'
import './RecipeDetails.css'
const RecipeDetails = ({ idReceta }) => {
    const state = useSelector(state => state.recipeDetail)
    const { name, image, instructions, diets, dishTypes, resume } = state;
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(recipeDetail(idReceta))
    }, [dispatch, idReceta])
    return (
        <div>  
            <h1>{name}</h1>
            <img src={image} alt={name} />
            <div className="recipeInfo">
                <h4>Dietas:</h4>
                <ul>
                    {diets?.map((e) => <li>{e || ""}</li>)}
                </ul>
                <h4>Tipo de plato:</h4>
                <ul>
                    {dishTypes?.map((e) => <li>{e || ""}</li>)}
                </ul>
                <ol>
                    <p>{parse(resume || "")}</p>
                    <h4>Instrucciones:</h4>
                    {instructions?.length && instructions?.map((e, index) => <li>{parse(e[index + 1] || "")}</li>)}
                </ol>
            </div>
        </div>
    )
}

export default RecipeDetails
