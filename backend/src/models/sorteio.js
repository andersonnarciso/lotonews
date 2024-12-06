const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

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

module.exports = Sorteio;
