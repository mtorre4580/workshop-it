const express = require("express");
const { Sequelize } = require("sequelize");

const PORT = process.env.PORT || 3000;

const app = express();

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

async function init() {
  await sequelize.authenticate();

  await sequelize.query(`DROP TABLE IF EXISTS Users;`);

  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL
    );
  `);

  await sequelize.query(`
      INSERT INTO Users (name, email) VALUES
      ('Matias', 'matias@example.com'),
      ('Belen', 'belen@example.com'),
      ('Facundo', 'facundo@example.com'),
      ('Diego', 'diego@example.com');
    `);
}

init();

app.use(express.json());

app.get("/users", async (_, res) => {
  const [users] = await sequelize.query("SELECT * FROM Users");
  return res.json(users);
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  await sequelize.query("INSERT INTO Users (name, email) VALUES (?, ?)", {
    replacements: [name, email],
  });
  return res.json({ success: true });
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  await sequelize.query("UPDATE Users SET name = ?, email = ? WHERE id = ?", {
    replacements: [name, email, id],
  });
  res.json({ success: true });
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  await sequelize.query("DELETE FROM Users WHERE id = ?", {
    replacements: [id],
  });
  return res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server listen in ${PORT}`);
});
