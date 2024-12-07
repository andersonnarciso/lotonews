import React, { useState, useEffect } from 'react';
import LotteryCard from '../components/LotteryCard';
import api from '../services/api';
import { LOTERIAS } from '../constants/loterias';

function Home() {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLottery, setSelectedLottery] = useState('');
  const [concursos, setConcursos] = useState([]);
  const [selectedConcurso, setSelectedConcurso] = useState('');

  useEffect(() => {
    fetchLatestResults();
  }, []);

  useEffect(() => {
    if (selectedLottery) {
      fetchConcursos(selectedLottery);
    }
  }, [selectedLottery]);

  useEffect(() => {
    if (selectedLottery && selectedConcurso) {
      fetchSpecificResult(selectedLottery, selectedConcurso);
    }
  }, [selectedConcurso]);

  const fetchLatestResults = async () => {
    try {
      setLoading(true);
      const response = await api.get('/latest');
      setResultados(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar resultados');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConcursos = async (loteria) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/${loteria}/concursos`);
      setConcursos(response.data);
    } catch (err) {
      setError('Erro ao carregar concursos');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecificResult = async (loteria, concurso) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/search?loteria=${loteria}&concurso=${concurso}`);
      if (response.data.length > 0) {
        setResultados([response.data[0]]);
      }
    } catch (err) {
      setError('Erro ao carregar resultado específico');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLotteryChange = (e) => {
    setSelectedLottery(e.target.value);
    setSelectedConcurso('');
    setConcursos([]);
  };

  const handleConcursoChange = (e) => {
    setSelectedConcurso(e.target.value);
  };

  const handleReset = () => {
    setSelectedLottery('');
    setSelectedConcurso('');
    setConcursos([]);
    fetchLatestResults();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loteria
            </label>
            <select
              value={selectedLottery}
              onChange={handleLotteryChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione uma loteria</option>
              {Object.entries(LOTERIAS).map(([key, value]) => (
                <option key={key} value={key}>{value.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Concurso
            </label>
            <select
              value={selectedConcurso}
              onChange={handleConcursoChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              disabled={!selectedLottery}
            >
              <option value="">Selecione um concurso</option>
              {concursos.map((concurso) => (
                <option key={concurso.concurso} value={concurso.concurso}>
                  Concurso {concurso.concurso} - {new Date(concurso.data_sorteio).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Limpar filtros
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resultados.map((resultado) => (
          <LotteryCard 
            key={`${resultado.loteria}-${resultado.concurso}`} 
            resultado={resultado} 
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
