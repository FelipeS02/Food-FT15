const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Diet = sequelize.define("diet", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    })
    return Diet
}