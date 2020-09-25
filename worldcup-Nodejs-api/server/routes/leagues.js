const express = require("express");

const router = express.Router();

router.get('', (req, res) => {
  res.status(200).json({
    'home': 'Canada',
    'visitor': 'Usa'
  });
});

module.exports = router;