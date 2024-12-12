const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Bem-vindo à API de WebServices!',
    });
});

module.exports = router;
