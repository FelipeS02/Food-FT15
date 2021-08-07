import React from 'react'
import { useDispatch } from 'react-redux'
import { sortRecipes } from '../actions'


const Nav = ({ diets }) => {
    const dispatch = useDispatch()
    const handleOption = (e) => {
        dispatch(sortRecipes(e.target.value))
    }
    return (
        <div>
            <nav>
                <select name="Tipo de dieta">
                    <option value="" disabled selected hidden>Tipo de Dieta</option>
                    <option value="">Todas</option>
                    {diets.map((d) => <option value={d.name} key={d.id}>{d.name}</option>)}
                </select>
                <select name="sort" onChange={handleOption}>
                    <option value="" disabled selected hidden>Ordenar Por:</option>
                    <option value="alfabeticalASC" >🔠▲</option>
                    <option value="alfabeticalDESC">🔠▼</option>
                    <option value="scoreASC">⭐⭐⭐▲</option>
                    <option value="scoreDESC">⭐⭐⭐▼</option>
                </select>
                <input type="text" placeholder="Buscar..."></input>
            </nav>
        </div>
    )
}

export default Nav
