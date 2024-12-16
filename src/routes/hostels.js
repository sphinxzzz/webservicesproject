const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");

// Endpoint para listar todos os hostels
router.get("/", async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [hostels] = await connection.query("SELECT * FROM hostels");
    await connection.end();

    res.status(200).json({
      success: true,
      message: "Lista de hostels obtida com sucesso!",
      data: hostels,
    });
  } catch (err) {
    console.error("Erro ao buscar hostels:", err.message);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar hostels.",
      error: err.message,
    });
  }
});

// Endpoint para buscar um hostel por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [hostel] = await connection.query("SELECT * FROM hostels WHERE id = ?", [id]);
    await connection.end();

    if (hostel.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Hostel com ID ${id} não encontrado.`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Hostel com ID ${id} obtido com sucesso!`,
      data: hostel[0],
    });
  } catch (err) {
    console.error("Erro ao buscar hostel:", err.message);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar hostel.",
      error: err.message,
    });
  }
});

module.exports = router;
