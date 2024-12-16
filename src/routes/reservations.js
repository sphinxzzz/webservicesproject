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

// Endpoint para criar uma nova reserva com desconto
router.post("/", async (req, res) => {
  const { userId, roomId, startDate, endDate } = req.body;

  try {
    // Conexão ao banco de dados
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Obter os detalhes do usuário
    const [user] = await connection.query("SELECT * FROM users WHERE id = ?", [userId]);
    
    if (!user.length) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    // Obter os detalhes do quarto
    const [room] = await connection.query("SELECT * FROM rooms WHERE id = ?", [roomId]);

    if (!room.length) {
      return res.status(404).json({ success: false, message: 'Quarto não encontrado' });
    }

    // Calcular o número de noites
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const nights = Math.ceil((endDateObj - startDateObj) / (1000 * 3600 * 24));

    // Calcular o preço total sem o desconto
    let totalPrice = room[0].price_per_night * nights;

    // Verificar se o usuário é residente dos Açores
    if (user[0].is_azores_resident === 1) {
      const discount = 0.1; // 10% de desconto
      totalPrice -= totalPrice * discount;
    }

    // Inserir a reserva no banco de dados
    const [result] = await connection.query(
      "INSERT INTO reservations (user_id, room_id, start_date, end_date, total_price) VALUES (?, ?, ?, ?, ?)",
      [userId, roomId, startDate, endDate, totalPrice]
    );

    await connection.end();

    // Retornar resposta de sucesso
    res.status(201).json({
      success: true,
      message: "Reserva criada com sucesso!",
      reservationId: result.insertId,
      totalPrice: totalPrice.toFixed(2), // Exibir o preço com 2 casas decimais
    });
  } catch (err) {
    console.error("Erro ao criar reserva:", err.message);
    res.status(500).json({
      success: false,
      message: "Erro ao criar reserva.",
      error: err.message,
    });
  }
});

module.exports = router;
