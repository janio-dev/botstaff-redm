(async () => {
  const database = require("./database");
  const itensTemp = require("./tables/itensTemp");

  try {
    const resultado = await database.sync();
    console.log("A conexão foi estabelecida com sucesso.");
  } catch (error) {
    console.error("Não foi possível conectar ao banco de dados:", error);
  }

  itensTemp.sync();
})();
