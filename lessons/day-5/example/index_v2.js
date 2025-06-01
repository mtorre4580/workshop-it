const express = require("express");
const { Sequelize, DataTypes, Model } = require("sequelize");

const PORT = process.env.PORT || 3000;
const app = express();

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

class User extends Model {}

User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'The first name of the person'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'The email of the person'
    },
  },
  {
    sequelize,
    modelName: "User",
    comment: 'Table users for the app'
  }
);

async function init() {
  await sequelize.authenticate();

  await sequelize.sync({ force: true });

  await User.bulkCreate([
    { name: "Matias", email: "matias@example.com" },
    { name: "Belen", email: "belen@example.com" },
    { name: "Facundo", email: "facundo@example.com" },
    { name: "Diego", email: "diego@example.com" },
  ]);
}

init();

app.use(express.json());

app.get("/users", async (_, res) => {
  const users = await User.findAll();
  return res.json(users);
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  await User.create({ name, email });
  return res.json({ success: true });
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  await User.update({ name, email }, { where: { id } });
  return res.json({ success: true });
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  await User.destroy({ where: { id } });
  return res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server listen in ${PORT}`);
});
