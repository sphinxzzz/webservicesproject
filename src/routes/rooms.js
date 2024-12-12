const express = require('express');
const router = express.Router();

// Endpoint para listar todos os quartos
router.get('/', async (req, res) => {
    try {
        const connection = await require('mysql2/promise').createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        const [rooms] = await connection.query('SELECT * FROM Rooms');
        await connection.end();

        res.status(200).json({
            success: true,
            message: 'Lista de quartos obtida com sucesso!',
            data: rooms,
        });
    } catch (err) {
        console.error('Erro ao buscar quartos:', err.message);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar quartos.',
            error: err.message,
        });
    }
});

module.exports = router;
