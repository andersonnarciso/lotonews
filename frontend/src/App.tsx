import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LotteryDetails from './pages/LotteryDetails';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:loteria/:concurso" element={<LotteryDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
