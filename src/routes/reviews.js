const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");

// Endpoint para listar todas as avaliações
router.get("/", async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [reviews] = await connection.query("SELECT * FROM reviews");
    await connection.end();

    res.status(200).json({
      success: true,
      message: "Lista de avaliações obtida com sucesso!",
      data: reviews,
    });
  } catch (err) {
    console.error("Erro ao buscar avaliações:", err.message);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar avaliações.",
      error: err.message,
    });
  }
});

// Endpoint para buscar uma avaliação por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [review] = await connection.query("SELECT * FROM reviews WHERE id = ?", [id]);
    await connection.end();

    if (review.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Avaliação com ID ${id} não encontrada.`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Avaliação com ID ${id} obtida com sucesso!`,
      data: review[0],
    });
  } catch (err) {
    console.error("Erro ao buscar avaliação:", err.message);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar avaliação.",
      error: err.message,
    });
  }
});

module.exports = router;
