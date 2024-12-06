import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Premiacao {
  acertos: number;
  vencedores: number;
  premio: number;
}

interface Sorteio {
  id: number;
  loteria: string;
  concurso: number;
  data_sorteio: string;
  numeros: number[];
  premiacoes: Premiacao[];
  acumulou: boolean;
}

function LotteryDetails() {
  const { loteria, concurso } = useParams();
  const [sorteio, setSorteio] = useState<Sorteio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/${loteria}/${concurso}`);
        setSorteio(response.data);
        setLoading(false);
      } catch (error) {
        setError('Erro ao carregar os dados do sorteio');
        setLoading(false);
      }
    };

    fetchDetails();
  }, [loteria, concurso]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !sorteio) {
    return (
      <div className="text-center text-red-600 py-8">
        {error || 'Sorteio não encontrado'}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 capitalize mb-2">
          {sorteio.loteria} - Concurso {sorteio.concurso}
        </h1>
        <p className="text-gray-600">
          {new Date(sorteio.data_sorteio).toLocaleDateString('pt-BR')}
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Números Sorteados</h2>
        <div className="flex flex-wrap gap-3">
          {sorteio.numeros.map((numero, index) => (
            <span
              key={index}
              className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full text-blue-800 font-bold text-lg"
            >
              {numero}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Premiações</h2>
        <div className="space-y-4">
          {sorteio.premiacoes.map((premiacao, index) => (
            <div key={index} className="flex justify-between items-center border-b pb-2">
              <div>
                <span className="font-medium">{premiacao.acertos} acertos: </span>
                <span className="text-gray-600">
                  {premiacao.vencedores} ganhador{premiacao.vencedores !== 1 ? 'es' : ''}
                </span>
              </div>
              <span className="font-semibold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(premiacao.premio)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {sorteio.acumulou && (
        <div className="mt-6 text-center">
          <p className="text-lg font-semibold text-green-600">
            Prêmio Acumulado!
          </p>
        </div>
      )}
    </div>
  );
}

export default LotteryDetails;
