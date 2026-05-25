import React, { useState, useEffect } from "react";
import TopAppBar from "./TopAppBar";

const API = import.meta.env.VITE_API_URL || 'http://localhost:8081';

function ProgressBar({ percent }) {
  return (
    <div className="h-4 w-full bg-surface-container-highest rounded-full overflow-hidden">
      <div
        className="h-full bg-primary progress-glow rounded-full transition-all duration-700 ease-out"
        style={{ width: percent + "%" }}
      ></div>
    </div>
  );
}

function QuestCard({ icon, colorClass, badge, title, desc, xp, extra, actions, usuarioAsignado }) {
  return (
    <div className="bg-surface-container-lowest rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow group border-2 border-transparent hover:border-primary/10 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className={`w-14 h-14 ${colorClass} rounded-2xl flex items-center justify-center`}>
            <span className="material-symbols-outlined !text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className={badge.className}>{badge.text}</span>
            {usuarioAsignado && (
              <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">person</span>
                {usuarioAsignado.nombre}
              </span>
            )}
          </div>
        </div>
        <h3 className="font-headline-md text-headline-md text-on-surface mb-1 truncate">{title}</h3>
        <p className="font-body-md text-body-md text-on-surface-variant mb-4">{desc} • <span className="text-secondary font-bold">+{xp} XP</span></p>
      </div>
      <div className="flex items-center justify-between mt-6 pt-2 border-t border-outline-variant/10">
        {extra}
        {actions}
      </div>
    </div>
  );
}

const getQuestStyle = (titulo, index, env) => {
  const t = (titulo || '').toLowerCase();
  const isFamily = env === 'FAMILY';

  if (isFamily) {
    if (t.includes('platos') || t.includes('vajilla') || t.includes('cocina') || t.includes('cenar') || t.includes('comida')) {
      return {
        icon: 'flatware',
        colorClass: 'bg-secondary-container/20 text-secondary',
        badge: { className: 'bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full font-label-sm text-label-sm', text: 'Cocina' },
        buttonIcon: 'check_circle',
        buttonColor: 'bg-primary text-on-primary'
      };
    }
    if (t.includes('limpiar') || t.includes('salón') || t.includes('polvo') || t.includes('aspirar') || t.includes('ordenar')) {
      return {
        icon: 'cleaning_services',
        colorClass: 'bg-primary-container/10 text-primary',
        badge: { className: 'bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full font-label-sm text-label-sm', text: 'Limpieza' },
        buttonIcon: 'check_circle',
        buttonColor: 'bg-primary text-on-primary'
      };
    }
    if (t.includes('basura') || t.includes('reciclar') || t.includes('contenedor') || t.includes('bolsa')) {
      return {
        icon: 'delete',
        colorClass: 'bg-tertiary-container/20 text-tertiary',
        badge: { className: 'bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full font-label-sm text-label-sm', text: 'Hogar' },
        buttonIcon: 'check_circle',
        buttonColor: 'bg-primary text-on-primary'
      };
    }
    const defaultFamilyIcons = ['home', 'eco', 'mop', 'check_box'];
    return {
      icon: defaultFamilyIcons[index % defaultFamilyIcons.length],
      colorClass: 'bg-primary-container/10 text-primary',
      badge: { className: 'bg-surface-container text-on-surface-variant px-3 py-1 rounded-full font-label-sm text-label-sm', text: 'Tarea' },
      buttonIcon: 'check_circle',
      buttonColor: 'bg-primary text-on-primary'
    };
  }

  // Universidad
  if (t.includes('biología') || t.includes('estudio') || t.includes('libro') || t.includes('leer')) {
    return {
      icon: 'menu_book',
      colorClass: 'bg-tertiary-container/20 text-tertiary',
      badge: { className: 'bg-error-container text-on-error-container px-3 py-1 rounded-full font-label-sm text-label-sm', text: 'Alta Prioridad' },
      buttonIcon: 'check_circle',
      buttonColor: 'bg-primary text-on-primary'
    };
  }
  if (t.includes('cardio') || t.includes('entrenamiento') || t.includes('ejercicio') || t.includes('deporte') || t.includes('fitness')) {
    return {
      icon: 'fitness_center',
      colorClass: 'bg-secondary-container/20 text-secondary',
      badge: { className: 'bg-surface-container text-on-surface-variant px-3 py-1 rounded-full font-label-sm text-label-sm', text: 'Salud' },
      buttonIcon: 'check_circle',
      buttonColor: 'bg-primary text-on-primary'
    };
  }
  if (t.includes('proyecto') || t.includes('revisión') || t.includes('reunión') || t.includes('grupo') || t.includes('social')) {
    return {
      icon: 'groups',
      colorClass: 'bg-primary-container/10 text-primary',
      badge: { className: 'bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full font-label-sm text-label-sm', text: 'Social' },
      buttonIcon: 'check_circle',
      buttonColor: 'bg-primary text-on-primary'
    };
  }
  if (t.includes('arquitectura') || t.includes('sketch') || t.includes('dibujo') || t.includes('arte') || t.includes('paleta')) {
    return {
      icon: 'palette',
      colorClass: 'bg-secondary-fixed/40 text-on-secondary-container',
      badge: { className: 'bg-surface-container text-on-surface-variant px-3 py-1 rounded-full font-label-sm text-label-sm', text: 'Opcional' },
      buttonIcon: 'check_circle',
      buttonColor: 'bg-primary text-on-primary'
    };
  }
  const defaultIcons = ['assignment', 'pending_actions', 'star', 'task'];
  const defaultColors = [
    { bg: 'bg-primary-container/15 text-primary', color: 'bg-primary text-on-primary' },
    { bg: 'bg-secondary-container/15 text-secondary', color: 'bg-secondary text-on-secondary' },
    { bg: 'bg-tertiary-container/15 text-tertiary', color: 'bg-tertiary text-on-tertiary' }
  ];
  const idx = index % 3;
  return {
    icon: defaultIcons[index % defaultIcons.length],
    colorClass: defaultColors[idx].bg,
    badge: { className: 'bg-surface-container text-on-surface-variant px-3 py-1 rounded-full font-label-sm text-label-sm', text: 'Misión' },
    buttonIcon: 'check_circle',
    buttonColor: defaultColors[idx].color
  };
};

function NuevaMisionModal({ onCrear, onClose, env }) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [puntos, setPuntos] = useState(100);
  const [fechaLimite, setFechaLimite] = useState('');
  const [grupos, setGrupos] = useState([]);
  const [grupoId, setGrupoId] = useState('');

  // Estados para reparto por IA
  const [descripcionIa, setDescripcionIa] = useState('');
  const [loadingIa, setLoadingIa]         = useState(false);

  useEffect(() => {
    fetch(`${API}/api/grupos`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setGrupos(data.filter(g => (g.environmentType || 'UNIVERSITY') === env)))
      .catch(() => {});
  }, [env]);

  const submit = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    const payload = {
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      puntosExperiencia: Number(puntos),
      fechaLimite: fechaLimite || null,
      completada: false,
      environmentType: env
    };
    if (grupoId) {
      payload.grupo = { id: Number(grupoId) };
    }
    await onCrear(payload);
    onClose();
  };

  const handleIaDistribute = async () => {
    if (!grupoId || !descripcionIa.trim()) return;
    setLoadingIa(true);
    try {
      const res = await fetch(`${API}/api/tareas/distribuir-ia`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grupoId: Number(grupoId),
          descripcionGeneral: descripcionIa.trim()
        })
      });
      if (res.ok) {
        await onCrear(); // Refrescar las tareas en MisionesSemanales
        onClose();
      } else {
        alert("Ocurrió un error al repartir las tareas con IA. Verifica que el grupo tenga miembros asignados.");
      }
    } catch (e) {
      console.error("Error al distribuir con IA:", e);
      alert("Error de conexión al servidor.");
    } finally {
      setLoadingIa(false);
    }
  };

  const isFamily = env === 'FAMILY';

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-t-2xl p-6 shadow-2xl animate-slide-up text-on-surface max-h-[90vh] overflow-y-auto hide-scrollbar">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline-md text-headline-md">
            {isFamily ? 'Nueva Tarea de Casa' : 'Nueva Misión'}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            required
            className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm border-none focus:ring-2 focus:ring-primary outline-none text-on-surface"
            placeholder={isFamily ? "Título de la tarea (ej: Lavar platos)" : "Título de la misión"}
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
          />
          <input
            className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm border-none focus:ring-2 focus:ring-primary outline-none text-on-surface"
            placeholder="Descripción (opcional)"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-on-surface-variant px-1">Dificultad / XP</label>
              <select
                className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm border-none focus:ring-2 focus:ring-primary outline-none text-on-surface"
                value={puntos}
                onChange={e => setPuntos(e.target.value)}
              >
                <option value={50}>Fácil - 50 XP</option>
                <option value={100}>Media - 100 XP</option>
                <option value={150}>Difícil - 150 XP</option>
                <option value={200}>Épica - 200 XP</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-on-surface-variant px-1">Fecha Límite</label>
              <input
                type="date"
                className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm border-none focus:ring-2 focus:ring-primary outline-none text-on-surface"
                value={fechaLimite}
                onChange={e => setFechaLimite(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-on-surface-variant px-1">
              {isFamily ? 'Asociar a un Grupo (opcional)' : 'Equipo Asociado (opcional)'}
            </label>
            <select
              className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm border-none focus:ring-2 focus:ring-primary outline-none text-on-surface"
              value={grupoId}
              onChange={e => setGrupoId(e.target.value)}
            >
              <option value="">
                {isFamily ? 'Ninguno (Tarea Personal)' : 'Ninguno (Misión Personal)'}
              </option>
              {grupos.map(g => (
                <option key={g.id} value={g.id}>{g.nombre}</option>
              ))}
            </select>
          </div>

          {grupoId && (
            <div className="mt-2 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col gap-3">
              <span className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
                <span className="material-symbols-outlined text-base">psychology</span>
                Repartir Tarea General con IA 🤖
              </span>
              <textarea
                className="w-full bg-surface-container-low text-on-surface rounded-xl px-3 py-2 text-sm border-none focus:ring-2 focus:ring-primary outline-none resize-none h-20"
                placeholder="Describe lo que hay que hacer (ej: Lavar platos, barrer el comedor y tirar la basura)..."
                value={descripcionIa}
                onChange={e => setDescripcionIa(e.target.value)}
              />
              <button
                type="button"
                onClick={handleIaDistribute}
                disabled={loadingIa || !descripcionIa.trim()}
                className="w-full bg-primary hover:bg-primary/95 text-white disabled:bg-surface-container-high disabled:text-on-surface-variant/40 rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
              >
                {loadingIa ? (
                  <>
                    <span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>
                    <span>Asignando tareas con IA...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">magic_button</span>
                    <span>Repartir con IA</span>
                  </>
                )}
              </button>
            </div>
          )}

          <div className="border-t border-outline-variant/20 my-1"></div>

          <button
            type="submit"
            className="w-full bg-primary text-white rounded-xl py-3 font-label-lg text-label-lg mt-1 active:scale-95 transition-transform"
          >
            {isFamily ? 'Crear tarea manual' : 'Crear misión manual'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function MisionesSemanales() {
  const [user, setUser] = useState(null);
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('activas');
  const [modal, setModal] = useState(false);
  const [loadingRealizar, setLoadingRealizar] = useState({});
  const [animatingTask, setAnimatingTask] = useState({});

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API}/api/usuario`);
      if (res.ok) {
        const u = await res.json();
        setUser(u);
        document.documentElement.setAttribute('data-env', u.environmentType || 'UNIVERSITY');
      }
    } catch (e) { console.error(e); }
  };

  const fetchTareas = async () => {
    try {
      const res = await fetch(`${API}/api/tareas`);
      if (res.ok) setTareas(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const refreshAll = () => {
    fetchUser();
    fetchTareas();
  };

  useEffect(() => {
    refreshAll();
    window.addEventListener('task-updated', refreshAll);
    window.addEventListener('theme-change', refreshAll);
    return () => {
      window.removeEventListener('task-updated', refreshAll);
      window.removeEventListener('theme-change', refreshAll);
    };
  }, []);

  const realizarTarea = async (id) => {
    setLoadingRealizar(prev => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`${API}/api/tareas/${id}/realizar`, { method: 'PUT' });
      if (res.ok) {
        setLoadingRealizar(prev => ({ ...prev, [id]: false }));
        setAnimatingTask(prev => ({ ...prev, [id]: 'success' }));
        setTimeout(() => {
          setAnimatingTask(prev => ({ ...prev, [id]: null }));
          refreshAll();
          window.dispatchEvent(new Event('task-updated'));
        }, 800);
      } else {
        setLoadingRealizar(prev => ({ ...prev, [id]: false }));
      }
    } catch (e) {
      console.error(e);
      setLoadingRealizar(prev => ({ ...prev, [id]: false }));
    }
  };

  const confirmarTarea = async (id) => {
    try {
      const res = await fetch(`${API}/api/tareas/${id}/confirmar`, { method: 'PUT' });
      if (res.ok) {
        fetchTareas();
        fetchUser();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const rechazarTarea = async (id) => {
    try {
      const res = await fetch(`${API}/api/tareas/${id}/rechazar`, { method: 'PUT' });
      if (res.ok) {
        fetchTareas();
        fetchUser();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const completarTarea = async (id) => {
    try {
      const res = await fetch(`${API}/api/tareas/${id}/completar`, { method: 'PUT' });
      if (res.ok) {
        fetchTareas();
        fetchUser();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const crearTarea = async (payload) => {
    if (!payload) {
      fetchTareas();
      return;
    }
    try {
      const res = await fetch(`${API}/api/tareas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        fetchTareas();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getLimitText = (t) => {
    if (t.completada) return "Completada";
    if (!t.fechaLimite) return "Sin límite";
    const limitDate = new Date(t.fechaLimite + "T00:00:00");
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const diffTime = limitDate - todayDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return `Venció hace ${Math.abs(diffDays)} día${Math.abs(diffDays) !== 1 ? 's' : ''}`;
    if (diffDays === 0) return "Vence hoy";
    if (diffDays === 1) return "Vence mañana";
    return `Vence en ${diffDays} días`;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const env = user?.environmentType || 'UNIVERSITY';
  const isFamily = env === 'FAMILY';
  const isAdmin = user?.role === 'PROFESOR' || user?.role === 'PADRES';

  const misionesFiltradas = tareas
    .filter(t => t.environmentType === env)
    .filter(t => {
      const hasLimit = !!t.fechaLimite;
      const limitDate = hasLimit ? new Date(t.fechaLimite + "T00:00:00") : null;
      const isExpired = !t.completada && hasLimit && limitDate < today;
      const isActive = !t.completada && (!hasLimit || limitDate >= today);
      const isCompleted = t.completada;

      if (filtro === 'activas') return isActive;
      if (filtro === 'completadas') return isCompleted;
      if (filtro === 'expiradas') return isExpired;
      return true;
    });

  const totalMisiones = tareas.filter(t => t.environmentType === env).length;
  const completadasCount = tareas.filter(t => t.environmentType === env && t.completada).length;
  const porcentaje = totalMisiones > 0 ? Math.round((completadasCount / totalMisiones) * 100) : 0;
  const avatarUrl = user?.imagenUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBVQFgaWoaiej0i0ZEHsVfWGUL1yCfFDh0JyUHDPE42xASH6ZtH-Za9SCdLrKU533Zc37S1SFC0M9QdyvUPsgViLt36yaZIwJxEIRMWuHQUwVLT6z_GNrH3U1zm9sreuKb0Cjne9l1bhXxkLxsyzLtCzllITu6Q2xzJ5gPT_xqtVs-eM8Mlti-BcFghvg2DhGNuZ6OzGAEnTUnmTyVq2nQTyQQZFLKQjJvAPKWHwPrRU7s9wbE5Fb0Fn2N9rqxU3r65RAXKyMcxfn8";

  const pendientesConfirmacion = tareas.filter(t => t.environmentType === env && t.realizada && !t.completada);

  return (
    <div className="bg-background text-on-background min-h-screen pb-32 font-body-md relative">
      <TopAppBar />
      <main className="px-[20px] max-w-[1200px] mx-auto mt-6">
        <section className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-1">
              {isFamily ? 'Tareas de Casa' : 'Misiones Semanales'}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant italic opacity-80">
              {isFamily 
                ? '"¡Manteniendo el hogar limpio, organizado y feliz!"' 
                : '"¡Cada tarea es un paso más hacia tu mejor versión!"'
              }
            </p>
          </div>
          
          {/* Restricción de rol administrador */}
          {isAdmin && (
            <button
              onClick={() => setModal(true)}
              className="bg-primary text-white rounded-xl px-4 py-2.5 font-label-lg text-label-lg active:scale-95 transition-all flex items-center gap-1 shadow-md hover:bg-primary/95 hover:shadow-lg"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span>Nueva</span>
            </button>
          )}
        </section>
        
        <section className="bg-surface-container-lowest rounded-lg p-6 mb-6 shadow-sm border border-outline-variant/10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="font-label-lg text-label-lg text-primary block mb-1">Progreso Actual</span>
              <span className="font-headline-md text-headline-md text-on-surface">
                {completadasCount}/{totalMisiones} Completadas
              </span>
            </div>
            <div className="text-right">
              <span className="font-label-sm text-label-sm text-on-surface-variant">{porcentaje}%</span>
            </div>
          </div>
          <ProgressBar percent={porcentaje} />
        </section>
        
        <nav className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar pb-2">
          <button
            onClick={() => setFiltro('activas')}
            className={`px-6 py-2.5 rounded-full font-label-lg text-label-lg whitespace-nowrap shadow-sm transition-colors ${
              filtro === 'activas'
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Activas
          </button>
          <button
            onClick={() => setFiltro('completadas')}
            className={`px-6 py-2.5 rounded-full font-label-lg text-label-lg whitespace-nowrap transition-colors ${
              filtro === 'completadas'
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Completadas
          </button>
          <button
            onClick={() => setFiltro('expiradas')}
            className={`px-6 py-2.5 rounded-full font-label-lg text-label-lg whitespace-nowrap transition-colors ${
              filtro === 'expiradas'
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Expiradas
          </button>
        </nav>
        
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-8 text-on-surface-variant">Cargando misiones...</div>
          ) : misionesFiltradas.length === 0 ? (
            <div className="col-span-full text-center py-8 text-on-surface-variant">No hay misiones en esta categoría.</div>
          ) : (
            misionesFiltradas.map((t, idx) => {
              const style = getQuestStyle(t.titulo, idx, env);
              const limitText = getLimitText(t);
              let extra = null;
              if (filtro === 'expiradas') {
                extra = <span className="text-error font-label-lg italic">¡Expirada!</span>;
              } else if (filtro === 'completadas') {
                extra = <span className="text-primary font-label-lg italic">¡Completada!</span>;
              } else {
                if (t.titulo.toLowerCase().includes('biología') || t.titulo.toLowerCase().includes('limpiar')) {
                  extra = (
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container-high"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-primary text-[10px] text-white flex items-center justify-center font-bold">+3</div>
                    </div>
                  );
                } else if (t.titulo.toLowerCase().includes('cardio') || t.titulo.toLowerCase().includes('platos')) {
                  extra = <div className="bg-secondary-fixed/30 text-on-secondary-fixed-variant px-3 py-1 rounded-lg font-label-sm">Progreso: 1/3</div>;
                } else {
                  extra = (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-on-surface-variant text-sm">schedule</span>
                      <span className="font-label-sm text-on-surface-variant">Activa</span>
                    </div>
                  );
                }
              }
              let actions = null;
              if (animatingTask[t.id] === 'success') {
                actions = (
                  <span className="flex items-center gap-1 text-emerald-500 font-bold text-xs bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 uppercase tracking-wider animate-checkmark-pop animate-green-ripple">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    ¡Realizada!
                  </span>
                );
              } else if (t.completada) {
                actions = (
                  <span className="flex items-center gap-1 text-emerald-500 font-bold text-xs bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    Confirmada
                  </span>
                );
              } else if (t.realizada) {
                if (isAdmin) {
                  actions = (
                    <button 
                      onClick={() => confirmarTarea(t.id)} 
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-xl active:scale-95 transition-transform flex items-center gap-1.5 shadow-md hover:shadow-lg text-xs uppercase tracking-wider"
                    >
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Confirmar
                    </button>
                  );
                } else {
                  actions = (
                    <span className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 uppercase tracking-wider animate-pulse">
                      <span className="material-symbols-outlined text-sm">hourglass_empty</span>
                      Por confirmar
                    </span>
                  );
                }
              } else {
                actions = (
                  <button 
                    disabled={loadingRealizar[t.id]}
                    onClick={() => realizarTarea(t.id)} 
                    className={`${style.buttonColor} px-4 py-2.5 rounded-xl font-bold active:scale-95 transition-all flex items-center gap-1.5 shadow-md text-xs uppercase tracking-wider disabled:opacity-60`}
                  >
                    {loadingRealizar[t.id] ? (
                      <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                    ) : (
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                    )}
                    <span>Realizada</span>
                  </button>
                );
              }

              return (
                <QuestCard
                  key={t.id}
                  icon={style.icon}
                  colorClass={style.colorClass}
                  badge={style.badge}
                  title={t.titulo}
                  desc={limitText}
                  xp={t.puntosExperiencia || 0}
                  extra={extra}
                  actions={actions}
                  usuarioAsignado={t.usuarioAsignado}
                />
              );
            })
          )}
        </section>
      </main>
      {modal && (
        <NuevaMisionModal onCrear={crearTarea} onClose={() => setModal(false)} env={env} />
      )}
    </div>
  );
}
