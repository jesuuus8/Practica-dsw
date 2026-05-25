import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNavBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [env, setEnv] = useState(() => localStorage.getItem('environmentType') || 'UNIVERSITY');

  useEffect(() => {
    const handleThemeChange = () => {
      setEnv(localStorage.getItem('environmentType') || 'UNIVERSITY');
    };
    window.addEventListener('theme-change', handleThemeChange);
    return () => window.removeEventListener('theme-change', handleThemeChange);
  }, []);

  const isFamily = env === 'FAMILY';

  const navItems = [
    { path: '/',         icon: 'dashboard',            label: isFamily ? 'Hogar' : 'Inicio',   fillIcon: true  },
    { path: '/misiones', icon: isFamily ? 'home_repair_service' : 'assignment_turned_in',  label: isFamily ? 'Tareas Casa' : 'Misiones', fillIcon: true  },
    { path: '/progreso', icon: 'leaderboard',            label: 'Progreso', fillIcon: false },
    { path: '/equipos',  icon: 'groups',                label: isFamily ? 'Familia' : 'Equipos',  fillIcon: false },
    { path: '/ajustes',  icon: 'settings',              label: 'Ajustes',  fillIcon: false },
  ];

  return (
    <nav className="bg-surface shadow-[0_-4px_20px_0_rgba(0,0,0,0.05)] fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-4 pt-2 rounded-t-lg">
      {navItems.map(({ path, icon, label, fillIcon }) => {
        const isActive = pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center justify-center px-4 py-1 rounded-xl transition-all duration-200 active:scale-90
              ${isActive
                ? 'bg-primary-container text-on-primary-container'
                : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: isActive && fillIcon ? "'FILL' 1" : "'FILL' 0" }}
            >
              {icon}
            </span>
            <span className="font-label-sm text-label-sm">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
