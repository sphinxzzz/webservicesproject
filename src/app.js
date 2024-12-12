const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

// Middleware para aceitar JSON
app.use(express.json());

// Função para criar conexão com a base de dados
const createDBConnection = async () => {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
};

const startServer = async () => {
    try {
        // Importar rotas
        const userRoutes = require('./routes/users');  // Certifique-se de que o caminho está correto
        const hostelRoutes = require('./routes/hostels');
        const reviewRoutes = require('./routes/reviews');
        const reservationRoutes = require('./routes/reservations');
        const roomRoutes = require('./routes/rooms');

        // Usar as rotas
        app.use('/users', userRoutes);
        app.use('/hostels', hostelRoutes);
        app.use('/reviews', reviewRoutes);
        app.use('/reservations', reservationRoutes);
        app.use('/rooms', roomRoutes);

        // Endpoint para testar a conexão à base de dados
        app.get('/db-test', async (req, res) => {
            try {
                const connection = await createDBConnection();
                const [rows] = await connection.query('SELECT 1');
                await connection.end();

                res.status(200).json({
                    success: true,
                    message: 'Conexão à base de dados bem-sucedida!',
                    data: rows,
                });
            } catch (err) {
                console.error('Erro ao conectar à base de dados:', err.message);
                res.status(500).json({
                    success: false,
                    message: 'Erro ao conectar à base de dados.',
                    error: err.message,
                });
            }
        });

        // Iniciar o servidor na porta 5000
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Servidor a correr na porta ${PORT}`);
        });
    } catch (err) {
        console.error('Erro ao iniciar o servidor:', err.message);
        process.exit(1);  // Encerra o processo se houver erro
    }
};

// Chama a função de iniciar o servidor
startServer();
