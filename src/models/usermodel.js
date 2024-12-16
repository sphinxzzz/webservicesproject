const db = require('../config/db'); // Aqui você deve importar sua configuração do banco de dados

// Método para criar um usuário
const createUser = (name, email, password_hash, isManager, isAzoresResident, callback) => {
  const query = 'INSERT INTO users (name, email, password_hash, is_manager, is_azores_resident) VALUES (?, ?, ?, ?, ?)';
  const values = [name, email, password_hash, isManager, isAzoresResident];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Erro ao criar usuário:', err);
      return callback({ success: false, message: 'Erro ao criar usuário' });  // Retorna erro para o callback
    }
    // Retorna o ID do novo usuário
    return callback({ success: true, userId: results.insertId });
  });
};

// Método para encontrar usuário por email
const findUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return callback(null);
    }
    // Retorna o primeiro usuário encontrado
    return callback(results[0]); 
  });
};

module.exports = { createUser, findUserByEmail };
