const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();
const { Diet, Recipe } = require("../db");
const axios = require("axios");
const { API_KEY } = process.env;
const { validate } = require("uuid");
const { Op } = require("sequelize");

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

//* ------------------------------------ RECIPES / RECIPES POR NAME ------------------------------------

router.get("/recipes", async (req, res) => {
  try {
    const apiResponse = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=10`
    );
    if (!req.query.name) {
      const dbRecipes = await Recipe.findAll({include: { all: true }});
      const apiExtractedInfo = apiResponse?.data?.results?.length
        ? apiResponse.data.results.map((r) => {
            const { title, image, diets, dishTypes, id, spoonacularScore } = r;
            return {
              id,
              name: title,
              score: spoonacularScore,
              diets,
              dishTypes,
              image,
            };
          })
        : [];
      const dbExtractedInfo = dbRecipes.length
        ? dbRecipes.map((r) => {
            const { name, image, id, score, diets } = r;
            const arrayDiets = diets.map((e) => e.name)
            return {
              id,
              name,
              score,
              diets: arrayDiets,
              image,
            };
          })
        : [];
      if (dbExtractedInfo === [] && apiExtractedInfo === []) {
        res.status(400).json({ messageError: "Error de servidor" });
        return;
      } else {
        res.json({ recipes: [...dbExtractedInfo.concat(apiExtractedInfo)] });
        return;
      }
    } else {
      const { name } = req.query;
      const apiExtractByName = apiResponse.data?.results?.length
        ? apiResponse.data.results
            .filter((r) => r.title.toLowerCase().includes(name))
            .map((e) => {
              const { title, image, diets, id } = e;
              return {
                id,
                name: title,
                diets,
                image,
              };
            })
        : [];
      const dbDietsByName = await Diet.findAll({
        include: [{
          where: { name: { [Op.iLike]: "%" + name + "%" } },
          model: Recipe,
        }]
      });
      const diets = dbDietsByName.map((d) => d.name)
      const dbRecipesByName = await Recipe.findAll({ where: { name: { [Op.iLike]: "%" + name + "%" } } })
      const dbExtractByName = dbRecipesByName.length
        ? dbRecipesByName.map((e) => {
            const { name, image, id } = e;
            return {
              id,
              name,
              diets,
              image,
            };
          })
        : [];
      if (apiExtractByName === [] && dbExtractByName === []) {
        res.status(400).json({ messageError: "Nombre inexistente" });
        return;
      } else {
        res.status(200).json({
          recipes: [...apiExtractByName.concat([...dbExtractByName])],
        });
        return;
      }
    }
  } catch (err) {
    const { message } = err;
    res.status(400).json({ message });
  }
});

//* ------------------------------------ RECIPES POR ID ------------------------------------

const setDiets = async (diets, recipe) => {
  try {
    const recipeDiets = diets.map(async (d) => {
      const currentDiet = await Diet.findOne({ where: { name: d } });
      currentDiet && (await recipe.addDiet(currentDiet));
    });
    await Promise.all(recipeDiets);
  } catch (err) {
    console.log(err);
  }
};

const changeData = (data) => {
  let steps = [];
  if (data[0].steps.length > 0) {
    data[0].steps.forEach(({ number, step }) => {
      steps.push ({[number]: step.toString()});
    });
  } else {
    steps = [{ noInstructions: "No existen instrucciones para esta receta" }];
  }
  return steps;
};

router.get("/recipes/:idReceta", async (req, res) => {
  try {
    const { idReceta } = req.params;
    if (validate(idReceta)) {
      const dbFind = await Recipe.findOne({
        where: { id: idReceta },
        include: { all: true },
      });
      if (dbFind) {
        const { name, resume, score, healthScore, instructions, image, diets, id } =
          dbFind.dataValues;
        const dietsName = diets.map((d) => d.name);
        const dbObject = {
          id,
          name,
          image,
          score,
          healthScore,
          diets: dietsName,
          resume: resume?.toString() || "",
          instructions,
        };
        res.json({ recipe: dbObject });
        return;
      } else {
        res.status(404).json({ messageError: "Id inexistente" });
        return;
      }
    } else {
      const apiResponse = await axios.get(
        `https://api.spoonacular.com/recipes/${idReceta}/information?apiKey=${API_KEY}`
      );
      if (apiResponse.data) {
        const {
          id,
          image,
          title,
          dishTypes,
          diets,
          analyzedInstructions,
          summary,
          spoonacularScore,
          healthScore,
        } = apiResponse.data;
        const instructions = changeData(analyzedInstructions);
        const recipeDetail = {
          id,
          name: title,
          image,
          dishTypes,
          diets,
          score: spoonacularScore,
          healthScore,
          resume: summary?.toString() || "",
          instructions,
        };
        res.json({ recipe: recipeDetail });
        return;
      } else {
        res.json({ messageError: "Id Inexistente" });
        return;
      }
    }
  } catch (err) {
    const { message } = err;
    res.json({ message });
  }
});

//* ------------------------------------ CREACION DE RECIPE ------------------------------------

router.post("/recipe", async (req, res) => {
  try {
    const { name, resume, score, healthScore, instructions, diet, image } =
      req.body;
    if (name && resume && diet) {
      const newRecipe = await Recipe.create({
        name,
        resume,
        score,
        healthScore,
        instructions,
        image,
      });
      await setDiets(diet, newRecipe);
      res.json(req.body);
      return;
    } else {
      res.status(400).json({
        messageError:
          "Uno de los datos necesarios no existe (name, resume, diets)",
      });
      return;
    }
  } catch (err) {
    const { message } = err;
    res.status(400).json({ message });
  }
});

//* ------------------------------------ OBTENCION DE TYPES ------------------------------------

router.get("/types", async (req, res) => {
  try {
    const dietTypes = await Diet.findAll();
    let diets = [];
    if (dietTypes.length === 10) {
      diets = [...dietTypes];
    } else {
      const newDiets = [
        "Gluten Free",
        "Ketogenic",
        "Vegetarian",
        "Lacto-Vegetarian",
        "Ovo-Vegetarian",
        "Vegan",
        "Pescetarian",
        "Paleo",
        "Primal",
        "Whole30",
      ];
      const dietsForDb = newDiets.map((d) => {
        return {
          name: d,
        };
      });
      await Diet.bulkCreate(dietsForDb);
      diets = await Diet.findAll();
    }
    res.json({ diets });
  } catch (err) {
    const { message } = err;
    res.status(400).json({ message });
  }
});

module.exports = router;
