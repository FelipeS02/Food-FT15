const { Router } = require("express");
const router = Router();
const { Diet, Recipe } = require("../db");
const axios = require("axios");
const { API_KEY } = process.env;
const { validate } = require("uuid");
const { Op } = require("sequelize");

//* ------------------------------------ RECIPES / RECIPES POR NAME ------------------------------------

router.get("/recipes", async (req, res) => {
  try {
    const apiResponse = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=10`
    );
    if (!req.query.name) {
      const dbRecipes = await Recipe.findAll({ include: { all: true } });
      const apiExtractedInfo = apiResponse?.data?.results?.length
        ? apiResponse.data.results.map((r) => {
            const {
              title,
              image,
              diets,
              dishTypes,
              id,
              spoonacularScore,
              healthScore,
            } = r;
            return {
              id,
              name: title,
              healthScore,
              score: spoonacularScore,
              diets,
              dishTypes,
              image,
            };
          })
        : [];
      const dbExtractedInfo = dbRecipes.length
        ? dbRecipes.map((r) => {
            const { name, image, id, score, diets, createdInDB, healthScore } =
              r;
            const arrayDiets = diets.map((e) => e.name.toLowerCase());
            return {
              id,
              name,
              healthScore,
              score,
              diets: arrayDiets,
              image,
              createdInDB,
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
        include: [
          {
            where: { name: { [Op.iLike]: "%" + name + "%" } },
            model: Recipe,
          },
        ],
      });
      const diets = dbDietsByName.map((d) => d.name);
      const dbRecipesByName = await Recipe.findAll({
        where: { name: { [Op.iLike]: "%" + name + "%" } },
      });
      const dbExtractByName = dbRecipesByName.length
        ? dbRecipesByName.map((e) => {
            const { name, image, id, createdInDB } = e;
            return {
              id,
              name,
              diets,
              image,
              createdInDB,
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

const changeData = (data) => {
  let steps = [];
  if (data[0].steps.length > 0) {
    data[0].steps.forEach(({ number, step }) => {
      steps.push({ [number]: step.toString() });
    });
  } else {
    steps = [{ noInstructions: "No existen instrucciones para esta receta" }];
  }
  return steps;
};

const changeDbData = (data) => {
  let instructions = [];
  if (data !== "") {
    instructions = data
      .split("-")
      .map((e, index) => {
        if (e !== "") {
          return { [index]: e };
        }
      })
      .filter(Boolean);
  } else {
    instructions = [
      { noInstructions: "No existen instrucciones para esta receta" },
    ];
  }
  return instructions;
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
        const {
          name,
          resume,
          score,
          healthScore,
          instructions,
          image,
          diets,
          id,
          createdInDB,
        } = dbFind.dataValues;
        const dietsName = diets.map((d) => d.name);
        const dbObject = {
          id,
          name,
          image,
          score,
          healthScore,
          diets: dietsName,
          resume: resume?.toString() || "",
          stringInstructions: instructions,
          instructions: changeDbData(instructions),
          createdInDB,
        };
        // res.status(200).json({ recipe: dbObject });
        res.status(200).json({ recipe: dbFind });
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
        res.status(200).json({ recipe: recipeDetail });
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

router.post("/recipe", async (req, res) => {
  try {
    const { name, resume, score, healthScore, instructions, diets, image } =
      req.body.data;
    if (name && resume && diets) {
      const newRecipe = await Recipe.create({
        name,
        resume,
        score,
        healthScore,
        instructions,
        image,
      });
      await setDiets(diets, newRecipe);
      res.status(200).json(req.body.data);
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

router.get("/delete/:idReceta", async (req, res) => {
  try {
    const response = await Recipe.destroy({
      where: {
        id: req.params.idReceta,
      },
    });
    res
      .status(200)
      .json({ confirmed: "Receta borrada correctamente", data: response });
  } catch (err) {
    const { message } = err;
    res.status(400).json({ message });
  }
});

//* ------------------------------------ EDICION DE RECIPE ------------------------------------
router.put("/edit/:idReceta", async (req, res) => {
  try {
    const { idReceta } = req.params;
    const { diets } = req.body.data;
    const currentRecipe = await Recipe.findByPk(idReceta);
    await setDiets(diets, currentRecipe);
    const response = await Recipe.update(req.body.data, {
      where: { id: idReceta },
    });
    console.log(response);
    res.status(200).json({ response });
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
