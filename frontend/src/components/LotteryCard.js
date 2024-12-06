import React from 'react';
import { Link } from 'react-router-dom';
import { LOTERIAS, formatarNumero, formatarData, formatarMoeda } from '../constants/loterias';

const LotteryBall = ({ number, loteria }) => {
  const { bola } = LOTERIAS[loteria];
  
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold md:w-12 md:h-12 md:text-base"
      style={{ 
        backgroundColor: bola.cor,
        color: bola.texto
      }}
    >
      {formatarNumero(number)}
    </div>
  );
};

const AccumulatedRibbon = ({ premio }) => (
  <div className="absolute -top-2 -right-2 bg-yellow-500 text-black px-4 py-1 rotate-12 shadow-lg z-10 font-bold text-sm md:text-base">
    Acumulou {formatarMoeda(premio)}
  </div>
);

function LotteryCard({ resultado }) {
  const { loteria, concurso, data_sorteio, numeros, premiacoes, acumulou } = resultado;
  const config = LOTERIAS[loteria];

  return (
    <Link 
      to={\`/\${loteria}/\${concurso}\`}
      className="block w-full transition-transform hover:scale-102 focus:outline-none focus:ring-2"
      style={{ borderColor: config.cor }}
    >
      <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
        {acumulou && premiacoes[0]?.premio && (
          <AccumulatedRibbon premio={premiacoes[0].premio} />
        )}
        
        <div 
          className="p-4"
          style={{ backgroundColor: config.cor + '10' }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold" style={{ color: config.cor }}>
              {config.nome}
            </h2>
            <div className="text-right">
              <div className="text-sm text-gray-600">Concurso</div>
              <div className="font-bold">{concurso}</div>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            {formatarData(data_sorteio)}
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {numeros.map((numero, index) => (
              <LotteryBall 
                key={index} 
                number={numero} 
                loteria={loteria}
              />
            ))}
          </div>

          <div className="space-y-2">
            {premiacoes.map((premiacao, index) => (
              <div 
                key={index}
                className="flex justify-between text-sm"
              >
                <span>{premiacao.acertos} acertos</span>
                <span className="font-bold">
                  {premiacao.vencedores} ganhadores
                </span>
                <span className="text-green-600">
                  {formatarMoeda(premiacao.premio)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default LotteryCard;
