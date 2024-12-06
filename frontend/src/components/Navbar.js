import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  
  const loterias = [
    { id: 'megasena', nome: 'Mega-Sena' },
    { id: 'lotofacil', nome: 'Lotofácil' },
    { id: 'quina', nome: 'Quina' },
    { id: 'lotomania', nome: 'Lotomania' },
    { id: 'timemania', nome: 'Timemania' }
  ];

  const handleLoteriaClick = async (loteria) => {
    try {
      const response = await fetch(`http://localhost:3001/api/${loteria}`);
      const data = await response.json();
      if (data && data.length > 0) {
        navigate(`/${loteria}/${data[0].concurso}`);
      }
    } catch (error) {
      console.error('Erro ao buscar resultados:', error);
    }
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center h-auto md:h-16">
          <Link to="/" className="flex items-center py-4 md:py-0">
            <span className="text-white text-xl font-bold">LotoNews</span>
          </Link>
          
          <div className="flex flex-wrap justify-center gap-2 pb-4 md:pb-0">
            {loterias.map((loteria) => (
              <button
                key={loteria.id}
                onClick={() => handleLoteriaClick(loteria.id)}
                className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                {loteria.nome}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
