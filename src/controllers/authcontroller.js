// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/usermodel');

const JWT_SECRET = 'secretdemaisparaajudar';

// Função de registro
const register = (req, res) => {
  const { name, email, password, isManager, isAzoresResident } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao criptografar senha' });
    }

    userModel.createUser(name, email, hash, isManager, isAzoresResident, (userId) => {
      return res.status(201).json({ message: 'Usuário registrado com sucesso', userId });
    });
  });
};

// Função de login
const login = (req, res) => {
  const { email, password } = req.body;

  userModel.findUserByEmail(email, (user) => {
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    bcrypt.compare(password, user.password_hash, (err, result) => {
      if (err || !result) {
        return res.status(401).json({ message: 'Senha incorreta' });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ message: 'Login bem-sucedido', token });
    });
  });
};

module.exports = { register, login };
