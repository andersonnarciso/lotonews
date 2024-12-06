import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="text-white text-xl font-bold">LotoNews</span>
          </Link>
          
          <div className="hidden md:flex space-x-4">
            <Link 
              to="/?loteria=megasena" 
              className="text-white hover:text-blue-200 px-3 py-2 rounded-md"
            >
              Mega-Sena
            </Link>
            <Link 
              to="/?loteria=lotofacil" 
              className="text-white hover:text-blue-200 px-3 py-2 rounded-md"
            >
              Lotofácil
            </Link>
            <Link 
              to="/?loteria=quina" 
              className="text-white hover:text-blue-200 px-3 py-2 rounded-md"
            >
              Quina
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
