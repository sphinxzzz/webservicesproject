const express = require('express');
const router = express.Router();

router.get('/hostels', (req, res) => {
    res.send('Listagem de hostels');
});

module.exports = router;
