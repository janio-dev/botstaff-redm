const { Sequelize } = require("sequelize");
const { database } = require("../config.json");

const sequelize = new Sequelize(database.db, "root", "", {
  host: database.host,
  dialect: database.dialect,
});
module.exports = sequelize;
