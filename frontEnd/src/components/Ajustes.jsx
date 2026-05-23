import React, { useEffect, useState } from 'react';

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
  const [editando, setEditando]   = useState(false);
  const [guardado, setGuardado]   = useState(false);

  // Preferencias locales (sin backend)
  const [notifs, setNotifs]       = useState(true);
  const [sonidos, setSonidos]     = useState(true);
  const [modoOscuro, setModoOscuro] = useState(false);
  const [animaciones, setAnimaciones] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/usuario`)
      .then(r => r.ok ? r.json() : null)
      .then(u => {
        if (u) { setUser(u); setNombre(u.nombre || 'Alex'); }
      })
      .catch(() => setNombre('Alex'));
  }, []);

  const guardar = () => {
    // En producción aquí iría PATCH /api/usuario con el nuevo nombre
    setUser(prev => prev ? { ...prev, nombre } : { nombre });
    setEditando(false);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  };

  const nivel = user?.nivel || 1;
  const xp    = user?.xpActual || 0;

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
          <h2 className="text-2xl font-bold text-on-surface">Ajustes</h2>
          <p className="text-base text-on-surface-variant">Personaliza tu experiencia</p>
        </section>

        {/* Perfil Card — usa datos de PerfilUsuario */}
        <section className="bg-surface-container-lowest rounded-lg p-5 shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] bento-card">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-full border-4 border-primary overflow-hidden shadow-md">
                <img
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA98l3sQ2VdiHUk2fFE50ag4rSRbWnMaTawL5VmpCd57n97liDvLVuFx8Wxehn59ZDC_ifONW3ssIMjocw8lecom6dSof9Tw0iY-tG-Q1wp6mzdO3wAt3lJy9wmLlx5I1iPooZ3IAoMxd6lr5M6092T5okg6C1miLxV8d_qSLflO4gxTvh_hCs_RuSRaa66CuBtDp3KqOpAucVDT6z0KcbGEhPnXAOt7Z55vzzi1oit5BSfrxJtCi1pCqzgSPVxZlIsCxHl6VvwEuk"
                />
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center shadow">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit</span>
              </button>
            </div>
            <div className="flex-1 min-w-0">
              {editando ? (
                <div className="flex gap-2 items-center">
                  <input
                    className="flex-1 bg-surface-container-low rounded-xl px-3 py-2 text-sm border-none focus:ring-2 focus:ring-primary outline-none"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    autoFocus
                  />
                  <button
                    onClick={guardar}
                    className="bg-primary text-white rounded-xl px-3 py-2 text-sm font-semibold active:scale-95 transition-transform"
                  >
                    Guardar
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-on-surface">{nombre}</span>
                  <button onClick={() => setEditando(true)} className="text-primary">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                  </button>
                </div>
              )}
              <p className="text-sm text-on-surface-variant mt-0.5">Nivel {nivel} • {xp} XP acumulados</p>
              {guardado && (
                <p className="text-xs text-primary mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  Guardado correctamente
                </p>
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
          <p className="text-xs text-on-surface-variant">TaskQuest v1.0.0 • Proyecto Final</p>
          <p className="text-xs text-on-surface-variant mt-1">Hecho con ❤️ y React + Spring Boot</p>
        </section>
      </main>
    </div>
  );
}
