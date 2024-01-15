const { SlashCommandBuilder, EmbedBuilder, userMention } = require("discord.js");
const { roleID } = require("../../config.json");
const database = require("../../database/database");
const itensTemp = require("../../database/tables/itensTemp");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveitem")
    .setDescription("dá o item para o jogador")
    .addStringOption((option) => option.setName("id").setDescription("id do player").setRequired(true))
    .addStringOption((option) => option.setName("name").setDescription("nome do item").setRequired(true))
    .addStringOption((option) => option.setName("quantity").setDescription("quantidade do item").setRequired(true)),
  async execute(interaction) {
    //variaveis
    const id = await interaction.options.getString("id");
    const name = await interaction.options.getString("name");
    const quantity = await interaction.options.getString("quantity");
    const cargosDoMembro = await interaction.member.roles.cache;
    const staffID = interaction.member.user.id;
    const Isplayer = await VerifyPlayer(id);
    const IsItem = await VerifyItem(name);
    let itensArray = name.split(",").map((item) => item.trim());
    const IsAllItem = await VerifyItemS(itensArray);

    if (cargosDoMembro.has(roleID)) {
      if (id && name && quantity) {
        if (parseInt(id) && parseInt(quantity)) {
          if (Isplayer) {
            if (IsAllItem) {
              itensArray.forEach(async (item) => {
                await itensTemp.create({ source: id, itemName: item, qty: quantity, staff: staffID });
              });
              await interaction.reply({ embeds: [EmbendItem(id, itensArray.join(", "), quantity, staffID)] });
            } else {
              await MessageError(interaction, "ESSE ITEM NÃO EXISTE ❌");
            }
          } else {
            await MessageError(interaction, "ESSE PLAYER NÃO EXISTE ❌");
          }
        } else {
          await MessageError(interaction, "ID OU QUANTIDADE INVÁLIDOS ❌!");
        }
      } else {
        await MessageError(interaction, "VOCÊ ESQUECEU UM PARAMETRO 😬!");
      }
    } else {
      await MessageError(interaction, "Você não tem permissão ❌");
    }
  },
};

async function VerifyItemS(names) {
  const [results, metadata] = await database.query(`SELECT item FROM items WHERE item = item`);
  let verify;
  let verdadeiros = 0;
  let falsos = 0;

  for (let i = 0; i < results.length; i++) {
    let item1 = results[i].item;

    // Loop através dos itens do segundo array
    for (let j = 0; j < names.length; j++) {
      let item2 = names[j];

      // Comparar os itens
      if (item1 === item2) {
        verdadeiros++;
      } else {
        falsos++;
      }
    }
  }

  if (verdadeiros < names.length) {
    verify = false;
  } else {
    verify = true;
  }
  return verify;
}

async function VerifyItem(name) {
  const [results, metadata] = await database.query(`SELECT item FROM items WHERE item = item`);
  let verify;
  const filtrando = results.filter((empresa) => empresa.item == name);
  if (filtrando.length >= 1) {
    verify = true;
  } else {
    verify = false;
  }
  return verify;
}

async function VerifyPlayer(id) {
  const [results, metadata] = await database.query(`SELECT charidentifier FROM characters`);
  let verify;
  results.forEach((item) => {
    if (parseInt(item.charidentifier) == parseInt(id)) {
      verify = true;
    } else {
      verify = false;
    }
  });
  return verify;
}

async function MessageError(interaction, message) {
  const responseError = await interaction.reply({
    content: message,
    ephemeral: true,
  });
  // Aguarda 5 segundos e, em seguida, exclui a mensagem temporária
  setTimeout(() => {
    responseError.delete();
  }, 5000);
}

function EmbendItem(id, name, quantity, staffID) {
  const embed = new EmbedBuilder()
    .setColor(0xff3100)
    .setTitle("ITENS ENVIADOS COM SUCESSO ✅")
    .setDescription("aqui você vai encontrar informações sobre o envio dos itens!")
    .addFields(
      { name: "ID DO JOGADOR", value: `${id}` },
      { name: "NOME DOS ITENS", value: `${name}` },
      { name: "QUANTIDADE DOS ITEM", value: `${quantity}` },
      { name: "STAFF QUE FEZ O ENVIO", value: `${userMention(staffID)}` }
    )
    .setImage(
      "https://media.discordapp.net/attachments/1095546170551578747/1194061031606071366/Capa_Discord_Oeste.gif?ex=65aefafe&is=659c85fe&hm=c15c5dbc5662e719d5dfc17cd5721fd5f72c2983d1f326236d7a996eedacc961&="
    )
    .setTimestamp();
  return embed;
}

// https://store-images.s-microsoft.com/image/apps.58752.13738414994700897.d5f58586-d72e-41d4-84db-1e7957867558.fd94761a-956a-49e5-9ee2-bb6f04f705d9?q=90&w=480&h=270"
