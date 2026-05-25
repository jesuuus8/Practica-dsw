import React, { useEffect, useState } from 'react';
import TopAppBar from './TopAppBar';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const STATS = [
  { label: 'Tareas completadas', icon: 'check_circle', color: 'text-primary', bg: 'bg-primary-container/20', key: 'completadas' },
  { label: 'Racha actual',       icon: 'local_fire_department', color: 'text-secondary', bg: 'bg-secondary-container/20', key: 'racha' },
  { label: 'XP acumulados',      icon: 'bolt',          color: 'text-tertiary', bg: 'bg-tertiary-container/20', key: 'xpTotal' },
  { label: 'Logros desbloqueados', icon: 'military_tech', color: 'text-secondary', bg: 'bg-secondary-fixed/30', key: 'logros' },
];

const LOGROS = [
  { id: 'early', icon: 'wb_sunny', label: 'Madrugador', desc: 'Completa una misión antes de las 9:00 AM.', color: 'text-primary', bg: 'bg-primary-container/20', border: 'border-primary-container', unlocked: true },
  { id: 'synergy', icon: 'groups', label: 'Sinergia', desc: 'Completa una misión en equipo con otros miembros.', color: 'text-tertiary', bg: 'bg-tertiary-container/20', border: 'border-tertiary-container', unlocked: true },
  { id: 'hunter', icon: 'timer', label: 'Cazador', desc: 'Completa 3 misiones en un mismo día.', color: 'text-secondary', bg: 'bg-secondary-container/20', border: 'border-secondary-container', unlocked: true },
  { id: 'legend', icon: 'military_tech', label: 'Leyenda', desc: 'Alcanza el nivel 15 en la plataforma.', color: 'text-on-surface-variant', bg: 'bg-surface-container', border: 'border-outline-variant', unlocked: false },
  { id: 'perfect', icon: 'auto_awesome', label: 'Perfecto', desc: 'Completa todas las misiones semanales sin fallar.', color: 'text-on-surface-variant', bg: 'bg-surface-container', border: 'border-outline-variant', unlocked: false },
  { id: 'champion', icon: 'emoji_events', label: 'Campeón', desc: 'Consigue el primer puesto en la clasificación de la semana.', color: 'text-on-surface-variant', bg: 'bg-surface-container', border: 'border-outline-variant', unlocked: false },
];

function AchievementDetailModal({ logro, onClose }) {
  if (!logro) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in px-4">
      <div className="bg-surface-container-lowest text-on-surface w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-scale-up relative overflow-hidden border border-outline/10">
        
        {logro.unlocked && (
          <div className="absolute top-[-50px] left-[50%] -translate-x-[50%] w-60 h-60 bg-primary/10 rounded-full filter blur-xl pointer-events-none" />
        )}

        <div className="flex flex-col items-center text-center mt-4">
          <div className="relative mb-6">
            {logro.unlocked && (
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-glow" />
            )}
            <div className={`w-24 h-24 rounded-full border-4 ${logro.border} bg-surface-container-low flex items-center justify-center relative z-10`}>
              <span className={`material-symbols-outlined !text-5xl ${logro.color}`} style={{ fontVariationSettings: logro.unlocked ? "'FILL' 1" : "'FILL' 0" }}>
                {logro.icon}
              </span>
            </div>
            {!logro.unlocked && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-outline-variant text-on-surface-variant flex items-center justify-center border-2 border-surface-container-lowest z-20">
                <span className="material-symbols-outlined !text-sm">lock</span>
              </div>
            )}
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${logro.unlocked ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant'}`}>
            {logro.unlocked ? 'Desbloqueado' : 'Bloqueado'}
          </span>

          <h3 className="text-2xl font-bold text-on-surface mb-2">{logro.label}</h3>
          <p className="text-sm text-on-surface-variant px-4 mb-6 leading-relaxed">
            {logro.desc}
          </p>

          <button
            onClick={onClose}
            className="w-full bg-primary text-white rounded-xl py-3 font-label-lg text-label-lg active:scale-95 transition-transform shadow-md"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Progreso() {
  const [user, setUser]   = useState(null);
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLogro, setSelectedLogro] = useState(null);

  const loadData = () => {
    Promise.all([
      fetch(`${API}/api/usuario`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${API}/api/tareas`).then(r => r.ok ? r.json() : []).catch(() => []),
    ]).then(([u, t]) => {
      if (u) {
        setUser(u);
        document.documentElement.setAttribute('data-env', u.environmentType || 'UNIVERSITY');
      }
      setTareas(t);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
    window.addEventListener('task-updated', loadData);
    window.addEventListener('theme-change', loadData);
    return () => {
      window.removeEventListener('task-updated', loadData);
      window.removeEventListener('theme-change', loadData);
    };
  }, []);

  const env = user?.environmentType || 'UNIVERSITY';
  const isFamily = env === 'FAMILY';

  // Filtrar tareas por entorno
  const tareasFiltradas = tareas.filter(t => t.environmentType === env);
  const completadas = tareasFiltradas.filter(t => t.completada).length;
  const xpTotal     = user?.xpActual || tareasFiltradas.filter(t => t.completada).reduce((s, t) => s + (t.puntosExperiencia || 0), 0);
  const nivel       = user?.nivel || 1;
  const xpActual    = user?.xpActual || 0;
  const xpSiguiente = 100; // El nivel sube cada 100 XP según el backend
  const porcentaje  = Math.min(100, Math.round((xpActual / xpSiguiente) * 100));

  const statsValues = {
    completadas,
    racha: 3,
    xpTotal,
    logros: 3,
  };

  const avatarUrl = user?.imagenUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBVQFgaWoaiej0i0ZEHsVfWGUL1yCfFDh0JyUHDPE42xASH6ZtH-Za9SCdLrKU533Zc37S1SFC0M9QdyvUPsgViLt36yaZIwJxEIRMWuHQUwVLT6z_GNrH3U1zm9sreuKb0Cjne9l1bhXxkLxsyzLtCzllITu6Q2xzJ5gPT_xqtVs-eM8Mlti-BcFghvg2DhGNuZ6OzGAEnTUnmTyVq2nQTyQQZFLKQjJvAPKWHwPrRU7s9wbE5Fb0Fn2N9rqxU3r65RAXKyMcxfn8";

  const getRoleLabel = () => {
    if (!user?.role) return isFamily ? 'Familiar' : 'Estudiante';
    const r = user.role;
    if (r === 'ESTUDIANTE') return 'Estudiante';
    if (r === 'PROFESOR') return 'Profesor';
    if (r === 'FAMILIAR') return 'Familiar / Hijo';
    if (r === 'PADRES') return 'Padre / Madre';
    return r;
  };

  return (
    <div className="bg-background text-on-surface min-h-screen pb-28 font-body-md">
      <TopAppBar />

      <main className="px-[20px] py-6 flex flex-col gap-6">
        {/* Title */}
        <section>
          <h2 className="text-2xl font-bold text-on-surface">Progreso</h2>
          <p className="text-base text-on-surface-variant">Tu evolución como aventurero, {user?.nombre || 'jesus'}</p>
        </section>

        {/* Level Card */}
        <section className="bg-surface-container-lowest rounded-lg p-6 shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] bento-card">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center border-4 border-primary shadow-md overflow-hidden flex-shrink-0">
              <img
                alt="Avatar"
                className="w-full h-full object-cover"
                src={avatarUrl}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                <span className="text-3xl font-extrabold text-primary">Nivel {nivel}</span>
                <span className="text-on-surface-variant font-label-sm text-label-sm">
                  {loading ? '...' : `${xpActual} / ${xpSiguiente} XP`}
                </span>
              </div>
              <p className="font-label-lg text-label-lg text-on-surface-variant mb-3">
                {user?.nombre || 'jesus'} • {getRoleLabel()} ({isFamily ? 'Hogar' : 'Academia'})
              </p>
              {/* Progress bar */}
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
                onClick={() => setSelectedLogro(l)}
                className={`flex flex-col items-center gap-2 cursor-pointer transition-all hover:scale-105 ${!l.unlocked ? 'opacity-40' : ''}`}
              >
                <div className={`w-16 h-16 rounded-full border-4 border-surface-container-low bg-surface-container-lowest shadow-sm flex items-center justify-center transition-transform hover:scale-110 relative`}>
                  <span
                    className={`material-symbols-outlined text-2xl ${l.color}`}
                    style={{ fontVariationSettings: l.unlocked ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {l.icon}
                  </span>
                  {!l.unlocked && (
                    <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-outline-variant text-on-surface-variant flex items-center justify-center border border-surface-container-lowest">
                      <span className="material-symbols-outlined !text-[10px]">lock</span>
                    </div>
                  )}
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
          ) : tareasFiltradas.filter(t => t.completada).length === 0 ? (
            <p className="text-on-surface-variant text-sm">Aún no has completado ninguna tarea. ¡Ánimo!</p>
          ) : (
            <div className="space-y-3">
              {tareasFiltradas.filter(t => t.completada).slice(0, 5).map(t => (
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

      {selectedLogro && (
        <AchievementDetailModal logro={selectedLogro} onClose={() => setSelectedLogro(null)} />
      )}
    </div>
  );
}
