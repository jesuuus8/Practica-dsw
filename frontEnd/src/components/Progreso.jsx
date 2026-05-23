import React, { useEffect, useState } from 'react';
import BarraProgreso from './BarraProgreso';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const STATS = [
  { label: 'Tareas completadas', icon: 'check_circle', color: 'text-primary', bg: 'bg-primary-container/20', key: 'completadas' },
  { label: 'Racha actual',       icon: 'local_fire_department', color: 'text-secondary', bg: 'bg-secondary-container/20', key: 'racha' },
  { label: 'XP esta semana',     icon: 'bolt',          color: 'text-tertiary', bg: 'bg-tertiary-container/20', key: 'xpSemana' },
  { label: 'Logros desbloqueados', icon: 'military_tech', color: 'text-secondary', bg: 'bg-secondary-fixed/30', key: 'logros' },
];

const LOGROS = [
  { icon: 'wb_sunny',    label: 'Madrugador',   color: 'text-primary',   border: 'border-primary-container',   unlocked: true  },
  { icon: 'groups',      label: 'Sinergia',     color: 'text-tertiary',  border: 'border-tertiary-container',  unlocked: true  },
  { icon: 'timer',       label: 'Cazador',      color: 'text-secondary', border: 'border-secondary-container', unlocked: true  },
  { icon: 'military_tech', label: 'Leyenda',    color: 'text-on-surface-variant', border: 'border-outline-variant', unlocked: false },
  { icon: 'auto_awesome', label: 'Perfecto',    color: 'text-on-surface-variant', border: 'border-outline-variant', unlocked: false },
  { icon: 'emoji_events', label: 'Campeón',     color: 'text-on-surface-variant', border: 'border-outline-variant', unlocked: false },
];

export default function Progreso() {
  const [user, setUser]   = useState(null);
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/usuario`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${API}/api/tareas`).then(r => r.ok ? r.json() : []).catch(() => []),
    ]).then(([u, t]) => {
      setUser(u);
      setTareas(t);
      setLoading(false);
    });
  }, []);

  const completadas = tareas.filter(t => t.completada).length;
  const xpTotal     = tareas.filter(t => t.completada).reduce((s, t) => s + (t.puntosExperiencia || 0), 0);
  const nivel       = user?.nivel || 1;
  const xpActual    = user?.xpActual || xpTotal;
  const xpSiguiente = nivel * 100;
  const porcentaje  = Math.min(100, Math.round((xpActual / xpSiguiente) * 100));

  const statsValues = {
    completadas,
    racha: user?.rachaActual || 3,
    xpSemana: xpActual,
    logros: 3,
  };

  return (
    <div className="bg-background text-on-surface min-h-screen pb-28 font-body-md">
      {/* Header */}
      <header className="bg-surface shadow-sm sticky top-0 z-50 flex justify-between items-center px-[20px] py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
            <img
              alt="Avatar"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA98l3sQ2VdiHUk2fFE50ag4rSRbWnMaTawL5VmpCd57n97liDvLVuFx8Wxehn59ZDC_ifONW3ssIMjocw8lecom6dSof9Tw0iY-tG-Q1wp6mzdO3wAt3lJy9wmLlx5I1iPooZ3IAoMxd6lr5M6092T5okg6C1miLxV8d_qSLflO4gxTvh_hCs_RuSRaa66CuBtDp3KqOpAucVDT6z0KcbGEhPnXAOt7Z55vzzi1oit5BSfrxJtCi1pCqzgSPVxZlIsCxHl6VvwEuk"
            />
          </div>
          <h1 className="font-bold text-primary text-2xl">TaskQuest</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center hover:bg-surface-container-high transition-colors rounded-full text-primary">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      <main className="px-[20px] py-6 flex flex-col gap-6">
        {/* Title */}
        <section>
          <h2 className="text-2xl font-bold text-on-surface">Progreso</h2>
          <p className="text-base text-on-surface-variant">Tu evolución como aventurero, {user?.nombre || 'Alex'}</p>
        </section>

        {/* Level Card */}
        <section className="bg-surface-container-lowest rounded-lg p-6 shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] bento-card">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center border-4 border-primary shadow-md overflow-hidden flex-shrink-0">
              <img
                alt="Avatar"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA98l3sQ2VdiHUk2fFE50ag4rSRbWnMaTawL5VmpCd57n97liDvLVuFx8Wxehn59ZDC_ifONW3ssIMjocw8lecom6dSof9Tw0iY-tG-Q1wp6mzdO3wAt3lJy9wmLlx5I1iPooZ3IAoMxd6lr5M6092T5okg6C1miLxV8d_qSLflO4gxTvh_hCs_RuSRaa66CuBtDp3KqOpAucVDT6z0KcbGEhPnXAOt7Z55vzzi1oit5BSfrxJtCi1pCqzgSPVxZlIsCxHl6VvwEuk"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-extrabold text-primary">Nivel {nivel}</span>
                <span className="text-on-surface-variant font-label-sm text-label-sm">
                  {loading ? '...' : `${xpActual} / ${xpSiguiente} XP`}
                </span>
              </div>
              <p className="font-label-lg text-label-lg text-on-surface-variant mb-3">
                {user?.nombre || 'Alex'} • Aventurero Universitario
              </p>
              {/* Progress bar usando BarraProgreso refactorizado */}
              <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(26,63,230,0.4)] transition-all duration-700"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
              <p className="text-xs text-on-surface-variant mt-1">{porcentaje}% hacia el siguiente nivel</p>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 gap-3">
          {STATS.map(s => (
            <div key={s.key} className="bg-surface-container-lowest rounded-lg p-4 shadow-sm flex flex-col gap-2 bento-card">
              <div className={`w-10 h-10 rounded-full ${s.bg} flex items-center justify-center`}>
                <span className={`material-symbols-outlined ${s.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  {s.icon}
                </span>
              </div>
              <span className="text-2xl font-extrabold text-on-surface">
                {loading ? '—' : statsValues[s.key]}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">{s.label}</span>
            </div>
          ))}
        </section>

        {/* Logros */}
        <section className="bg-surface-container-lowest rounded-lg p-5 shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] bento-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-on-surface">Logros</h3>
            <span className="font-label-sm text-label-sm text-primary">3 / {LOGROS.length}</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {LOGROS.map(l => (
              <div
                key={l.label}
                className={`flex flex-col items-center gap-2 ${!l.unlocked ? 'opacity-40 grayscale' : ''}`}
              >
                <div className={`w-16 h-16 rounded-full border-4 ${l.border} bg-surface-container-lowest shadow-sm flex items-center justify-center transition-transform hover:scale-110`}>
                  <span
                    className={`material-symbols-outlined text-2xl ${l.color}`}
                    style={{ fontVariationSettings: l.unlocked ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {l.icon}
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-center">{l.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Historial de tareas completadas */}
        <section className="bg-surface-container-lowest rounded-lg p-5 shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] bento-card border-l-4 border-primary">
          <h3 className="text-xl font-semibold text-on-surface mb-4">Últimas completadas</h3>
          {loading ? (
            <p className="text-on-surface-variant text-sm">Cargando...</p>
          ) : tareas.filter(t => t.completada).length === 0 ? (
            <p className="text-on-surface-variant text-sm">Aún no has completado ninguna tarea. ¡Ánimo!</p>
          ) : (
            <div className="space-y-3">
              {tareas.filter(t => t.completada).slice(0, 5).map(t => (
                <div key={t.id} className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-label-lg text-label-lg truncate">{t.titulo}</p>
                    <p className="text-xs text-on-surface-variant">{t.grupo?.nombre || 'Personal'}</p>
                  </div>
                  <span className="font-bold text-sm text-primary flex-shrink-0">+{t.puntosExperiencia || 0} XP</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
