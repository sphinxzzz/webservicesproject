const express = require('express');
const router = express.Router();

// Endpoint para listar todos os hostels
router.get('/', async (req, res) => {
    try {
        const connection = await require('mysql2/promise').createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        const [hostels] = await connection.query('SELECT * FROM Hostels');
        await connection.end();

        res.status(200).json({
            success: true,
            message: 'Lista de hostels obtida com sucesso!',
            data: hostels,
        });
    } catch (err) {
        console.error('Erro ao buscar hostels:', err.message);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar hostels.',
            error: err.message,
        });
    }
});

module.exports = router;
