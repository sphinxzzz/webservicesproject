const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");

// Endpoint para listar todas as reservas
router.get("/", async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [reservations] = await connection.query("SELECT * FROM reservations");
    await connection.end();

    res.status(200).json({
      success: true,
      message: "Lista de reservas obtida com sucesso!",
      data: reservations,
    });
  } catch (err) {
    console.error("Erro ao buscar reservas:", err.message);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar reservas.",
      error: err.message,
    });
  }
});

// Endpoint para buscar uma reserva por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [reservation] = await connection.query("SELECT * FROM reservations WHERE id = ?", [id]);
    await connection.end();

    if (reservation.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Reserva com ID ${id} não encontrada.`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Reserva com ID ${id} obtida com sucesso!`,
      data: reservation[0],
    });
  } catch (err) {
    console.error("Erro ao buscar reserva:", err.message);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar reserva.",
      error: err.message,
    });
  }
});

module.exports = router;
