const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");

// Endpoint para listar todos os utilizadores
router.get("/", async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [users] = await connection.query("SELECT * FROM users");
    await connection.end();

    res.status(200).json({
      success: true,
      message: "Lista de utilizadores obtida com sucesso!",
      data: users,
    });
  } catch (err) {
    console.error("Erro ao buscar utilizadores:", err.message);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar utilizadores.",
      error: err.message,
    });
  }
});

// Endpoint para buscar um utilizador pelo nome
router.get("/search/:name", async (req, res) => {
  try {
    const { name } = req.params;

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [users] = await connection.query("SELECT * FROM users WHERE name LIKE ?", [`%${name}%`]);
    await connection.end();

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Nenhum utilizador encontrado com o nome "${name}".`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Utilizadores encontrados com o nome "${name}".`,
      data: users,
    });
  } catch (err) {
    console.error("Erro ao buscar utilizador pelo nome:", err.message);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar utilizador pelo nome.",
      error: err.message,
    });
  }
});

module.exports = router;
