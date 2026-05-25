import React, { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8081';

export default function TopAppBar() {
  const [user, setUser] = useState(null);
  const [tareas, setTareas] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchData = async () => {
    try {
      const [uRes, tRes] = await Promise.all([
        fetch(`${API}/api/usuario`),
        fetch(`${API}/api/tareas`)
      ]);
      if (uRes.ok) setUser(await uRes.json());
      if (tRes.ok) setTareas(await tRes.json());
    } catch (e) {
      console.error('Error fetching header data:', e);
    }
  };

  useEffect(() => {
    fetchData();
    window.addEventListener('task-updated', fetchData);
    window.addEventListener('theme-change', fetchData);
    return () => {
      window.removeEventListener('task-updated', fetchData);
      window.removeEventListener('theme-change', fetchData);
    };
  }, []);

  const confirmarTarea = async (id) => {
    try {
      const res = await fetch(`${API}/api/tareas/${id}/confirmar`, { method: 'PUT' });
      if (res.ok) {
        window.dispatchEvent(new Event('task-updated'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const rechazarTarea = async (id) => {
    try {
      const res = await fetch(`${API}/api/tareas/${id}/rechazar`, { method: 'PUT' });
      if (res.ok) {
        window.dispatchEvent(new Event('task-updated'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const env = user?.environmentType || 'UNIVERSITY';
  const isAdmin = user?.role === 'PROFESOR' || user?.role === 'PADRES';
  const pendientesConfirmacion = tareas.filter(t => t.environmentType === env && t.realizada && !t.completada);
  const avatarUrl = user?.imagenUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBVQFgaWoaiej0i0ZEHsVfWGUL1yCfFDh0JyUHDPE42xASH6ZtH-Za9SCdLrKU533Zc37S1SFC0M9QdyvUPsgViLt36yaZIwJxEIRMWuHQUwVLT6z_GNrH3U1zm9sreuKb0Cjne9l1bhXxkLxsyzLtCzllITu6Q2xzJ5gPT_xqtVs-eM8Mlti-BcFghvg2DhGNuZ6OzGAEnTUnmTyVq2nQTyQQZFLKQjJvAPKWHwPrRU7s9wbE5Fb0Fn2N9rqxU3r65RAXKyMcxfn8";

  return (
    <header className="bg-surface shadow-sm docked full-width top-0 z-50 sticky">
      <div className="flex justify-between items-center w-full px-[20px] py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
            <img alt="Avatar de usuario" className="w-full h-full object-cover" src={avatarUrl} />
          </div>
          <h1 className="font-bold text-primary text-2xl">Gamify</h1>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-primary relative"
          >
            <span className="material-symbols-outlined">notifications</span>
            {isAdmin && pendientesConfirmacion.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
                {pendientesConfirmacion.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 shadow-2xl z-[100] animate-scale-up text-on-surface">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-outline-variant/20">
                <span className="font-bold text-sm text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">notifications</span>
                  Aprobaciones pendientes
                </span>
                <button onClick={() => setShowNotifications(false)} className="text-xs text-on-surface-variant hover:text-on-surface font-semibold">Cerrar</button>
              </div>
              
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                {isAdmin && pendientesConfirmacion.length > 0 ? (
                  pendientesConfirmacion.map(t => (
                    <div key={t.id} className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/10 flex flex-col gap-2 shadow-sm">
                      <div>
                        <p className="text-xs font-bold text-primary truncate">{t.titulo}</p>
                        {t.descripcion && <p className="text-[11px] text-on-surface-variant line-clamp-2">{t.descripcion}</p>}
                        <p className="text-[9px] text-secondary font-semibold mt-1">
                          👤 Asignado: {t.usuarioAsignado?.nombre || 'General'} • +{t.puntosExperiencia} XP
                        </p>
                      </div>
                      
                      <div className="flex gap-1.5 justify-end">
                        <button 
                          onClick={() => {
                            rechazarTarea(t.id);
                            setShowNotifications(false);
                          }}
                          className="bg-error/10 hover:bg-error text-error hover:text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors active:scale-95 flex items-center gap-0.5"
                        >
                          <span className="material-symbols-outlined text-xs">close</span>
                          Rechazar
                        </button>
                        <button 
                          onClick={() => {
                            confirmarTarea(t.id);
                            setShowNotifications(false);
                          }}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors active:scale-95 flex items-center gap-0.5"
                        >
                          <span className="material-symbols-outlined text-xs">check</span>
                          Confirmar
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-on-surface-variant text-center py-6">No tienes notificaciones pendientes.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
