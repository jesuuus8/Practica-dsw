import React, { useEffect, useState } from 'react';
import TopAppBar from './TopAppBar';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8081';

function SettingRow({ icon, label, desc, children }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-outline-variant/30 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-on-surface-variant">{icon}</span>
        </div>
        <div>
          <p className="font-label-lg text-label-lg text-on-surface">{label}</p>
          {desc && <p className="text-xs text-on-surface-variant">{desc}</p>}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${value ? 'bg-primary' : 'bg-outline-variant'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${value ? 'translate-x-6' : 'translate-x-0'}`}
      />
    </button>
  );
}

export default function Ajustes() {
  const [user, setUser]           = useState(null);
  const [nombre, setNombre]       = useState('');
  const [telefono, setTelefono]   = useState('');
  const [email, setEmail]         = useState('');
  const [edad, setEdad]           = useState('');
  const [editando, setEditando]   = useState(false);
  const [guardado, setGuardado]   = useState(false);

  // Preferencias locales (sin backend)
  const [notifs, setNotifs]       = useState(true);
  const [sonidos, setSonidos]     = useState(true);
  const [modoOscuro, setModoOscuro] = useState(() => {
    return document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
  });
  const [animaciones, setAnimaciones] = useState(true);

  // Entorno y rol
  const [envType, setEnvType] = useState('UNIVERSITY');
  const [rol, setRol] = useState('ESTUDIANTE');

  useEffect(() => {
    if (modoOscuro) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [modoOscuro]);

  const loadUser = () => {
    fetch(`${API}/api/usuario`)
      .then(r => r.ok ? r.json() : null)
      .then(u => {
        if (u) {
          setUser(u);
          setNombre(u.nombre || 'jesus');
          setEnvType(u.environmentType || 'UNIVERSITY');
          setRol(u.role || 'ESTUDIANTE');
          setTelefono(u.telefono || '');
          setEmail(u.email || '');
          setEdad(u.edad !== null && u.edad !== undefined ? String(u.edad) : '');
          localStorage.setItem('environmentType', u.environmentType || 'UNIVERSITY');
          localStorage.setItem('userRole', u.role || 'ESTUDIANTE');
          document.documentElement.setAttribute('data-env', u.environmentType || 'UNIVERSITY');
        }
      })
      .catch(() => setNombre('jesus'));
  };

  useEffect(() => {
    loadUser();
    window.addEventListener('task-updated', loadUser);
    return () => {
      window.removeEventListener('task-updated', loadUser);
    };
  }, []);

  const guardar = async () => {
    try {
      const res = await fetch(`${API}/api/usuario`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...user,
          nombre,
          telefono,
          email,
          edad: edad !== '' ? parseInt(edad, 10) : null
        }),
      });
      if (res.ok) {
        const u = await res.json();
        setUser(u);
        setNombre(u.nombre || 'jesus');
        setEnvType(u.environmentType || 'UNIVERSITY');
        setRol(u.role || 'ESTUDIANTE');
        setTelefono(u.telefono || '');
        setEmail(u.email || '');
        setEdad(u.edad !== null && u.edad !== undefined ? String(u.edad) : '');
      }
    } catch (e) {
      console.error(e);
    }
    setEditando(false);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  };

  const cancelarEdicion = () => {
    if (user) {
      setNombre(user.nombre || 'jesus');
      setTelefono(user.telefono || '');
      setEmail(user.email || '');
      setEdad(user.edad !== null && user.edad !== undefined ? String(user.edad) : '');
    }
    setEditando(false);
  };

  const handleEnvChange = async (newEnv) => {
    setEnvType(newEnv);
    const defaultRole = newEnv === 'UNIVERSITY' ? 'ESTUDIANTE' : 'FAMILIAR';
    setRol(defaultRole);

    try {
      const res = await fetch(`${API}/api/usuario`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, environmentType: newEnv, role: defaultRole }),
      });
      if (res.ok) {
        const u = await res.json();
        setUser(u);
        localStorage.setItem('environmentType', u.environmentType || 'UNIVERSITY');
        localStorage.setItem('userRole', u.role || 'ESTUDIANTE');
        document.documentElement.setAttribute('data-env', u.environmentType || 'UNIVERSITY');
        window.dispatchEvent(new Event('theme-change'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRoleChange = async (newRole) => {
    setRol(newRole);

    try {
      const res = await fetch(`${API}/api/usuario`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, role: newRole }),
      });
      if (res.ok) {
        const u = await res.json();
        setUser(u);
        localStorage.setItem('environmentType', u.environmentType || 'UNIVERSITY');
        localStorage.setItem('userRole', u.role || 'ESTUDIANTE');
        window.dispatchEvent(new Event('theme-change'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const cambiarImagen = () => {
    const url = prompt("Introduce la URL de tu nueva imagen de perfil:", user?.imagenUrl || "");
    if (url !== null) {
      const updatedUser = { ...user, imagenUrl: url };
      fetch(`${API}/api/usuario`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      })
        .then(r => r.ok ? r.json() : null)
        .then(u => {
          if (u) {
            setUser(u);
            setGuardado(true);
            setTimeout(() => setGuardado(false), 2500);
          }
        })
        .catch(e => console.error(e));
    }
  };

  const nivel = user?.nivel || 1;
  const xp    = user?.xpActual || 0;
  const imagenUrl = user?.imagenUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuO98l3sQ2VdiHUk2fFE50ag4rSRbWnMaTawL5VmpCd57n97liDvLVuFx8Wxehn59ZDC_ifONW3ssIMjocw8lecom6dSof9Tw0iY-tG-Q1wp6mzdO3wAt3lJy9wmLlx5I1iPooZ3IAoMxd6lr5M6092T5okg6C1miLxV8d_qSLflO4gxTvh_hCs_RuSRaa66CuBtDp3KqOpAucVDT6z0KcbGEhPnXAOt7Z55vzzi1oit5BSfrxJtCi1pCqzgSPVxZlIsCxHl6VvwEuk";

  return (
    <div className="bg-background text-on-surface min-h-screen pb-28 font-body-md">
      <TopAppBar />

      <main className="px-[20px] py-6 flex flex-col gap-6">
        {/* Title */}
        <section>
          <h2 className="text-2xl font-bold text-on-surface">Ajustes</h2>
          <p className="text-base text-on-surface-variant">Personaliza tu experiencia</p>
        </section>

        {/* Perfil Card */}
        <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-outline-variant/20 bento-card">
          <div className="flex flex-col gap-6">
            
            {/* Header info: Avatar & Basic stats */}
            <div className="flex items-center gap-4 pb-4 border-b border-outline-variant/30">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-full border-4 border-primary/20 hover:border-primary/50 overflow-hidden shadow-md transition-colors">
                  <img
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    src={imagenUrl}
                  />
                </div>
                <button
                  onClick={cambiarImagen}
                  title="Cambiar foto de perfil"
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary hover:bg-primary/95 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold text-on-surface tracking-tight">{nombre}</span>
                </div>
                <p className="text-sm text-on-surface-variant mt-1 font-medium">Nivel {nivel} • {xp} XP acumulados</p>
                {guardado && (
                  <p className="text-xs text-primary mt-1.5 flex items-center gap-1">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Guardado correctamente
                  </p>
                )}
              </div>
            </div>

            {/* Editable Fields / Display Fields */}
            {editando ? (
              <div className="flex flex-col gap-4 animate-scale-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nombre</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-lg">person</span>
                      <input
                        type="text"
                        className="w-full bg-surface text-on-surface rounded-xl pl-10 pr-4 py-2 text-sm border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none transition-all"
                        placeholder="Nombre de usuario"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Correo Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-lg">mail</span>
                      <input
                        type="email"
                        className="w-full bg-surface text-on-surface rounded-xl pl-10 pr-4 py-2 text-sm border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none transition-all"
                        placeholder="ejemplo@correo.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Telefono Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Teléfono</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-lg">call</span>
                      <input
                        type="tel"
                        className="w-full bg-surface text-on-surface rounded-xl pl-10 pr-4 py-2 text-sm border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none transition-all"
                        placeholder="Número de teléfono"
                        value={telefono}
                        onChange={e => setTelefono(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Edad Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Edad</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-lg">cake</span>
                      <input
                        type="number"
                        className="w-full bg-surface text-on-surface rounded-xl pl-10 pr-4 py-2 text-sm border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none transition-all"
                        placeholder="Edad"
                        value={edad}
                        onChange={e => setEdad(e.target.value)}
                        min="1"
                        max="120"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={cancelarEdicion}
                    className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors text-sm font-semibold active:scale-95"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={guardar}
                    className="bg-primary hover:bg-primary/95 text-white px-5 py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition-all shadow-md shadow-primary/10"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Correo Display */}
                  <div className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-outline-variant/10">
                    <div className="w-8 h-8 rounded-full bg-primary-container/10 flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>mail</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">Correo Electrónico</p>
                      <p className="text-sm font-medium text-on-surface truncate">{user?.email || 'No especificado'}</p>
                    </div>
                  </div>

                  {/* Teléfono Display */}
                  <div className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-outline-variant/10">
                    <div className="w-8 h-8 rounded-full bg-primary-container/10 flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>call</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">Teléfono</p>
                      <p className="text-sm font-medium text-on-surface truncate">{user?.telefono || 'No especificado'}</p>
                    </div>
                  </div>

                  {/* Edad Display */}
                  <div className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-outline-variant/10">
                    <div className="w-8 h-8 rounded-full bg-primary-container/10 flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>cake</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">Edad</p>
                      <p className="text-sm font-medium text-on-surface truncate">
                        {user?.edad ? `${user.edad} años` : 'No especificada'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => setEditando(true)}
                  className="mt-2 w-full py-3 bg-surface hover:bg-surface-container-high text-primary hover:text-primary/95 border border-primary/20 hover:border-primary/45 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                  Editar Información de Perfil
                </button>
              </div>
            )}

          </div>
        </section>

        {/* Entorno y Rol */}
        <section className="bg-surface-container-lowest rounded-lg p-5 shadow-sm flex flex-col gap-6">
          <div>
            <h3 className="font-label-lg text-label-lg uppercase tracking-wider text-on-surface-variant mb-1">Entorno y Rol</h3>
            <p className="text-xs text-on-surface-variant">Configura tu área de trabajo y tu nivel de acceso</p>
          </div>

          {/* Tipo de Entorno Grid */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">domain</span>
              Tipo de Entorno
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleEnvChange('UNIVERSITY')}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 text-center transition-all duration-250 cursor-pointer active:scale-98 ${
                  envType === 'UNIVERSITY'
                    ? 'border-primary bg-primary/5 text-on-surface font-semibold shadow-sm'
                    : 'border-outline-variant/30 hover:border-outline-variant bg-surface hover:bg-surface-container-low text-on-surface-variant'
                }`}
              >
                <span className={`material-symbols-outlined text-3xl mb-2 ${envType === 'UNIVERSITY' ? 'text-primary' : 'text-on-surface-variant'}`}>
                  school
                </span>
                <span className="text-sm font-bold block">Universitario</span>
                <span className="text-[11px] mt-1 text-on-surface-variant/80 font-normal leading-normal">
                  Entorno académico y de clases
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleEnvChange('FAMILY')}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 text-center transition-all duration-250 cursor-pointer active:scale-98 ${
                  envType === 'FAMILY'
                    ? 'border-primary bg-primary/5 text-on-surface font-semibold shadow-sm'
                    : 'border-outline-variant/30 hover:border-outline-variant bg-surface hover:bg-surface-container-low text-on-surface-variant'
                }`}
              >
                <span className={`material-symbols-outlined text-3xl mb-2 ${envType === 'FAMILY' ? 'text-primary' : 'text-on-surface-variant'}`}>
                  home
                </span>
                <span className="text-sm font-bold block">Familiar</span>
                <span className="text-[11px] mt-1 text-on-surface-variant/80 font-normal leading-normal">
                  Entorno del hogar y familia
                </span>
              </button>
            </div>
          </div>

          {/* Rol de Usuario Grid */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">badge</span>
              Rol de Usuario
            </span>
            <div className="grid grid-cols-2 gap-3">
              {envType === 'UNIVERSITY' ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleRoleChange('ESTUDIANTE')}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 text-center transition-all duration-250 cursor-pointer active:scale-98 ${
                      rol === 'ESTUDIANTE'
                        ? 'border-primary bg-primary/5 text-on-surface font-semibold shadow-sm'
                        : 'border-outline-variant/30 hover:border-outline-variant bg-surface hover:bg-surface-container-low text-on-surface-variant'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-3xl mb-2 ${rol === 'ESTUDIANTE' ? 'text-primary' : 'text-on-surface-variant'}`}>
                      local_library
                    </span>
                    <span className="text-sm font-bold block">Estudiante</span>
                    <span className="text-[11px] mt-1 text-on-surface-variant/80 font-normal leading-normal">
                      Realiza misiones y gana XP
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange('PROFESOR')}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 text-center transition-all duration-250 cursor-pointer active:scale-98 ${
                      rol === 'PROFESOR'
                        ? 'border-primary bg-primary/5 text-on-surface font-semibold shadow-sm'
                        : 'border-outline-variant/30 hover:border-outline-variant bg-surface hover:bg-surface-container-low text-on-surface-variant'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-3xl mb-2 ${rol === 'PROFESOR' ? 'text-primary' : 'text-on-surface-variant'}`}>
                      shield_person
                    </span>
                    <span className="text-sm font-bold block">Profesor</span>
                    <span className="text-[11px] mt-1 text-on-surface-variant/80 font-normal leading-normal">
                      Administrador de misiones
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleRoleChange('FAMILIAR')}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 text-center transition-all duration-250 cursor-pointer active:scale-98 ${
                      rol === 'FAMILIAR'
                        ? 'border-primary bg-primary/5 text-on-surface font-semibold shadow-sm'
                        : 'border-outline-variant/30 hover:border-outline-variant bg-surface hover:bg-surface-container-low text-on-surface-variant'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-3xl mb-2 ${rol === 'FAMILIAR' ? 'text-primary' : 'text-on-surface-variant'}`}>
                      sentiment_satisfied
                    </span>
                    <span className="text-sm font-bold block">Familiar / Hijo</span>
                    <span className="text-[11px] mt-1 text-on-surface-variant/80 font-normal leading-normal">
                      Completa tareas familiares
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange('PADRES')}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 text-center transition-all duration-250 cursor-pointer active:scale-98 ${
                      rol === 'PADRES'
                        ? 'border-primary bg-primary/5 text-on-surface font-semibold shadow-sm'
                        : 'border-outline-variant/30 hover:border-outline-variant bg-surface hover:bg-surface-container-low text-on-surface-variant'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-3xl mb-2 ${rol === 'PADRES' ? 'text-primary' : 'text-on-surface-variant'}`}>
                      admin_panel_settings
                    </span>
                    <span className="text-sm font-bold block">Padres</span>
                    <span className="text-[11px] mt-1 text-on-surface-variant/80 font-normal leading-normal">
                      Control parental y misiones
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Notificaciones */}
        <section className="bg-surface-container-lowest rounded-lg p-5 shadow-sm">
          <h3 className="font-label-lg text-label-lg uppercase tracking-wider text-on-surface-variant mb-2">Notificaciones</h3>
          <SettingRow icon="notifications" label="Notificaciones push" desc="Recordatorios de misiones y logros">
            <Toggle value={notifs} onChange={setNotifs} />
          </SettingRow>
          <SettingRow icon="volume_up" label="Sonidos" desc="Efectos de sonido al completar tareas">
            <Toggle value={sonidos} onChange={setSonidos} />
          </SettingRow>
        </section>

        {/* Apariencia */}
        <section className="bg-surface-container-lowest rounded-lg p-5 shadow-sm">
          <h3 className="font-label-lg text-label-lg uppercase tracking-wider text-on-surface-variant mb-2">Apariencia</h3>
          <SettingRow icon="dark_mode" label="Modo oscuro" desc="Interfaz con fondo oscuro">
            <Toggle value={modoOscuro} onChange={setModoOscuro} />
          </SettingRow>
          <SettingRow icon="animation" label="Animaciones" desc="Micro-interacciones y transiciones">
            <Toggle value={animaciones} onChange={setAnimaciones} />
          </SettingRow>
        </section>

        {/* Cuenta */}
        <section className="bg-surface-container-lowest rounded-lg p-5 shadow-sm">
          <h3 className="font-label-lg text-label-lg uppercase tracking-wider text-on-surface-variant mb-2">Cuenta</h3>
          <SettingRow icon="language" label="Idioma" desc="Español">
            <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
          </SettingRow>
          <SettingRow icon="privacy_tip" label="Privacidad" desc="Visibilidad en el ranking">
            <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
          </SettingRow>
          <SettingRow icon="help" label="Ayuda y soporte" desc="">
            <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
          </SettingRow>
        </section>

        {/* Info de versión */}
        <section className="text-center">
          <p className="text-xs text-on-surface-variant">Gamify v1.0.0 • Proyecto Final</p>
          <p className="text-xs text-on-surface-variant mt-1">Hecho con ❤️ y React + Spring Boot</p>
        </section>
      </main>
    </div>
  );
}
