const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");

// Endpoint para listar todos os quartos
router.get("/", async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rooms] = await connection.query("SELECT * FROM rooms");
    await connection.end();

    res.status(200).json({
      success: true,
      message: "Lista de quartos obtida com sucesso!",
      data: rooms,
    });
  } catch (err) {
    console.error("Erro ao buscar quartos:", err.message);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar quartos.",
      error: err.message,
    });
  }
});

// Endpoint para buscar um quarto por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [room] = await connection.query("SELECT * FROM rooms WHERE id = ?", [id]);
    await connection.end();

    if (room.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Quarto com ID ${id} não encontrado.`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Quarto com ID ${id} obtido com sucesso!`,
      data: room[0],
    });
  } catch (err) {
    console.error("Erro ao buscar quarto:", err.message);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar quarto.",
      error: err.message,
    });
  }
});

module.exports = router;
