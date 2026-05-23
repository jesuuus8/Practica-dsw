import React, { useEffect, useState } from 'react';
import GrupoView from './GrupoView';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8081';

function NuevoGrupoModal({ onCrear, onClose }) {
  const [nombre, setNombre] = useState('');
  const [desc, setDesc]     = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    await onCrear({ nombre, descripcion: desc });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-t-2xl p-6 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline-md text-headline-md text-on-surface">Nuevo Equipo</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm border-none focus:ring-2 focus:ring-primary outline-none"
            placeholder="Nombre del equipo"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
          <input
            className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm border-none focus:ring-2 focus:ring-primary outline-none"
            placeholder="Descripción (opcional)"
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-primary text-white rounded-xl py-3 font-label-lg text-label-lg mt-2 active:scale-95 transition-transform"
          >
            Crear equipo
          </button>
        </form>
      </div>
    </div>
  );
}

const ICONS = ['groups', 'science', 'sports_esports', 'music_note', 'code', 'palette'];
const COLORS = [
  { bg: 'bg-primary-container/20',   text: 'text-primary'   },
  { bg: 'bg-tertiary-container/20',  text: 'text-tertiary'  },
  { bg: 'bg-secondary-container/20', text: 'text-secondary' },
];

export default function Equipos() {
  const [grupos, setGrupos]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);

  const fetchGrupos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/grupos`);
      if (res.ok) setGrupos(await res.json());
    } catch (e) { /* sin backend muestra vacío */ }
    setLoading(false);
  };

  useEffect(() => { fetchGrupos(); }, []);

  const crearGrupo = async (payload) => {
    try {
      const res = await fetch(`${API}/api/grupos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) fetchGrupos();
    } catch (e) { console.error(e); }
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
          <h2 className="text-2xl font-bold text-on-surface">Equipos</h2>
          <p className="text-base text-on-surface-variant">Colabora y conquista misiones juntos</p>
        </section>

        {/* Stats rápidas */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surface-container-lowest rounded-lg p-4 flex flex-col items-center gap-1 shadow-sm">
            <span className="text-2xl font-extrabold text-primary">{grupos.length}</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant text-center">Equipos</span>
          </div>
          <div className="bg-surface-container-lowest rounded-lg p-4 flex flex-col items-center gap-1 shadow-sm">
            <span className="text-2xl font-extrabold text-tertiary">
              {grupos.reduce((s, g) => s + (g.miembros?.length || 0), 0)}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant text-center">Miembros</span>
          </div>
          <div className="bg-surface-container-lowest rounded-lg p-4 flex flex-col items-center gap-1 shadow-sm">
            <span className="text-2xl font-extrabold text-secondary">4</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant text-center">Activos hoy</span>
          </div>
        </div>

        {/* Lista de grupos */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-label-lg text-label-lg uppercase tracking-wider text-on-surface-variant">Mis Equipos</h3>
          </div>

          {loading ? (
            <div className="text-center py-8 text-on-surface-variant">Cargando equipos...</div>
          ) : grupos.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-lg p-8 shadow-sm flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant">group_add</span>
              <p className="text-on-surface-variant text-center">Aún no perteneces a ningún equipo.<br/>¡Crea uno o únete a uno!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {grupos.map((g, i) => {
                const col   = COLORS[i % COLORS.length];
                const icon  = ICONS[i % ICONS.length];
                const count = g.miembros?.length || 0;
                return (
                  <div key={g.id} className="bg-surface-container-lowest rounded-lg p-4 shadow-sm flex items-center gap-4 bento-card hover:shadow-md transition-shadow">
                    <div className={`w-14 h-14 rounded-2xl ${col.bg} flex items-center justify-center flex-shrink-0`}>
                      <span className={`material-symbols-outlined text-2xl ${col.text}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                        {icon}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-label-lg text-label-lg truncate">{g.nombre}</p>
                      {g.descripcion && <p className="text-xs text-on-surface-variant truncate">{g.descripcion}</p>}
                      <div className="flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-xs text-on-surface-variant" style={{ fontSize: '14px' }}>person</span>
                        <span className="text-xs text-on-surface-variant">{count} miembro{count !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <button className="w-9 h-9 rounded-full hover:bg-surface-container-high flex items-center justify-center text-primary transition-colors">
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Sugerencias de grupos (usando GrupoView como referencia visual) */}
        <section className="bg-surface-container-lowest rounded-lg p-5 shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] bento-card border-l-4 border-tertiary">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-tertiary">group_add</span>
            <h3 className="font-headline-md text-headline-md text-on-surface">Grupos disponibles</h3>
          </div>
          {/* Reutiliza GrupoView pero sin estilos antiguos */}
          <p className="text-sm text-on-surface-variant">
            Hay <span className="font-bold text-tertiary">{grupos.length}</span> equipo{grupos.length !== 1 ? 's' : ''} en la plataforma.
            ¡Únete para ganar XP en equipo!
          </p>
        </section>
      </main>

      {/* FAB: crear equipo */}
      <button
        onClick={() => setModal(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-tertiary-container text-on-tertiary-container rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-40"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>

      {modal && (
        <NuevoGrupoModal onCrear={crearGrupo} onClose={() => setModal(false)} />
      )}
    </div>
  );
}
