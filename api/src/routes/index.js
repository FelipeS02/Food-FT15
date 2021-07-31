const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();
const { Diet, Recipe } = require("../db");
const axios = require("axios");
const { API_KEY } = process.env;
const { validate } = require("uuid");

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

//* ------------------------------------ RECIPES / RECIPES POR NAME ------------------------------------

router.get("/recipes", async (req, res) => {
  try {
    const apiResponse = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`
    );
    const dbRecipes = await Recipe.findAll();
    if (!req.query.name) {
      const apiExtractedInfo = apiResponse?.data?.results?.length
        ? apiResponse.data.results.map((r) => {
            const { title, image, diets, dishTypes } = r;
            return {
              name: title,
              diets,
              dishTypes,
              image,
            };
          })
        : [];
      const dbExtractedInfo = dbRecipes.length
        ? dbRecipes.map((r) => {
            const { name, diet, image } = r;
            return {
              name,
              diet: diet.split(","),
              image,
            };
          })
        : [];
      if (dbExtractedInfo === [] && apiExtractedInfo === []) {
        res.status(400).json({ messageError: "Error de servidor" });
        return;
      } else {
        res.json({ recipes: [...apiExtractedInfo.concat(dbExtractedInfo)] });
        return;
      }
    } else {
      const { name } = req.query;
      const apiExtractByName = apiResponse.length
        ? apiResponse
            .filter((r) => r.title.toLowerCase().includes(name))
            .map((e) => {
              const { title, image, diets } = e;
              return {
                name: title,
                diets,
                image,
              };
            })
        : [];
      const dbExtractByName = dbRecipes.length
        ? dbRecipes
            .filter((r) => r.name.toLowerCase().includes(name))
            .map((e) => {
              const { name, image, diet } = e;
              return {
                name,
                diet,
                image,
              };
            })
        : [];
      if (apiExtractByName === [] && dbExtractByName === []) {
          res.status(400).json({ messageError: "Nombre inexistente" });
          return
      } else {
        res
          .status(200)
          .json({
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
  let steps = {};
  data["analyzedInstructions"] &&
    data["analyzedInstructions"][0]["steps"]?.forEach(({ number, step }) => {
      steps = {
        ...steps,
        [number]: step.replace("&amp;", "").replace("&amp;", "").replace("&amp;", ""),
      };
    });
  return steps;
};

router.get("/recipes/:idReceta", async (req, res) => {
  try {
    const { idReceta } = req.params;
    if (validate(idReceta)) {
        const dbFind = await Recipe.findOne({ where: { id: idReceta }, include: { all: true }})
        if (dbFind) {
            const { name, resume, score, healthScore, instructions, image, diets } = dbFind.dataValues;
            const dietsName = diets.map((d) => d.name)
            const dbObject = {
                name,
                image,
                score,
                healthScore,
                dietsName,
                resume,
                instructions,
            }
            res.json({ recipe: dbObject })
            return
        } else {
            res.status(404).json({ messageError: "Id inexistente" })
            return
        }
    } else {
      const apiResponse = await axios.get(
        `https://api.spoonacular.com/recipes/${idReceta}/information?apiKey=${API_KEY}`
      );
      if (apiResponse.data) {
        const instructions = changeData(apiResponse.data);
        const {
          image,
          title,
          dishTypes,
          diets,
          summary,
          spoonacularScore,
          healthScore,
        } = apiResponse.data;
        
          const recipeDetail = {
          name: title,
          image,
          dishTypes,
          diets,
          score: spoonacularScore,
          healthScore,
          resume: summary,
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

router.get("/types", async (_req, res) => {
  try {
    const dietTypes = await Diet.findAll();
    let diets = [];
    if (dietTypes.length === 10) {
      diets = [...dietTypes];
      return;
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
