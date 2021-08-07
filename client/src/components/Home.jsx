import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDiets, getRecipes } from '../actions';
import Card from './Card';
import "./Home.css";
import Nav from './Nav';

const Home = () => {
    const dispatch = useDispatch()
    const diets = useSelector((state) => state.allDiets)
    const recipes = useSelector((state) => state.recipes)
    
    useEffect(() => {
        if (recipes?.length === 0) {
            dispatch(getRecipes());
            dispatch(getDiets());
        }
    },[dispatch, recipes])
    
    return (
        <div>
            <div className="startZone">
                <img src="https://i.postimg.cc/hP82LTQz/miniLogo.png" alt="logo" className="homeLogo" />
                <Nav diets={diets} />
                {/* <Cards recipes={recipes}/> */}
                {recipes?.length && recipes?.map((e) => <Card name={e.name} img={e.image} diets={e.diets} id={e.id} key={e.id} />)}
            </div>
        </div>
    )
}

export default Home