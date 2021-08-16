/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require("chai");
const session = require("supertest-session");
const app = require("../../src/app.js");
const { Recipe, conn } = require("../../src/db.js");

const agent = session(app);
const recipe = {
  name: "Milanesa de suprema de pollo con pure",
  resume: "Un plato muy clásico, nadie se resiste a unas ricas milas con puré.",
  diet: ["Primal", "Whole30"],
};

describe("Recipe routes", () => {
  before(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  beforeEach(async () =>
    await Recipe.sync({ force: true }).then(async () => await Recipe.create(recipe))
  );
  describe("GET /recipes", () => {
    it("should get 200", () => agent.get("/recipes?name=" + recipe.name).expect(200));
  });
});
