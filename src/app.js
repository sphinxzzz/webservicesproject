const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

// Endpoint para testar a conexão à base de dados
app.get('/db-test', async (req, res) => {
    try {
        // Criar uma conexão com a base de dados
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        // Fazer uma consulta simples
        const [rows] = await connection.query('SELECT 1');
        await connection.end();

        // Responder com sucesso
        res.status(200).json({ success: true, message: 'Conexão à base de dados bem-sucedida!', data: rows });
    } catch (err) {
        console.error('Erro ao conectar à base de dados:', err);
        res.status(500).json({ success: false, message: 'Erro ao conectar à base de dados.', error: err.message });
    }
});

// Servidor na porta definida
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
});