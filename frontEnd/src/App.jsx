import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MisionesSemanales from './components/MisionesSemanales';

export default function App() {
  return (
    <Router>
      <nav className="flex gap-4 p-4 bg-surface-container-lowest shadow-sm">
        <Link to="/" className="text-primary hover:underline">Dashboard</Link>
        <Link to="/misiones" className="text-primary hover:underline">Misiones Semanales</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/misiones" element={<MisionesSemanales />} />
      </Routes>
    </Router>
  );
}
