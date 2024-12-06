const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});

// Define model
const Sorteio = sequelize.define('Sorteio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  loteria: {
    type: DataTypes.STRING,
    allowNull: false
  },
  concurso: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  data_sorteio: {
    type: DataTypes.DATE,
    allowNull: false
  },
  numeros: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: false
  },
  premiacoes: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  acumulou: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'sorteios',
  timestamps: true
});

// Test database connection and sync
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established.');
    return sequelize.sync({ force: true }); // Em produção, remover force: true
  })
  .then(() => {
    // Dados de exemplo
    return Sorteio.bulkCreate([
      {
        loteria: 'megasena',
        concurso: 2650,
        data_sorteio: new Date(),
        numeros: [10, 20, 30, 40, 50, 60],
        premiacoes: [
          { acertos: 6, vencedores: 1, premio: 5000000 },
          { acertos: 5, vencedores: 50, premio: 50000 }
        ],
        acumulou: false
      },
      {
        loteria: 'lotofacil',
        concurso: 3000,
        data_sorteio: new Date(),
        numeros: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        premiacoes: [
          { acertos: 15, vencedores: 2, premio: 2000000 },
          { acertos: 14, vencedores: 200, premio: 1000 }
        ],
        acumulou: false
      },
      {
        loteria: 'quina',
        concurso: 6500,
        data_sorteio: new Date(),
        numeros: [5, 15, 25, 35, 45],
        premiacoes: [
          { acertos: 5, vencedores: 1, premio: 1500000 },
          { acertos: 4, vencedores: 100, premio: 10000 }
        ],
        acumulou: false
      },
      {
        loteria: 'lotomania',
        concurso: 2500,
        data_sorteio: new Date(),
        numeros: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40],
        premiacoes: [
          { acertos: 20, vencedores: 1, premio: 3000000 },
          { acertos: 19, vencedores: 150, premio: 20000 }
        ],
        acumulou: false
      },
      {
        loteria: 'timemania',
        concurso: 2000,
        data_sorteio: new Date(),
        numeros: [7, 14, 21, 28, 35, 42, 49],
        premiacoes: [
          { acertos: 7, vencedores: 1, premio: 1000000 },
          { acertos: 6, vencedores: 80, premio: 5000 }
        ],
        acumulou: false
      }
    ]);
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Routes
app.get('/api/latest', async (req, res) => {
  try {
    const results = await Sorteio.findAll({
      order: [['data_sorteio', 'DESC']],
      limit: 6
    });
    res.json(results);
  } catch (error) {
    console.error('Error fetching latest results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/:loteria', async (req, res) => {
  try {
    const results = await Sorteio.findAll({
      where: { loteria: req.params.loteria },
      order: [['concurso', 'DESC']],
      limit: 10
    });
    res.json(results);
  } catch (error) {
    console.error('Error fetching lottery results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/:loteria/:concurso', async (req, res) => {
  try {
    const result = await Sorteio.findOne({
      where: {
        loteria: req.params.loteria,
        concurso: req.params.concurso
      }
    });
    
    if (!result) {
      return res.status(404).json({ error: 'Contest not found' });
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching contest details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
