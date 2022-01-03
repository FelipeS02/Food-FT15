const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  const Recipe = sequelize.define(
    "recipe",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      resume: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      healthScore: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "",
      },
      image: {
        type: DataTypes.TEXT,
        defaultValue: "https://i.postimg.cc/T1y6kdbQ/no-img.png",
        allowNull: true,
      },
      createdInDB: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: true,
      },
    },
    { timestamps: false }
  );
  return Recipe;
};
