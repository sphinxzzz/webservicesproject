const express = require('express');
const router = express.Router();

// Endpoint para listar todas as avaliações
router.get('/', async (req, res) => {
    try {
        const connection = await require('mysql2/promise').createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        const [reviews] = await connection.query('SELECT * FROM Reviews');
        await connection.end();

        res.status(200).json({
            success: true,
            message: 'Lista de avaliações obtida com sucesso!',
            data: reviews,
        });
    } catch (err) {
        console.error('Erro ao buscar avaliações:', err.message);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar avaliações.',
            error: err.message,
        });
    }
});

module.exports = router;
