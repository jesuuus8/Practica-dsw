import React, { useEffect, useState } from 'react';
import TopAppBar from './TopAppBar';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8081';

function HeroWelcome({ user }) {
  const isFamily = user?.environmentType === 'FAMILY';
  return (
    <section>
      <h2 className="text-2xl font-bold text-on-surface">
        {isFamily ? 'Hogar' : 'El Centro'}
      </h2>
      <p className="text-base text-on-surface-variant">
        {isFamily 
          ? `¿Listo para colaborar hoy en casa, ${user?.nombre || 'jesus'}?` 
          : `¿Listo para las aventuras de hoy, ${user?.nombre || 'jesus'}?`
        }
      </p>
    </section>
  );
}

const LOGROS = [
  { id: 'early', icon: 'wb_sunny', label: 'Madrugador', desc: 'Completa una misión antes de las 9:00 AM.', color: 'text-primary', bg: 'bg-primary-container/20', border: 'border-primary-container', unlocked: true },
  { id: 'synergy', icon: 'groups', label: 'Sinergia', desc: 'Completa una misión en equipo con otros miembros.', color: 'text-tertiary', bg: 'bg-tertiary-container/20', border: 'border-tertiary-container', unlocked: true },
  { id: 'hunter', icon: 'timer', label: 'Cazador', desc: 'Completa 3 misiones en un mismo día.', color: 'text-secondary', bg: 'bg-secondary-container/20', border: 'border-secondary-container', unlocked: true },
  { id: 'legend', icon: 'military_tech', label: 'Leyenda', desc: 'Alcanza el nivel 15 en la plataforma.', color: 'text-on-surface-variant', bg: 'bg-surface-container', border: 'border-outline-variant', unlocked: false },
  { id: 'perfect', icon: 'auto_awesome', label: 'Perfecto', desc: 'Completa todas las misiones semanales sin fallar.', color: 'text-on-surface-variant', bg: 'bg-surface-container', border: 'border-outline-variant', unlocked: false },
  { id: 'champion', icon: 'emoji_events', label: 'Campeón', desc: 'Consigue el primer puesto en la clasificación de la semana.', color: 'text-on-surface-variant', bg: 'bg-surface-container', border: 'border-outline-variant', unlocked: false },
];

const REWARDS = {
  UNIVERSITY: [
    { id: 'coffee', label: 'Pase de café gratis', icon: 'coffee', price: 200, desc: 'Un café caliente gratis en la cafetería del campus.' },
    { id: 'movie', label: 'Noche de película', icon: 'movie', price: 500, desc: 'Una entrada para la noche de cine del equipo.' },
    { id: 'pizza', label: 'Fiesta de Pizza', icon: 'local_pizza', price: 600, desc: 'Una pizza familiar para compartir con tus compañeros.' },
    { id: 'pass', label: 'Pase de entrega tardía', icon: 'edit_calendar', price: 800, desc: 'Extiende el límite de una entrega académica por 24 horas.' },
  ],
  FAMILY: [
    { id: 'free_eve', label: 'Tarde libre de tareas', icon: 'eco', price: 250, desc: 'Líbrate de cualquier tarea asignada para hoy.' },
    { id: 'dinner', label: 'Elegir cena especial', icon: 'restaurant', price: 400, desc: 'Elige tu plato favorito para la cena de hoy.' },
    { id: 'screen', label: 'Tiempo de pantalla extra', icon: 'screenshot_monitor', price: 300, desc: '1 hora adicional para jugar o ver series.' },
    { id: 'game', label: 'Noche de juegos de mesa', icon: 'casino', price: 150, desc: 'Elige el juego para la noche familiar.' },
  ]
};

function ConfettiEffect() {
  const particles = Array.from({ length: 40 }).map((_, i) => {
    const left = Math.random() * 100 + 'vw';
    const delay = Math.random() * 2 + 's';
    const size = Math.random() * 8 + 6 + 'px';
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    const bg = colors[Math.floor(Math.random() * colors.length)];
    return (
      <div
        key={i}
        className="confetti-particle"
        style={{
          left,
          animationDelay: delay,
          width: size,
          height: size,
          backgroundColor: bg,
        }}
      />
    );
  });
  return <div className="fixed inset-0 pointer-events-none z-[999] overflow-hidden">{particles}</div>;
}

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

function AllAchievementsModal({ user, onSelectAchievement, onClose, onCanjear, rewardsList }) {
  const [activeTab, setActiveTab] = useState('logros');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in px-4">
      <div className="bg-surface-container-lowest text-on-surface w-full max-w-lg h-[90vh] max-h-[640px] rounded-2xl shadow-2xl animate-scale-up flex flex-col overflow-hidden border border-outline/10">
        
        <div className="p-5 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low">
          <h3 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">military_tech</span>
            <span>Logros y Recompensas</span>
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex border-b border-outline-variant/20 bg-surface-container-low">
          <button
            onClick={() => setActiveTab('logros')}
            className={`flex-1 py-3 text-center font-label-lg text-label-lg relative transition-colors ${activeTab === 'logros' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Logros
            {activeTab === 'logros' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('recompensas')}
            className={`flex-1 py-3 text-center font-label-lg text-label-lg relative transition-colors ${activeTab === 'recompensas' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Recompensas
            {activeTab === 'recompensas' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-background">
          {activeTab === 'logros' ? (
            <div className="grid grid-cols-2 gap-3">
              {LOGROS.map(l => (
                <div
                  key={l.id}
                  onClick={() => onSelectAchievement(l)}
                  className={`p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm flex flex-col items-center gap-2 hover:border-primary/20 hover:shadow-md cursor-pointer transition-all ${!l.unlocked ? 'opacity-60' : ''}`}
                >
                  <div className={`w-12 h-12 rounded-full border-2 ${l.border} ${l.bg} flex items-center justify-center`}>
                    <span className={`material-symbols-outlined text-xl ${l.color}`} style={{ fontVariationSettings: l.unlocked ? "'FILL' 1" : "'FILL' 0" }}>
                      {l.icon}
                    </span>
                  </div>
                  <span className="font-bold text-sm text-center truncate w-full">{l.label}</span>
                  <span className="text-[10px] text-on-surface-variant text-center leading-tight line-clamp-2">{l.desc}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-surface-container-low rounded-xl mb-4">
                <span className="text-sm font-semibold">Tus Puntos:</span>
                <span className="flex items-center gap-1 text-secondary font-extrabold text-lg">
                  <span className="material-symbols-outlined">monetization_on</span>
                  {user?.puntos || 0}
                </span>
              </div>
              
              {rewardsList.map(r => {
                const canAfford = (user?.puntos || 0) >= r.price;
                return (
                  <div
                    key={r.id}
                    className={`p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm flex items-center gap-3 transition-all ${!canAfford ? 'opacity-60' : ''}`}
                  >
                    <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center flex-shrink-0 relative">
                      <span className="material-symbols-outlined !text-2xl">{r.icon}</span>
                      {!canAfford && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-outline-variant text-on-surface-variant rounded-full flex items-center justify-center border border-surface-container-lowest">
                          <span className="material-symbols-outlined !text-[10px]">lock</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{r.label}</p>
                      <p className="text-xs text-on-surface-variant line-clamp-1">{r.desc}</p>
                      <span className="text-xs font-bold text-secondary flex items-center gap-0.5 mt-0.5">
                        <span className="material-symbols-outlined text-xs">monetization_on</span>
                        {r.price} pts
                      </span>
                    </div>
                    {canAfford ? (
                      <button
                        onClick={() => onCanjear(r)}
                        className="bg-primary text-white rounded-lg px-3 py-1.5 font-label-md text-label-md active:scale-95 transition-transform"
                      >
                        Canjear
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-surface-container text-on-surface-variant/40 cursor-not-allowed rounded-lg px-3 py-1.5 font-label-md text-label-md flex items-center gap-0.5"
                      >
                        <span className="material-symbols-outlined text-xs">lock</span>
                        Bloqueado
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Achievements({ onSelectAchievement, onOpenAll }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex justify-between items-end">
        <h3 className="uppercase tracking-wider text-on-surface-variant font-semibold">Logros</h3>
        <span onClick={onOpenAll} className="text-primary font-medium cursor-pointer flex items-center gap-0.5 hover:underline text-sm">
          Ver todos
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </span>
      </div>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-[20px] px-[20px]">
        {LOGROS.map(l => (
          <div
            key={l.id}
            onClick={() => onSelectAchievement(l)}
            className={`flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer transition-all hover:scale-105 ${!l.unlocked ? 'opacity-50' : ''}`}
          >
            <div className={`w-20 h-20 rounded-full border-4 border-surface-container-low bg-surface-container-lowest shadow-sm flex items-center justify-center transition-transform group-hover:scale-110 relative`}>
              <span className={`material-symbols-outlined text-3xl ${l.color}`} style={{fontVariationSettings: l.unlocked ? "'FILL' 1" : "'FILL' 0"}}>
                {l.icon}
              </span>
              {!l.unlocked && (
                <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-outline-variant text-on-surface-variant flex items-center justify-center border border-surface-container-lowest">
                  <span className="material-symbols-outlined !text-xs">lock</span>
                </div>
              )}
            </div>
            <span className="text-xs font-semibold">{l.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Leaderboard({ user, usuarios }) {
  const isFamily = user?.environmentType === 'FAMILY';
  const env = user?.environmentType || 'UNIVERSITY';
  const filtrados = (usuarios || []).filter(u => (u.environmentType || 'UNIVERSITY') === env);
  
  const sorted = [...filtrados].sort((a, b) => {
    const levelA = a.nivel || 1;
    const levelB = b.nivel || 1;
    if (levelB !== levelA) return levelB - levelA;
    const xpA = a.xpActual || 0;
    const xpB = b.xpActual || 0;
    return xpB - xpA;
  });

  return (
    <section className="bg-surface-container-lowest rounded-lg p-5 shadow bento-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-on-surface">
          {isFamily ? 'Clasificación Familiar' : 'Clasificación'}
        </h3>
        <span className="material-symbols-outlined text-secondary">emoji_events</span>
      </div>
      <div className="space-y-4">
        {sorted.map((u, index) => {
          const isCurrentUser = u.id === user?.id;
          const uIsAdmin = u.role === 'PROFESOR' || u.role === 'PADRES';
          const level = u.nivel || 1;
          const xp = u.xpActual || 0;
          const rank = uIsAdmin ? '—' : (index + 1);
          
          let borderCol = 'border-surface-variant';
          let rankCol = 'text-on-surface-variant';
          if (index === 0) {
            borderCol = 'border-secondary';
            rankCol = 'text-secondary';
          } else if (index === 1) {
            borderCol = 'border-primary';
            rankCol = 'text-primary';
          }
          
          return (
            <div key={u.id} className="flex items-center gap-4">
              <span className={`font-bold text-lg w-4 ${rankCol}`}>{rank}</span>
              <div className={`w-12 h-12 rounded-full border-2 ${borderCol} overflow-hidden flex-shrink-0`}>
                <img alt={u.nombre} className="w-full h-full object-cover" src={u.imagenUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBVQFgaWoaiej0i0ZEHsVfWGUL1yCfFDh0JyUHDPE42xASH6ZtH-Za9SCdLrKU533Zc37S1SFC0M9QdyvUPsgViLt36yaZIwJxEIRMWuHQUwVLT6z_GNrH3U1zm9sreuKb0Cjne9l1bhXxkLxsyzLtCzllITu6Q2xzJ5gPT_xqtVs-eM8Mlti-BcFghvg2DhGNuZ6OzGAEnTUnmTyVq2nQTyQQZFLKQjJvAPKWHwPrRU7s9wbE5Fb0Fn2N9rqxU3r65RAXKyMcxfn8"} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">
                    {u.nombre} {isCurrentUser && ' (Tú)'}
                    {uIsAdmin && (
                      <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full ml-2 font-normal">
                        {u.role === 'PADRES' ? 'Padre/Madre' : 'Profesor'}
                      </span>
                    )}
                  </span>
                  <span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full text-xs">
                    Nivel {level}
                  </span>
                </div>
                <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full shadow" 
                    style={{ width: `${Math.min(100, xp)}%` }} 
                  />
                </div>
              </div>
            </div>
          );
        })}
        {sorted.length === 0 && (
          <p className="text-sm text-on-surface-variant text-center py-4">No hay participantes todavía.</p>
        )}
      </div>
    </section>
  );
}

function WeeklyQuests({ user, tareas }) {
  const isFamily = user?.environmentType === 'FAMILY';
  const activeTareas = tareas.filter(t => !t.completada);
  const completedCount = tareas.filter(t => t.completada).length;

  return (
    <section className="bg-surface-container-lowest rounded-lg p-5 shadow bento-card border-l-4 border-primary">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-on-surface">
          {isFamily ? 'Tareas de Casa' : 'Misiones semanales'}
        </h3>
        <span className="font-medium text-primary">
          {completedCount}/{tareas.length} Completadas
        </span>
      </div>
      <div className="space-y-3">
        {activeTareas.length === 0 ? (
          <p className="text-sm text-on-surface-variant italic">No hay tareas pendientes.</p>
        ) : (
          activeTareas.slice(0, 3).map(t => (
            <div key={t.id} className="flex items-center gap-4 p-3 bg-surface-container-low rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined">
                  {isFamily ? 'cleaning_services' : 'menu_book'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{t.titulo}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-on-surface-variant truncate">{t.descripcion || 'Sin descripción'}</p>
                  {t.realizada && (
                    <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider animate-pulse flex-shrink-0">Por confirmar</span>
                  )}
                </div>
              </div>
              <span className="text-xs font-bold text-secondary flex-shrink-0">+{t.puntosExperiencia} XP</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function TeamStore({ user, onCanjear, rewardsList }) {
  const isFamily = user?.environmentType === 'FAMILY';

  return (
    <section className="bg-surface-container-lowest rounded-lg p-5 shadow bento-card border border-outline-variant/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-on-surface">
          {isFamily ? 'Recompensas Familiares' : 'Tienda del equipo'}
        </h3>
        <div className="flex items-center gap-1 text-secondary font-bold bg-secondary/10 px-3 py-1 rounded-full text-sm">
          <span className="material-symbols-outlined text-sm">monetization_on</span>
          <span>{user?.puntos || 0} pts</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {rewardsList.map(r => {
          const canAfford = (user?.puntos || 0) >= r.price;
          return (
            <div
              key={r.id}
              onClick={() => { if (canAfford) onCanjear(r); }}
              className={`p-3 bg-surface-container rounded-xl flex flex-col items-center gap-2 border-2 transition-all relative ${canAfford ? 'border-transparent hover:border-secondary cursor-pointer hover:shadow-sm' : 'border-transparent opacity-60'}`}
            >
              <div className="w-12 h-12 bg-white dark:bg-surface-container-low rounded-full flex items-center justify-center shadow-sm relative">
                <span className="material-symbols-outlined text-secondary">{r.icon}</span>
                {!canAfford && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-outline-variant text-on-surface-variant rounded-full flex items-center justify-center border border-surface-container-lowest">
                    <span className="material-symbols-outlined !text-[10px]">lock</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-center font-semibold line-clamp-1 w-full">{r.label}</p>
              <span className="text-xs font-bold text-secondary flex items-center gap-0.5">
                <span className="material-symbols-outlined text-xs">monetization_on</span>
                {r.price} pts
              </span>
              
              {canAfford && (
                <button
                  onClick={(e) => { e.stopPropagation(); onCanjear(r); }}
                  className="bg-primary text-white rounded-lg text-[10px] font-bold px-2 py-1 mt-1 active:scale-95 transition-transform"
                >
                  Canjear
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TeamChat({ user }) {
  const isFamily = user?.environmentType === 'FAMILY';

  const [messages, setMessages] = useState([
    { id: 1, sender: isFamily ? "Mamá" : "Sara", avatar: isFamily ? "https://lh3.googleusercontent.com/aida-public/AB6AXuAa1Ey8dl5fTJkSD_XWQWxd8ZEqBHYRBPiQoEajoS3yG6JGsKo_8DnY2AqoBbHrLJ4bYDOy6avIPoBDpF_KeaCPrZpgsgce7f8EyAkIkWXm_nSpTe2kJ7nmNXEvHfcqnbVsOZfnu07eD6BOese3E0ZLonu9V4cl60lg9e9XFpast5rNEKfmBOcCVHDofhIWiMKS6E5rZjz4D-Cj_wqFRawcBDg45mxwuFVIPjsicVxbmIlNZ1VX-5CgiltLiCFwJDsYUju1X42ijio" : "https://lh3.googleusercontent.com/aida-public/AB6AXuCD0EFEpmSsu62hpej9QRsF8e5XUheWe4uxeKU1gnnXyd9OXrHfzCpRMv3yn6XhvKv-KFyry2DNI2DW-SQ4HSTbGVOQpVZLZRWAn45nwG3aDKcbPCyPta2wds3LbIkB8O6Ddc_kSsc2KbS-GLN9L6VE3jSCjz_j1m28d_Vl9UpXBfasWIvbzPo4NIZ1wQrDvaVC83lWFjIY1evWjYMx5Dy_ByvF4YbvCiekXSca00NQ3jwafbNoUuLG1vHLMyDjr9DqIdAZFi6b6s4", text: isFamily ? "¿Alguien puede sacar la basura antes de cenar?" : "¿Todos terminaron la lectura de Biología?", isMe: false },
    { id: 2, sender: "Tú", avatar: "", text: isFamily ? "¡Yo me encargo! Sacaré al perro también. 🐾" : "¡Casi! Solo me faltan 2 páginas. 📚", isMe: true },
    { id: 3, sender: isFamily ? "Papá" : "Juan", avatar: isFamily ? "https://lh3.googleusercontent.com/aida-public/AB6AXuC4ClzKjSwZHGhWbm9wQWhfvNzQXqyUyKESilqAfNaaZcN0vLQXvBev946XJN-VCT_g4BGquDOux1-nnyvSJgExaCfwTm1FhAa44fEnrhTu77aLf6iu77rvqeGoMK85RrtxNG72RCEJS0w4CTA0whUtr2LxjXlnK4qJnlYHIekAPbLdEQ1cHJGd0rB5JiSLPceZeHT7WGSTA4lZRN8h6-OYbh-QDayOHlqXo4_GEeqBqv67Nee_2-oN4zcxMwr8fRDKKQHmq4HZfYg" : "https://lh3.googleusercontent.com/aida-public/AB6AXuC4ClzKjSwZHGhWbm9wQWhfvNzQXqyUyKESilqAfNaaZcN0vLQXvBev946XJN-VCT_g4BGquDOux1-nnyvSJgExaCfwTm1FhAa44fEnrhTu77aLf6iu77rvqeGoMK85RrtxNG72RCEJS0w4CTA0whUtr2LxjXlnK4qJnlYHIekAPbLdEQ1cHJGd0rB5JiSLPceZeHT7WGSTA4lZRN8h6-OYbh-QDayOHlqXo4_GEeqBqv67Nee_2-oN4zcxMwr8fRDKKQHmq4HZfYg", text: isFamily ? "Genial, yo haré los platos." : "Yo también. ¿Quedamos a las 5?", isMe: false }
  ]);
  const [inputText, setInputText] = useState("");
  const chatEndRef = React.useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: "Tú",
        avatar: "",
        text: inputText.trim(),
        isMe: true
      }
    ]);
    setInputText("");
  };

  return (
    <section className="bg-surface-container-lowest rounded-lg p-5 shadow bento-card overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold text-on-surface leading-tight">
            {isFamily ? 'Chat familiar' : 'Grupo de estudio'}
          </h3>
          <p className="text-xs text-on-surface-variant">
            {isFamily ? 'Familia activa' : '4 miembros activos'}
          </p>
        </div>
        <button className="text-primary"><span className="material-symbols-outlined">more_horiz</span></button>
      </div>
      <div ref={chatEndRef} className="space-y-4 max-h-[200px] overflow-y-auto pr-2 hide-scrollbar">
        {messages.map(msg => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
            {!msg.isMe && (
              <img alt={msg.sender} className="w-8 h-8 rounded-full" src={msg.avatar} />
            )}
            <div className={`${msg.isMe ? 'bg-primary-container text-on-primary-container rounded-l-xl rounded-br-xl' : 'bg-surface-container-high text-on-surface rounded-r-xl rounded-bl-xl'} p-3 max-w-[80%]`}>
              {!msg.isMe && (
                <p className="text-xs font-bold text-on-surface mb-1">{msg.sender}</p>
              )}
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <input
          className="flex-1 bg-surface-container-low border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
          placeholder="Escribe un mensaje..."
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
        />
        <button type="submit" className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-sm">send</span>
        </button>
      </form>
    </section>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tareas, setTareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para logros y tienda interactivos
  const [selectedLogro, setSelectedLogro] = useState(null);
  const [showAllModal, setShowAllModal] = useState(false);
  const [celebrationReward, setCelebrationReward] = useState(null);

  const loadData = () => {
    Promise.all([
      fetch(`${API}/api/usuario`).then(r => r.ok ? r.json() : null),
      fetch(`${API}/api/tareas`).then(r => r.ok ? r.json() : []),
      fetch(`${API}/api/usuario/todos`).then(r => r.ok ? r.json() : [])
    ]).then(([u, t, us]) => {
      if (u) {
        setUser(u);
        document.documentElement.setAttribute('data-env', u.environmentType || 'UNIVERSITY');
      }
      setTareas(t);
      setUsuarios(us || []);
      setLoading(false);
    }).catch(e => {
      console.error(e);
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

  const handleCanjear = async (reward) => {
    if (!user || user.puntos < reward.price) return;
    const nuevosPuntos = user.puntos - reward.price;
    try {
      const res = await fetch(`${API}/api/usuario`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, puntos: nuevosPuntos }),
      });
      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        setCelebrationReward(reward);
        window.dispatchEvent(new Event('theme-change'));
        setTimeout(() => {
          setCelebrationReward(null);
        }, 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="bg-background text-on-surface font-body-md min-h-screen flex items-center justify-center">
        <p>Cargando panel...</p>
      </div>
    );
  }

  const env = user?.environmentType || 'UNIVERSITY';
  const tareasEntorno = tareas.filter(t => t.environmentType === env);
  const rewardsList = REWARDS[env] || [];

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen pb-24">
      <TopAppBar />
      <main className="px-[20px] py-6 flex flex-col gap-6">
        <HeroWelcome user={user} />
        <Achievements onSelectAchievement={setSelectedLogro} onOpenAll={() => setShowAllModal(true)} />
        <Leaderboard user={user} usuarios={usuarios} />
        <WeeklyQuests user={user} tareas={tareasEntorno} />
        <TeamStore user={user} onCanjear={handleCanjear} rewardsList={rewardsList} />
        <TeamChat user={user} />
      </main>

      {/* Modales de Logros y Tienda */}
      {selectedLogro && (
        <AchievementDetailModal logro={selectedLogro} onClose={() => setSelectedLogro(null)} />
      )}
      
      {showAllModal && (
        <AllAchievementsModal
          user={user}
          rewardsList={rewardsList}
          onSelectAchievement={setSelectedLogro}
          onCanjear={handleCanjear}
          onClose={() => setShowAllModal(false)}
        />
      )}

      {celebrationReward && (
        <>
          <ConfettiEffect />
          <div className="fixed top-10 left-[50%] -translate-x-[50%] z-[200] bg-primary text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-scale-up border border-white/20">
            <span className="material-symbols-outlined text-3xl animate-bounce">celebration</span>
            <div>
              <p className="font-bold text-sm">¡Canjeado con éxito!</p>
              <p className="text-xs text-white/90">Disfruta de: {celebrationReward.label}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
