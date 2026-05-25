import React, { useEffect, useState } from 'react';
import TopAppBar from './TopAppBar';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8081';

function NuevoGrupoModal({ onCrear, onClose, isFamily }) {
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
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-t-2xl p-6 shadow-2xl animate-slide-up text-on-surface">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline-md text-headline-md">
            {isFamily ? 'Nuevo Grupo Familiar' : 'Nuevo Equipo'}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm border-none focus:ring-2 focus:ring-primary outline-none text-on-surface"
            placeholder={isFamily ? "Nombre del grupo familiar" : "Nombre del equipo"}
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
          <input
            className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm border-none focus:ring-2 focus:ring-primary outline-none text-on-surface"
            placeholder="Descripción (opcional)"
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-primary text-white rounded-xl py-3 font-label-lg text-label-lg mt-2 active:scale-95 transition-transform"
          >
            {isFamily ? 'Crear grupo' : 'Crear equipo'}
          </button>
        </form>
      </div>
    </div>
  );
}

const ICONS = ['groups', 'home', 'favorite', 'diversity_3', 'yard', 'local_laundry_service'];
const COLORS = [
  { bg: 'bg-primary-container/20',   text: 'text-primary'   },
  { bg: 'bg-tertiary-container/20',  text: 'text-tertiary'  },
  { bg: 'bg-secondary-container/20', text: 'text-secondary' },
];

function DetalleGrupoModal({ grupo, currentUser, onClose, onAddMember, onRemoveMember }) {
  const [todosLosUsuarios, setTodosLosUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarUsuarios = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/api/usuario/todos`);
        if (res.ok) {
          const data = await res.json();
          setTodosLosUsuarios(data);
        }
      } catch (e) {
        console.error('Error fetching all users:', e);
      }
      setLoading(false);
    };
    cargarUsuarios();
  }, []);

  const isAdmin = currentUser?.role === 'PADRES' || currentUser?.role === 'PROFESOR';

  const actualesIds = new Set(grupo.miembros?.map(m => m.id) || []);
  const candidatos = todosLosUsuarios.filter(u => 
    !actualesIds.has(u.id) && u.environmentType === currentUser?.environmentType
  );

  const candidatosFiltrados = candidatos.filter(u => 
    u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || 
    (u.email && u.email.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-surface-container-lowest border border-outline-variant/30 w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-scale-in text-on-surface flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-primary leading-tight">{grupo.nombre}</h3>
              <p className="text-xs text-on-surface-variant truncate max-w-[280px]">{grupo.descripcion || 'Sin descripción'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto mb-4 pr-1">
          <h4 className="font-label-lg text-label-lg uppercase tracking-wider text-on-surface-variant mb-3">
            Miembros ({grupo.miembros?.length || 0})
          </h4>
          
          <div className="flex flex-col gap-2.5">
            {grupo.miembros && grupo.miembros.length > 0 ? (
              grupo.miembros.map(m => (
                <div key={m.id} className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-outline-variant/10 shadow-sm hover:shadow transition-shadow">
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={m.imagenUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVQFgaWoaiej0i0ZEHsVfWGUL1yCfFDh0JyUHDPE42xASH6ZtH-Za9SCdLrKU533Zc37S1SFC0M9QdyvUPsgViLt36yaZIwJxEIRMWuHQUwVLT6z_GNrH3U1zm9sreuKb0Cjne9l1bhXxkLxsyzLtCzllITu6Q2xzJ5gPT_xqtVs-eM8Mlti-BcFghvg2DhGNuZ6OzGAEnTUnmTyVq2nQTyQQZFLKQjJvAPKWHwPrRU7s9wbE5Fb0Fn2N9rqxU3r65RAXKyMcxfn8'} 
                      alt={m.nombre} 
                      className="w-10 h-10 rounded-full object-cover border border-outline-variant/30 shadow-sm"
                    />
                    <div className="truncate">
                      <p className="font-semibold text-sm truncate">{m.nombre}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          m.role === 'PROFESOR' || m.role === 'PADRES' 
                            ? 'bg-primary-container text-primary border border-primary/20' 
                            : 'bg-secondary-container text-secondary border border-secondary/20'
                        }`}>
                          {m.role || 'Estudiante'}
                        </span>
                        {m.email && <span className="text-xs text-on-surface-variant truncate">| {m.email}</span>}
                      </div>
                    </div>
                  </div>
                  
                  {isAdmin && (
                    <button 
                      onClick={() => {
                        if (window.confirm(`¿Estás seguro de que quieres eliminar a ${m.nombre} del grupo?`)) {
                          onRemoveMember(m.id);
                        }
                      }} 
                      className="w-8 h-8 rounded-full hover:bg-error/10 text-on-surface-variant hover:text-error flex items-center justify-center transition-colors active:scale-95"
                      title="Eliminar miembro"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-on-surface-variant">No hay miembros en este grupo.</p>
            )}
          </div>

          {/* Add member section */}
          {isAdmin && (
            <div className="mt-6 border-t border-outline-variant/30 pt-4">
              <h4 className="font-label-lg text-label-lg uppercase tracking-wider text-on-surface-variant mb-3">Añadir nuevos miembros</h4>
              
              <div className="relative mb-3">
                <input 
                  type="text" 
                  placeholder="Buscar usuario por nombre..." 
                  value={busqueda} 
                  onChange={e => setBusqueda(e.target.value)} 
                  className="w-full bg-surface-container-low rounded-xl pl-10 pr-4 py-2.5 text-sm border border-outline-variant/20 focus:border-primary outline-none text-on-surface"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-sm">search</span>
              </div>
              
              {loading ? (
                <p className="text-xs text-on-surface-variant text-center py-4">Cargando usuarios...</p>
              ) : busqueda.trim() !== '' && (
                <div className="max-h-40 overflow-y-auto bg-surface-container-low rounded-xl p-2 border border-outline-variant/30 flex flex-col gap-1 shadow-inner">
                  {candidatosFiltrados.length === 0 ? (
                    <p className="text-xs text-on-surface-variant text-center py-4">No se encontraron usuarios o ya están en el grupo</p>
                  ) : (
                    candidatosFiltrados.map(u => (
                      <div key={u.id} className="flex items-center justify-between p-2 hover:bg-surface-container-high rounded-lg transition-colors">
                        <div className="flex items-center gap-2 min-w-0">
                          <img 
                            src={u.imagenUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVQFgaWoaiej0i0ZEHsVfWGUL1yCfFDh0JyUHDPE42xASH6ZtH-Za9SCdLrKU533Zc37S1SFC0M9QdyvUPsgViLt36yaZIwJxEIRMWuHQUwVLT6z_GNrH3U1zm9sreuKb0Cjne9l1bhXxkLxsyzLtCzllITu6Q2xzJ5gPT_xqtVs-eM8Mlti-BcFghvg2DhGNuZ6OzGAEnTUnmTyVq2nQTyQQZFLKQjJvAPKWHwPrRU7s9wbE5Fb0Fn2N9rqxU3r65RAXKyMcxfn8'} 
                            alt={u.nombre} 
                            className="w-8 h-8 rounded-full object-cover border border-outline-variant/20"
                          />
                          <div className="truncate">
                            <p className="text-sm font-semibold truncate">{u.nombre}</p>
                            <p className="text-xs text-on-surface-variant/80 truncate">{u.role || 'Estudiante'}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            onAddMember(u.id);
                            setBusqueda('');
                          }} 
                          className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-white flex items-center justify-center transition-colors active:scale-95"
                          title="Añadir miembro"
                        >
                          <span className="material-symbols-outlined text-sm font-bold">add</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Equipos() {
  const [grupos, setGrupos]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [modal, setModal]             = useState(false);
  const [user, setUser]               = useState(null);
  const [selectedGrupo, setSelectedGrupo] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API}/api/usuario`);
      if (res.ok) {
        const u = await res.json();
        setUser(u);
        document.documentElement.setAttribute('data-env', u.environmentType || 'UNIVERSITY');
      }
    } catch (e) {}
  };

  const fetchGrupos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/grupos`);
      if (res.ok) {
        const allGroups = await res.json();
        const filtered = allGroups.filter(g => {
          const gEnv = g.environmentType || 'UNIVERSITY';
          return gEnv === (user?.environmentType || 'UNIVERSITY');
        });
        setGrupos(filtered);
      }
    } catch (e) { }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchGrupos();
    }
  }, [user]);

  useEffect(() => {
    const refresh = () => {
      fetchUser();
    };
    window.addEventListener('task-updated', refresh);
    window.addEventListener('theme-change', refresh);
    return () => {
      window.removeEventListener('task-updated', refresh);
      window.removeEventListener('theme-change', refresh);
    };
  }, []);

  const crearGrupo = async (payload) => {
    try {
      const res = await fetch(`${API}/api/grupos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          environmentType: user?.environmentType || 'UNIVERSITY'
        }),
      });
      if (res.ok) fetchGrupos();
    } catch (e) { console.error(e); }
  };

  const addMiembro = async (usuarioId) => {
    if (!selectedGrupo) return;
    try {
      const res = await fetch(`${API}/api/grupos/${selectedGrupo.id}/miembros/${usuarioId}`, {
        method: 'POST',
      });
      if (res.ok) {
        const updatedGrupo = await res.json();
        setSelectedGrupo(updatedGrupo);
        fetchGrupos();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const removeMiembro = async (usuarioId) => {
    if (!selectedGrupo) return;
    try {
      const res = await fetch(`${API}/api/grupos/${selectedGrupo.id}/miembros/${usuarioId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const updatedMiembros = selectedGrupo.miembros.filter(m => m.id !== usuarioId);
        setSelectedGrupo({ ...selectedGrupo, miembros: updatedMiembros });
        fetchGrupos();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const isFamily = user?.environmentType === 'FAMILY';

  return (
    <div className="bg-background text-on-surface min-h-screen pb-28 font-body-md">
      <TopAppBar />

      <main className="px-[20px] py-6 flex flex-col gap-6">
        {/* Title */}
        <section>
          <h2 className="text-2xl font-bold text-on-surface">
            {isFamily ? 'Familia' : 'Equipos'}
          </h2>
          <p className="text-base text-on-surface-variant">
            {isFamily ? 'Colabora y organiza las tareas del hogar juntos' : 'Colabora y conquista misiones juntos'}
          </p>
        </section>

        {/* Stats rápidas */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surface-container-lowest rounded-lg p-4 flex flex-col items-center gap-1 shadow-sm">
            <span className="text-2xl font-extrabold text-primary">{grupos.length}</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant text-center">
              {isFamily ? 'Grupos' : 'Equipos'}
            </span>
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
            <h3 className="font-label-lg text-label-lg uppercase tracking-wider text-on-surface-variant">
              {isFamily ? 'Mis Grupos Familiares' : 'Mis Equipos'}
            </h3>
          </div>

          {loading ? (
            <div className="text-center py-8 text-on-surface-variant">Cargando...</div>
          ) : grupos.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-lg p-8 shadow-sm flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant">group_add</span>
              <p className="text-on-surface-variant text-center">Aún no perteneces a ningún grupo.<br/>¡Crea uno o únete a uno!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {grupos.map((g, i) => {
                const col   = COLORS[i % COLORS.length];
                const icon  = ICONS[i % ICONS.length];
                const count = g.miembros?.length || 0;
                return (
                  <div 
                    key={g.id} 
                    onClick={() => setSelectedGrupo(g)}
                    className="bg-surface-container-lowest rounded-lg p-4 shadow-sm flex items-center gap-4 bento-card hover:shadow-md transition-shadow cursor-pointer"
                  >
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
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGrupo(g);
                      }}
                      className="w-9 h-9 rounded-full hover:bg-surface-container-high flex items-center justify-center text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Sugerencias de grupos */}
        <section className="bg-surface-container-lowest rounded-lg p-5 shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] bento-card border-l-4 border-tertiary">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-tertiary">group_add</span>
            <h3 className="font-headline-md text-headline-md text-on-surface">Grupos disponibles</h3>
          </div>
          <p className="text-sm text-on-surface-variant">
            Hay <span className="font-bold text-tertiary">{grupos.length}</span> grupo{grupos.length !== 1 ? 's' : ''} en la plataforma.
            ¡Únete para colaborar juntos!
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
        <NuevoGrupoModal onCrear={crearGrupo} onClose={() => setModal(false)} isFamily={isFamily} />
      )}

      {selectedGrupo && (
        <DetalleGrupoModal 
          grupo={selectedGrupo} 
          currentUser={user} 
          onClose={() => setSelectedGrupo(null)} 
          onAddMember={addMiembro} 
          onRemoveMember={removeMiembro} 
        />
      )}
    </div>
  );
}
