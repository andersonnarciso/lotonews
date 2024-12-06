import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Sorteio {
  id: number;
  loteria: string;
  concurso: number;
  data_sorteio: string;
  numeros: number[];
  premiacoes: any;
  acumulou: boolean;
}

function Home() {
  const [latestResults, setLatestResults] = useState<Sorteio[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/latest');
        setLatestResults(response.data);
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Últimos Resultados</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {latestResults.map((sorteio) => (
          <Link 
            key={sorteio.id} 
            to={`/${sorteio.loteria}/${sorteio.concurso}`}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 capitalize">
                {sorteio.loteria}
              </h2>
              <span className="text-sm text-gray-600">
                Concurso {sorteio.concurso}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {sorteio.numeros.map((numero, index) => (
                <span 
                  key={index}
                  className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full text-blue-800 font-semibold"
                >
                  {numero}
                </span>
              ))}
            </div>
            
            <div className="text-sm text-gray-600">
              {new Date(sorteio.data_sorteio).toLocaleDateString('pt-BR')}
              {sorteio.acumulou && (
                <span className="ml-2 text-green-600 font-semibold">
                  Acumulou!
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
