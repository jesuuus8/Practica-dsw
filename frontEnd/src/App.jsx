import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MisionesSemanales from './components/MisionesSemanales';
import Progreso from './components/Progreso';
import Equipos from './components/Equipos';
import Ajustes from './components/Ajustes';
import BottomNavBar from './components/BottomNavBar';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"         element={<Dashboard />} />
        <Route path="/misiones" element={<MisionesSemanales />} />
        <Route path="/progreso" element={<Progreso />} />
        <Route path="/equipos"  element={<Equipos />} />
        <Route path="/ajustes"  element={<Ajustes />} />
      </Routes>
      <BottomNavBar />
    </Router>
  );
}
