const express = require('express');
const router = express.Router();

// Endpoint para listar todas as reservas
router.get('/', async (req, res) => {
    try {
        const connection = await require('mysql2/promise').createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        const [reservations] = await connection.query('SELECT * FROM Reservations');
        await connection.end();

        res.status(200).json({
            success: true,
            message: 'Lista de reservas obtida com sucesso!',
            data: reservations,
        });
    } catch (err) {
        console.error('Erro ao buscar reservas:', err.message);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar reservas.',
            error: err.message,
        });
    }
});

module.exports = router;
