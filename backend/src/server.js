const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes, Op, QueryTypes } = require('sequelize');
const axios = require('axios');
const cron = require('node-cron');

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

// URLs base para cada loteria
const LOTTERY_URLS = {
  megasena: 'https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena',
  lotofacil: 'https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil',
  quina: 'https://servicebus2.caixa.gov.br/portaldeloterias/api/quina',
  lotomania: 'https://servicebus2.caixa.gov.br/portaldeloterias/api/lotomania',
  timemania: 'https://servicebus2.caixa.gov.br/portaldeloterias/api/timemania'
};

// Função para converter data no formato DD/MM/YYYY para YYYY-MM-DD
function convertDate(dateStr) {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Função para baixar resultados de uma loteria
async function downloadResults(loteria) {
  try {
    const baseUrl = LOTTERY_URLS[loteria];
    if (!baseUrl) {
      throw new Error(`Loteria não suportada: ${loteria}`);
    }

    // Primeiro, obtemos o último concurso
    const response = await axios.get(baseUrl);
    const data = response.data;
    
    if (!data || !data.numero) {
      throw new Error(`Não foi possível obter o último concurso de ${loteria}`);
    }

    const latestConcurso = parseInt(data.numero, 10);
    if (isNaN(latestConcurso)) {
      throw new Error(`Número do concurso inválido: ${data.numero}`);
    }

    console.log(`Baixando resultados de ${loteria}, último concurso: ${latestConcurso}`);

    // Baixa os últimos 100 concursos
    const startConcurso = latestConcurso;
    const endConcurso = Math.max(1, latestConcurso - 100);
    let foundValidResult = false;
    
    for (let concurso = startConcurso; concurso >= endConcurso; concurso--) {
      try {
        // Verifica se já temos este resultado
        const existing = await Sorteio.findOne({
          where: { loteria, concurso }
        });

        if (existing) {
          console.log(`Concurso ${concurso} já existe no banco`);
          continue;
        }

        const url = `${baseUrl}/${concurso}`;
        console.log(`Buscando ${url}`);
        
        const response = await axios.get(url);
        const data = response.data;

        if (!data || !data.numero) {
          console.log(`Concurso ${concurso} não encontrado`);
          continue;
        }

        foundValidResult = true;

        // Converte a data para o formato correto
        const dataFormatada = convertDate(data.dataApuracao);
        if (!dataFormatada) {
          console.log(`Data inválida para o concurso ${concurso}: ${data.dataApuracao}`);
          continue;
        }

        await Sorteio.create({
          loteria,
          concurso: data.numero,
          data_sorteio: dataFormatada,
          numeros: data.dezenasSorteadasOrdemSorteio,
          premiacoes: data.listaRateioPremio || [],
          acumulou: data.acumulado
        });

        console.log(`Concurso ${data.numero} salvo com sucesso`);
        
        // Pequena pausa para não sobrecarregar a API
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log(`Concurso ${concurso} não existe`);
          if (foundValidResult) {
            // Se já encontramos algum resultado válido e agora estamos tendo 404,
            // provavelmente chegamos ao fim dos concursos disponíveis
            break;
          }
        } else {
          console.error(`Erro ao baixar concurso ${concurso}:`, error.message);
        }
        // Pausa maior em caso de erro
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    if (!foundValidResult) {
      throw new Error(`Não foi possível encontrar nenhum resultado válido para ${loteria}`);
    }

    return true;
  } catch (error) {
    console.error(`Erro ao baixar resultados de ${loteria}:`, error);
    throw error;
  }
}

// Rota para iniciar download manual dos resultados
app.post('/api/download/:loteria', async (req, res) => {
  try {
    const { loteria } = req.params;
    await downloadResults(loteria);
    res.json({ message: 'Download iniciado com sucesso' });
  } catch (error) {
    console.error('Erro ao iniciar download:', error);
    res.status(500).json({ error: 'Erro ao iniciar download' });
  }
});

// Agendamento para baixar novos resultados todos os dias às 21:00
cron.schedule('0 21 * * *', async () => {
  console.log('Iniciando download automático de resultados...');
  for (const loteria of Object.keys(LOTTERY_URLS)) {
    try {
      await downloadResults(loteria);
    } catch (error) {
      console.error(`Erro no download automático de ${loteria}:`, error);
    }
  }
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

app.get('/api/:loteria/concursos', async (req, res) => {
  try {
    const { loteria } = req.params;

    const concursos = await Sorteio.findAll({
      where: { loteria },
      attributes: ['concurso', 'data_sorteio'],
      order: [['concurso', 'DESC']],
      raw: true,
      group: ['concurso', 'data_sorteio']
    });

    res.json(concursos);
  } catch (error) {
    console.error('Erro ao buscar concursos:', error);
    res.status(500).json({ error: 'Erro ao buscar concursos' });
  }
});

app.get('/api/:loteria/:concurso', async (req, res) => {
  try {
    const { loteria, concurso } = req.params;
    const concursoNum = parseInt(concurso, 10);

    if (isNaN(concursoNum)) {
      return res.status(400).json({ error: 'Número do concurso inválido' });
    }

    const resultado = await Sorteio.findOne({
      where: {
        loteria,
        concurso: concursoNum
      }
    });

    if (!resultado) {
      return res.status(404).json({ error: 'Resultado não encontrado' });
    }

    res.json(resultado);
  } catch (error) {
    console.error('Erro ao buscar resultado:', error);
    res.status(500).json({ error: 'Erro ao buscar resultado' });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const { loteria, concurso } = req.query;
    let where = {};

    if (loteria) {
      where.loteria = loteria;
    }

    if (concurso) {
      where.concurso = parseInt(concurso, 10);
    }

    const resultados = await Sorteio.findAll({
      where,
      order: [['concurso', 'DESC']],
      limit: 1,
      raw: true
    });

    res.json(resultados);
  } catch (error) {
    console.error('Erro ao buscar resultados:', error);
    res.status(500).json({ error: 'Erro ao buscar resultados' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
