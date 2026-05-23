import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/',         icon: 'dashboard',            label: 'Inicio',   fillIcon: true  },
  { path: '/misiones', icon: 'assignment_turned_in',  label: 'Misiones', fillIcon: true  },
  { path: '/progreso', icon: 'leaderboard',            label: 'Progreso', fillIcon: false },
  { path: '/equipos',  icon: 'groups',                label: 'Equipos',  fillIcon: false },
  { path: '/ajustes',  icon: 'settings',              label: 'Ajustes',  fillIcon: false },
];

export default function BottomNavBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="bg-surface shadow-[0_-4px_20px_0_rgba(0,0,0,0.05)] fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-4 pt-2 rounded-t-lg">
      {NAV_ITEMS.map(({ path, icon, label, fillIcon }) => {
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
