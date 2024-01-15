const { Sequelize, DataTypes } = require("sequelize");
const database = require("../database.js");

const ItensTemp = database.define("itenstemps", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  itemName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  qty: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  staff: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = ItensTemp;
