const express = require('express');
const { Sorteio } = require('../models');

const router = express.Router();

// Get latest results for all lotteries
router.get('/latest', async (req, res) => {
  try {
    const results = await Sorteio.findAll({
      order: [['data_sorteio', 'DESC']],
      limit: 10
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get results by lottery type
router.get('/:loteria', async (req, res) => {
  try {
    const results = await Sorteio.findAll({
      where: { loteria: req.params.loteria },
      order: [['concurso', 'DESC']],
      limit: 10
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific contest result
router.get('/:loteria/:concurso', async (req, res) => {
  try {
    const result = await Sorteio.findOne({
      where: {
        loteria: req.params.loteria,
        concurso: req.params.concurso
      }
    });
    if (!result) {
      return res.status(404).json({ error: 'Sorteio não encontrado' });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
