import React, { useState, useEffect } from 'react';
import LotteryCard from '../components/LotteryCard';
import { LOTERIAS } from '../constants/loterias';

function Home() {
  const [resultados, setResultados] = useState([]);
  const [filteredResultados, setFilteredResultados] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLoteria, setSelectedLoteria] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResultados();
  }, []);

  const fetchResultados = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/latest');
      const data = await response.json();
      setResultados(data);
      setFilteredResultados(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar resultados:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterResultados(value, selectedLoteria);
  };

  const handleLoteriaFilter = (e) => {
    const value = e.target.value;
    setSelectedLoteria(value);
    filterResultados(searchTerm, value);
  };

  const filterResultados = (search, loteria) => {
    let filtered = [...resultados];

    if (loteria) {
      filtered = filtered.filter(resultado => resultado.loteria === loteria);
    }

    if (search) {
      filtered = filtered.filter(resultado => 
        resultado.concurso.toString().includes(search) ||
        resultado.numeros.some(n => n.toString().includes(search))
      );
    }

    setFilteredResultados(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando resultados...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-4">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pesquisar por concurso ou números
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Ex: 2650 ou 10"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por loteria
              </label>
              <select
                value={selectedLoteria}
                onChange={handleLoteriaFilter}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas as loterias</option>
                {Object.entries(LOTERIAS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResultados.map((resultado) => (
            <LotteryCard 
              key={`${resultado.loteria}-${resultado.concurso}`} 
              resultado={resultado} 
            />
          ))}
        </div>

        {filteredResultados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Nenhum resultado encontrado para sua pesquisa.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
